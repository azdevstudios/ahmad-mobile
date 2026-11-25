"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound } from "lucide-react";

function ResetPasswordForm() {
  const token = useSearchParams().get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (!token) return setError("This reset link is missing or invalid.");
    if (password !== confirmPassword) return setError("Passwords do not match.");

    setLoading(true);
    try {
      const response = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "This reset link is invalid or expired.");
      router.replace("/admin/login?reset=complete");
    } catch (submitError) {
      setError(submitError.message || "Could not reset the password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <section className="w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-xl sm:p-9">
        <KeyRound size={22} className="mb-5" />
        <h1 className="text-3xl font-bold tracking-tight">Choose a new password</h1>
        <p className="mt-2 text-sm leading-6 text-secondary">Use at least 12 characters. Other sessions will be signed out.</p>
        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <label className="block text-sm font-medium">New password
            <input type="password" required minLength={12} maxLength={128} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15" />
          </label>
          <label className="block text-sm font-medium">Confirm new password
            <input type="password" required minLength={12} maxLength={128} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15" />
          </label>
          {error && <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-400">{error}</p>}
          <button disabled={loading || !token} className="h-12 w-full rounded-xl bg-foreground px-4 font-semibold text-background hover:opacity-85 disabled:opacity-60">{loading ? "Saving…" : "Save new password"}</button>
        </form>
        <Link href="/admin/login" className="mt-5 inline-block text-sm font-medium text-accent hover:underline">Back to sign in</Link>
      </section>
    </main>
  );
}

export default function ResetPasswordPage() {
  return <Suspense fallback={<main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground"><p className="text-sm text-secondary">Loading secure reset page…</p></main>}><ResetPasswordForm /></Suspense>;
}
