import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { tenants, type TenantConfig } from "@/config/tenants";
import { resolveTenantFromHost } from "@/lib/tenant-resolution";

/**
 * The tenant for the current request, derived ONLY from the Host header.
 * Never accept a tenant id from the browser (query string, form field, cookie).
 * Unknown hosts get a 404 rather than a fallback tenant.
 */
export const getTenant = cache(async (): Promise<TenantConfig> => {
  const tenant = await findTenant();
  if (!tenant) notFound();
  return tenant;
});

/** Same lookup without the 404. Only for the root layout and the 404 page. */
export const findTenant = cache(async (): Promise<TenantConfig | null> => {
  const host = (await headers()).get("host");
  return resolveTenantFromHost(host, {
    rootDomain: process.env.PLATFORM_ROOT_DOMAIN ?? "localhost",
    defaultSlug: process.env.DEFAULT_TENANT_SLUG || undefined,
    tenants,
  });
});
