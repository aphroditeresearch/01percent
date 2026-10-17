import { describe, expect, it } from "vitest";
import { tenants } from "@/config/tenants";
import { normalizeHost, resolveTenantFromHost } from "./tenant-resolution";

const withCustomDomain = tenants.map((t) =>
  t.slug === "northform" ? { ...t, customDomains: ["learn.northform.example"] } : t,
);

const dev = { rootDomain: "localhost", defaultSlug: "meridian", tenants: withCustomDomain };
const prod = { rootDomain: "platform.example", tenants: withCustomDomain };

describe("normalizeHost", () => {
  it("lowercases and strips port and trailing dot", () => {
    expect(normalizeHost("Meridian.LocalHost:3000")).toBe("meridian.localhost");
    expect(normalizeHost("platform.example.")).toBe("platform.example");
  });
});

describe("resolveTenantFromHost", () => {
  it("resolves tenant subdomains", () => {
    expect(resolveTenantFromHost("northform.localhost:3000", dev)?.slug).toBe("northform");
    expect(resolveTenantFromHost("meridian.platform.example", prod)?.slug).toBe("meridian");
  });

  it("resolves custom domains", () => {
    expect(resolveTenantFromHost("learn.northform.example", prod)?.slug).toBe("northform");
  });

  it("uses the default tenant on the bare root only when configured", () => {
    expect(resolveTenantFromHost("localhost:3000", dev)?.slug).toBe("meridian");
    expect(resolveTenantFromHost("platform.example", prod)).toBeNull();
  });

  it("refuses unknown hosts instead of falling back to another tenant", () => {
    expect(resolveTenantFromHost("unknown.localhost", dev)).toBeNull();
    expect(resolveTenantFromHost("evil.example", prod)).toBeNull();
    expect(resolveTenantFromHost(null, dev)).toBeNull();
    expect(resolveTenantFromHost("", dev)).toBeNull();
  });

  it("does not match nested subdomains or lookalike suffixes", () => {
    expect(resolveTenantFromHost("x.meridian.platform.example", prod)).toBeNull();
    expect(resolveTenantFromHost("meridian.platform.example.evil.com", prod)).toBeNull();
    expect(resolveTenantFromHost("meridianplatform.example", prod)).toBeNull();
  });
});
