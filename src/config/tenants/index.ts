import { meridian } from "./meridian";
import { northform } from "./northform";
import { onepercent } from "./onepercent";
import { tempo } from "./tempo";
import type { TenantConfig } from "./types";

export type { TenantConfig, FeatureKey, TenantTheme, LoginConfig, HomeConfig, DisplayFont } from "./types";

/** All configured tenants. Phase 2 replaces this with a database lookup. */
export const tenants: readonly TenantConfig[] = [meridian, northform, tempo, onepercent];
