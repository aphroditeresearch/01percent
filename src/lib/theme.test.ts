import { describe, expect, it } from "vitest";
import { tenants } from "@/config/tenants";
import { memberNav } from "./features";
import { isHexColor, themeToCssVars } from "./theme";

describe("tenant configs", () => {
  it.each(tenants.map((t) => [t.slug, t] as const))("%s has a valid theme", (_slug, tenant) => {
    expect(() => themeToCssVars(tenant.theme)).not.toThrow();
  });

  it("cinematic logins use valid streak colours", () => {
    for (const t of tenants) {
      if (t.login.style === "cinematic") expect(isHexColor(t.login.streakColor)).toBe(true);
    }
  });

  it("tenant ids and slugs are unique", () => {
    expect(new Set(tenants.map((t) => t.id)).size).toBe(tenants.length);
    expect(new Set(tenants.map((t) => t.slug)).size).toBe(tenants.length);
  });
});

describe("themeToCssVars", () => {
  it("rejects anything that is not #rrggbb (blocks CSS injection from DB values)", () => {
    const theme = { ...tenants[0].theme, accent: "red; background:url(https://evil)" };
    expect(() => themeToCssVars(theme)).toThrow(/Invalid theme colour/);
  });
});

describe("memberNav", () => {
  it("omits disabled modules", () => {
    const tenant = { ...tenants[0], features: { ...tenants[0].features, homework: false } };
    expect(memberNav(tenant).map((i) => i.href)).not.toContain("/homework");
    expect(memberNav(tenants[0]).map((i) => i.href)).toContain("/homework");
  });
});
