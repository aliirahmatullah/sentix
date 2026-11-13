import { describe, it, expect } from "vitest";
import { BRAND } from "../src/lib/brand";

describe("Brand Configuration", () => {
  it("should have product name as Sentix", () => {
    expect(BRAND.name).toBe("Sentix");
  });

  it("should have PM initials and radar icon placeholder", () => {
    expect(BRAND.initials).toBe("PM");
    expect(BRAND.logoIcon).toBe("radar");
  });

  it("should have correct tagline and description", () => {
    expect(BRAND.tagline).toBe("Platform Monitoring & OSINT");
    expect(BRAND.description).toContain("media monitoring");
  });
});

