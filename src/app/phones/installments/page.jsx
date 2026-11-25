
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SiOppo } from "react-icons/si";
import {
  Smartphone,
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronRight,
  X,
  CreditCard,
  MessageCircle,
} from "lucide-react";

// Available brands
const brands = [
  { name: "Infinix", icon: Smartphone },
  { name: "Tecno", icon: Smartphone },
  { name: "Itel", icon: Smartphone },
  { name: "Realme", icon: Smartphone },
  { name: "Nubia", icon: Smartphone },
  { name: "Oppo", icon: SiOppo },
  { name: "Villaon", icon: Smartphone },
  { name: "Other", icon: Smartphone },
];

const downPayments = [25, 35, 50];
const paymentTerms = [3, 6, 9];

const formatPrice = (price) =>
  `Rs. ${Math.round(price).toLocaleString("en-PK")}`;

export default function InstallmentPhonesPage() {
  const [phones, setPhones] = useState([]);
  const [loadingPhones, setLoadingPhones] = useState(true);
  const [phonesError, setPhonesError] = useState("");
  const [activeBrand, setActiveBrand] = useState("Infinix");
  const [selectedPhone, setSelectedPhone] = useState(null);

  const [modelModal, setModelModal] = useState(false);
  const [repaymentModal, setRepaymentModal] = useState(false);

  const [storage, setStorage] = useState("");
  const [color, setColor] = useState("");

  const [downPaymentPercent, setDownPaymentPercent] = useState(25);
  const [duration, setDuration] = useState(3);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/products?type=installment", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Could not load installment phones.");
        if (!cancelled) setPhones(result.products ?? []);
      })
      .catch((error) => { if (!cancelled) setPhonesError(error.message || "Could not load installment phones."); })
      .finally(() => { if (!cancelled) setLoadingPhones(false); });
    return () => { cancelled = true; };
  }, []);

  const brandOptions = useMemo(() => {
    const known = new Set(brands.map((brand) => brand.name));
    const extraBrands = [...new Set(
      phones
        .map((phone) => phone.brand)
        .filter((brand) => !known.has(brand) && !["apple", "samsung"].includes(brand.toLowerCase()))
    )];
    return [...brands, ...extraBrands.map((name) => ({ name, icon: Smartphone }))];
  }, [phones]);

  const filteredPhones = phones.filter(
    (phone) => phone.brand === activeBrand
  );

  const downPayment = selectedPhone
    ? Math.round(
        (selectedPhone.price * downPaymentPercent) / 100
      )
    : 0;

  const remainingAmount = selectedPhone
    ? selectedPhone.price - downPayment
    : 0;

  const monthlyPayment = selectedPhone
    ? Math.ceil(remainingAmount / duration)
    : 0;

  // Select phone and open customization
  const selectPhone = (phone) => {
    setSelectedPhone(phone);
    setStorage(phone.storage[0]);
    setColor(phone.colors[0]);

    setDownPaymentPercent(phone.downPayments?.[0] ?? downPayments[0]);
    setDuration(phone.durations?.[0] ?? paymentTerms[0]);
    setModelModal(false);

    setTimeout(() => {
      document
        .getElementById("customize-phone")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  };

  // WhatsApp message
  const whatsappMessage = encodeURIComponent(
    `Hi Ahmed Mobile, I am interested in an installment phone.

Model: ${selectedPhone?.name}
Storage: ${storage}
Color: ${color}
Total Price: ${formatPrice(selectedPhone?.price || 0)}
Down Payment: ${formatPrice(downPayment)}
Duration: ${duration} months
Estimated Monthly Payment: ${formatPrice(monthlyPayment)}

Please share more details.`
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-7xl px-5 pb-20 pt-14 sm:px-8 lg:px-10 lg:pt-20">

        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Ahmed Mobile Collection
            </p>

            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
              Easy installments.
              <span className="block text-secondary">
                Your phone, your choice.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-secondary sm:text-base">
              Choose your preferred smartphone, customize its
              configuration and explore flexible payment options.
            </p>
          </div>

          <Link
            href="/phones"
            className="inline-flex items-center gap-2 text-sm font-semibold hover:opacity-60"
          >
            <ArrowLeft size={17} />
            All Phones
          </Link>
        </div>

        {/* Installment Type */}
        <div className="mt-10 border-b border-border">
          <div className="inline-flex items-center gap-2 border-b-2 border-foreground px-2 pb-4 text-sm font-semibold">
            <CreditCard size={17} />
            Standard Installment
          </div>
        </div>

        {/* Brand Selection */}
        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            Step 01
          </p>

          <h2 className="mt-2 font-heading text-xl font-bold">
            Select Brand
          </h2>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
            {brandOptions.map((brand) => {
              const BrandIcon = brand.icon;

              return (
                <button
                  key={brand.name}
                  onClick={() => {
                    setActiveBrand(brand.name);
                    setSelectedPhone(null);
                    setStorage("");
                    setColor("");
                  }}
                  className={`flex min-h-28 flex-col items-center justify-center gap-3 rounded-2xl border p-4 transition-all duration-200 ${
                    activeBrand === brand.name
                      ? "border-foreground bg-surface ring-1 ring-foreground"
                      : "border-border bg-surface hover:border-secondary"
                  }`}
                >
                  <BrandIcon
                    size={34}
                    className="text-foreground"
                  />

                  <span className="text-xs font-semibold">
                    {brand.name}
                  </span>

                  {activeBrand === brand.name && (
                    <Check size={15} className="text-accent" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Model Selection */}
        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            Step 02
          </p>

          <h2 className="mt-2 font-heading text-xl font-bold">
            Select Model
          </h2>

          <button
            onClick={() => setModelModal(true)}
            className="mt-5 flex w-full items-center justify-between gap-4 rounded-2xl border border-border bg-surface px-5 py-5 text-left transition-colors hover:border-secondary sm:px-7"
          >
            <div>
              <p className="text-xs text-muted">
                {selectedPhone
                  ? "Selected Model"
                  : "Choose a phone model"}
              </p>

              <h3 className="mt-2 font-heading text-lg font-bold">
                {selectedPhone
                  ? selectedPhone.name
                  : "Select Model"}
              </h3>

              {selectedPhone && (
                <p className="mt-1 text-sm text-secondary">
                  {selectedPhone.code} ·{" "}
                  {formatPrice(selectedPhone.price)}
                </p>
              )}
            </div>

            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border">
              <ChevronRight size={20} />
            </span>
          </button>
        </div>

        {/* Customization */}
        {selectedPhone && (
          <div
            id="customize-phone"
            className="mt-12 scroll-mt-28"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">
              Step 03
            </p>

            <h2 className="mt-2 font-heading text-2xl font-bold">
              Customize your phone
            </h2>

            <p className="mt-2 text-sm text-secondary">
              Select your preferred storage and color.
            </p>

            <div className="mt-7 grid grid-cols-1 gap-7 lg:grid-cols-[0.9fr_1.1fr]">

              {/* Phone Preview */}
              <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-border bg-surface p-7">
                <Image
                  src={selectedPhone.images?.[0]?.url || selectedPhone.image || "/images/other.png"}
                  alt={selectedPhone.name}
                  width={480}
                  height={480}
                  unoptimized
                  className="h-64 w-full object-contain"
                />

                <p className="mt-4 text-sm font-semibold">
                  {selectedPhone.name}
                </p>

                <p className="mt-1 text-xs text-secondary">
                  {selectedPhone.code}
                </p>
              </div>

              {/* Customization Options */}
              <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
                <label className="text-sm font-semibold">
                  Storage
                </label>

                <div className="mt-4 flex flex-wrap gap-3">
                  {selectedPhone.storage.map((item) => (
                    <button
                      key={item}
                      onClick={() => setStorage(item)}
                      className={`rounded-xl border px-5 py-3 text-sm font-semibold transition-colors ${
                        storage === item
                          ? "border-foreground bg-foreground text-background"
                          : "border-border hover:border-foreground"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <div className="mt-8">
                  <label className="text-sm font-semibold">
                    Color
                  </label>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {selectedPhone.colors.map((item) => (
                      <button
                        key={item}
                        onClick={() => setColor(item)}
                        className={`rounded-xl border px-5 py-3 text-sm transition-colors ${
                          color === item
                            ? "border-foreground bg-foreground text-background"
                            : "border-border hover:border-foreground"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-6">
                  <div>
                    <p className="text-xs text-muted">
                      Selected Phone
                    </p>

                    <h3 className="mt-1 font-heading font-bold">
                      {selectedPhone.name}
                    </h3>

                    <p className="mt-1 text-xs text-secondary">
                      {storage} · {color}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-mono text-lg font-bold">
                      {formatPrice(selectedPhone.price)}
                    </p>

                    <p className="text-xs text-muted">
                      Total Price
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Down Payment */}
            <div className="mt-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                Step 04
              </p>

              <h2 className="mt-2 font-heading text-xl font-bold">
                Down Payment
              </h2>

              <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-surface">
                {(selectedPhone.downPayments?.length ? selectedPhone.downPayments : downPayments).map((percent) => (
                  <button
                    key={percent}
                    onClick={() => setDownPaymentPercent(percent)}
                    className="flex w-full items-center justify-between gap-4 border-b border-border px-5 py-5 text-left last:border-0 sm:px-7"
                  >
                    <span className="flex items-center gap-3 text-sm">
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                          downPaymentPercent === percent
                            ? "border-foreground bg-foreground text-background"
                            : "border-secondary"
                        }`}
                      >
                        {downPaymentPercent === percent && (
                          <Check size={13} />
                        )}
                      </span>

                      {percent}% Order Amount
                    </span>

                    <span className="font-mono text-sm font-semibold">
                      {formatPrice(
                        (selectedPhone.price * percent) / 100
                      )}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between rounded-xl bg-surface px-5 py-5">
                <span className="text-sm font-semibold">
                  Down Payment
                </span>

                <span className="font-mono font-bold">
                  {formatPrice(downPayment)}
                </span>
              </div>
            </div>

            {/* Payment Duration */}
            <div className="mt-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                Step 05
              </p>

              <h2 className="mt-2 font-heading text-xl font-bold">
                Payment Term
              </h2>

              <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-surface">
                {(selectedPhone.durations?.length ? selectedPhone.durations : paymentTerms).map((months) => (
                  <button
                    key={months}
                    onClick={() => setDuration(months)}
                    className="flex w-full items-center justify-between border-b border-border px-5 py-5 text-left last:border-0 sm:px-7"
                  >
                    <span className="flex items-center gap-3 text-sm">
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                          duration === months
                            ? "border-foreground bg-foreground text-background"
                            : "border-secondary"
                        }`}
                      >
                        {duration === months && (
                          <Check size={13} />
                        )}
                      </span>

                      {months} Months
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Monthly Payment */}
            <div className="mt-8 flex items-center justify-between rounded-xl bg-surface px-5 py-6">
              <div>
                <p className="text-sm font-semibold">
                  Monthly Payment
                </p>

                <p className="mt-1 text-xs text-secondary">
                  Estimated for {duration} months
                </p>
              </div>

              <p className="font-mono text-lg font-bold">
                {formatPrice(monthlyPayment)}
              </p>
            </div>

            {/* Repayment Plan */}
            <button
              onClick={() => setRepaymentModal(true)}
              className="mt-5 flex w-full items-center justify-between border-b border-border py-5 text-sm font-semibold hover:opacity-60"
            >
              Repayment Plan

              <span className="flex items-center gap-2 text-secondary">
                View <ChevronRight size={18} />
              </span>
            </button>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/923193187344?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-5 py-4 text-sm font-bold text-background transition-opacity hover:opacity-80"
            >
              <MessageCircle size={19} />
              Inquire on WhatsApp
              <ArrowUpRight size={17} />
            </a>

            <p className="mt-4 text-center text-xs leading-6 text-secondary">
              Final pricing and installment terms will be confirmed by Ahmed Mobile.
            </p>
          </div>
        )}
      </section>

      {/* Model Selection Modal */}
      {modelModal && (
        <div
          className="fixed inset-0 z-100 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-5"
          onClick={() => setModelModal(false)}
        >
          <div
            className="flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-background shadow-2xl sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <p className="text-xs text-muted">
                  {activeBrand}
                </p>

                <h2 className="font-heading text-xl font-bold">
                  Select Model
                </h2>
              </div>

              <button
                onClick={() => setModelModal(false)}
                aria-label="Close model selection"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto">
              {loadingPhones ? (
                <div className="px-6 py-12 text-center text-sm text-secondary">Loading installment phones…</div>
              ) : phonesError ? (
                <div className="px-6 py-12 text-center">
                  <h3 className="font-heading text-base font-bold">Phones are temporarily unavailable</h3>
                  <p className="mt-2 text-sm text-secondary">{phonesError}</p>
                </div>
              ) : filteredPhones.length > 0 ? (
                <>
                  <div className="bg-surface px-6 py-3 text-sm font-semibold">
                    Available Models
                  </div>

                  {filteredPhones.map((phone) => (
                    <button
                      key={phone.id}
                      onClick={() => selectPhone(phone)}
                      className="flex w-full items-center justify-between gap-4 border-b border-border px-6 py-5 text-left hover:bg-surface"
                    >
                      <div>
                        <p className="font-heading font-bold">
                          {phone.name}

                          <span className="ml-2 text-xs font-normal text-muted">
                            {phone.code}
                          </span>
                        </p>

                        <p className="mt-2 text-sm text-secondary">
                          From {formatPrice(phone.price)}
                        </p>
                      </div>

                      <ChevronRight
                        size={19}
                        className="text-secondary"
                      />
                    </button>
                  ))}
                </>
              ) : (
                <div className="px-6 py-12 text-center">
                  <Smartphone
                    size={34}
                    className="mx-auto text-secondary"
                  />

                  <h3 className="mt-4 font-heading text-base font-bold">
                    Models coming soon
                  </h3>

                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-secondary">
                    {activeBrand} installment models will be added here soon.
                    Please contact Ahmed Mobile for current availability.
                  </p>

                  <a
                    href="https://wa.me/923193187344"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4"
                  >
                    Ask on WhatsApp
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-border p-5">
              <button
                onClick={() => setModelModal(false)}
                className="w-full rounded-xl bg-foreground px-5 py-4 text-sm font-bold text-background"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Repayment Plan Modal */}
      {repaymentModal && selectedPhone && (
        <div
          className="fixed inset-0 z-110 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setRepaymentModal(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-background p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted">
                  Payment breakdown
                </p>

                <h2 className="mt-1 font-heading text-xl font-bold">
                  Repayment Plan
                </h2>
              </div>

              <button
                onClick={() => setRepaymentModal(false)}
                aria-label="Close repayment plan"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border"
              >
                <X size={18} />
              </button>
            </div>

            {/* Payment Summary */}
            <div className="mt-7 rounded-xl bg-surface p-5">
              {[
                ["Phone", selectedPhone.name],
                ["Total Price", formatPrice(selectedPhone.price)],
                ["Down Payment", formatPrice(downPayment)],
                ["Remaining Balance", formatPrice(remainingAmount)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="mb-4 flex justify-between gap-3 text-sm last:mb-0"
                >
                  <span className="text-secondary">
                    {label}
                  </span>

                  <span className="font-semibold">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Monthly Breakdown */}
            <div className="mt-7">
              <p className="mb-4 text-sm font-semibold">
                Monthly Breakdown
              </p>

              <div className="space-y-3">
                {Array.from(
                  { length: duration },
                  (_, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b border-border pb-3 text-sm"
                    >
                      <span className="text-secondary">
                        Month {index + 1}
                      </span>

                      <span className="font-mono font-semibold">
                        {formatPrice(
                          index === duration - 1
                            ? remainingAmount -
                                monthlyPayment * (duration - 1)
                            : monthlyPayment
                        )}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            <button
              onClick={() => setRepaymentModal(false)}
              className="mt-7 w-full rounded-xl bg-foreground px-5 py-4 text-sm font-bold text-background"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
