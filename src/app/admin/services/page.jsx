"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  ArrowUpRight,
  CalendarCheck,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Headphones,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Smartphone,
  Wrench,
  Pencil,
  X,
} from "lucide-react";
import { confirmDeleteToast } from "@/components/admin/ConfirmDeleteToast";

const iconOptions = [
  { name: "Smartphone", Icon: Smartphone },
  { name: "RefreshCw", Icon: RefreshCw },
  { name: "CalendarCheck", Icon: CalendarCheck },
  { name: "Wrench", Icon: Wrench },
  { name: "Headphones", Icon: Headphones },
  { name: "ShieldCheck", Icon: ShieldCheck },
];
const iconMap = Object.fromEntries(iconOptions.map(({ name, Icon }) => [name, Icon]));
const fieldClassName = "mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15";

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [savingService, setSavingService] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [formOpen, setFormOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState("Wrench");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/services?includeHidden=1", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Could not load services.");
        if (!cancelled) setServices(result.services ?? []);
      })
      .catch((error) => { if (!cancelled) toast.error(error.message || "Could not load services."); })
      .finally(() => { if (!cancelled) setLoadingServices(false); });
    return () => { cancelled = true; };
  }, []);

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase();
    return services.filter((service) => {
      const matchesSearch = !query || `${service.title} ${service.description}`.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "All statuses" || service.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [services, search, statusFilter]);

  const closeForm = () => {
    setFormOpen(false);
    setEditingService(null);
  };

  const openForm = (service = null) => {
    setEditingService(service);
    setSelectedIcon(service?.icon ?? "Wrench");
    setFormOpen(true);
  };

  const saveService = async (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const service = {
      id: editingService?.id,
      number: String(editingService?.number ?? services.length + 1).padStart(2, "0"),
      title: values.title.trim(),
      description: values.description.trim(),
      icon: values.icon,
      status: values.status,
    };

    setSavingService(true);
    try {
      const response = await fetch(editingService ? `/api/services/${editingService.id}` : "/api/services", {
        method: editingService ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(service),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not save this service.");
      setServices((current) => editingService
        ? current.map((item) => (item.id === editingService.id ? result.service : item))
        : [...current, result.service]
      );
      toast.success(editingService ? "Service updated." : "Service added.");
      closeForm();
    } catch (error) {
      toast.error(error.message || "Could not save this service.");
    } finally {
      setSavingService(false);
    }
  };

  const toggleStatus = async (service) => {
    const updatedService = { ...service, status: service.status === "Active" ? "Hidden" : "Active" };
    try {
      const response = await fetch(`/api/services/${service.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedService),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not update service visibility.");
      setServices((current) => current.map((item) => item.id === service.id ? result.service : item));
      toast.success(updatedService.status === "Active" ? "Service is visible." : "Service hidden from storefront.");
    } catch (error) {
      toast.error(error.message || "Could not update service visibility.");
    }
  };

  const requestDelete = (service) => {
    confirmDeleteToast({
      title: `Delete “${service.title}”?`,
      description: "This removes the service from the admin list.",
      successMessage: "Service deleted.",
      onConfirm: async () => {
        const response = await fetch(`/api/services/${service.id}`, { method: "DELETE" });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Could not delete this service.");
        setServices((current) => current.filter((item) => item.id !== service.id));
      },
    });
  };

  const activeCount = services.filter((service) => service.status === "Active").length;

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent">Website / Services</p>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Services</h1>
            <p className="mt-2 text-sm text-muted-foreground">Manage the services shown on your website.</p>
          </div>
          <button type="button" onClick={() => openForm()} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-foreground px-4 text-sm font-semibold text-background transition-opacity hover:opacity-85">
            <Plus size={18} /> Add Service
          </button>
        </div>

        <section className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "All services", value: services.length, icon: Wrench },
            { label: "Active on website", value: activeCount, icon: Eye },
            { label: "Hidden", value: services.length - activeCount, icon: EyeOff },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent"><Icon size={20} /></div>
              <div><p className="text-2xl font-bold">{value}</p><p className="mt-0.5 text-xs text-muted-foreground">{label}</p></div>
            </div>
          ))}
        </section>

        <section className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <label className="relative block w-full lg:max-w-sm">
              <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search services" aria-label="Search services" className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15" />
            </label>
            <label className="relative block sm:w-44">
              <span className="sr-only">Filter by status</span>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-11 w-full appearance-none rounded-lg border border-border bg-background pl-3 pr-9 text-sm outline-none focus:border-accent">
                <option>All statuses</option><option>Active</option><option>Hidden</option>
              </select>
              <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </label>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
            <p className="text-sm font-medium">Service list</p>
            <p className="text-xs text-muted-foreground" aria-live="polite">{filteredServices.length} {filteredServices.length === 1 ? "service" : "services"}</p>
          </div>

          {loadingServices ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Loading services…</div>
          ) : filteredServices.length ? (
            <div className="mt-3 grid gap-3 lg:grid-cols-2">
              {filteredServices.map((service) => {
                const Icon = iconMap[service.icon] ?? Wrench;
                return (
                  <article key={service.id} className="rounded-xl border border-border bg-background p-4 transition-colors hover:border-accent/30 sm:p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent"><Icon size={21} strokeWidth={1.8} /></div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-semibold">{service.title}</h2>
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${service.status === "Active" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                            {service.status === "Active" ? <Check size={12} /> : <EyeOff size={12} />}{service.status}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{service.description}</p>
                        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                          <span className="font-mono text-xs text-muted-foreground">/{service.number}</span>
                          <div className="flex items-center gap-1">
                            <button type="button" onClick={() => toggleStatus(service)} aria-label={`${service.status === "Active" ? "Hide" : "Show"} ${service.title}`} title={service.status === "Active" ? "Hide service" : "Show service"} className="flex h-9 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground">{service.status === "Active" ? <EyeOff size={15} /> : <Eye size={15} />}<span className="hidden sm:inline">{service.status === "Active" ? "Hide" : "Show"}</span></button>
                            <button type="button" onClick={() => openForm(service)} aria-label={`Edit ${service.title}`} title="Edit service" className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"><Pencil size={16} /></button>
                            <button type="button" onClick={() => requestDelete(service)} aria-label={`Delete ${service.title}`} title="Delete service" className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"><X size={17} /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="my-5 rounded-xl border border-dashed border-border px-5 py-12 text-center">
              <p className="font-semibold">No matching services</p>
              <p className="mt-2 text-sm text-muted-foreground">Try a different search or filter.</p>
            </div>
          )}
        </section>
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/45 p-0 backdrop-blur-sm sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) closeForm(); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="service-form-title" className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-2xl border border-border bg-background shadow-2xl sm:rounded-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-5 py-4 sm:px-6">
              <div><p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Website content</p><h2 id="service-form-title" className="mt-1 text-lg font-bold">{editingService ? "Edit service" : "Add service"}</h2></div>
              <button type="button" onClick={closeForm} aria-label="Close form" className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-muted hover:text-foreground"><X size={18} /></button>
            </div>
            <form key={editingService?.id ?? "new-service"} onSubmit={saveService} className="space-y-4 p-5 sm:p-6">
              <label className="block text-sm font-medium">Service title<input name="title" required maxLength={60} defaultValue={editingService?.title ?? ""} placeholder="e.g. Mobile Repairing" className={fieldClassName} /></label>
              <label className="block text-sm font-medium">Description<textarea name="description" required maxLength={220} rows={4} defaultValue={editingService?.description ?? ""} placeholder="Briefly describe this service" className={`${fieldClassName} h-auto resize-y py-3 leading-6`} /><span className="mt-1 block text-xs text-muted-foreground">Keep it clear and concise (up to 220 characters).</span></label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium">Icon<select name="icon" value={selectedIcon} onChange={(event) => setSelectedIcon(event.target.value)} className={fieldClassName}>{iconOptions.map(({ name }) => <option key={name} value={name}>{name.replace(/([A-Z])/g, " $1").trim()}</option>)}</select></label>
                <label className="text-sm font-medium">Visibility<select name="status" defaultValue={editingService?.status ?? "Active"} className={fieldClassName}><option>Active</option><option>Hidden</option></select></label>
              </div>
              {(() => {
                const PreviewIcon = iconMap[selectedIcon] ?? Wrench;
                return <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent"><PreviewIcon size={20} /></span><div><p className="text-xs font-semibold">Icon preview</p><p className="mt-0.5 text-xs text-muted-foreground">The selected icon appears on the service card.</p></div><ArrowUpRight size={16} className="ml-auto text-muted-foreground" /></div>;
              })()}
              <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                <button type="button" onClick={closeForm} className="h-11 rounded-lg border border-border px-4 text-sm font-semibold hover:bg-muted">Cancel</button>
                <button type="submit" disabled={savingService} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-foreground px-5 text-sm font-semibold text-background hover:opacity-85 disabled:opacity-50"><Check size={17} />{savingService ? "Saving…" : editingService ? "Save changes" : "Add service"}</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
