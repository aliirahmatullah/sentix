import React from "react";
import Link from "next/link";

export function Error404View() {
  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-4rem)] items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-[520px] bg-surface rounded-[20px] shadow-card border border-border-subtle p-8 sm:p-12 text-center mx-auto flex flex-col items-center">
        {/* Thin outline search icon */}
        <div className="w-16 h-16 rounded-full bg-neu-tint flex items-center justify-center mb-6 text-ink-600 shadow-inner">
          <svg
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
            <path d="m13.5 8.5-5 5" />
            <path d="m8.5 8.5 5 5" />
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>

        {/* Status Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-sunken mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-ink-500" aria-hidden="true" />
          <span className="text-xs uppercase tracking-widest text-ink-600 font-semibold">
            STATUS 404 · TIDAK DITEMUKAN
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-title-xl font-bold text-ink-900 tracking-tight mb-2">
          Halaman tidak ditemukan.
        </h1>

        {/* Explanatory Text */}
        <p className="text-base text-ink-600 max-w-[420px] mb-6">
          Tautan mungkin sudah tidak berlaku atau alamat yang Anda tuju telah dipindahkan.
        </p>

        {/* Primary Action Button */}
        <div className="w-full flex flex-col items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-surface rounded-[10px] px-6 py-2.5 font-medium shadow-sm transition-colors duration-fast focus-ring"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              arrow_back
            </span>
            <span>Kembali ke Dashboard</span>
          </Link>

          {/* Help notice */}
          <p className="text-xs text-ink-500">
            Periksa kembali URL yang dimasukkan atau kembali ke ringkasan pemantauan.
          </p>
        </div>
      </div>
    </div>
  );
}

