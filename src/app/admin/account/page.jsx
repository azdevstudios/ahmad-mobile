"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { KeyRound } from "lucide-react";

export default function AdminAccountPage() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Could not change the password.");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password updated. Other sessions have been signed out.");
    } catch (error) {
      toast.error(error.message || "Could not change the password.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-7 text-foreground sm:px-6 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-7">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Account security</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Change password</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Use at least 12 characters. Other sessions will be signed out.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
          <label className="block text-sm font-medium">Current password
            <input type="password" required maxLength={128} autoComplete="current-password" value={form.currentPassword} onChange={(event) => setForm({ ...form, currentPassword: event.target.value })} className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 sm:max-w-lg" />
          </label>
          <label className="block text-sm font-medium">New password
            <input type="password" required minLength={12} maxLength={128} autoComplete="new-password" value={form.newPassword} onChange={(event) => setForm({ ...form, newPassword: event.target.value })} className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 sm:max-w-lg" />
          </label>
          <label className="block text-sm font-medium">Confirm new password
            <input type="password" required minLength={12} maxLength={128} autoComplete="new-password" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 sm:max-w-lg" />
          </label>
          <div className="border-t border-border pt-5">
            <button disabled={saving} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-foreground px-5 text-sm font-semibold text-background hover:opacity-85 disabled:opacity-60"><KeyRound size={16} />{saving ? "Updating…" : "Update password"}</button>
          </div>
        </form>
      </div>
    </main>
  );
}
