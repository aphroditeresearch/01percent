/**
 * Tenant configuration — everything that differs between client websites.
 *
 * Today these live in code (src/config/tenants/*.ts). In Phase 2 the same
 * shape moves into the `tenants`, `domains` and `feature_settings` tables so
 * mentors can be onboarded without a deploy. Keep this type the contract.
 */

export const FEATURE_KEYS = [
  "courses",
  "announcements",
  "journal",
  "homework",
  "protectedVideo",
  "discord",
] as const;

export type FeatureKey = (typeof FEATURE_KEYS)[number];

/** Fonts must be declared statically with next/font, so tenants pick from a set. */
export type DisplayFont = "anton" | "fraunces" | "archivoWide";
export type BodyFont = "inter" | "plex";

export interface TenantTheme {
  /** Page background */
  bg: string;
  /** Raised surfaces: inputs, cards */
  surface: string;
  /** Primary text and solid buttons */
  ink: string;
  /** Secondary text */
  muted: string;
  /** Hairline borders */
  line: string;
  /** Brand accent, used sparingly */
  accent: string;
  /** Positive state, e.g. "Done" */
  success: string;
  displayFont: DisplayFont;
  bodyFont: BodyFont;
  /** Uppercase display headings (editorial look) vs. sentence case */
  uppercaseHeadings: boolean;
  /** Tells the browser to draw form controls and scrollbars for a light or dark page. */
  colorScheme: "light" | "dark";
}

/**
 * How the sign-in screen looks.
 * - editorial: quiet centred wordmark, rule and button (default).
 * - cinematic: dark full-bleed scene with an intro burst, ambient video,
 *   streaks and a framed hero panel.
 */
export type LoginConfig =
  | { style: "editorial" }
  | {
      style: "cinematic";
      /** Large hero word, e.g. the brand name. */
      heroWord: string;
      /** Optional secondary script under the hero word (e.g. katakana). */
      heroKana?: string;
      /** Small caps line shown during the intro. */
      introSubtitle: string;
      /** Second accent colour for streaks, #rrggbb. */
      streakColor: string;
      /**
       * Background videos in /public, supplied by the client. When omitted an
       * animated gradient stands in, so the page still works without assets.
       */
      video?: { ambient: string; poster?: string };
      /**
       * Optional ambient audio played via the official YouTube IFrame Player
       * API once the sign-in panel is visible. No video is downloaded or
       * embedded visually — only used as a muted-until-gesture audio source.
       */
      ambientAudio?: { youtubeId: string; startSeconds?: number };
    };

export interface TenantConfig {
  id: string;
  /** Subdomain on the platform root domain, e.g. "meridian" → meridian.<root> */
  slug: string;
  /** Extra hostnames that resolve to this tenant (custom domains). */
  customDomains: string[];
  name: string;
  /** Short text shown in the header when there is no logo image. */
  wordmark: string;
  tagline: string;
  loginBlurb: string;
  footerNote: string;
  /** Shown on lesson pages and the footer. Mentor supplies the wording; have it reviewed. */
  disclaimer?: string;
  theme: TenantTheme;
  login: LoginConfig;
  /**
   * Member-area chrome. "header" (default) is the classic top nav + footer.
   * "sidebar" is a left-rail shell (wordmark, vertical nav, sign-out) for a
   * more app-like feel — see sidebar-shell.tsx.
   */
  memberLayout?: "header" | "sidebar";
  features: Record<FeatureKey, boolean>;
  /** Mentor-chosen names for navigation items. */
  labels: {
    library: string;
    journal: string;
    homework: string;
  };
}
