"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND } from "@/lib/brand";
import { useShell } from "./ShellContext";

interface NavItemDef {
  label: string;
  href: string;
  icon: string;
  exact?: boolean;
}

const PIMPINAN_NAV: NavItemDef[] = [
  { label: "Dashboard", href: "/", icon: "dashboard", exact: true },
  { label: "Jejaring aktor", href: "/network", icon: "hub" },
];

const ADMIN_NAV: NavItemDef[] = [
  { label: "Status sistem", href: "/admin", icon: "dns", exact: true },
  { label: "Sumber RSS", href: "/admin/sources", icon: "rss_feed" },
  { label: "Media sosial", href: "/admin/social", icon: "share" },
  { label: "Koneksi X", href: "/admin/x-connection", icon: "link" },
  { label: "Kamus alias", href: "/admin/aliases", icon: "spellcheck" },
  { label: "Pengguna", href: "/admin/users", icon: "manage_accounts" },
  { label: "Audit log", href: "/admin/audit-log", icon: "history" },
];

interface FreshnessItem {
  name: string;
  timeAgo: string;
  status: "ok" | "warn" | "err";
  icon: string;
}

const FRESHNESS_DATA: FreshnessItem[] = [
  { name: "Berita", timeAgo: "4 mnt lalu", status: "ok", icon: "check_circle" },
  { name: "X", timeAgo: "1 j 2 mnt lalu", status: "warn", icon: "schedule" },
  { name: "Instagram", timeAgo: "22 mnt lalu", status: "ok", icon: "check_circle" },
  { name: "Threads", timeAgo: "18 mnt lalu", status: "ok", icon: "check_circle" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { role, sidebarCollapsed, mobileDrawerOpen, setMobileDrawerOpen } = useShell();

  // Close drawer with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileDrawerOpen) {
        setMobileDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileDrawerOpen, setMobileDrawerOpen]);

  const isItemActive = (item: NavItemDef) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  const renderNavLinks = (items: NavItemDef[]) => (
    <ul className="flex flex-col gap-1.5 list-none p-0 m-0">
      {items.map((item) => {
        const active = isItemActive(item);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              title={item.label}
              onClick={() => setMobileDrawerOpen(false)}
              className={`flex items-center h-10 rounded-[10px] text-body-sm transition-colors duration-fast ease-out focus-ring ${
                sidebarCollapsed
                  ? "justify-center px-0 w-10 mx-auto"
                  : mobileDrawerOpen
                    ? "gap-3 px-3"
                    : "sm:justify-center sm:px-0 sm:w-10 sm:mx-auto lg:justify-start lg:gap-3 lg:px-3 lg:w-full"
              } ${
                active
                  ? "bg-primary-50 text-primary-700 font-semibold relative before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-primary-600 before:rounded-r"
                  : "text-ink-700 hover:bg-surface-sunken hover:text-ink-900"
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px] shrink-0"
                aria-hidden="true"
              >
                {item.icon}
              </span>
              <span
                className={`font-medium truncate ${
                  sidebarCollapsed
                    ? "hidden"
                    : mobileDrawerOpen
                      ? "inline"
                      : "sm:hidden lg:inline"
                }`}
              >
                {item.label}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Scrim Overlay on Mobile when Drawer is open */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink-900/40 backdrop-blur-xs transition-opacity duration-base sm:hidden"
          onClick={() => setMobileDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Single, authoritative Sidebar element */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-surface border-r border-border-subtle flex flex-col justify-between select-none transition-all duration-base ease-out ${
          mobileDrawerOpen
            ? "translate-x-0 z-50 w-[240px] shadow-modal"
            : `-translate-x-full sm:translate-x-0 z-30 ${
                sidebarCollapsed
                  ? "sm:w-[72px] lg:w-[72px]"
                  : "sm:w-[72px] lg:w-[240px]"
              }`
        }`}
      >
        {/* Scrollable Upper Area: Header + Navigation */}
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
          {/* Brand header */}
          <div
            className={`h-16 flex items-center border-b border-border-subtle shrink-0 ${
              sidebarCollapsed
                ? "justify-center px-2"
                : mobileDrawerOpen
                  ? "px-5 gap-3"
                  : "sm:justify-center sm:px-2 lg:justify-start lg:px-5 lg:gap-3"
            }`}
          >
            <div
              className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-surface font-bold text-sm tracking-tight shrink-0 shadow-sm"
              aria-hidden="true"
            >
              {BRAND.initials}
            </div>
            <div
              className={`flex flex-col min-w-0 ${
                sidebarCollapsed
                  ? "hidden"
                  : mobileDrawerOpen
                    ? "flex"
                    : "sm:hidden lg:flex"
              }`}
            >
              <span className="text-[14px] leading-tight font-bold text-ink-900 truncate">
                {BRAND.name}
              </span>
              <span className="text-[11px] leading-tight text-ink-600 truncate mt-0.5">
                {BRAND.tagline}
              </span>
            </div>
          </div>

          {/* Navigation list */}
          <nav aria-label="Navigasi utama" className="p-3 flex flex-col gap-2">
            {/* Pimpinan Section */}
            <div>
              <div
                className={`px-3 py-1 text-[11px] font-semibold text-ink-500 uppercase tracking-wider ${
                  sidebarCollapsed
                    ? "hidden"
                    : mobileDrawerOpen
                      ? "block"
                      : "sm:hidden lg:block"
                }`}
              >
                Pimpinan
              </div>
              {renderNavLinks(PIMPINAN_NAV)}
            </div>

            {/* Administrasi Section (Admin only) */}
            {role === "admin" && (
              <div className="mt-2 pt-2 border-t border-border-subtle">
                <div
                  className={`px-3 py-1 text-[12px] font-semibold text-ink-500 ${
                    sidebarCollapsed
                      ? "hidden"
                      : mobileDrawerOpen
                        ? "block"
                        : "sm:hidden lg:block"
                  }`}
                >
                  Administrasi
                </div>
                {renderNavLinks(ADMIN_NAV)}
              </div>
            )}
          </nav>
        </div>

        {/* Pinned Bottom Area: Freshness Card & Help Link */}
        <div className="shrink-0 flex flex-col bg-surface border-t border-border-subtle/40 p-2 sm:p-2 lg:p-3 gap-2.5">
          {/* Rail mode collapsed freshness dots (Visible only on tablet or collapsed) */}
          <div
            className={`p-3 rounded-xl flex-col items-center gap-2 text-surface cursor-pointer ${
              sidebarCollapsed
                ? "flex"
                : mobileDrawerOpen
                  ? "hidden"
                  : "hidden sm:flex lg:hidden"
            }`}
            style={{
              background:
                "linear-gradient(165deg, var(--color-primary-700) 0%, var(--color-primary-900) 100%)",
            }}
            title="Kesegaran data (4 sumber dipantau)"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-fresh-ok animate-pulse" />
            <div className="w-2.5 h-2.5 rounded-full bg-fresh-warn" />
            <div className="w-2.5 h-2.5 rounded-full bg-fresh-ok" />
          </div>

          {/* Full Freshness Card (Visible on mobile drawer & desktop expanded) */}
          <div
            className={`p-4 rounded-[20px] text-surface shadow-card flex-col ${
              sidebarCollapsed
                ? "hidden"
                : mobileDrawerOpen
                  ? "flex"
                  : "sm:hidden lg:flex"
            }`}
            style={{
              background:
                "linear-gradient(165deg, var(--color-primary-700) 0%, var(--color-primary-900) 100%)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-bold tracking-wide uppercase text-primary-100">
                Kesegaran data
              </span>
              <span
                className="w-2 h-2 rounded-full bg-fresh-ok animate-pulse"
                aria-hidden="true"
              />
            </div>

            <div className="flex flex-col gap-2.5 text-[11px]">
              {FRESHNESS_DATA.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <span className="text-primary-100/90 font-medium">{item.name}</span>
                  <div className="flex items-center gap-1.5 font-medium">
                    <span className="text-surface/80">{item.timeAgo}</span>
                    <span
                      className={`material-symbols-outlined text-[15px] shrink-0 ${
                        item.status === "ok"
                          ? "text-fresh-ok"
                          : item.status === "warn"
                            ? "text-fresh-warn"
                            : "text-fresh-err"
                      }`}
                      aria-hidden="true"
                    >
                      {item.icon}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/admin"
              onClick={() => setMobileDrawerOpen(false)}
              className="inline-block mt-3 text-[11px] font-semibold text-primary-100 hover:text-surface underline-offset-2 hover:underline transition-colors focus-ring rounded"
            >
              Lihat detail →
            </Link>
          </div>

          {/* Cara Membaca Data Link */}
          <Link
            href="#cara-membaca-data"
            title="Cara membaca data"
            onClick={() => setMobileDrawerOpen(false)}
            className={`flex items-center rounded-lg text-ink-600 hover:text-ink-900 hover:bg-surface-sunken text-[13px] font-medium transition-colors focus-ring ${
              sidebarCollapsed
                ? "justify-center p-2 w-10 h-10 mx-auto"
                : mobileDrawerOpen
                  ? "gap-2.5 px-3 py-2"
                  : "sm:justify-center sm:p-2 sm:w-10 sm:h-10 sm:mx-auto lg:justify-start lg:gap-2.5 lg:px-3 lg:py-2 lg:w-full"
            }`}
          >
            <span className="material-symbols-outlined text-[18px] shrink-0" aria-hidden="true">
              info
            </span>
            <span
              className={
                sidebarCollapsed
                  ? "hidden"
                  : mobileDrawerOpen
                    ? "inline"
                    : "sm:hidden lg:inline"
              }
            >
              Cara membaca data
            </span>
          </Link>
        </div>
      </aside>
    </>
  );
}
