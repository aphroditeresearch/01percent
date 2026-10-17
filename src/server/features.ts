import "server-only";

import { notFound } from "next/navigation";
import type { FeatureKey, TenantConfig } from "@/config/tenants";
import { isFeatureEnabled } from "@/lib/features";

/**
 * Call at the top of every page, route handler and server action that belongs
 * to a module. Hiding the nav link is not enough: a disabled module must 404
 * when its URL is requested directly.
 */
export function requireFeature(tenant: TenantConfig, key: FeatureKey): void {
  if (!isFeatureEnabled(tenant, key)) notFound();
}
