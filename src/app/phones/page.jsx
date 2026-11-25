
import Link from "next/link";
import {
  ArrowUpRight,
  Smartphone,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";

const phoneCategories = [
  {
    number: "01",
    title: "Used Phones",
    description:
      "Explore pre-owned smartphones from Apple, Samsung, Vivo, Oppo, Infinix and more.",
    detail: "Browse available used devices",
    href: "/phones/used",
    icon: Smartphone,
  },
  {
    number: "02",
    title: "Installment Phones",
    description:
      "Find your preferred smartphone and explore flexible installment options.",
    detail: "Explore installment plans",
    href: "/phones/installments",
    icon: CalendarDays,
  },
];

export default function PhonesPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto w-full max-w-7xl px-5 pb-20 pt-16 sm:px-8 sm:pt-24 lg:px-10">
        <div className="max-w-3xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Ahmed Mobile Collection
          </p>

          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Find the right phone
            <span className="block text-secondary">
              for your needs.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-secondary sm:text-base">
            Explore quality used smartphones or discover devices
            available with flexible installment options.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
          {phoneCategories.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.number}
                href={item.href}
                className="group relative flex min-h-82.5 flex-col overflow-hidden rounded-3xl border border-border bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:border-secondary/50 sm:min-h-92.5 sm:p-9"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted">
                    {item.number}
                  </span>

                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-border">
                    <ArrowUpRight
                      size={20}
                      className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                    />
                  </span>
                </div>

                <div className="flex flex-1 items-center justify-center py-8">
                  <Icon
                    size={90}
                    strokeWidth={1}
                    className="text-secondary transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                    {item.detail}
                  </p>

                  <h2 className="font-heading text-2xl font-bold sm:text-3xl">
                    {item.title}
                  </h2>

                  <p className="mt-3 max-w-md text-sm leading-7 text-secondary">
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 flex items-center gap-3 border-t border-border pt-6">
          <ShieldCheck size={20} className="shrink-0 text-secondary" />
          <p className="text-xs leading-6 text-secondary sm:text-sm">
            Visit Ahmed Mobile for genuine guidance and personalized
            assistance.
          </p>
        </div>
      </section>
    </main>
  );
}
