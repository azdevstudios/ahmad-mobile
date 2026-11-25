"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck,
  Database,
  Settings,
  Smartphone,
  Store,
  Wrench,
} from "lucide-react";

const managementAreas = [
  {
    title: "Used Phones",
    description: "Add pre-owned phones, photos, condition and availability.",
    href: "/admin/used-phones",
    action: "Open used phones",
    icon: Smartphone,
  },
  {
    title: "Installment Phones",
    description: "Manage models, down payments and available plan durations.",
    href: "/admin/installment-phones",
    action: "Open installments",
    icon: CalendarCheck,
  },
  {
    title: "Services",
    description: "Update the services and descriptions shown to customers.",
    href: "/admin/services",
    action: "Open services",
    icon: Wrench,
  },
  {
    title: "Store Settings",
    description: "Review contact details, location and storefront options.",
    href: "/admin/settings",
    action: "Open settings",
    icon: Settings,
  },
];

export default function AdminDashboard() {
  const [catalog, setCatalog] = useState({ loading: true, error: "", used: 0, installment: 0, services: 0 });

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/api/products?type=used&admin=1", { cache: "no-store" }).then((response) => response.json().then((body) => ({ response, body }))),
      fetch("/api/products?type=installment&admin=1", { cache: "no-store" }).then((response) => response.json().then((body) => ({ response, body }))),
      fetch("/api/services?includeHidden=1", { cache: "no-store" }).then((response) => response.json().then((body) => ({ response, body }))),
    ])
      .then(([used, installment, services]) => {
        if (!used.response.ok || !installment.response.ok || !services.response.ok) {
          throw new Error("Could not load the latest catalog counts.");
        }
        if (!cancelled) setCatalog({
          loading: false,
          error: "",
          used: used.body.products?.length ?? 0,
          installment: installment.body.products?.length ?? 0,
          services: services.body.services?.length ?? 0,
        });
      })
      .catch((error) => {
        if (!cancelled) setCatalog((current) => ({ ...current, loading: false, error: error.message || "Database is unavailable." }));
      });

    return () => { cancelled = true; };
  }, []);

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7 lg:flex-row lg:items-center lg:justify-between lg:p-8">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1.5 text-xs font-medium text-accent">
              <Store size={14} /> Store management
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              Welcome to your dashboard
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
              Manage phone listings, installment options, services and the details customers see on your store.
            </p>
          </div>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-foreground px-4 text-sm font-semibold text-background transition-opacity hover:opacity-85"
          >
            View storefront <ArrowUpRight size={16} />
          </Link>
        </section>

        <section aria-labelledby="management-heading">
          <div className="mb-5">
            <h2 id="management-heading" className="text-lg font-bold">Management</h2>
            <p className="mt-1 text-sm text-muted-foreground">Choose a section to continue working on your store.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {managementAreas.map((area) => {
              const Icon = area.icon;

              return (
                <Link
                  key={area.href}
                  href={area.href}
                  className="group flex min-h-56 flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/35 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/10">
                      <Icon size={21} strokeWidth={1.8} />
                    </span>
                    <ArrowUpRight size={17} className="text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                  <h3 className="text-base font-semibold tracking-tight">{area.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{area.description}</p>
                  <p className="mt-3 text-xs font-medium text-accent">
                    {catalog.loading ? "Loading saved items…" : catalog.error ? "Count unavailable" : area.href === "/admin/used-phones" ? `${catalog.used} saved listings` : area.href === "/admin/installment-phones" ? `${catalog.installment} saved models` : area.href === "/admin/services" ? `${catalog.services} saved services` : "Store details"}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 border-t border-border pt-4 text-sm font-semibold text-accent">
                    {area.action}<ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent"><Database size={19} /></span>
              <div>
                <h2 className="font-semibold">Catalog sync</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {catalog.error
                    ? "The dashboard could not reach the catalog database. Check the database connection and try again."
                    : "Phone listings and active services are loaded from the database. Admin changes now persist and the public pages read the saved catalog."}
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${catalog.error ? "bg-red-500/10 text-red-700 dark:text-red-400" : catalog.loading ? "bg-muted text-muted-foreground" : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"}`}>
                {catalog.loading ? "Checking database…" : catalog.error ? "Connection unavailable" : "Database connected"}
              </span>
              <span className="text-xs text-muted-foreground">{catalog.error || "Counts reflect saved database records."}</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-accent/5 p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Quick start</p>
            <h2 className="mt-2 text-lg font-bold">Keep your store up to date</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Start by adding inventory and checking the store details customers use to contact you.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/admin/used-phones" className="inline-flex h-9 items-center gap-2 rounded-lg bg-foreground px-3 text-xs font-semibold text-background hover:opacity-85">
                <Smartphone size={15} /> Add inventory
              </Link>
              <Link href="/admin/settings" className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-semibold hover:bg-muted">
                Store settings <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
