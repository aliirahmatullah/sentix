import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Design Tokens verification", () => {
  const cssPath = path.resolve(__dirname, "../src/app/globals.css");
  const cssContent = fs.readFileSync(cssPath, "utf-8");

  it("should contain official neutral and primary color tokens from DESIGN.md 3.7", () => {
    expect(cssContent).toContain("--color-canvas: #F3F5F9");
    expect(cssContent).toContain("--color-surface: #FFFFFF");
    expect(cssContent).toContain("--color-sunken: #F7F8FB");
    expect(cssContent).toContain("--color-line: #E6E9F0");
    expect(cssContent).toContain("--color-ink-900: #0F1729");
    expect(cssContent).toContain("--color-primary-600: #2457E6");
    expect(cssContent).toContain("--color-primary-700: #1B45C2");
    expect(cssContent).toContain("--color-primary-900: #10245F");
  });

  it("should contain sentiment color tokens", () => {
    expect(cssContent).toContain("--color-pos: #1FA463");
    expect(cssContent).toContain("--color-neu: #8A94A8");
    expect(cssContent).toContain("--color-neg: #E5484D");
    expect(cssContent).toContain("--color-warn: #F59E0B");
  });

  it("should contain z-index tokens from DESIGN.md 3.5", () => {
    expect(cssContent).toContain("--z-filter-bar: 20");
    expect(cssContent).toContain("--z-sidebar-mobile: 30");
    expect(cssContent).toContain("--z-scrim: 40");
    expect(cssContent).toContain("--z-panel-modal: 50");
    expect(cssContent).toContain("--z-toast: 60");
    expect(cssContent).toContain("--z-tooltip: 70");
  });

  it("should contain motion tokens from DESIGN.md 3.6", () => {
    expect(cssContent).toContain("--duration-fast: 120ms");
    expect(cssContent).toContain("--duration-base: 200ms");
    expect(cssContent).toContain("--duration-slow: 320ms");
    expect(cssContent).toContain("--ease-out: cubic-bezier(.2, .8, .2, 1)");
  });

  it("should import local Material Symbols without CDN", () => {
    expect(cssContent).toContain('material-symbols/outlined.css');
    expect(cssContent).not.toContain("fonts.googleapis.com");
  });
});

