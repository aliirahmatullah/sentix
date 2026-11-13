"use client";

import React from "react";
import { AppShell } from "@/components/shell/AppShell";
import { Error500View } from "@/components/errors/Error500View";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body className="antialiased min-h-screen bg-canvas text-ink-900 font-sans">
        <AppShell>
          <Error500View
            errorCode={error.digest ? `ERR-${error.digest.slice(0, 6)}` : "ERR-500"}
            onRetry={reset}
          />
        </AppShell>
      </body>
    </html>
  );
}

