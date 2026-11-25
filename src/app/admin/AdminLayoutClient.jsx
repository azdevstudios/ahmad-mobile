"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu, PanelLeftClose, PanelLeftOpen, Sun, Moon, ExternalLink, LogOut } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Toaster } from "react-hot-toast";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;
const authPages = new Set(["/admin/login", "/admin/setup", "/admin/forgot-password", "/admin/reset-password"]);

export default function AdminLayoutClient({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = authPages.has(pathname);

  useEffect(() => {
    if (isAuthPage) return undefined;
    let cancelled = false;
    fetch("/api/admin/me", { cache: "no-store" })
      .then((response) => {
        if (!cancelled && response.status === 401) {
          router.replace("/admin/login");
          router.refresh();
        }
      })
      .catch(() => {
        if (!cancelled) router.replace("/admin/login");
      });
    return () => { cancelled = true; };
  }, [isAuthPage, pathname, router]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  }

  if (isAuthPage) return children;

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Toaster position="top-right" />
      <AdminSidebar isOpen={isOpen} isCollapsed={isCollapsed} onClose={() => setIsOpen(false)} />
      <div className="min-w-0 flex-1">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-3 sm:px-5 md:px-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => setIsOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden" aria-label="Open sidebar">
              <Menu size={21} />
            </button>
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="hidden h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:flex" aria-label="Toggle sidebar" title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
              {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
            </button>
            <div>
              <h2 className="text-sm font-semibold">Ahmed Mobile</h2>
              <p className="hidden text-[11px] text-muted-foreground sm:block">Management Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} disabled={!mounted} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" aria-label="Toggle theme" title="Switch theme">
              {mounted && theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link href="/" target="_blank" rel="noopener noreferrer" className="flex h-9 items-center gap-2 rounded-lg bg-foreground px-3 text-xs font-medium text-background transition-opacity hover:opacity-85 sm:px-4 sm:text-sm">
              <ExternalLink size={16} /><span>View Store</span>
            </Link>
            <button onClick={handleLogout} disabled={loggingOut} className="flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-wait disabled:opacity-60 sm:text-sm">
              <LogOut size={16} /><span>{loggingOut ? "Signing out…" : "Log out"}</span>
            </button>
          </div>
        </header>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
