
import {
  ShieldCheck,
  Wrench,
  Wallet,
  Headset,
} from "lucide-react";

const benefits = [
  {
    number: "01",
    title: "100% PTA Approved",
    description:
      "Shop with confidence. We offer PTA-approved smartphones for a reliable experience.",
    icon: ShieldCheck,
  },
  {
    number: "02",
    title: "Genuine Parts",
    description:
      "Quality replacement parts and careful workmanship for your mobile repairs.",
    icon: Wrench,
  },
  {
    number: "03",
    title: "Easy Installments",
    description:
      "Flexible payment plans to help you get the smartphone you want.",
    icon: Wallet,
  },
  {
    number: "04",
    title: "Trusted Support",
    description:
      "Get friendly assistance and guidance whenever you need help.",
    icon: Headset,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 pt-8 pb-12 sm:px-8 lg:px-10 lg:pt-12 lg:pb-16">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            The Ahmed Mobile Difference
          </p>

          <h2 className="max-w-lg font-heading text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            A better mobile experience starts here.
          </h2>

          <p className="mt-5 max-w-md text-sm leading-7 text-secondary sm:text-base">
            From choosing your next smartphone to keeping your current
            device in perfect shape, we are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.number}
                className="border-t border-border py-7"
              >
                <div className="mb-6 flex items-center justify-between">
                  <span className="font-mono text-xs text-muted">
                    {benefit.number}
                  </span>

                  <Icon
                    size={23}
                    strokeWidth={1.6}
                    className="text-secondary"
                  />
                </div>

                <h3 className="font-heading text-lg font-bold">
                  {benefit.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-secondary">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
