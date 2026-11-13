import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { BRAND } from "@/lib/brand";

const manrope = localFont({
  src: [
    {
      path: "./fonts/manrope-latin.woff2",
      weight: "200 800",
      style: "normal",
    },
    {
      path: "./fonts/manrope-latin-ext.woff2",
      weight: "200 800",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: {
    default: `${BRAND.name} — ${BRAND.tagline}`,
    template: `%s · ${BRAND.name}`,
  },
  description: BRAND.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={manrope.variable}>
      <body className="antialiased min-h-screen bg-canvas text-ink-900 font-sans">
        {children}
      </body>
    </html>
  );
}

