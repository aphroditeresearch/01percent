import "server-only";

import { cache } from "react";
import type { TenantConfig } from "@/config/tenants";
import type { Viewer } from "@/lib/domain";
import { sampleViewers } from "./data/sample-data";

/**
 * ⚠️ DEMO SESSION — NOT AUTHENTICATION.
 *
 * Returns a fixed fictional member for the current tenant so the shell can be
 * explored. Phase 2 replaces this with a Supabase Auth session lookup plus a
 * check that the user has a membership row for THIS tenant.
 */
export const getViewer = cache(async (tenant: TenantConfig): Promise<Viewer> => {
  const viewer = sampleViewers.find((v) => v.tenantId === tenant.id);
  if (!viewer) throw new Error(`No demo viewer configured for tenant ${tenant.id}`);
  return viewer;
});

export const IS_DEMO_SESSION = true;
