import type { FeatureKey, TenantConfig } from "@/config/tenants";

export function isFeatureEnabled(tenant: TenantConfig, key: FeatureKey): boolean {
  return tenant.features[key] === true;
}

export interface NavItem {
  href: string;
  label: string;
}

/** Navigation is derived from features so a disabled module never shows a link. */
export function memberNav(tenant: TenantConfig): NavItem[] {
  const items: (NavItem | false)[] = [
    { href: "/", label: "Home" },
    isFeatureEnabled(tenant, "courses") && { href: "/library", label: tenant.labels.library },
    isFeatureEnabled(tenant, "journal") && { href: "/journal", label: tenant.labels.journal },
    isFeatureEnabled(tenant, "homework") && { href: "/homework", label: tenant.labels.homework },
    { href: "/account", label: "Account" },
  ];
  return items.filter((i): i is NavItem => Boolean(i));
}
