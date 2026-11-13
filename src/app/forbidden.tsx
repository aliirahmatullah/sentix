import React from "react";
import type { Metadata } from "next";
import { AppShell } from "@/components/shell/AppShell";
import { Error403View } from "@/components/errors/Error403View";

export const metadata: Metadata = {
  title: "403 · Akses Terbatas",
};

export default function Forbidden() {
  return (
    <AppShell>
      <Error403View />
    </AppShell>
  );
}

