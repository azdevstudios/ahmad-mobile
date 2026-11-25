
"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Menu,
  X,
  Sun,
  Moon,
  MessageCircle,
} from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Phones", href: "/phones" },
  { name: "Services", href: "/services" },
  { name: "About", href: "/about" },
];

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function Navbar() {
  const [openForPath, setOpenForPath] = useState(null);
  const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const menuOpen = openForPath === pathname;

  return (
    <header className="sticky top-0 z-50 px-4 pt-3 sm:px-6">
      <nav className={`relative mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center rounded-2xl px-4 py-3 backdrop-blur-2xl transition-colors duration-300 lg:grid-cols-[1fr_auto_1fr] sm:px-6 ${
  mounted && theme === "dark"
    ? "border border-white/10 bg-zinc-950/80 shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
    : "border border-white/70 bg-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
}`}>

        {/* Brand */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground font-heading text-lg font-bold text-background">
            AM
          </div>

          <div>
            <p className="font-heading text-sm font-bold tracking-tight">
              Ahmed Mobile
            </p>
            <p className="text-[11px] text-muted">
              Smartphones & Repair Lab
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`relative py-2 text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-foreground"
                  : "text-secondary hover:text-foreground"
              }`}
            >
              {link.name}

              {pathname === link.href && (
                <span className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-accent" />
              )}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            disabled={!mounted}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-surface/70 text-foreground transition-colors hover:bg-background disabled:cursor-wait"
          >
            {mounted && theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <a
            href="https://wa.me/923193187344"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-80 sm:flex"
          >
            <MessageCircle size={16} />
            WhatsApp
          </a>

          <button
            onClick={() => setOpenForPath(menuOpen ? null : pathname)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-surface/70 text-foreground transition-colors hover:bg-background lg:hidden"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Floating Mobile Menu */}
        {menuOpen && (
          <div className={`absolute right-0 top-[calc(100%+10px)] z-50 w-[min(290px,calc(100vw-32px))] rounded-2xl p-3 backdrop-blur-2xl transition-colors duration-300 lg:hidden ${
  mounted && theme === "dark"
    ? "border border-white/10 bg-zinc-900/95 shadow-[0_16px_45px_rgba(0,0,0,0.4)]"
    : "border border-white/70 bg-white/95 shadow-[0_12px_35px_rgba(0,0,0,0.08)]"
}`}>

            <p className="px-3 py-2 text-xs font-semibold uppercase tracking-widest text-muted">
              Navigation
            </p>

            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setOpenForPath(null)}
                  className={`block rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-black/5 text-foreground dark:bg-white/10"
                      : "text-secondary hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="my-3 h-px bg-border" />

            <a
              href="https://wa.me/923193187344"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-sm font-semibold text-background"
            >
              <MessageCircle size={17} />
              Chat on WhatsApp
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}
