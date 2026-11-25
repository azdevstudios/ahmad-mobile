
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  SlidersHorizontal,
  ArrowUpRight,
  MessageCircle,
} from "lucide-react";

const brands = [
  "All",
  "Apple",
  "Samsung",
  "Oppo",
  "Vivo",
  "Infinix",
  "Tecno",
];

export default function UsedPhonesPage() {
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [activeBrand, setActiveBrand] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/products?type=used", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Could not load phones.");
        if (!cancelled) setPhones(result.products ?? []);
      })
      .catch((error) => { if (!cancelled) setLoadError(error.message || "Could not load phones."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const availableBrands = useMemo(() => [
    "All",
    ...new Set([...brands.filter((brand) => brand !== "All"), ...phones.map((phone) => phone.brand)]),
  ], [phones]);

  const filteredPhones = phones.filter((phone) => {
    const matchesBrand = activeBrand === "All" || phone.brand === activeBrand;

    const matchesSearch =
      `${phone.name} ${phone.brand} ${phone.storage}`.toLowerCase().includes(search.toLowerCase());

    return matchesBrand && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 lg:px-10 lg:pt-24">

        {/* Heading */}
        <div className="max-w-3xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Ahmed Mobile Collection
          </p>

          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Quality used phones.
            <span className="block text-secondary">
              Better value, trusted choice.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-secondary sm:text-base">
            Explore our collection of pre-owned smartphones.
            Find your preferred model at a price that suits you.
          </p>
        </div>

        {/* Search */}
        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <div className="flex h-12 flex-1 items-center gap-3 rounded-xl border border-border bg-surface px-4">
            <Search size={19} className="text-muted" />

            <input
              type="text"
              placeholder="Search phone model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
            />
          </div>

          <button className="flex h-12 items-center justify-center gap-2 rounded-xl border border-border px-5 text-sm font-medium transition-colors hover:bg-surface">
            <SlidersHorizontal size={17} />
            Filters
          </button>
        </div>

        {/* Brands */}
        <div className="mt-8 flex flex-wrap gap-2">
            {availableBrands.map((brand) => (
            <button
              key={brand}
              onClick={() => setActiveBrand(brand)}
              className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${
                activeBrand === brand
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-secondary hover:border-foreground hover:text-foreground"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>

        {/* Listing Header */}
        <div className="mt-14 flex items-end justify-between border-b border-border pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">
              Available Collection
            </p>
            <h2 className="mt-2 font-heading text-2xl font-bold">
              Used Smartphones
            </h2>
          </div>

          <p className="text-sm text-secondary">
            {loading ? "Loading phones…" : `${filteredPhones.length} phones`}
          </p>
        </div>

        {/* Phone Cards */}
        {loading ? (
          <div className="mt-7 rounded-2xl border border-border bg-surface px-5 py-16 text-center text-sm text-secondary">Loading available phones…</div>
        ) : loadError ? (
          <div className="mt-7 rounded-2xl border border-amber-500/30 bg-amber-500/5 px-5 py-12 text-center">
            <h3 className="font-heading text-xl font-bold">Phones are temporarily unavailable</h3>
            <p className="mt-2 text-sm text-secondary">{loadError}</p>
          </div>
        ) : filteredPhones.length > 0 ? (
          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredPhones.map((phone) => (
              <div
                key={phone.id}
                className="group overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-secondary/50"
              >
                <div className="relative flex h-64 items-center justify-center bg-[#f5f5f3] p-5">
                  <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold text-zinc-800">
                    {phone.pta}
                  </span>

                  <span className="absolute right-4 top-4 font-mono text-xs text-zinc-500">
                    Used
                  </span>

                  <Image
                    src={phone.images?.[0]?.url || phone.image || "/images/other.png"}
                    alt={phone.name}
                    width={640}
                    height={640}
                    unoptimized
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                    {phone.brand} · {phone.storage}
                  </p>

                  <h3 className="mt-2 font-heading text-lg font-bold">
                    {phone.name}
                  </h3>

                  <div className="mt-4 flex items-center justify-between text-xs text-secondary">
                    <span>Condition</span>
                    <span className="font-semibold text-foreground">
                      {phone.condition}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                    <p className="font-mono text-base font-bold">
                      Rs. {Number(phone.price).toLocaleString("en-PK")}
                    </p>
                  </div>

                  <a
                    href={`https://wa.me/923193187344?text=${encodeURIComponent(
                      `Hi, I am interested in ${phone.name} (${phone.storage}). Is it available?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-80"
                  >
                    <MessageCircle size={17} />
                    Inquire on WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <h3 className="font-heading text-xl font-bold">
              No phones found
            </h3>
            <p className="mt-2 text-sm text-secondary">
              Try another model or select a different brand.
            </p>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-16 border-t border-border pt-7">
          <Link
            href="/phones"
            className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-60"
          >
            Explore all phones
            <ArrowUpRight size={17} />
          </Link>
        </div>

      </section>
    </main>
  );
}
