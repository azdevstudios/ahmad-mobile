
import Link from "next/link";
import {
  Smartphone,
  Wrench,
  ShieldCheck,
  Handshake,
  ArrowUpRight,
  MessageCircle,
  CheckCircle2,
  MapPin,
} from "lucide-react";

const features = [
  {
    icon: Smartphone,
    title: "Mobile Showroom",
    description:
      "Explore new and used smartphones from different brands to find a device that suits your needs.",
  },
  {
    icon: Wrench,
    title: "Repair Lab",
    description:
      "Get assistance with mobile repair and technical issues through our repair services.",
  },
  {
    icon: ShieldCheck,
    title: "Customer Confidence",
    description:
      "We aim to make every customer experience clear, helpful and reliable.",
  },
  {
    icon: Handshake,
    title: "Personal Assistance",
    description:
      "Our team helps you understand available phones, installment options and services.",
  },
];

const reasons = [
  "New and used smartphone options",
  "Flexible installment plans",
  "Mobile repair services",
  "Helpful customer support",
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">

      {/* Hero Section */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">

          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-10 bg-foreground/50" />
            <span className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
              About Ahmed Mobile
            </span>
          </div>

          <div className="grid gap-10 md:grid-cols-2 md:items-end">

            <div>
              <h1 className="max-w-2xl text-5xl font-bold leading-[1.1] tracking-tight md:text-7xl">
                More Than Just
                <span className="block">
                  A Mobile Store.
                </span>
              </h1>
            </div>

            <div className="md:pb-2">
              <p className="max-w-lg text-base leading-8 text-muted-foreground md:text-lg">
                Ahmed Mobile brings phone shopping, installment options and
                repair services together. Visit us to explore new and used
                phones, ask about available plans or discuss a repair.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* About Introduction */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">

        <div className="grid gap-14 md:grid-cols-2 md:items-center">

          <div>
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Who We Are
            </p>

            <h2 className="mb-6 text-3xl font-bold leading-tight tracking-tight md:text-4xl">
              Your Mobile Needs, All in One Place.
            </h2>

            <div className="space-y-5 text-sm leading-8 text-muted-foreground md:text-base">
              <p>
                Ahmed Mobile is a local mobile showroom and repair lab. We
                help customers explore phones, compare available options and
                get support with mobile repairs.
              </p>

              <p>
                Whether you are looking for a new smartphone, a quality used
                phone, an installment option or repair assistance, we are here
                to help you explore your options.
              </p>

              <p>
                Our goal is simple: provide a helpful experience, clear
                information and support when you need it.
              </p>
            </div>
          </div>

          <div className="flex min-h-85 flex-col justify-between rounded-2xl border border-border bg-card p-7 sm:p-9 md:min-h-107.5">
            <div>
              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/15">
                <MapPin size={23} strokeWidth={1.8} />
              </div>

              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Visit Our Showroom
              </p>

              <h3 className="text-2xl font-bold tracking-tight">
                Ahmed Mobile
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Smartphones &amp; Repair Lab
              </p>
            </div>

            <div className="mt-10 border-t border-border pt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Our Location
              </p>
              <p className="mt-2 max-w-sm text-sm leading-7">
                Chak No. 338, Ada Nawa, Lahore Kajla Road
              </p>
              <a
                href="https://www.google.com/maps?q=31.3257201,72.7271838"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-opacity hover:opacity-70"
              >
                Get directions <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="border-y border-border bg-card/40">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-24">

          <div className="mb-12 max-w-2xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
              What Defines Us
            </p>

            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Built Around Your Mobile Needs.
            </h2>

            <p className="mt-5 text-sm leading-7 text-muted-foreground md:text-base">
              We bring different mobile products and services together to
              make things convenient for our customers.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/15">
                    <Icon size={23} strokeWidth={1.7} />
                  </div>

                  <span className="mb-3 block font-mono text-xs text-muted-foreground">
                    0{index + 1}
                  </span>

                  <h3 className="mb-3 text-lg font-semibold">
                    {feature.title}
                  </h3>

                  <p className="text-sm leading-7 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">

        <div className="grid gap-12 md:grid-cols-2 md:items-center">

          <div>
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Why Ahmed Mobile
            </p>

            <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">
              A Better Experience Starts Here.
            </h2>

            <p className="max-w-lg text-sm leading-8 text-muted-foreground md:text-base">
              Choosing a mobile phone or getting it repaired should be a
              straightforward experience. We aim to help you make informed
              decisions with the right information and assistance.
            </p>
          </div>

          <div className="space-y-5">
            {reasons.map((reason) => (
              <div
                key={reason}
                className="flex items-center gap-4 border-b border-border pb-5"
              >
                <CheckCircle2
                  size={21}
                  strokeWidth={1.7}
                  className="shrink-0"
                />

                <span className="text-sm font-medium md:text-base">
                  {reason}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-10">

        <div className="relative overflow-hidden rounded-3xl bg-foreground px-7 py-14 text-background md:px-14 md:py-20">

          <div className="relative z-10 max-w-2xl">

            <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] opacity-60">
              Get in Touch
            </p>

            <h2 className="mb-5 text-3xl font-bold tracking-tight md:text-5xl">
              We&apos;re Here to Help.
            </h2>

            <p className="mb-8 max-w-lg text-sm leading-7 opacity-70 md:text-base">
              Have a question about smartphones, installments or repair
              services? Contact Ahmed Mobile and let us assist you.
            </p>

            <Link
              href="https://wa.me/923193187344"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-background px-6 py-3.5 text-sm font-semibold text-foreground transition-opacity hover:opacity-80"
            >
              <MessageCircle size={18} />
              Chat on WhatsApp
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
