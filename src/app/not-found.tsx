import React from "react";
import type { Metadata } from "next";
import { AppShell } from "@/components/shell/AppShell";
import { Error404View } from "@/components/errors/Error404View";

export const metadata: Metadata = {
  title: "404 · Halaman Tidak Ditemukan",
};

export default function GlobalNotFound() {
  return (
    <AppShell>
      <Error404View />
    </AppShell>
  );
}

