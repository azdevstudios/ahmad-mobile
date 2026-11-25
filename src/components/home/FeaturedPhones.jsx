
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const phones = [
  {
    number: "01",
    name: "Latest iPhones",
    description: "Explore the latest Apple smartphones and available models.",
    category: "Apple",
    image: "/images/apple.png",
    imageAlt: "Apple smartphones",
  },
  {
    number: "02",
    name: "Samsung Galaxy",
    description: "Discover Samsung Galaxy smartphones for every need.",
    category: "Samsung",
    image: "/images/samsung.png",
    imageAlt: "Samsung Galaxy smartphones",
  },
  {
    number: "03",
    name: "Other Smartphones",
    description: "Explore Vivo, Infinix and other popular smartphone brands.",
    category: "Vivo · Infinix · More",
    image: "/images/other.png",
    imageAlt: "Vivo and Infinix smartphones",
  },
];

export default function FeaturedPhones() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 pt-8 pb-12 sm:px-8 lg:px-10 lg:pt-12 lg:pb-16">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Explore Our Collection
          </p>

          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Find your next smartphone.
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-7 text-secondary sm:text-base">
            Explore smartphones from popular brands and find the right
            device for your needs.
          </p>
        </div>

        <Link
          href="/phones"
          className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-opacity hover:opacity-60"
        >
          Explore all phones <ArrowUpRight size={17} />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {phones.map((phone) => (
          <Link
            href="/phones"
            key={phone.number}
            className="group overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-secondary/40"
          >
            
<div className="relative h-64 overflow-hidden sm:h-72">
  <Image
    src={phone.image}
    alt={phone.imageAlt}
    fill
    sizes="(max-width: 768px) 100vw, 33vw"
    className="object-contain transition-transform duration-500 group-hover:scale-105"
  />

  <span className="absolute left-5 top-5 font-mono text-xs text-zinc-500">
    {phone.number}
  </span>

  <span className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white text-zinc-900 shadow-sm transition-transform duration-300 group-hover:rotate-45">
    <ArrowUpRight size={18} />
  </span>
</div>


            <div className="p-6 sm:p-7">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                {phone.category}
              </p>

              <h3 className="font-heading text-xl font-bold">
                {phone.name}
              </h3>

              <p className="mt-2 text-sm leading-6 text-secondary">
                {phone.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
