"use client";

import React, { useState, useRef, useEffect } from "react";
import { useShell } from "./ShellContext";

export function TopBar() {
  const { role, setRole, sidebarCollapsed, toggleSidebar } = useShell();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const userInitial = role === "admin" ? "AS" : "PI";
  const userName = role === "admin" ? "Admin Sektor" : "Pimpinan Instansi";
  const userRoleLabel = role === "admin" ? "Super Admin" : "Pimpinan";

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-surface border-b border-border-subtle z-30 flex items-center justify-between px-3 sm:px-6 transition-all duration-base ease-out left-0 sm:left-[72px] ${
        sidebarCollapsed ? "lg:left-[72px]" : "lg:left-[240px]"
      }`}
    >
      {/* Left controls: Toggle button & Freshness chip */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="w-9 h-9 flex items-center justify-center rounded-lg text-ink-700 hover:bg-surface-sunken hover:text-ink-900 transition-colors focus-ring shrink-0"
        >
          <span className="material-symbols-outlined text-[20px]">
            <span className="hidden sm:inline">menu_open</span>
            <span className="sm:hidden">menu</span>
          </span>
        </button>

        {/* Freshness Chip */}
        <div
          role="status"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-warn-tint text-warn-text text-[12px] font-medium shrink-0 whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[15px] shrink-0" aria-hidden="true">
            schedule
          </span>
          {/* Desktop & Tablet: full text */}
          <span className="hidden sm:inline">1 sumber terlambat</span>
          {/* Mobile: shortened text per DESIGN.md 9.2 */}
          <span className="sm:hidden font-semibold">Terlambat · 09:42</span>
        </div>
      </div>

      {/* Right controls: Admin Notifications & User Profile Menu */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0" ref={dropdownRef}>
        {/* Admin-only system alerts bell per DESIGN.md 6.1 */}
        {role === "admin" && (
          <>
            <button
              type="button"
              aria-label="Peringatan sistem"
              title="1 peringatan sistem aktif"
              className="relative w-9 h-9 flex items-center justify-center rounded-lg text-ink-600 hover:bg-surface-sunken hover:text-ink-900 transition-colors focus-ring shrink-0"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span
                className="absolute top-2 right-2 w-2 h-2 rounded-full bg-neg ring-2 ring-surface"
                aria-hidden="true"
              />
            </button>
            <div className="h-5 w-[1px] bg-border-subtle hidden sm:block" />
          </>
        )}

        {/* User Avatar Menu Trigger */}
        <div className="relative">
          <button
            type="button"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
            aria-label={`Menu profil ${userName}`}
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-1.5 sm:gap-2 py-1 px-1.5 rounded-lg hover:bg-surface-sunken transition-colors focus-ring shrink-0"
          >
            <div
              className="w-8 h-8 rounded-full bg-primary-600 text-surface font-semibold text-[13px] flex items-center justify-center shadow-sm shrink-0"
              aria-hidden="true"
            >
              {userInitial}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-[13px] font-semibold text-ink-900 leading-none">{userName}</span>
              <span className="text-[11px] text-ink-500 leading-tight mt-0.5">{userRoleLabel}</span>
            </div>
            <span
              className={`material-symbols-outlined text-ink-600 text-[18px] transition-transform duration-fast hidden sm:inline ${
                dropdownOpen ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            >
              expand_more
            </span>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-56 bg-surface border border-border-subtle rounded-xl shadow-pop p-1.5 z-50 text-[13px]"
            >
              <div className="px-3 py-2 border-b border-border-subtle mb-1">
                <p className="font-semibold text-ink-900">{userName}</p>
                <p className="text-[11px] text-ink-500">{userRoleLabel}</p>
              </div>

              {/* Role Toggle (Demo) */}
              <div className="px-3 py-2">
                <span className="text-[11px] font-semibold text-ink-500 uppercase tracking-wider block mb-1.5">
                  Ganti peran (Demo)
                </span>
                <div className="grid grid-cols-2 gap-1 bg-surface-sunken p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setRole("admin")}
                    className={`py-1 text-center rounded text-[12px] font-medium transition-colors ${
                      role === "admin"
                        ? "bg-primary-600 text-surface shadow-sm font-semibold"
                        : "text-ink-700 hover:text-ink-900"
                    }`}
                  >
                    Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("pimpinan")}
                    className={`py-1 text-center rounded text-[12px] font-medium transition-colors ${
                      role === "pimpinan"
                        ? "bg-primary-600 text-surface shadow-sm font-semibold"
                        : "text-ink-700 hover:text-ink-900"
                    }`}
                  >
                    Pimpinan
                  </button>
                </div>
              </div>

              <div className="border-t border-border-subtle my-1" />

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-left rounded-lg text-ink-700 hover:bg-surface-sunken hover:text-ink-900 transition-colors focus-ring"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span>Keluar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
