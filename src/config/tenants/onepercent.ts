import type { TenantConfig } from "./types";

/**
 * "1%" — private trading mentorship brand. Same cinematic-login + sidebar +
 * sakura-dashboard shell as tempo.ts, reskinned in black/gold instead of
 * Japan red/pink, with no kana. This file is the template for cloning a new
 * tenant: copy it, swap the colours/copy/video paths below, done.
 *
 * `introVideo` is intentionally left unset until a real video asset lands in
 * `public/tenants/onepercent/` — see intro-video-gate.tsx. Once that file
 * exists, set `introVideo: { src: "/tenants/onepercent/intro.mp4" }` and the
 * black-screen-then-cross-fade intro turns on automatically.
 */
export const onepercent: TenantConfig = {
  id: "tnt_onepercent",
  slug: "onepercent",
  customDomains: [],
  name: "1%",
  wordmark: "1% Mentorship",
  tagline: "Private trading mentorship",
  loginBlurb: "Use the Discord account that holds your member role.",
  footerNote: "Demo build · Sample data, no real sign-in",
  theme: {
    bg: "#0a0a08",
    surface: "#16140f",
    ink: "#f5f1e6",
    muted: "#8c8676",
    line: "#2c2820",
    accent: "#d4af37",
    success: "#34d399",
    displayFont: "archivoWide",
    bodyFont: "plex",
    uppercaseHeadings: true,
    colorScheme: "dark",
  },
  login: {
    style: "cinematic",
    heroWord: "1%",
    introSubtitle: "Private mentorship",
    streakColor: "#e8c468",
    // No ambient background video supplied yet — the cinematic login falls
    // back to its animated-gradient backdrop (see LoginConfig.video doc).
  },
  memberLayout: "sidebar",
  home: { style: "sakura", petalColor: "#d4af37" },
  features: {
    courses: true,
    announcements: true,
    journal: true,
    homework: true,
    protectedVideo: true,
    discord: true,
  },
  labels: {
    library: "Lectures",
    journal: "Journal",
    homework: "Homework",
  },
};
