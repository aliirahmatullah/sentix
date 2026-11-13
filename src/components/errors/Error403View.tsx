import React from "react";
import Link from "next/link";

export function Error403View() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Central Card Container */}
      <div className="w-full max-w-[520px] bg-surface rounded-[20px] shadow-card border border-border-subtle p-8 sm:p-12 text-center flex flex-col items-center">
        {/* Icon Container with Subtle Ambient Background */}
        <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mb-6 text-primary-600">
          <svg
            className="shrink-0"
            fill="none"
            height="32"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            width="32"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <rect height="5" rx="1" width="6" x="9" y="11" />
            <path d="M10 11V9a2 2 0 1 1 4 0v2" />
          </svg>
        </div>

        {/* HTTP Status Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-sunken mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-ink-600" aria-hidden="true" />
          <span className="text-xs text-ink-600 font-bold tracking-wider uppercase">
            STATUS 403 · AKSES TERBATAS
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-title-xl font-bold text-ink-900 tracking-tight mb-2">
          Anda tidak memiliki akses ke halaman ini.
        </h1>

        {/* Explanatory Text */}
        <p className="text-base text-ink-600 mb-8 max-w-sm">
          Halaman ini hanya untuk admin.
        </p>

        {/* Primary Action Button */}
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-[10px] bg-primary-600 text-surface font-medium hover:bg-primary-700 transition-colors duration-fast shadow-sm w-full sm:w-auto min-w-[200px] focus-ring"
        >
          Kembali ke Dashboard
        </Link>

        {/* Secondary Help Notice */}
        <div className="mt-8 pt-6 w-full flex flex-col items-center gap-1 bg-surface-sunken rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-ink-500">
            <span className="material-symbols-outlined text-[15px]" aria-hidden="true">
              shield_person
            </span>
            <span className="text-xs font-semibold">Otorisasi &amp; Hak Istimewa</span>
          </div>
          <p className="text-xs text-ink-500 max-w-xs">
            Jika Anda memerlukan hak akses administratif, hubungi{" "}
            <span className="text-ink-700 font-semibold">Administrator Sektor</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

