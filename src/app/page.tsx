import React from "react";
import type { Metadata } from "next";
import { AppShell } from "@/components/shell/AppShell";
import { DashboardView } from "@/components/dashboard/DashboardView";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function HomePage() {
  return (
    <AppShell>
      <DashboardView />
    </AppShell>
  );
}

