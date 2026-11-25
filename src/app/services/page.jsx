
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Smartphone,
  RefreshCw,
  CalendarCheck,
  Wrench,
  Headphones,
  ShieldCheck,
  ArrowUpRight,
  MessageCircle,
} from "lucide-react";

const serviceIcons = { Smartphone, RefreshCw, CalendarCheck, Wrench, Headphones, ShieldCheck };

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/services", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Could not load services.");
        if (!cancelled) setServices(result.services ?? []);
      })
      .catch((error) => { if (!cancelled) setLoadError(error.message || "Could not load services."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">

      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">

          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-10 bg-foreground/50" />
            <span className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
              What We Offer
            </span>
          </div>

          <div className="grid gap-10 md:grid-cols-2 md:items-end">
            <div>
              <h1 className="max-w-2xl text-5xl font-bold leading-[1.1] tracking-tight md:text-7xl">
                Everything Your
                <span className="block">
                  Mobile Needs.
                </span>
              </h1>
            </div>

            <div className="md:pb-2">
              <p className="max-w-lg text-base leading-8 text-muted-foreground md:text-lg">
                From the latest smartphones to reliable repairs and flexible
                installment plans, Ahmed Mobile is here to make your mobile
                experience easier.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">

        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Our Services
            </p>

            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              What We Do Best
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-muted-foreground">
            Quality products, dependable services and support you can count on.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="rounded-xl border border-border bg-card p-7 text-sm text-muted-foreground">Loading services…</div>
          ) : loadError ? (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-7 text-sm text-muted-foreground">{loadError}</div>
          ) : services.length ? services.map((service) => {
            const Icon = serviceIcons[service.icon] ?? Wrench;

            return (
              <div
                key={service.number}
                className="group border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-10 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/15">
                    <Icon size={23} strokeWidth={1.7} />
                  </div>

                  <span className="font-mono text-sm text-muted-foreground">
                    / {service.number}
                  </span>
                </div>

                <h3 className="mb-3 text-xl font-semibold tracking-tight">
                  {service.title}
                </h3>

                <p className="text-sm leading-7 text-muted-foreground">
                  {service.description}
                </p>

                <div className="mt-8 flex items-center gap-2 text-sm font-medium text-foreground">
                  Ahmed Mobile

                  <ArrowUpRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </div>
              </div>
            );
          }) : (
            <div className="rounded-xl border border-dashed border-border p-7 text-sm text-muted-foreground">Services will be added soon. Contact our team for assistance.</div>
          )}
        </div>

      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-10">
        <div className="relative overflow-hidden rounded-3xl bg-foreground px-7 py-14 text-background md:px-14 md:py-20">

          <div className="relative z-10 max-w-2xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] opacity-60">
              Need Assistance?
            </p>

            <h2 className="mb-5 text-3xl font-bold tracking-tight md:text-5xl">
              Let&apos;s Find What You Need.
            </h2>

            <p className="mb-8 max-w-lg text-sm leading-7 opacity-70 md:text-base">
              Have a question about a phone, installment plan or repair
              service? Get in touch with our team.
            </p>

            <Link
              href="https://wa.me/923193187344"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-background px-6 py-3.5 text-sm font-semibold text-foreground transition-all hover:opacity-80"
            >
              <MessageCircle size={18} />
              Contact Us on WhatsApp
              <ArrowUpRight size={17} />
            </Link>
          </div>

          <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full border border-background/10" />
          <div className="pointer-events-none absolute -right-10 -top-14 h-60 w-60 rounded-full border border-background/10" />

        </div>
      </section>

    </main>
  );
}
