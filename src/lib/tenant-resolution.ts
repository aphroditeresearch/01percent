import type { TenantConfig } from "@/config/tenants";

export interface ResolveOptions {
  /** Platform root domain, e.g. "localhost" in dev or "yourplatform.com" in prod. */
  rootDomain: string;
  /** Tenant served on the bare root domain. Only set this in development. */
  defaultSlug?: string;
  tenants: readonly TenantConfig[];
}

/** Lowercases and strips the port and any trailing dot: "Foo.Localhost:3000" → "foo.localhost". */
export function normalizeHost(host: string): string {
  return host.trim().toLowerCase().replace(/:\d+$/, "").replace(/\.$/, "");
}

/**
 * Maps an incoming hostname to a tenant. Pure function so it can be unit tested.
 *
 * Order: exact custom domain → "<slug>.<rootDomain>" → bare root (dev default).
 * Returns null for anything unrecognised; callers must treat that as 404,
 * never fall back to some other tenant.
 */
export function resolveTenantFromHost(
  rawHost: string | null | undefined,
  { rootDomain, defaultSlug, tenants }: ResolveOptions,
): TenantConfig | null {
  if (!rawHost) return null;
  const host = normalizeHost(rawHost);
  const root = normalizeHost(rootDomain);

  const byDomain = tenants.find((t) =>
    t.customDomains.some((d) => normalizeHost(d) === host),
  );
  if (byDomain) return byDomain;

  if (host === root) {
    return defaultSlug ? (tenants.find((t) => t.slug === defaultSlug) ?? null) : null;
  }

  const suffix = `.${root}`;
  if (host.endsWith(suffix)) {
    const sub = host.slice(0, -suffix.length);
    // Only single-label subdomains: "a.b.root" must not match tenant "a" or "b".
    if (sub && !sub.includes(".")) {
      return tenants.find((t) => t.slug === sub) ?? null;
    }
  }

  return null;
}
