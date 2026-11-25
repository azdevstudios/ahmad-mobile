
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Smartphone,
  CalendarCheck,
  Wrench,
  Settings,
  KeyRound,
  Store,
  X,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Used Phones",
    href: "/admin/used-phones",
    icon: Smartphone,
  },
  {
    name: "Installment Phones",
    href: "/admin/installment-phones",
    icon: CalendarCheck,
  },
  {
    name: "Services",
    href: "/admin/services",
    icon: Wrench,
  },
  {
    name: "Account",
    href: "/admin/account",
    icon: KeyRound,
  },
];

export default function AdminSidebar({
  isOpen,
  isCollapsed,
  onClose,
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Glass Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-background/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-65 shrink-0 flex-col border-r border-border bg-card shadow-xl transition-[width,transform] duration-300 ease-in-out md:sticky md:top-0 md:h-screen md:translate-x-0 md:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          isCollapsed
            ? "md:w-18"
            : "md:w-64"
        }`}
      >
        {/* Brand */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
              <Store size={19} />
            </div>

            <div
              className={`min-w-0 overflow-hidden whitespace-nowrap transition-all duration-200 ${
                isCollapsed
                  ? "md:w-0 md:opacity-0"
                  : "opacity-100"
              }`}
            >
              <h2 className="text-sm font-bold">
                Ahmed Mobile
              </h2>
              <p className="text-[11px] text-muted-foreground">
                Admin Panel
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted md:hidden"
            aria-label="Close menu"
          >
            <X size={19} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-5">
          <p
            className={`mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground ${
              isCollapsed ? "md:hidden" : ""
            }`}
          >
            Main Menu
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  title={isCollapsed ? item.name : undefined}
                  className={`flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  } ${
                    isCollapsed
                      ? "md:justify-center md:px-0"
                      : ""
                  }`}
                >
                  <Icon
                    size={19}
                    strokeWidth={1.8}
                    className="shrink-0"
                  />

                  <span
                    className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${
                      isCollapsed
                        ? "md:w-0 md:opacity-0"
                        : "opacity-100"
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Settings */}
        <div className="shrink-0 border-t border-border p-3">
          <Link
            href="/admin/settings"
            onClick={onClose}
            title={isCollapsed ? "Settings" : undefined}
            className={`flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${
              pathname.startsWith("/admin/settings")
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            } ${
              isCollapsed
                ? "md:justify-center md:px-0"
                : ""
            }`}
          >
            <Settings
              size={19}
              strokeWidth={1.8}
              className="shrink-0"
            />

            <span
              className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${
                isCollapsed
                  ? "md:w-0 md:opacity-0"
                  : "opacity-100"
              }`}
            >
              Settings
            </span>
          </Link>
        </div>
      </aside>
    </>
  );
}

