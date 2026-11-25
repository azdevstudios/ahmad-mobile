
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";

export default function AboutPreview() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
      <div className="grid grid-cols-1 items-center gap-8 rounded-3xl border border-border bg-surface p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:gap-12 lg:p-14">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            About Ahmed Mobile
          </p>

          <h2 className="max-w-2xl font-heading text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            Your trusted destination for smartphones and mobile care.
          </h2>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-secondary sm:text-base">
            At Ahmed Mobile, we bring smartphones, flexible installment
            options and professional repair services together under one
            roof. Our goal is to make your mobile experience simple,
            reliable and convenient.
          </p>

          <div className="mt-6 flex items-center gap-2 text-sm font-medium text-secondary">
           <MapPin size={17} />
            Chak no 338 ada nawa lahore kajla road.
          </div>
        </div>

        <div className="flex lg:justify-end">
          <Link
            href="/about"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-75"
          >
            More About Us
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
