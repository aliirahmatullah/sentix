import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Shell and Accessibility Structure", () => {
  const sidebarPath = path.resolve(__dirname, "../src/components/shell/Sidebar.tsx");
  const sidebarContent = fs.readFileSync(sidebarPath, "utf-8");

  const layoutPath = path.resolve(__dirname, "../src/app/layout.tsx");
  const layoutContent = fs.readFileSync(layoutPath, "utf-8");

  const appShellPath = path.resolve(__dirname, "../src/components/shell/AppShell.tsx");
  const appShellContent = fs.readFileSync(appShellPath, "utf-8");

  it("should enforce html lang=id", () => {
    expect(layoutContent).toContain('lang="id"');
  });

  it("should have skip to content link matching DESIGN.md 10.1", () => {
    expect(appShellContent).toContain('href="#konten"');
    expect(appShellContent).toContain("Lewati ke konten utama");
  });

  it("should contain nav landmark with aria-label Navigasi utama", () => {
    expect(sidebarContent).toContain('aria-label="Navigasi utama"');
  });

  it("should set aria-current=page on active navigation links", () => {
    expect(sidebarContent).toContain('aria-current={active ? "page" : undefined}');
  });

  it("should conditionally render Administrasi group only for role admin", () => {
    expect(sidebarContent).toContain('role === "admin"');
    expect(sidebarContent).toContain("Administrasi");
    expect(sidebarContent).toContain("/admin/sources");
    expect(sidebarContent).toContain("/admin/users");
  });

  it("should have mobile drawer implementation without bottom nav per DESIGN.md 9.2", () => {
    expect(sidebarContent).toContain("mobileDrawerOpen");
    expect(sidebarContent).toContain("-translate-x-full");
    expect(sidebarContent).not.toContain("bottom-nav");
  });
});

