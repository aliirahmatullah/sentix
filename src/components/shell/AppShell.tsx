"use client";

import React from "react";
import { ShellProvider, useShell, UserRole } from "./ShellContext";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface AppShellProps {
  children: React.ReactNode;
  defaultRole?: UserRole;
}

function ShellLayout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useShell();

  return (
    <div className="min-h-screen bg-canvas text-ink-900 flex flex-col">
      {/* Skip to main content link for keyboard accessibility (DESIGN.md 10.1) */}
      <a href="#konten" className="skip-link">
        Lewati ke konten utama
      </a>

      {/* Persistent Single Sidebar */}
      <Sidebar />

      {/* Main Viewport Container */}
      <div
        className={`flex-1 flex flex-col transition-all duration-base ease-out pl-0 sm:pl-[72px] ${
          sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-[240px]"
        }`}
      >
        <TopBar />

        {/* Main Content Area (max 1600px width limit per DESIGN.md 3.3) */}
        <main
          id="konten"
          tabIndex={-1}
          className="relative pt-16 min-h-screen bg-canvas outline-none"
        >
          <div className="flex flex-col w-full pb-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export function AppShell({ children, defaultRole = "admin" }: AppShellProps) {
  return (
    <ShellProvider defaultRole={defaultRole}>
      <ShellLayout>{children}</ShellLayout>
    </ShellProvider>
  );
}
