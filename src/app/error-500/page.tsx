import React from "react";
import type { Metadata } from "next";
import { AppShell } from "@/components/shell/AppShell";
import { Error500View } from "@/components/errors/Error500View";

export const metadata: Metadata = {
  title: "500 · Gangguan Server",
};

export default function ServerErrorPage() {
  return (
    <AppShell>
      <Error500View />
    </AppShell>
  );
}

