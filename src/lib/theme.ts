import type { CSSProperties } from "react";
import type { DisplayFont, TenantTheme } from "@/config/tenants";

const HEX = /^#[0-9a-f]{6}$/i;

export function isHexColor(value: string): boolean {
  return HEX.test(value);
}

const COLOR_VARS = {
  bg: "--t-bg",
  surface: "--t-surface",
  ink: "--t-ink",
  muted: "--t-muted",
  line: "--t-line",
  accent: "--t-accent",
  success: "--t-success",
} as const satisfies Partial<Record<keyof TenantTheme, string>>;

/** Exported so callers that need a one-off DisplayFont override for a single
 * element (e.g. the cinematic login's `heroFont`) can reuse the same
 * family/weight/stretch mapping instead of duplicating it. */
export const DISPLAY_FONT = {
  anton: { family: "var(--font-anton)", weight: "400", stretch: "normal" },
  fraunces: { family: "var(--font-fraunces)", weight: "500", stretch: "normal" },
  // Archivo at its widest, heaviest setting.
  archivoWide: { family: "var(--font-archivo)", weight: "900", stretch: "125%" },
} as const satisfies Record<DisplayFont, { family: string; weight: string; stretch: string }>;

const BODY_FONT_VAR = {
  inter: "var(--font-inter)",
  plex: "var(--font-plex)",
} as const;

/**
 * Turns a tenant theme into CSS custom properties for <html style>.
 * Colours are validated as strict #rrggbb so a theme loaded from the database
 * can never inject arbitrary CSS.
 */
export function themeToCssVars(theme: TenantTheme): CSSProperties {
  const vars: Record<string, string> = {};
  for (const [key, cssVar] of Object.entries(COLOR_VARS)) {
    const value = theme[key as keyof typeof COLOR_VARS];
    if (!isHexColor(value)) {
      throw new Error(`Invalid theme colour for "${key}": expected #rrggbb`);
    }
    vars[cssVar] = value;
  }
  const display = DISPLAY_FONT[theme.displayFont];
  vars["--t-font-display"] = display.family;
  vars["--t-display-weight"] = display.weight;
  vars["--t-display-stretch"] = display.stretch;
  vars["--t-font-body"] = BODY_FONT_VAR[theme.bodyFont];
  vars.colorScheme = theme.colorScheme;
  vars["--t-heading-case"] = theme.uppercaseHeadings ? "uppercase" : "none";
  return vars as CSSProperties;
}
