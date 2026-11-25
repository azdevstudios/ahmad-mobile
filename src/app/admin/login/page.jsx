"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockKeyhole, Store } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [setupAvailable, setSetupAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/setup", { cache: "no-store" })
      .then((response) => response.json())
      .then((result) => { if (!cancelled) setSetupAvailable(Boolean(result.setupAvailable)); })
      .catch(() => { if (!cancelled) setSetupAvailable(false); });
    return () => { cancelled = true; };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Could not sign in.");
      router.replace("/admin");
      router.refresh();
    } catch (submitError) {
      setError(submitError.message || "Could not sign in. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <section className="w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-xl sm:p-9">
        <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-background"><Store size={22} /></div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Ahmed Mobile</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Admin sign in</h1>
        <p className="mt-2 text-sm leading-6 text-secondary">Sign in to manage store inventory and settings.</p>
        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <label className="block text-sm font-medium">Email
            <input type="email" autoComplete="username" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15" />
          </label>
          <label className="block text-sm font-medium">Password
            <input type="password" autoComplete="current-password" required maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15" />
          </label>
          {error && <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-foreground px-4 font-semibold text-background hover:opacity-85 disabled:opacity-60"><LockKeyhole size={17} />{loading ? "Signing in…" : "Sign in"}</button>
        </form>
        <div className="mt-5 flex justify-between gap-3 text-sm">
          <Link href="/admin/forgot-password" className="font-medium text-accent hover:underline">Forgot password?</Link>
          {setupAvailable && <Link href="/admin/setup" className="text-secondary hover:text-foreground">First-time setup</Link>}
        </div>
      </section>
    </main>
  );
}


