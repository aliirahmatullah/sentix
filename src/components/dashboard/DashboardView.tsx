"use client";

import React, { useState } from "react";

export function DashboardView() {
  const [keywordView, setKeywordView] = useState<"awan" | "daftar">("awan");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("7 hari");

  return (
    <>
      {/* 1. Baris Judul & Filter (Tinggi 72px, sticky top-16, bg-canvas, border-b border-border-subtle, z-20) */}
      <section
        role="group"
        aria-label="Filter dashboard"
        className="sticky top-16 z-20 min-h-[72px] bg-canvas border-b border-border-subtle px-4 sm:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3"
      >
        <div className="flex flex-col justify-center">
          <h1 className="text-title-xl font-bold text-ink-900 leading-none">Dashboard</h1>
          <span className="text-body-sm text-ink-600 mt-1">6–12 Nov 2026</span>
        </div>

        {/* Filter Controls Row */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto py-1">
          {/* Segmented Control Periode */}
          <div
            role="radiogroup"
            aria-label="Periode waktu"
            className="inline-flex items-center bg-surface border border-border-control/20 rounded-[14px] p-[3px] shrink-0"
          >
            {["Hari ini", "7 hari", "30 hari", "Kustom"].map((p) => {
              const active = selectedPeriod === p;
              return (
                <button
                  key={p}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setSelectedPeriod(p)}
                  className={`px-3 py-1 text-[13px] font-medium transition-colors rounded-[11px] whitespace-nowrap focus-ring ${
                    active
                      ? "bg-primary-600 text-surface shadow-sm font-semibold"
                      : "text-ink-700 hover:text-ink-900"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          {/* Date Pill */}
          <div className="hidden lg:inline-flex items-center gap-2 bg-surface border border-border-subtle rounded-full px-[14px] py-[6px] text-ink-900 text-[13px] font-medium shadow-sm shrink-0 whitespace-nowrap">
            <svg
              className="w-4 h-4 text-ink-700 stroke-[1.5]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            <span>6–12 Nov 2026</span>
          </div>

          {/* Dropdown Kategori */}
          <button
            type="button"
            className="inline-flex items-center gap-2 bg-surface border border-border-control/30 rounded-[14px] px-3 py-[6px] text-ink-700 text-[13px] font-medium hover:bg-surface-sunken transition-colors shrink-0 whitespace-nowrap focus-ring"
          >
            <span>Kategori</span>
            <span className="material-symbols-outlined text-[16px] text-ink-500">expand_more</span>
          </button>

          {/* Dropdown Topik */}
          <button
            type="button"
            className="inline-flex items-center gap-2 bg-surface border border-border-control/30 rounded-[14px] px-3 py-[6px] text-ink-700 text-[13px] font-medium hover:bg-surface-sunken transition-colors shrink-0 whitespace-nowrap focus-ring"
          >
            <span>Topik</span>
            <span className="material-symbols-outlined text-[16px] text-ink-500">expand_more</span>
          </button>

          {/* Dropdown Sumber */}
          <button
            type="button"
            className="inline-flex items-center gap-2 bg-surface border border-border-control/30 rounded-[14px] px-3 py-[6px] text-ink-700 text-[13px] font-medium hover:bg-surface-sunken transition-colors shrink-0 whitespace-nowrap focus-ring"
          >
            <span>Sumber: Semua</span>
            <span className="material-symbols-outlined text-[16px] text-ink-500">expand_more</span>
          </button>
        </div>
      </section>

      {/* 2. Container Konten Utama (max-w-[1600px] w-full mx-auto) */}
      <div className="px-3 sm:px-8 mt-4 sm:mt-6 flex flex-col gap-5 sm:gap-6 max-w-[1600px] w-full mx-auto overflow-x-hidden">
        {/* Baris 1: Empat Kartu KPI (Grid 4 kolom desktop, 2x2 mobile) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-5">
          {/* Kartu 1: Total Konten */}
          <div className="bg-surface border border-border-subtle rounded-[20px] p-3 sm:p-5 flex flex-col justify-between shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-[12px] sm:text-[13px] font-medium text-ink-600">Total konten</span>
              <span className="text-[12px] font-medium text-ink-500 hidden lg:inline">
                7 hari · semua sumber
              </span>
            </div>
            <div className="font-bold text-[22px] sm:text-[28px] leading-tight text-ink-900 tabular-nums my-1 sm:my-2">
              12.480
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 bg-neu-tint text-ink-700 rounded-full px-2 py-0.5 text-[11px] sm:text-[12px] font-medium">
                <svg className="w-3 h-3 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <line x1="12" x2="12" y1="19" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
                <span>4,9%</span>
              </span>
              <span className="text-[11px] sm:text-[12px] font-medium text-ink-500">vs 11.902</span>
            </div>
          </div>

          {/* Kartu 2: Sentimen Positif */}
          <div className="bg-surface border border-border-subtle rounded-[20px] p-3 sm:p-5 flex flex-col justify-between shadow-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-pos stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" x2="9.01" y1="9" y2="9" />
                  <line x1="15" x2="15.01" y1="9" y2="9" />
                </svg>
                <span className="text-[12px] sm:text-[13px] font-medium text-ink-600">Sentimen positif</span>
              </div>
              <span className="text-[12px] font-medium text-ink-500 hidden lg:inline">
                7 hari · semua sumber
              </span>
            </div>
            <div className="font-bold text-[22px] sm:text-[28px] leading-tight text-ink-900 tabular-nums my-1 sm:my-2">
              38%
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 bg-neu-tint text-ink-700 rounded-full px-2 py-0.5 text-[11px] sm:text-[12px] font-medium">
                <svg className="w-3 h-3 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <line x1="12" x2="12" y1="19" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
                <span>2,1 poin</span>
              </span>
              <span className="text-[11px] sm:text-[12px] font-medium text-ink-500">4.742 konten</span>
            </div>
          </div>

          {/* Kartu 3: Sentimen Negatif */}
          <div className="bg-surface border border-border-subtle rounded-[20px] p-3 sm:p-5 flex flex-col justify-between shadow-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-neg stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
                  <line x1="9" x2="9.01" y1="9" y2="9" />
                  <line x1="15" x2="15.01" y1="9" y2="9" />
                </svg>
                <span className="text-[12px] sm:text-[13px] font-medium text-ink-600">Sentimen negatif</span>
              </div>
              <span className="text-[12px] font-medium text-ink-500 hidden lg:inline">
                7 hari · semua sumber
              </span>
            </div>
            <div className="font-bold text-[22px] sm:text-[28px] leading-tight text-ink-900 tabular-nums my-1 sm:my-2">
              21%
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 bg-neu-tint text-ink-700 rounded-full px-2 py-0.5 text-[11px] sm:text-[12px] font-medium">
                <svg className="w-3 h-3 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <line x1="12" x2="12" y1="5" y2="19" />
                  <polyline points="19 12 12 19 5 12" />
                </svg>
                <span>1,3 poin</span>
              </span>
              <span className="text-[11px] sm:text-[12px] font-medium text-ink-500">2.620 konten</span>
            </div>
          </div>

          {/* Kartu 4: Aktor Paling Sering Muncul */}
          <div className="bg-surface border border-border-subtle rounded-[20px] p-3 sm:p-5 flex flex-col justify-between shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-[12px] sm:text-[13px] font-medium text-ink-600 truncate">
                Aktor teratas
              </span>
              <span className="text-[12px] font-medium text-ink-500 hidden lg:inline">
                7 hari · semua sumber
              </span>
            </div>
            <div className="flex items-center gap-2 my-1 sm:my-2">
              <div className="w-3.5 h-3.5 rounded-full bg-primary-600 shrink-0" />
              <span className="font-bold text-[18px] sm:text-[20px] leading-tight text-ink-900 truncate">
                Joko Widodo
              </span>
            </div>
            <div className="text-[11px] sm:text-[13px] font-medium text-ink-600">312 kemunculan</div>
          </div>
        </div>

        {/* Baris 2: Tren Sentimen (8 Kolom) + Rasio Sentimen (4 Kolom) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Kolom Kiri: Tren Sentimen (8 Kolom) */}
          <div className="md:col-span-8 bg-surface border border-border-subtle rounded-[20px] p-4 sm:p-5 flex flex-col justify-between shadow-card gap-4">
            {/* Header Kartu */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex flex-col">
                <h2 className="text-[16px] font-semibold text-ink-900 leading-tight">Tren sentimen</h2>
                <span className="text-[12px] font-medium text-ink-500 mt-0.5">
                  Persentase konten per hari · 6–12 Nov 2026 · semua sumber
                </span>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {/* Legenda Interaktif */}
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pos-tint text-pos-text text-[12px] font-medium cursor-pointer">
                    <svg className="w-3.5 h-3.5 fill-pos" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-3.5-9c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm7 0c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                    </svg>
                    <span>Positif</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neu-tint text-neu-text text-[12px] font-medium cursor-pointer">
                    <svg className="w-3.5 h-3.5 fill-neu" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="9" cy="9" fill="var(--color-surface)" r="1.5" />
                      <circle cx="15" cy="9" fill="var(--color-surface)" r="1.5" />
                      <rect fill="var(--color-surface)" height="2" rx="1" width="8" x="8" y="14" />
                    </svg>
                    <span>Netral</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neg-tint text-neg-text text-[12px] font-medium cursor-pointer">
                    <svg className="w-3.5 h-3.5 fill-neg" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-3.5-9c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm7 0c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-3.5 3c-2.33 0-4.31 1.46-5.11 3.5h10.22c-.8-2.04-2.78-3.5-5.11-3.5z" />
                    </svg>
                    <span>Negatif</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Area Grafik SVG */}
            <div className="relative w-full h-[195px] my-1">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 740 180">
                {/* Horizontal grid lines */}
                <line stroke="var(--color-border-subtle)" strokeWidth="1" x1="45" x2="735" y1="10" y2="10" />
                <line stroke="var(--color-border-subtle)" strokeWidth="1" x1="45" x2="735" y1="47.5" y2="47.5" />
                <line stroke="var(--color-border-subtle)" strokeWidth="1" x1="45" x2="735" y1="85" y2="85" />
                <line stroke="var(--color-border-subtle)" strokeWidth="1" x1="45" x2="735" y1="122.5" y2="122.5" />
                <line stroke="var(--color-border-subtle)" strokeWidth="1" x1="45" x2="735" y1="160" y2="160" />

                {/* Y-axis labels */}
                <text className="fill-ink-600 text-[11px] font-medium" textAnchor="end" x="35" y="14">100%</text>
                <text className="fill-ink-600 text-[11px] font-medium" textAnchor="end" x="35" y="51.5">75%</text>
                <text className="fill-ink-600 text-[11px] font-medium" textAnchor="end" x="35" y="89">50%</text>
                <text className="fill-ink-600 text-[11px] font-medium" textAnchor="end" x="35" y="126.5">25%</text>
                <text className="fill-ink-600 text-[11px] font-medium" textAnchor="end" x="35" y="164">0%</text>

                {/* X-axis labels */}
                <text className="fill-ink-600 text-[11px] font-medium" textAnchor="middle" x="70" y="177">6 Nov</text>
                <text className="fill-ink-600 text-[11px] font-medium" textAnchor="middle" x="175" y="177">7 Nov</text>
                <text className="fill-ink-600 text-[11px] font-medium" textAnchor="middle" x="280" y="177">8 Nov</text>
                <text className="fill-ink-600 text-[11px] font-medium" textAnchor="middle" x="385" y="177">9 Nov</text>
                <text className="fill-ink-600 text-[11px] font-semibold" textAnchor="middle" x="490" y="177">10 Nov</text>
                <text className="fill-ink-600 text-[11px] font-medium" textAnchor="middle" x="595" y="177">11 Nov</text>
                <text className="fill-ink-600 text-[11px] font-medium" textAnchor="middle" x="700" y="177">12 Nov</text>

                {/* Vertical dash on 10 Nov */}
                <line stroke="var(--color-border-control)" strokeDasharray="3,3" strokeWidth="1.5" x1="490" x2="490" y1="10" y2="160" />

                {/* Neutral line */}
                <path
                  d="M 70 102 C 120 105, 140 96, 175 97 C 210 98, 250 93, 280 95 C 320 97, 350 101, 385 100 C 420 99, 450 98.5, 490 98.5 C 530 98.5, 560 94, 595 96 C 630 98, 660 99, 700 98"
                  fill="none"
                  stroke="var(--color-neu)"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
                {/* Positive line */}
                <path
                  d="M 70 106 C 120 108, 140 101, 175 103 C 210 105, 250 100, 280 102 C 320 104, 350 106, 385 105 C 420 104, 460 104.5, 490 104.5 C 530 104.5, 560 102, 595 103 C 630 104, 660 105, 700 103"
                  fill="none"
                  stroke="var(--color-pos)"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
                {/* Negative line */}
                <path
                  d="M 70 126 C 120 129, 140 124, 175 125 C 210 126, 250 128, 280 127 C 320 126, 350 128, 385 127 C 420 126, 460 127, 490 127 C 530 127, 560 129, 595 128 C 630 127, 660 126, 700 128"
                  fill="none"
                  stroke="var(--color-neg)"
                  strokeLinecap="round"
                  strokeWidth="2"
                />

                {/* Circles on 10 Nov */}
                <circle cx="490" cy="98.5" fill="var(--color-surface)" r="4.5" stroke="var(--color-neu)" strokeWidth="2" />
                <circle cx="490" cy="104.5" fill="var(--color-surface)" r="4.5" stroke="var(--color-pos)" strokeWidth="2" />
                <circle cx="490" cy="127" fill="var(--color-surface)" r="4.5" stroke="var(--color-neg)" strokeWidth="2" />
              </svg>

              {/* Tooltip on 10 Nov */}
              <div className="absolute left-[62%] -translate-x-1/2 top-1 pointer-events-none bg-ink-900 text-surface rounded-lg p-[8px_12px] text-[12px] shadow-lg whitespace-nowrap z-10 flex items-center gap-1.5">
                <span className="font-semibold text-surface">10 Nov 2026:</span>
                <span>Positif 37% · Netral 41% · Negatif 22%</span>
                <span className="text-primary-100">(612 konten)</span>
              </div>
            </div>

            {/* 4 Tile Sumber (Grid 4 kolom desktop, 2x2 mobile) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* Tile 1: Berita */}
              <div className="bg-surface-sunken border border-border-subtle rounded-[10px] p-[10px_12px] flex flex-col justify-between h-[88px]">
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-src-news stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                    <path d="M18 14h-8" />
                    <path d="M15 18h-5" />
                    <path d="M10 6h8v4h-8V6Z" />
                  </svg>
                  <span className="text-[12px] font-semibold text-ink-900">Berita</span>
                </div>
                <div className="text-[18px] font-bold text-ink-900 leading-none">8.120</div>
                <div className="w-full bg-border-subtle h-1 rounded-full overflow-hidden">
                  <div className="bg-src-news h-full rounded-full" style={{ width: "65%" }} />
                </div>
                <div className="flex items-center gap-1 text-[11px] font-medium text-ink-600 leading-none">
                  <span className="material-symbols-outlined text-[13px] text-pos">check_circle</span>
                  <span>4 mnt lalu</span>
                </div>
              </div>

              {/* Tile 2: X */}
              <div className="bg-surface-sunken border border-border-subtle rounded-[10px] p-[10px_12px] flex flex-col justify-between h-[88px]">
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-src-x fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span className="text-[12px] font-semibold text-ink-900">X</span>
                </div>
                <div className="text-[18px] font-bold text-ink-900 leading-none">3.012</div>
                <div className="w-full bg-border-subtle h-1 rounded-full overflow-hidden">
                  <div className="bg-src-x h-full rounded-full" style={{ width: "24%" }} />
                </div>
                <div className="flex items-center gap-1 text-[11px] font-medium text-warn-text leading-none">
                  <span className="material-symbols-outlined text-[13px] text-warn">schedule</span>
                  <span>1 j 2 mnt lalu</span>
                </div>
              </div>

              {/* Tile 3: Instagram */}
              <div className="bg-surface-sunken border border-border-subtle rounded-[10px] p-[10px_12px] flex flex-col justify-between h-[88px]">
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-src-instagram stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect height="20" rx="5" ry="5" width="20" x="2" y="2" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  <span className="text-[12px] font-semibold text-ink-900">Instagram</span>
                </div>
                <div className="text-[18px] font-bold text-ink-900 leading-none">902</div>
                <div className="w-full bg-border-subtle h-1 rounded-full overflow-hidden">
                  <div className="bg-src-instagram h-full rounded-full" style={{ width: "7%" }} />
                </div>
                <div className="flex items-center gap-1 text-[11px] font-medium text-ink-600 leading-none">
                  <span className="material-symbols-outlined text-[13px] text-pos">check_circle</span>
                  <span>22 mnt lalu</span>
                </div>
              </div>

              {/* Tile 4: Threads */}
              <div className="bg-surface-sunken border border-border-subtle rounded-[10px] p-[10px_12px] flex flex-col justify-between h-[88px]">
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-src-threads stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
                  </svg>
                  <span className="text-[12px] font-semibold text-ink-900">Threads</span>
                </div>
                <div className="text-[18px] font-bold text-ink-900 leading-none">446</div>
                <div className="w-full bg-border-subtle h-1 rounded-full overflow-hidden">
                  <div className="bg-src-threads h-full rounded-full" style={{ width: "4%" }} />
                </div>
                <div className="flex items-center gap-1 text-[11px] font-medium text-ink-600 leading-none">
                  <span className="material-symbols-outlined text-[13px] text-pos">check_circle</span>
                  <span>18 mnt lalu</span>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Rasio Sentimen (4 Kolom) */}
          <div className="md:col-span-4 bg-surface border border-border-subtle rounded-[20px] p-4 sm:p-5 flex flex-col justify-between shadow-card gap-4">
            <div className="flex flex-col">
              <h2 className="text-[16px] font-semibold text-ink-900 leading-tight">Rasio sentimen</h2>
              <span className="text-[12px] font-medium text-ink-500 mt-0.5">Proporsi keseluruhan sentimen</span>
            </div>

            {/* Gauge Graphic */}
            <div className="relative w-full flex flex-col items-center justify-center my-auto">
              <div className="relative w-[240px] h-[130px] flex items-center justify-center">
                <svg className="w-[240px] h-[130px]" viewBox="0 0 240 130">
                  <g transform="translate(120, 118)">
                    {/* Positif 23 ticks */}
                    {Array.from({ length: 23 }).map((_, i) => (
                      <line
                        key={`pos-${i}`}
                        stroke="var(--color-pos)"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        transform={`rotate(${i * 3.05})`}
                        x1="-105"
                        x2="-90"
                        y1="0"
                        y2="0"
                      />
                    ))}
                    {/* Netral 25 ticks */}
                    {Array.from({ length: 25 }).map((_, i) => (
                      <line
                        key={`neu-${i}`}
                        stroke="var(--color-neu)"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        transform={`rotate(${70.15 + i * 3.05})`}
                        x1="-105"
                        x2="-90"
                        y1="0"
                        y2="0"
                      />
                    ))}
                    {/* Negatif 12 ticks */}
                    {Array.from({ length: 12 }).map((_, i) => (
                      <line
                        key={`neg-${i}`}
                        stroke="var(--color-neg)"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        transform={`rotate(${146.4 + i * 3.05})`}
                        x1="-105"
                        x2="-90"
                        y1="0"
                        y2="0"
                      />
                    ))}
                  </g>
                </svg>
                {/* Center Value */}
                <div className="absolute bottom-2 flex flex-col items-center">
                  <span className="text-[12px] font-medium text-ink-600 leading-none">Netral</span>
                  <span className="text-[36px] font-extrabold text-ink-900 tracking-[-0.02em] leading-tight">
                    41%
                  </span>
                </div>
              </div>
            </div>

            {/* 3 Legend Rows */}
            <div className="flex flex-col gap-2.5 my-1">
              {/* Positif */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-pos stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <line x1="9" x2="9.01" y1="9" y2="9" />
                    <line x1="15" x2="15.01" y1="9" y2="9" />
                  </svg>
                  <span className="text-[13px] font-medium text-ink-900">Positif</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-semibold text-ink-900">38%</span>
                  <span className="text-[13px] font-medium text-ink-600 w-12 text-right">4.742</span>
                </div>
              </div>
              {/* Netral */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-neu stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="8" x2="16" y1="15" y2="15" />
                    <line x1="9" x2="9.01" y1="9" y2="9" />
                    <line x1="15" x2="15.01" y1="9" y2="9" />
                  </svg>
                  <span className="text-[13px] font-medium text-ink-900">Netral</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-semibold text-ink-900">41%</span>
                  <span className="text-[13px] font-medium text-ink-600 w-12 text-right">5.118</span>
                </div>
              </div>
              {/* Negatif */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-neg stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
                    <line x1="9" x2="9.01" y1="9" y2="9" />
                    <line x1="15" x2="15.01" y1="9" y2="9" />
                  </svg>
                  <span className="text-[13px] font-medium text-ink-900">Negatif</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-semibold text-ink-900">21%</span>
                  <span className="text-[13px] font-medium text-ink-600 w-12 text-right">2.620</span>
                </div>
              </div>
            </div>

            {/* Bottom info pill */}
            <div className="flex items-center justify-between bg-surface-sunken border border-border-subtle rounded-[10px] px-3 py-2 text-[12px] text-ink-600">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-ink-500">info</span>
                <span>Keyakinan rendah: 14% konten</span>
              </div>
            </div>
          </div>
        </div>

        {/* Baris 3: Kata kunci (5 Kolom) + Jejaring aktor (7 Kolom) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Kata Kunci (5 Kolom) */}
          <div className="md:col-span-5 bg-surface border border-border-subtle rounded-[20px] p-4 sm:p-5 flex flex-col justify-between shadow-card gap-4">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <h2 className="text-[16px] font-semibold text-ink-900 leading-tight">Kata kunci</h2>
                <span className="text-[12px] font-medium text-ink-600 mt-0.5">
                  Ukuran kata menunjukkan frekuensi
                </span>
              </div>
              <div className="inline-flex items-center bg-surface-sunken border border-border-subtle rounded-[12px] p-[2px]">
                <button
                  type="button"
                  onClick={() => setKeywordView("awan")}
                  className={`px-2.5 py-1 text-[12px] rounded-[10px] transition-colors focus-ring ${
                    keywordView === "awan"
                      ? "font-semibold bg-primary-600 text-surface shadow-sm"
                      : "font-medium text-ink-600 hover:text-ink-900"
                  }`}
                >
                  Awan
                </button>
                <button
                  type="button"
                  onClick={() => setKeywordView("daftar")}
                  className={`px-2.5 py-1 text-[12px] rounded-[10px] transition-colors focus-ring ${
                    keywordView === "daftar"
                      ? "font-semibold bg-primary-600 text-surface shadow-sm"
                      : "font-medium text-ink-600 hover:text-ink-900"
                  }`}
                >
                  Daftar
                </button>
              </div>
            </div>

            {/* Keyword Content */}
            {keywordView === "awan" ? (
              <div className="flex flex-wrap items-center justify-center content-center gap-x-3.5 gap-y-2 p-3 min-h-[260px] overflow-hidden select-none">
                <span className="font-extrabold text-[42px] text-primary-600 leading-none">anggaran</span>
                <span className="font-semibold text-[17px] text-ink-700">program</span>
                <span className="font-bold text-[36px] text-primary-600 leading-none">kebijakan</span>
                <span className="font-medium text-[14px] text-ink-700">kementerian</span>
                <span className="font-semibold text-[19px] text-ink-700">publik</span>
                <span className="font-bold text-[32px] text-primary-600 leading-none">pemerintah</span>
                <span className="font-medium text-[15px] text-ink-700">pajak</span>
                <span className="font-semibold text-[18px] text-ink-700">energi</span>
                <span className="font-bold text-[28px] text-primary-600 leading-none">subsidi</span>
                <span className="font-medium text-[14px] text-ink-700">pendidikan</span>
                <span className="font-semibold text-[20px] text-ink-700">kesehatan</span>
                <span className="font-bold text-[24px] text-primary-600 leading-none">harga</span>
                <span className="font-medium text-[16px] text-ink-700">infrastruktur</span>
                <span className="font-semibold text-[18px] text-ink-700">bantuan</span>
                <span className="font-semibold text-[21px] text-ink-700">ekonomi</span>
                <span className="font-semibold text-[16px] text-ink-700">inflasi</span>
              </div>
            ) : (
              <div className="flex flex-col gap-2 p-2 max-h-[260px] overflow-y-auto">
                {[
                  { word: "anggaran", count: 1420 },
                  { word: "kebijakan", count: 1102 },
                  { word: "pemerintah", count: 980 },
                  { word: "subsidi", count: 854 },
                  { word: "harga", count: 712 },
                  { word: "ekonomi", count: 640 },
                ].map((item, idx) => (
                  <div
                    key={item.word}
                    className="flex items-center justify-between py-1.5 px-3 rounded-lg hover:bg-surface-sunken transition-colors text-[13px]"
                  >
                    <span className="font-medium text-ink-900">
                      {idx + 1}. {item.word}
                    </span>
                    <span className="text-ink-500 font-semibold">{item.count}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="text-[12px] font-medium text-ink-500 pt-1 border-t border-border-subtle">
              Menampilkan 60 dari 3.412 kata.
            </div>
          </div>

          {/* Jejaring Aktor (7 Kolom) */}
          <div className="md:col-span-7 bg-surface border border-border-subtle rounded-[20px] p-4 sm:p-5 flex flex-col justify-between shadow-card gap-4">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <h2 className="text-[16px] font-semibold text-ink-900 leading-tight">Jejaring aktor</h2>
                <span className="text-[12px] font-medium text-ink-600 mt-0.5">
                  Dihitung harian · data terbaru 11 Nov 2026
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] border border-border-subtle bg-surface text-ink-900 text-[12px] font-semibold hover:bg-surface-sunken transition-colors shadow-sm focus-ring"
                >
                  <span className="material-symbols-outlined text-[16px] text-ink-700">table_chart</span>
                  <span>Tabel</span>
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] border border-border-subtle bg-surface text-ink-900 text-[12px] font-semibold hover:bg-surface-sunken transition-colors shadow-sm focus-ring"
                >
                  <span className="material-symbols-outlined text-[16px] text-ink-700">fullscreen</span>
                  <span>Buka layar penuh</span>
                </button>
              </div>
            </div>

            {/* Graph area */}
            <div className="relative w-full h-[280px] rounded-[14px] bg-surface-sunken/60 border border-border-subtle overflow-hidden">
              <svg className="w-full h-full select-none" viewBox="0 0 620 300">
                {/* Edges */}
                <g stroke="var(--color-control)" strokeOpacity="0.4" strokeLinecap="round">
                  <line x1="230" y1="145" x2="370" y2="110" strokeWidth="5" />
                  <line x1="230" y1="145" x2="210" y2="220" strokeWidth="4" />
                  <line x1="230" y1="145" x2="440" y2="195" strokeWidth="3.5" />
                  <line x1="370" y1="110" x2="440" y2="195" strokeWidth="4" />
                  <line x1="370" y1="110" x2="280" y2="60" strokeWidth="3" />
                  <line x1="130" y1="95" x2="230" y2="145" strokeWidth="3" />
                  <line x1="440" y1="195" x2="520" y2="130" strokeWidth="3.5" />
                </g>

                {/* Satellite nodes */}
                <circle cx="150" cy="140" r="7" fill="var(--color-primary-600)" />
                <circle cx="390" cy="45" r="6" fill="var(--color-primary-600)" />
                <rect x="200" y="40" width="18" height="18" rx="4" fill="var(--color-warn-text)" />
                <rect x="310" y="155" width="16" height="16" rx="4" fill="var(--color-warn-text)" />

                {/* Hub 1: Joko Widodo */}
                <g transform="translate(230, 145)">
                  <circle cx="0" cy="0" r="20" fill="var(--color-primary-600)" stroke="var(--color-surface)" strokeWidth="3" />
                  <text x="0" y="32" textAnchor="middle" className="fill-ink-900 text-[12px] font-bold pointer-events-none">
                    Joko Widodo
                  </text>
                </g>

                {/* Hub 2: Kemenkeu */}
                <g transform="translate(370, 110)">
                  <rect x="-16" y="-16" width="32" height="32" rx="6" fill="var(--color-warn-text)" stroke="var(--color-surface)" strokeWidth="3" />
                  <text x="0" y="28" textAnchor="middle" className="fill-ink-900 text-[12px] font-bold pointer-events-none">
                    Kemenkeu
                  </text>
                </g>

                {/* Hub 3: Pertamina */}
                <g transform="translate(440, 195)">
                  <polygon points="0,-18 18,0 0,18 -18,0" fill="var(--color-pos-text)" stroke="var(--color-surface)" strokeWidth="3" />
                  <text x="0" y="32" textAnchor="middle" className="fill-ink-900 text-[12px] font-bold pointer-events-none">
                    Pertamina
                  </text>
                </g>
              </svg>

              {/* Entity Legend */}
              <div className="absolute bottom-2.5 left-3 z-10 flex items-center gap-3 bg-surface/90 backdrop-blur-sm border border-border-subtle rounded-lg px-2.5 py-1.5 shadow-sm text-[11px] font-medium text-ink-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-600 shrink-0" />
                  <span>Tokoh</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-warn-text shrink-0" />
                  <span>Organisasi</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rotate-45 rounded-[1px] bg-pos-text shrink-0" />
                  <span>Perusahaan</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Baris 4: Konten terbaru (12 Kolom) */}
        <div className="w-full bg-surface border border-border-subtle rounded-[20px] p-4 sm:p-5 shadow-card flex flex-col gap-4">
          <div className="flex items-start justify-between pb-3 border-b border-border-subtle">
            <div className="flex flex-col">
              <h2 className="text-[16px] font-semibold text-ink-900 leading-tight">Konten terbaru</h2>
              <span className="text-[12px] font-medium text-ink-600 mt-0.5">
                Daftar artikel dan postingan sesuai filter aktif
              </span>
            </div>
            <a
              href="#semua-konten"
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary-600 hover:underline transition-colors focus-ring rounded"
            >
              <span>Lihat 30 terbaru</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </a>
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-sunken text-ink-600 text-[12px] font-semibold border-b border-border-subtle">
                  <th className="py-3 px-4 w-[170px]">Sumber</th>
                  <th className="py-3 px-4">Judul / cuplikan</th>
                  <th className="py-3 px-4 w-[210px]">Sentimen</th>
                  <th className="py-3 px-4 w-[150px]">Waktu</th>
                  <th className="py-3 px-4 w-[70px] text-center">Tautan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-[13px]">
                {/* Row 1 */}
                <tr className="hover:bg-surface-sunken/60 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="inline-flex items-center gap-2">
                      <span className="w-5 h-5 rounded flex items-center justify-center bg-primary-50 text-primary-600 font-bold text-[10px]">
                        K
                      </span>
                      <span className="font-semibold text-ink-900 text-[12px]">Kompas</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-ink-900 font-medium">
                    <p className="line-clamp-2 leading-relaxed">
                      Pemerintah siapkan skema penyesuaian subsidi energi untuk menjaga stabilitas anggaran tahun 2027.
                    </p>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pos-tint text-pos-text text-[12px] font-medium">
                      <span className="material-symbols-outlined text-[14px]">sentiment_satisfied</span>
                      <span>Positif</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-[12px] text-ink-600 tabular-nums">
                    12 Nov 09:31 WIB
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors focus-ring"
                      title="Buka sumber"
                      aria-label="Buka sumber asli Kompas"
                    >
                      <span className="material-symbols-outlined text-[17px]">open_in_new</span>
                    </button>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="hover:bg-surface-sunken/60 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="inline-flex items-center gap-2">
                      <span className="w-5 h-5 rounded flex items-center justify-center bg-primary-50 text-primary-600 font-bold text-[10px]">
                        D
                      </span>
                      <span className="font-semibold text-ink-900 text-[12px]">Detik</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-ink-900 font-medium">
                    <p className="line-clamp-2 leading-relaxed">
                      Evaluasi distribusi bahan pokok jelang akhir tahun menunjukkan perbaikan rantai pasok daerah.
                    </p>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neu-tint text-neu-text text-[12px] font-medium">
                      <span className="material-symbols-outlined text-[14px]">sentiment_neutral</span>
                      <span>Netral</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-[12px] text-ink-600 tabular-nums">
                    12 Nov 09:15 WIB
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors focus-ring"
                      title="Buka sumber"
                      aria-label="Buka sumber asli Detik"
                    >
                      <span className="material-symbols-outlined text-[17px]">open_in_new</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View (< 640px) */}
          <div className="sm:hidden flex flex-col gap-3">
            <div className="p-3 bg-surface-sunken rounded-xl border border-border-subtle flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-ink-900">Kompas</span>
                <span className="text-[11px] text-ink-500">12 Nov 09:31 WIB</span>
              </div>
              <p className="text-[13px] text-ink-900 font-medium line-clamp-3">
                Pemerintah siapkan skema penyesuaian subsidi energi untuk menjaga stabilitas anggaran tahun 2027.
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pos-tint text-pos-text text-[11px] font-medium">
                  <span className="material-symbols-outlined text-[13px]">sentiment_satisfied</span>
                  <span>Positif</span>
                </span>
                <button
                  type="button"
                  className="text-primary-600 text-[12px] font-semibold inline-flex items-center gap-1"
                >
                  <span>Buka</span>
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

