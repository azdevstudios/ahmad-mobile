
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  MessageCircle,
  ArrowUpRight,
  Wrench,
  Zap,
  Handshake,
} from "lucide-react";

const trustItems = [
  { title: "100% PTA Approved", icon: ShieldCheck },
  { title: "Genuine Parts", icon: Wrench },
  { title: "Easy Installments", icon: Zap },
  { title: "JazzCash & Easypaisa", icon: Handshake },
];

export default function Hero() {
  return (
    <section className="w-full overflow-hidden">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-9 px-5 pb-8 pt-12 sm:px-8 sm:pt-16 lg:grid-cols-2 lg:gap-12 lg:px-10 lg:pb-12 lg:pt-20">

        {/* Hero Content */}
        <div className="min-w-0 w-full text-center lg:text-left">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-xs font-semibold shadow-sm sm:text-sm">
            <ShieldCheck size={17} className="shrink-0 text-green-600" />
            Your Trusted Mobile Store
          </div>

          <h1 className="font-heading text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            Ahmed Mobile
          </h1>

          <h2 className="mx-auto mt-4 max-w-xl font-heading text-xl font-semibold leading-snug sm:mt-5 sm:text-2xl lg:mx-0">
            Your Trusted Mobile Showroom & Repair Lab
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-secondary sm:mt-5 sm:text-base lg:mx-0">
            Discover the latest smartphones, enjoy flexible installment
            options, and get professional mobile repair services
            you can trust.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:mt-9 sm:flex-row lg:justify-start">
            <a
              href="https://wa.me/923193187344"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-semibold text-background transition-opacity hover:opacity-80"
            >
              <MessageCircle size={18} />
              Chat on WhatsApp
            </a>

            <Link
              href="/phones"
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-border bg-surface px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-background"
            >
              Browse Phones
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>

        {/* Hero Product Image */}
        <div className="hidden h-[30rem] min-w-0 w-full items-center justify-center lg:flex">
          <Image
            src="/images/iphone-hero.png"
            alt="Silver smartphones available at Ahmed Mobile"
            width={1277}
            height={1231}
            priority
            sizes="(max-width: 1280px) 40vw, 420px"
            className="h-auto w-88 max-w-full object-contain xl:w-100"
          />
        </div>

        {/* Trust Indicators */}
        <div className="grid min-w-0 grid-cols-2 gap-x-3 gap-y-6 rounded-2xl border border-border bg-surface px-5 py-7 sm:grid-cols-4 sm:gap-3 sm:px-7 sm:py-8 lg:col-span-2">
          {trustItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="flex min-w-0 flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-3"
              >
                <Icon
                  size={24}
                  strokeWidth={1.7}
                  className="shrink-0 text-secondary"
                />
                <span className="text-xs font-semibold leading-5 sm:text-sm">
                  {item.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
