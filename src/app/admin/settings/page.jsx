"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  Bell,
  Check,
  Clock3,
  Globe2,
  MapPin,
  MessageCircle,
  Save,
  Store,
} from "lucide-react";

const fieldClassName =
  "mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15";

function SettingSwitch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-accent" : "bg-muted-foreground/30"}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`}
      />
    </button>
  );
}

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState("Ahmed Mobile");
  const [tagline, setTagline] = useState("Smartphones & Repair Lab");
  const [whatsApp, setWhatsApp] = useState("+92 319 3187344");
  const [mapUrl, setMapUrl] = useState("https://www.google.com/maps?q=31.3257201,72.7271838");
  const [showWhatsApp, setShowWhatsApp] = useState(true);
  const [showLocation, setShowLocation] = useState(true);
  const [showInstallments, setShowInstallments] = useState(true);

  const handleSave = (event) => {
    event.preventDefault();
    toast("Settings screen is ready. Saving them across the website will be connected in the backend step.", {
      duration: 5000,
    });
  };

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-7">
        <header>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent">Admin / Settings</p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Store Settings</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Review your store details and choose what visitors see on the website.
          </p>
        </header>

        <div className="flex items-start gap-3 rounded-xl border border-accent/20 bg-accent/5 p-4">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Bell size={17} />
          </div>
          <div>
            <p className="text-sm font-semibold">Settings interface</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Values can be edited here for the UI. Saving them to the website and database will be connected in the backend phase.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-start gap-3 border-b border-border pb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent"><Store size={19} /></div>
              <div>
                <h2 className="font-semibold">Store profile</h2>
                <p className="mt-1 text-xs text-muted-foreground">Name and identity shown across the storefront.</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium">Store name<input value={storeName} onChange={(event) => setStoreName(event.target.value)} required maxLength={60} className={fieldClassName} /></label>
              <label className="text-sm font-medium">Tagline<input value={tagline} onChange={(event) => setTagline(event.target.value)} maxLength={80} className={fieldClassName} /></label>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-start gap-3 border-b border-border pb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent"><MessageCircle size={19} /></div>
              <div>
                <h2 className="font-semibold">Contact & location</h2>
                <p className="mt-1 text-xs text-muted-foreground">Where customers can reach or visit Ahmed Mobile.</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium">WhatsApp number<input type="tel" value={whatsApp} onChange={(event) => setWhatsApp(event.target.value)} placeholder="+92 300 1234567" className={fieldClassName} /><span className="mt-1 block text-xs text-muted-foreground">Include the country code.</span></label>
              <label className="text-sm font-medium">Google Maps link<input type="url" value={mapUrl} onChange={(event) => setMapUrl(event.target.value)} placeholder="https://maps.google.com/..." className={fieldClassName} /></label>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-background px-3 py-2.5 text-xs text-muted-foreground">
              <MapPin size={15} className="shrink-0 text-accent" />
              <span>Location is set to the shop pin currently used on the About page.</span>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-start gap-3 border-b border-border pb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent"><Globe2 size={19} /></div>
              <div>
                <h2 className="font-semibold">Website visibility</h2>
                <p className="mt-1 text-xs text-muted-foreground">Choose which store options should appear for visitors.</p>
              </div>
            </div>
            <div className="divide-y divide-border">
              {[
                { title: "WhatsApp contact button", detail: "Let visitors start a chat with the store.", checked: showWhatsApp, onChange: setShowWhatsApp },
                { title: "Store location", detail: "Show the shop location and map link.", checked: showLocation, onChange: setShowLocation },
                { title: "Installment phones", detail: "Show the installment phone section in the store.", checked: showInstallments, onChange: setShowInstallments },
              ].map((setting) => (
                <div key={setting.title} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                  <div><p className="text-sm font-medium">{setting.title}</p><p className="mt-1 text-xs text-muted-foreground">{setting.detail}</p></div>
                  <SettingSwitch checked={setting.checked} onChange={setting.onChange} label={setting.title} />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-start gap-3 border-b border-border pb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent"><Clock3 size={19} /></div>
              <div>
                <h2 className="font-semibold">Store hours</h2>
                <p className="mt-1 text-xs text-muted-foreground">Add opening hours when you have them ready.</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium">Opening time<input type="time" className={fieldClassName} /></label>
              <label className="text-sm font-medium">Closing time<input type="time" className={fieldClassName} /></label>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Hours are not currently listed on the website.</p>
          </section>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => window.location.reload()} className="h-11 rounded-lg border border-border px-4 text-sm font-semibold hover:bg-muted">Discard changes</button>
            <button type="submit" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-foreground px-5 text-sm font-semibold text-background hover:opacity-85"><Save size={17} />Save settings</button>
          </div>
        </form>
      </div>
    </main>
  );
}
