"use client";

import React, { useState } from "react";
import Link from "next/link";

interface Error500ViewProps {
  errorCode?: string;
  errorTime?: string;
  onRetry?: () => void;
}

export function Error500View({
  errorCode = "ERR-500",
  errorTime = "12 Nov 2026 09:42 WIB",
  onRetry,
}: Error500ViewProps) {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = () => {
    setRetrying(true);
    if (onRetry) {
      onRetry();
    } else if (typeof window !== "undefined") {
      setTimeout(() => {
        window.location.reload();
      }, 700);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-[540px] bg-surface rounded-[20px] shadow-card border border-border-subtle p-8 sm:p-12 flex flex-col items-center text-center">
        {/* Warning Icon Container */}
        <div className="w-16 h-16 rounded-full bg-neg-tint flex items-center justify-center mb-4 text-neg-text">
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
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <line x1="12" x2="12" y1="9" y2="13" />
            <line x1="12" x2="12.01" y1="17" y2="17" />
          </svg>
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neg-tint text-neg-text text-xs uppercase tracking-wider mb-4 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-neg-text" aria-hidden="true" />
          <span>STATUS 500 · GANGGUAN SERVER</span>
        </div>

        {/* Heading */}
        <h1 className="text-title-xl font-bold text-ink-900 tracking-tight mb-3">
          Terjadi gangguan di server.
        </h1>

        {/* Error Code Box */}
        <div className="w-full bg-surface-sunken rounded-lg p-3 sm:p-4 mb-4 text-left border border-border-subtle">
          <div className="flex items-center justify-between text-sm text-ink-900 font-semibold tabular-nums">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-ink-500" aria-hidden="true">
                tag
              </span>
              Kode: {errorCode}
            </span>
            <span className="text-ink-600 font-medium text-xs">{errorTime}</span>
          </div>
          <p className="text-sm text-ink-600 mt-1">
            Sebutkan kode ini saat menghubungi admin.
          </p>
        </div>

        {/* Integrity Assurance */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-ink-500 mb-6">
          <span className="material-symbols-outlined text-[15px] text-primary-600" aria-hidden="true">
            verified_user
          </span>
          <span>Data yang sudah tersimpan di sistem tetap aman dan tidak terpengaruh.</span>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            disabled={retrying}
            onClick={handleRetry}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-surface font-medium px-6 py-2.5 rounded-[10px] transition-colors shadow-sm focus-ring cursor-pointer disabled:opacity-75"
          >
            <span
              className={`material-symbols-outlined text-[18px] transition-transform duration-500 ${
                retrying ? "animate-spin" : ""
              }`}
              aria-hidden="true"
            >
              refresh
            </span>
            <span>{retrying ? "Memuat..." : "Coba lagi"}</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-surface hover:bg-surface-sunken text-ink-700 font-medium px-6 py-2.5 rounded-[10px] transition-colors border border-border-subtle focus-ring"
          >
            <span>Kembali ke Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

