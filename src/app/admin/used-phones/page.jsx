"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Script from "next/script";
import toast from "react-hot-toast";
import { confirmDeleteToast } from "@/components/admin/ConfirmDeleteToast";
import {
  ArrowUpRight,
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

const initialPhone = {
  name: "",
  brand: "Apple",
  storage: "128GB",
  condition: "10/10",
  pta: "PTA Approved",
  price: "",
  status: "Available",
};

const brands = ["Apple", "Samsung", "Oppo", "Vivo", "Infinix", "Tecno", "Other"];
const maxPhoneImages = 5;

const fieldClassName =
  "mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15";

function formatPrice(price) {
  return `Rs. ${Number(price).toLocaleString("en-PK")}`;
}

export default function AdminUsedPhonesPage() {
  const [phones, setPhones] = useState([]);
  const [loadingPhones, setLoadingPhones] = useState(true);
  const [savingPhone, setSavingPhone] = useState(false);
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("All brands");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [formOpen, setFormOpen] = useState(false);
  const [editingPhone, setEditingPhone] = useState(null);
  const [phoneImages, setPhoneImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");
  const [widgetReady, setWidgetReady] = useState(false);
  const widgetRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/products?type=used&admin=1", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Could not load used phones.");
        if (!cancelled) setPhones(result.products ?? []);
      })
      .catch((error) => {
        if (!cancelled) toast.error(error.message || "Could not load used phones.");
      })
      .finally(() => {
        if (!cancelled) setLoadingPhones(false);
      });

    return () => { cancelled = true; };
  }, []);

  const filteredPhones = useMemo(() => {
    const query = search.trim().toLowerCase();

    return phones.filter((phone) => {
      const matchesSearch =
        !query ||
        `${phone.name} ${phone.brand} ${phone.storage}`
          .toLowerCase()
          .includes(query);
      const matchesBrand = brandFilter === "All brands" || phone.brand === brandFilter;
      const matchesStatus = statusFilter === "All statuses" || phone.status === statusFilter;

      return matchesSearch && matchesBrand && matchesStatus;
    });
  }, [phones, search, brandFilter, statusFilter]);

  const openForm = (phone = null) => {
    setEditingPhone(phone);
    setPhoneImages(phone?.images ?? []);
    setImageUploadError("");
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingPhone(null);
    setPhoneImages([]);
    setImageUploadError("");
  };

  const openCloudinaryWidget = async () => {
    setImageUploadError("");

    if (phoneImages.length >= maxPhoneImages) {
      setImageUploadError(`Add up to ${maxPhoneImages} photos per phone.`);
      return;
    }

    if (!widgetReady || !window.cloudinary?.createUploadWidget) {
      setImageUploadError("Photo picker is still loading. Please try again in a moment.");
      return;
    }

    setUploading(true);

    try {
      const configResponse = await fetch("/api/admin/used-phones/upload", { cache: "no-store" });
      const cloudinaryConfig = await configResponse.json();

      if (!configResponse.ok) {
        throw new Error(cloudinaryConfig.error ?? "Cloudinary is not configured.");
      }

      if (widgetRef.current) {
        widgetRef.current.open();
        return;
      }

      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: cloudinaryConfig.cloudName,
          apiKey: cloudinaryConfig.apiKey,
          uploadSignature: async (callback, paramsToSign) => {
            try {
              const signatureResponse = await fetch(
                "/api/admin/used-phones/upload-signature",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(paramsToSign),
                }
              );
              const signatureData = await signatureResponse.json();

              if (!signatureResponse.ok) {
                throw new Error(signatureData.error ?? "Could not sign this upload.");
              }

              callback(signatureData.signature);
            } catch (error) {
              setImageUploadError(error.message || "Could not authorize the upload.");
              setUploading(false);
            }
          },
          folder: "ahmad-mobiles/used-phones",
          resourceType: "image",
          sources: ["local", "url", "camera", "google_drive", "dropbox", "box", "unsplash"],
          multiple: true,
          maxFiles: maxPhoneImages - phoneImages.length,
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
        (error, result) => {
          if (error) {
            setImageUploadError(error.message || "Photo upload failed.");
            return;
          }

          if (result?.event === "success") {
            const uploaded = result.info;
            setPhoneImages((currentImages) => {
              if (currentImages.length >= maxPhoneImages) return currentImages;
              if (currentImages.some((image) => image.publicId === uploaded.public_id)) {
                return currentImages;
              }

              return [
                ...currentImages,
                {
                  url: uploaded.secure_url,
                  publicId: uploaded.public_id,
                  width: uploaded.width,
                  height: uploaded.height,
                },
              ];
            });
          }

          if (result?.event === "close") {
            setUploading(false);
          }
        }
      );
      widgetRef.current.open();
    } catch (error) {
      setUploading(false);
      setImageUploadError(error.message || "Could not open the photo picker.");
    }
  };

  const savePhone = async (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const phone = {
      type: "used",
      ...values,
      price: Number(values.price),
      images: phoneImages,
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
      setPhones((currentPhones) => editingPhone
        ? currentPhones.map((item) => (item.id === editingPhone.id ? result.product : item))
        : [result.product, ...currentPhones]
      );
      toast.success(editingPhone ? "Phone updated." : "Phone added.");
      closeForm();
    } catch (error) {
      toast.error(error.message || "Could not save this phone.");
    } finally {
      setSavingPhone(false);
    }
  };

  const deletePhone = async (id) => {
    const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? "Could not delete this phone.");
    setPhones((currentPhones) => currentPhones.filter((phone) => phone.id !== id));
  };

  const requestPhoneDelete = (phone) => {
    confirmDeleteToast({
      title: `Delete ${phone.name}?`,
      description: "This removes the phone from your used phone list.",
      successMessage: "Used phone deleted.",
      onConfirm: () => deletePhone(phone.id),
    });
  };

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 sm:py-8 lg:px-10">
      <Script
        src="https://upload-widget.cloudinary.com/global/all.js"
        strategy="afterInteractive"
        onReady={() => setWidgetReady(true)}
        onError={() => setImageUploadError("Could not load Cloudinary photo picker. Refresh and try again.")}
      />
      <div className="mx-auto max-w-7xl space-y-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              Inventory / Used Phones
            </p>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Used Phones
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Add and organize the pre-owned phones in your showroom.
            </p>
          </div>

          <button
            type="button"
            onClick={() => openForm()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-foreground px-4 text-sm font-semibold text-background transition-opacity hover:opacity-85"
          >
            <Plus size={18} />
            Add Used Phone
          </button>
        </div>

        <section className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <label className="relative block w-full lg:max-w-sm">
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search model or brand"
                aria-label="Search used phones"
                className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
              />
            </label>

            <div className="grid grid-cols-2 gap-3 sm:flex">
              <label className="relative">
                <span className="sr-only">Filter by brand</span>
                <select
                  value={brandFilter}
                  onChange={(event) => setBrandFilter(event.target.value)}
                  className="h-11 w-full appearance-none rounded-lg border border-border bg-background pl-3 pr-9 text-sm outline-none focus:border-accent sm:w-40"
                >
                  <option>All brands</option>
                  {brands.map((brand) => <option key={brand}>{brand}</option>)}
                </select>
                <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </label>

              <label className="relative">
                <span className="sr-only">Filter by status</span>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="h-11 w-full appearance-none rounded-lg border border-border bg-background pl-3 pr-9 text-sm outline-none focus:border-accent sm:w-40"
                >
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
            <p className="text-sm font-medium">Phone listings</p>
            <p className="text-xs text-muted-foreground" aria-live="polite">
              {filteredPhones.length} {filteredPhones.length === 1 ? "phone" : "phones"}
            </p>
          </div>

          {loadingPhones ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Loading used phones…</div>
          ) : filteredPhones.length > 0 ? (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr className="border-b border-border text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="px-3 py-3">Phone</th>
                    <th className="px-3 py-3">Condition</th>
                    <th className="px-3 py-3">PTA status</th>
                    <th className="px-3 py-3">Price</th>
                    <th className="px-3 py-3">Availability</th>
                    <th className="px-3 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredPhones.map((phone) => (
                    <tr key={phone.id} className="text-sm">
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-3">
                          {phone.images?.[0]?.url ? (
                            <Image
                              src={phone.images[0].url}
                              alt={phone.name}
                              width={40}
                              height={40}
                              unoptimized
                              className="h-10 w-10 shrink-0 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                              <Smartphone size={19} />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold">{phone.name}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {phone.brand} · {phone.storage}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4">{phone.condition}</td>
                      <td className="px-3 py-4">{phone.pta}</td>
                      <td className="px-3 py-4 font-semibold">{formatPrice(phone.price)}</td>
                      <td className="px-3 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                          <Check size={13} />
                          {phone.status}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openForm(phone)}
                            aria-label={`Edit ${phone.name}`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => requestPhoneDelete(phone)}
                            aria-label={`Remove ${phone.name}`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                          >
                            <X size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="my-5 flex flex-col items-center rounded-xl border border-dashed border-border bg-background px-5 py-12 text-center sm:py-16">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                {phones.length === 0 ? <ImagePlus size={25} /> : <Search size={24} />}
              </div>
              <h2 className="mt-5 text-base font-semibold">
                {phones.length === 0 ? "No used phones yet" : "No matching phones"}
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                {phones.length === 0
                  ? "Add your first used phone to start building the showroom inventory."
                  : "Try another search or change the selected filters."}
              </p>
              {phones.length === 0 ? (
                <button
                  type="button"
                  onClick={() => openForm()}
                  className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-foreground px-4 text-sm font-semibold text-background hover:opacity-85"
                >
                  <Plus size={17} /> Add Used Phone
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setBrandFilter("All brands");
                    setStatusFilter("All statuses");
                  }}
                  className="mt-5 text-sm font-semibold text-accent hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </section>
      </div>

      {formOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/45 p-0 backdrop-blur-sm sm:items-center sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="phone-form-title"
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-border bg-background shadow-2xl sm:rounded-2xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Used phone inventory
                </p>
                <h2 id="phone-form-title" className="mt-1 text-lg font-bold">
                  {editingPhone ? "Edit phone" : "Add used phone"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeForm}
                aria-label="Close form"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            <form key={editingPhone?.id ?? "new-phone"} onSubmit={savePhone} className="space-y-5 p-5 sm:p-6">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">Phone photos</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Upload up to {maxPhoneImages} JPG, PNG or WebP photos (8 MB max each).
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {phoneImages.length}/{maxPhoneImages}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={openCloudinaryWidget}
                  disabled={uploading || phoneImages.length >= maxPhoneImages}
                  className={`mt-3 flex min-h-20 items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card px-4 py-4 text-sm font-medium transition-colors ${
                    uploading || phoneImages.length >= maxPhoneImages
                      ? "cursor-not-allowed opacity-60"
                      : "hover:border-accent/50 hover:bg-accent/5"
                  }`}
                >
                  {uploading ? <Upload size={18} className="animate-pulse text-accent" /> : <ImagePlus size={19} className="text-accent" />}
                  <span>
                    {uploading
                      ? "Cloudinary picker open…"
                      : phoneImages.length >= maxPhoneImages
                        ? "Photo limit reached"
                        : "Add pics"}
                  </span>
                </button>

                {imageUploadError && (
                  <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {imageUploadError}
                  </p>
                )}

                {phoneImages.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-5">
                    {phoneImages.map((image, index) => (
                      <div key={image.publicId ?? image.url} className="relative aspect-square overflow-hidden rounded-lg border border-border bg-card">
                        <Image
                          src={image.url}
                          alt={`Phone photo ${index + 1}`}
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 30vw, 100px"
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setPhoneImages((current) => current.filter((item) => item.url !== image.url))}
                          aria-label={`Remove phone photo ${index + 1}`}
                          className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-background/95 text-foreground shadow-sm hover:bg-background"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium sm:col-span-2">
                  Phone model
                  <input
                    name="name"
                    required
                    defaultValue={editingPhone?.name ?? initialPhone.name}
                    placeholder="e.g. iPhone 13 Pro"
                    className={fieldClassName}
                  />
                </label>

                <label className="text-sm font-medium">
                  Brand
                  <select name="brand" defaultValue={editingPhone?.brand ?? initialPhone.brand} className={fieldClassName}>
                    {brands.map((brand) => <option key={brand}>{brand}</option>)}
                  </select>
                </label>

                <label className="text-sm font-medium">
                  Storage
                  <select name="storage" defaultValue={editingPhone?.storage ?? initialPhone.storage} className={fieldClassName}>
                    {["64GB", "128GB", "256GB", "512GB", "1TB"].map((storage) => <option key={storage}>{storage}</option>)}
                  </select>
                </label>

                <label className="text-sm font-medium">
                  Condition
                  <select name="condition" defaultValue={editingPhone?.condition ?? initialPhone.condition} className={fieldClassName}>
                    {["10/10", "9/10", "8/10", "7/10", "6/10"].map((condition) => <option key={condition}>{condition}</option>)}
                  </select>
                </label>

                <label className="text-sm font-medium">
                  PTA status
                  <select name="pta" defaultValue={editingPhone?.pta ?? initialPhone.pta} className={fieldClassName}>
                    <option>PTA Approved</option>
                    <option>Non-PTA</option>
                  </select>
                </label>

                <label className="text-sm font-medium">
                  Price (PKR)
                  <input
                    name="price"
                    type="number"
                    min="1"
                    step="1"
                    required
                    defaultValue={editingPhone?.price ?? ""}
                    placeholder="145000"
                    className={fieldClassName}
                  />
                </label>

                <label className="text-sm font-medium">
                  Availability
                  <select name="status" defaultValue={editingPhone?.status ?? initialPhone.status} className={fieldClassName}>
                    <option>Available</option>
                    <option>Reserved</option>
                    <option>Sold</option>
                  </select>
                </label>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  className="h-11 rounded-lg border border-border px-5 text-sm font-medium hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                    disabled={uploading || savingPhone || phoneImages.length === 0}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-foreground px-5 text-sm font-semibold text-background hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Check size={17} />
                    {savingPhone ? "Saving…" : editingPhone ? "Save changes" : "Add phone"}
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
