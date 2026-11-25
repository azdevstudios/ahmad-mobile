
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-5 sm:flex-row sm:px-8 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground font-heading text-sm font-bold text-background">
            AM
          </div>
          <span className="font-heading text-sm font-bold">
            Ahmed Mobile
          </span>
        </Link>

        <p className="text-center text-[11px] text-muted">
          © {new Date().getFullYear()} Ahmed Mobile. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
