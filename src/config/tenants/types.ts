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
  "booking",
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
      /**
       * Opt-in: use a different DisplayFont than `theme.displayFont` for the
       * brand word mark specifically — the header wordmark, the intro burst
       * title, and the hero word on the sign-in panel (all three stay in
       * sync). Lets the "1%"/"KILO"-style giant wordmark read as a distinct,
       * deliberate logotype instead of just reusing whatever font the rest
       * of the page's headings use. Omit to keep the classic behaviour
       * (wordmark matches `theme.displayFont` everywhere, e.g. tempo).
       */
      heroFont?: DisplayFont;
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
      /**
       * Opt-in: swap the default backdrop (halftone dots + flying light
       * streaks) for the falling-sakura-petal field used on member pages
       * (see components/layout/petal-field.tsx). Only takes effect when
       * `home.style` is also "sakura" — PetalField itself is a no-op
       * otherwise. Omit to keep the classic halftone/streak backdrop.
       */
      ambientPetals?: boolean;
      /**
       * Opt-in two-panel layout: brand word + emblem on the left, boxed
       * sign-in panel on the right. Omit for the classic single centred
       * panel (e.g. tempo) — nothing changes there. See
       * cinematic-login.tsx's `SplitPanels`.
       */
      split?: {
        /** Line shown under the hero word on the left panel, e.g. "Private mentorship". */
        tagline: string;
        /**
         * Optional looping, muted clip shown in a framed box above the hero
         * word on the left panel. Purely decorative — no audio, no controls.
         * Omit for just the emblem/word/tagline stack. Either a YouTube
         * embed (driven by the IFrame Player API, see youtube-box.tsx) or a
         * self-hosted file in /public (plain `<video>`, see
         * ambient-video.tsx's sibling in SplitPanels) — a local file avoids
         * every YouTube-specific quirk (autoplay being blocked, the native
         * play/pause control flashing over the clip) since it's just a
         * same-origin video element, so prefer it when a clip is available.
         */
        media?: { youtubeId: string } | { src: string; poster?: string };
      };
    };

/**
 * How the member home page (dashboard) looks.
 * - default (or omitted): the quiet resume/summary page.
 * - sakura: a progress-forward dashboard (streak, modules, next-up card)
 *   with a drifting cherry-blossom petal overlay — see sakura-dashboard.tsx.
 */
export type HomeConfig =
  | { style: "default" }
  | {
      style: "sakura";
      /** Petal colour, #rrggbb. Falls back to theme.accent if omitted. */
      petalColor?: string;
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
  /** Member home page style. Omit for the default (see HomeConfig). */
  home?: HomeConfig;
  /**
   * Full-screen black intro that plays once (muted, autoplaying video)
   * before the sign-in screen cross-fades in. Omit entirely for the
   * classic behaviour — the login renders immediately, nothing changes.
   * Independent of `login.style`: works the same whether the sign-in
   * screen underneath is "editorial" or "cinematic". See
   * `intro-video-gate.tsx`.
   */
  introVideo?: { src: string; poster?: string };
  features: Record<FeatureKey, boolean>;
  /** Mentor-chosen names for navigation items. */
  labels: {
    library: string;
    journal: string;
    homework: string;
  };
}
