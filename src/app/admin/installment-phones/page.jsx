"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Script from "next/script";
import { confirmDeleteToast } from "@/components/admin/ConfirmDeleteToast";
import toast from "react-hot-toast";
import {
  CalendarCheck,
  Check,
  ChevronDown,
  ImagePlus,
  Pencil,
  Plus,
  Search,
  Smartphone,
  Upload,
  X,
} from "lucide-react";

const brands = ["Infinix", "Tecno", "Itel", "Realme", "Nubia", "Oppo", "Villaon", "Other"];
const maxImages = 5;
const fieldClassName =
  "mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15";

const formatPrice = (price) => `Rs. ${Number(price).toLocaleString("en-PK")}`;
const splitOptions = (value) =>
  value.split(",").map((item) => item.trim()).filter(Boolean);

export default function AdminInstallmentPhonesPage() {
  const [phones, setPhones] = useState([]);
  const [loadingPhones, setLoadingPhones] = useState(true);
  const [savingPhone, setSavingPhone] = useState(false);
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("All brands");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [formOpen, setFormOpen] = useState(false);
  const [editingPhone, setEditingPhone] = useState(null);
  const [phoneImages, setPhoneImages] = useState([]);
  const [widgetReady, setWidgetReady] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const widgetRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/products?type=installment&admin=1", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Could not load installment phones.");
        if (!cancelled) setPhones(result.products ?? []);
      })
      .catch((loadError) => { if (!cancelled) toast.error(loadError.message || "Could not load installment phones."); })
      .finally(() => { if (!cancelled) setLoadingPhones(false); });
    return () => { cancelled = true; };
  }, []);

  const filteredPhones = useMemo(() => {
    const query = search.trim().toLowerCase();

    return phones.filter((phone) => {
      const matchesSearch =
        !query || `${phone.name} ${phone.brand} ${phone.code}`.toLowerCase().includes(query);
      const matchesBrand = brandFilter === "All brands" || phone.brand === brandFilter;
      const matchesStatus = statusFilter === "All statuses" || phone.status === statusFilter;
      return matchesSearch && matchesBrand && matchesStatus;
    });
  }, [phones, search, brandFilter, statusFilter]);

  const openForm = (phone = null) => {
    setEditingPhone(phone);
    setPhoneImages(phone?.images ?? (phone?.image ? [{ url: phone.image }] : []));
    setError("");
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingPhone(null);
    setPhoneImages([]);
    setError("");
  };

  const openCloudinaryWidget = async () => {
    setError("");

    if (phoneImages.length >= maxImages) {
      setError(`You can add up to ${maxImages} photos per phone.`);
      return;
    }

    if (!widgetReady || !window.cloudinary?.createUploadWidget) {
      setError("Photo picker is still loading. Please try again in a moment.");
      return;
    }

    setUploading(true);

    try {
      const configResponse = await fetch("/api/admin/used-phones/upload", { cache: "no-store" });
      const config = await configResponse.json();
      if (!configResponse.ok) throw new Error(config.error ?? "Cloudinary is not configured.");

      if (widgetRef.current) {
        widgetRef.current.open();
        return;
      }

      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: config.cloudName,
          apiKey: config.apiKey,
          uploadSignature: async (callback, paramsToSign) => {
            try {
              const response = await fetch("/api/admin/used-phones/upload-signature", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(paramsToSign),
              });
              const result = await response.json();
              if (!response.ok) throw new Error(result.error ?? "Could not sign the upload.");
              callback(result.signature);
            } catch (uploadError) {
              setError(uploadError.message || "Could not authorize the upload.");
              setUploading(false);
            }
          },
          folder: "ahmad-mobiles/used-phones",
          resourceType: "image",
          sources: ["local", "url", "camera", "google_drive", "dropbox", "box", "unsplash"],
          multiple: true,
          maxFiles: maxImages - phoneImages.length,
          clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
          maxFileSize: 8 * 1024 * 1024,
          styles: {
            palette: {
              window: "#ffffff",
              windowBorder: "#d8e0e8",
              tabIcon: "#173b63",
              menuIcons: "#173b63",
              textDark: "#101828",
              textLight: "#ffffff",
              link: "#1769aa",
              action: "#1769aa",
              inactiveTabIcon: "#8292a5",
              error: "#b42318",
              inProgress: "#1769aa",
              complete: "#16835d",
              sourceBg: "#edf3f8",
            },
          },
        },
        (uploadError, result) => {
          if (uploadError) {
            setError(uploadError.message || "Photo upload failed.");
            return;
          }

          if (result?.event === "success") {
            const uploaded = result.info;
            setPhoneImages((current) => {
              if (current.length >= maxImages || current.some((image) => image.publicId === uploaded.public_id)) {
                return current;
              }
              return [
                ...current,
                {
                  url: uploaded.secure_url,
                  publicId: uploaded.public_id,
                  width: uploaded.width,
                  height: uploaded.height,
                },
              ];
            });
          }

          if (result?.event === "close") setUploading(false);
        }
      );
      widgetRef.current.open();
    } catch (uploadError) {
      setUploading(false);
      setError(uploadError.message || "Could not open the photo picker.");
    }
  };

  const savePhone = async (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const phone = {
      type: "installment",
      name: values.name.trim(),
      code: values.code.trim(),
      brand: values.brand,
      price: Number(values.price),
      storage: splitOptions(values.storage),
      colors: splitOptions(values.colors),
      downPayments: splitOptions(values.downPayments).map(Number).filter((value) => value > 0 && value < 100),
      durations: splitOptions(values.durations).map(Number).filter((value) => value > 0),
      status: values.status,
      images: phoneImages,
      image: phoneImages[0]?.url ?? "",
    };

    setSavingPhone(true);
    try {
      const response = await fetch(editingPhone ? `/api/products/${editingPhone.id}` : "/api/products", {
        method: editingPhone ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(phone),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not save this phone.");
      setPhones((current) => editingPhone
        ? current.map((item) => (item.id === editingPhone.id ? result.product : item))
        : [result.product, ...current]
      );
      toast.success(editingPhone ? "Installment phone updated." : "Installment phone added.");
      closeForm();
    } catch (saveError) {
      toast.error(saveError.message || "Could not save this phone.");
    } finally {
      setSavingPhone(false);
    }
  };

  const requestPhoneDelete = (phone) => {
    confirmDeleteToast({
      title: `Delete ${phone.brand} ${phone.name}?`,
      description: "This removes the phone from this installment list.",
      successMessage: "Installment phone deleted.",
      onConfirm: async () => {
        const response = await fetch(`/api/products/${phone.id}`, { method: "DELETE" });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Could not delete this phone.");
        setPhones((current) => current.filter((item) => item.id !== phone.id));
      },
    });
  };

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 sm:py-8 lg:px-10">
      <Script
        src="https://upload-widget.cloudinary.com/global/all.js"
        strategy="afterInteractive"
        onReady={() => setWidgetReady(true)}
        onError={() => setError("Could not load Cloudinary photo picker. Refresh and try again.")}
      />
      <div className="mx-auto max-w-7xl space-y-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              Inventory / Installment Phones
            </p>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Installment Phones</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage phone prices, available configurations and payment options.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openForm()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-foreground px-4 text-sm font-semibold text-background transition-opacity hover:opacity-85"
          >
            <Plus size={18} /> Add Installment Phone
          </button>
        </div>

        <section className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <label className="relative block w-full lg:max-w-sm">
              <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search model, code or brand"
                aria-label="Search installment phones"
                className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
              />
            </label>
            <div className="grid grid-cols-2 gap-3 sm:flex">
              <label className="relative">
                <span className="sr-only">Filter by brand</span>
                <select value={brandFilter} onChange={(event) => setBrandFilter(event.target.value)} className="h-11 w-full appearance-none rounded-lg border border-border bg-background pl-3 pr-9 text-sm outline-none focus:border-accent sm:w-40">
                  <option>All brands</option>
                  {brands.map((brand) => <option key={brand}>{brand}</option>)}
                </select>
                <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </label>
              <label className="relative">
                <span className="sr-only">Filter by status</span>
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-11 w-full appearance-none rounded-lg border border-border bg-background pl-3 pr-9 text-sm outline-none focus:border-accent sm:w-40">
                  <option>All statuses</option>
                  <option>Available</option>
                  <option>Reserved</option>
                  <option>Sold</option>
                  <option>Draft</option>
                </select>
                <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </label>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
            <p className="text-sm font-medium">Installment listings</p>
            <p className="text-xs text-muted-foreground" aria-live="polite">{filteredPhones.length} {filteredPhones.length === 1 ? "phone" : "phones"}</p>
          </div>

          {loadingPhones ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Loading installment phones…</div>
          ) : filteredPhones.length ? (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[780px] text-left">
                <thead>
                  <tr className="border-b border-border text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="px-3 py-3">Phone</th>
                    <th className="px-3 py-3">Total price</th>
                    <th className="px-3 py-3">Down payment</th>
                    <th className="px-3 py-3">Duration</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredPhones.map((phone) => (
                    <tr key={phone.id} className="text-sm">
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-3">
                          {phone.images?.[0]?.url || phone.image ? (
                            <Image src={phone.images?.[0]?.url ?? phone.image} alt={phone.name} width={42} height={42} unoptimized className="h-11 w-11 shrink-0 rounded-lg object-cover" />
                          ) : (
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent"><Smartphone size={19} /></div>
                          )}
                          <div>
                            <p className="font-semibold">{phone.brand} {phone.name}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{phone.code} · {phone.storage.join(" / ")}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 font-semibold">{formatPrice(phone.price)}</td>
                      <td className="px-3 py-4">{phone.downPayments.join("% · ")}%</td>
                      <td className="px-3 py-4">{phone.durations.join(" / ")} months</td>
                      <td className="px-3 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent"><Check size={13} />{phone.status}</span>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex justify-end gap-1">
                          <button type="button" onClick={() => openForm(phone)} aria-label={`Edit ${phone.name}`} className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"><Pencil size={16} /></button>
                          <button type="button" onClick={() => requestPhoneDelete(phone)} aria-label={`Remove ${phone.name}`} className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"><X size={17} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="my-5 flex flex-col items-center rounded-xl border border-dashed border-border bg-background px-5 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">{phones.length ? <Search size={24} /> : <CalendarCheck size={25} />}</div>
              <h2 className="mt-5 text-base font-semibold">{phones.length ? "No matching phones" : "No installment phones yet"}</h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{phones.length ? "Try another search or change the selected filters." : "Add a phone to start managing installment options."}</p>
            </div>
          )}
        </section>
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/45 p-0 backdrop-blur-sm sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) closeForm(); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="installment-form-title" className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-border bg-background shadow-2xl sm:rounded-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Installment inventory</p>
                <h2 id="installment-form-title" className="mt-1 text-lg font-bold">{editingPhone ? "Edit phone" : "Add installment phone"}</h2>
              </div>
              <button type="button" onClick={closeForm} aria-label="Close form" className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-muted hover:text-foreground"><X size={18} /></button>
            </div>

            <form key={editingPhone?.id ?? "new-installment-phone"} onSubmit={savePhone} className="space-y-5 p-5 sm:p-6">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">Phone photos</p>
                    <p className="mt-1 text-xs text-muted-foreground">Add up to {maxImages} JPG, PNG or WebP photos, 8 MB each.</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{phoneImages.length}/{maxImages}</span>
                </div>
                <button type="button" onClick={openCloudinaryWidget} disabled={uploading || phoneImages.length >= maxImages} className={`mt-3 flex min-h-16 w-full items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card px-4 py-4 text-sm font-medium transition-colors ${uploading || phoneImages.length >= maxImages ? "cursor-not-allowed opacity-60" : "hover:border-accent/50 hover:bg-accent/5"}`}>
                  {uploading ? <Upload size={18} className="animate-pulse text-accent" /> : <ImagePlus size={19} className="text-accent" />}
                  {uploading ? "Cloudinary picker open…" : phoneImages.length >= maxImages ? "Photo limit reached" : "Add pics"}
                </button>
                {error && <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
                {!!phoneImages.length && (
                  <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-5">
                    {phoneImages.map((image, index) => (
                      <div key={image.publicId ?? image.url} className="relative aspect-square overflow-hidden rounded-lg border border-border bg-card">
                        <Image src={image.url} alt={`Installment phone photo ${index + 1}`} fill unoptimized sizes="(max-width: 640px) 30vw, 100px" className="object-cover" />
                        <button type="button" onClick={() => setPhoneImages((current) => current.filter((item) => item.url !== image.url))} aria-label={`Remove photo ${index + 1}`} className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-background/95 text-foreground shadow-sm hover:bg-background"><X size={15} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium sm:col-span-2">Phone model<input name="name" required defaultValue={editingPhone?.name ?? ""} placeholder="e.g. Reno 11" className={fieldClassName} /></label>
                <label className="text-sm font-medium">Brand<select name="brand" defaultValue={editingPhone?.brand ?? "Infinix"} className={fieldClassName}>{brands.map((brand) => <option key={brand}>{brand}</option>)}</select></label>
                <label className="text-sm font-medium">Model code<input name="code" defaultValue={editingPhone?.code ?? ""} placeholder="e.g. CPH2599" className={fieldClassName} /></label>
                <label className="text-sm font-medium">Total price (PKR)<input name="price" type="number" min="1" required defaultValue={editingPhone?.price ?? ""} placeholder="110000" className={fieldClassName} /></label>
                <label className="text-sm font-medium">Availability<select name="status" defaultValue={editingPhone?.status ?? "Available"} className={fieldClassName}><option>Available</option><option>Reserved</option><option>Sold</option><option>Draft</option></select></label>
                <label className="text-sm font-medium">Storage options<input name="storage" required defaultValue={editingPhone?.storage?.join(", ") ?? "128GB, 256GB"} placeholder="128GB, 256GB" className={fieldClassName} /><span className="mt-1 block text-xs text-muted-foreground">Separate options with commas.</span></label>
                <label className="text-sm font-medium">Color options<input name="colors" required defaultValue={editingPhone?.colors?.join(", ") ?? "Black, Blue"} placeholder="Black, Blue" className={fieldClassName} /><span className="mt-1 block text-xs text-muted-foreground">Separate options with commas.</span></label>
                <label className="text-sm font-medium">Down payment percentages<input name="downPayments" required defaultValue={editingPhone?.downPayments?.join(", ") ?? "25, 35, 50"} placeholder="25, 35, 50" className={fieldClassName} /><span className="mt-1 block text-xs text-muted-foreground">Enter percentages without % signs.</span></label>
                <label className="text-sm font-medium">Plan durations (months)<input name="durations" required defaultValue={editingPhone?.durations?.join(", ") ?? "3, 6, 9"} placeholder="3, 6, 9" className={fieldClassName} /><span className="mt-1 block text-xs text-muted-foreground">Separate durations with commas.</span></label>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                <button type="button" onClick={closeForm} className="h-11 rounded-lg border border-border px-4 text-sm font-semibold hover:bg-muted">Cancel</button>
                <button type="submit" disabled={uploading || savingPhone} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-foreground px-5 text-sm font-semibold text-background hover:opacity-85 disabled:opacity-50"><Check size={17} />{savingPhone ? "Saving…" : editingPhone ? "Save changes" : "Add phone"}</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
