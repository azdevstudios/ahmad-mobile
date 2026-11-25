"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyRound, Store } from "lucide-react";

export default function AdminSetupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", setupKey: "" });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (form.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Could not create the admin account.");
      router.replace("/admin");
      router.refresh();
    } catch (submitError) {
      setError(submitError.message || "Could not create the admin account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <section className="w-full max-w-lg rounded-3xl border border-border bg-surface p-6 shadow-xl sm:p-9">
        <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-background"><Store size={22} /></div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">One-time setup</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Create the client admin</h1>
        <p className="mt-2 text-sm leading-6 text-secondary">Enter the client’s email and agreed temporary password. They can change it after signing in.</p>
        <form onSubmit={handleSubmit} className="mt-7 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium sm:col-span-2">Admin name
            <input required minLength={2} maxLength={80} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15" />
          </label>
          <label className="text-sm font-medium sm:col-span-2">Client email
            <input type="email" required maxLength={254} autoComplete="username" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15" />
          </label>
          <label className="text-sm font-medium">Temporary password
            <input type="password" required minLength={12} maxLength={128} autoComplete="new-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15" />
          </label>
          <label className="text-sm font-medium">Confirm password
            <input type="password" required minLength={12} maxLength={128} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15" />
          </label>
          <label className="text-sm font-medium sm:col-span-2">One-time setup key
            <input type="password" required minLength={32} autoComplete="off" value={form.setupKey} onChange={(event) => setForm({ ...form, setupKey: event.target.value })} className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15" />
          </label>
          {error && <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-400 sm:col-span-2">{error}</p>}
          <button disabled={loading} className="flex h-12 items-center justify-center gap-2 rounded-xl bg-foreground px-4 font-semibold text-background hover:opacity-85 disabled:opacity-60 sm:col-span-2"><KeyRound size={17} />{loading ? "Creating account…" : "Create admin account"}</button>
        </form>
        <Link href="/admin/login" className="mt-5 inline-block text-sm font-medium text-accent hover:underline">Back to sign in</Link>
      </section>
    </main>
  );
}
