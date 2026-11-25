
import { MapPin, Phone, MessageCircle, ArrowUpRight, PhoneCall } from "lucide-react";

export default function ContactPreview() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 pt-4 pb-12 sm:px-8 lg:px-10 lg:pt-6 lg:pb-16">
      <div className="flex flex-col gap-8 rounded-3xl border border-border bg-surface p-7 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-12">
        <div className="max-w-xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Get In Touch
          </p>

          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Let&apos;s find the right phone for you.
          </h2>

          <p className="mt-4 text-sm leading-7 text-secondary sm:text-base">
            Have a question about a smartphone, installments or mobile
            repair? Get in touch with our team or visit our shop.
          </p>

          <div className="mt-6 grid gap-3 text-sm text-secondary">
            <a href="tel:+923193187344" className="inline-flex w-fit items-center gap-2 transition-colors hover:text-foreground">
              <PhoneCall size={17} className="shrink-0" />
              +92 319 3187344
            </a>
            <a
              href="https://www.google.com/maps?q=31.3257201,72.7271838"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-start gap-2 transition-colors hover:text-foreground"
            >
              <MapPin size={17} className="mt-0.5 shrink-0" />
              <span>Chak No. 338, Ada Nawa, Lahore–Kajla Road</span>
            </a>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
          <a
            href="https://wa.me/923193187344"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-75"
          >
            <MessageCircle size={17} />
            Chat on WhatsApp
            <ArrowUpRight size={16} />
          </a>

          <a
            href="tel:03193187344"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface"
          >
            <Phone size={17} />
            Call 0319-3187344
          </a>
        </div>
      </div>
    </section>
  );
}
