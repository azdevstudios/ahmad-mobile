"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Password recovery is not available right now.");
      setMessage(result.message);
    } catch (submitError) {
      setError(submitError.message || "Could not send the reset link.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <section className="w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-xl sm:p-9">
        <h1 className="text-3xl font-bold tracking-tight">Reset your password</h1>
        <p className="mt-2 text-sm leading-6 text-secondary">Enter the admin email. If it matches an account, we’ll send a secure reset link.</p>
        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <label className="block text-sm font-medium">Admin email
            <input type="email" required maxLength={254} autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15" />
          </label>
          {message && <p role="status" className="rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-300">{message}</p>}
          {error && <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-400">{error}</p>}
          <button disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-foreground px-4 font-semibold text-background hover:opacity-85 disabled:opacity-60"><Mail size={17} />{loading ? "Sending…" : "Send reset link"}</button>
        </form>
        <Link href="/admin/login" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"><ArrowLeft size={15} /> Back to sign in</Link>
      </section>
    </main>
  );
}
