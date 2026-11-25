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
} from "lucide-react";

const serviceIcons = { Smartphone, RefreshCw, CalendarCheck, Wrench, Headphones, ShieldCheck };

export default function ServicesPreview() {
  const [services, setServices] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/services", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Could not load services");
        return response.json();
      })
      .then((result) => {
        if (!cancelled) setServices((result.services ?? []).slice(0, 3));
      })
      .catch(() => {
        if (!cancelled) setServices([]);
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pt-4 pb-12 sm:px-8 lg:px-10 lg:pt-6 lg:pb-16">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            What We Offer
          </p>
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            More than just a mobile shop.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-secondary sm:text-base">
            From smartphones to reliable repairs, everything you need for your mobile experience.
          </p>
        </div>

        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:opacity-70"
        >
          Explore services <ArrowUpRight size={17} />
        </Link>
      </div>

      {!loaded ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3" aria-label="Loading services">
          {[0, 1, 2].map((item) => (
            <div key={item} className="min-h-57.5 animate-pulse rounded-2xl border border-border bg-surface" />
          ))}
        </div>
      ) : services.length ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {services.map((service, index) => {
            const Icon = serviceIcons[service.icon] ?? Wrench;

            return (
              <Link
                href="/services"
                key={service.id ?? service.number ?? service.title}
                className="group flex min-h-57.5 flex-col rounded-2xl border border-border bg-surface p-6 transition-colors hover:bg-background sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted">/ {service.number || String(index + 1).padStart(2, "0")}</span>
                  <Icon size={23} strokeWidth={1.7} className="text-secondary transition-transform group-hover:-translate-y-1" />
                </div>
                <div className="mt-auto pt-10">
                  <h3 className="font-heading text-xl font-bold">{service.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-secondary">{service.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-7 text-sm text-secondary">
          Our services are being updated. Please contact our team for assistance.
        </div>
      )}
    </section>
  );
}
