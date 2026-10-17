import type { TenantConfig } from "./types";

/**
 * "1%" — private trading mentorship brand. Same cinematic-login + sidebar +
 * sakura-dashboard shell as tempo.ts, same red/pink Japan palette and sakura
 * petals, with no kana. This file is the template for cloning a new tenant:
 * copy it, swap the colours/copy/video paths below, done.
 *
 * `introVideo` points at `public/tenants/onepercent/intro.mp4` — a
 * full-screen black intro that cross-fades into the login once it ends.
 * See intro-video-gate.tsx. Omit this field entirely to go back to the
 * classic behaviour (login renders immediately, no gate).
 */
export const onepercent: TenantConfig = {
  id: "tnt_onepercent",
  slug: "onepercent",
  // The Vercel-assigned production alias, so this tenant actually resolves
  // there while no real custom domain is set up yet. Add the real domain
  // here (and keep this one) once one exists.
  customDomains: ["01percent-aphrodite-research.vercel.app"],
  name: "1%",
  // Brand reads as just "1%" everywhere (sidebar, cinematic header) — no
  // "Mentorship" suffix in the lockup itself; "private mentorship" still
  // appears as the tagline/subtitle copy around it.
  wordmark: "1%",
  tagline: "Private trading mentorship",
  loginBlurb: "Use the Discord account that holds your member role.",
  footerNote: "Demo build · Sample data, no real sign-in",
  theme: {
    bg: "#0a0b0e",
    surface: "#15171c",
    ink: "#f2f1ee",
    muted: "#8b8d94",
    line: "#2a2d34",
    accent: "#ff3b5c",
    success: "#5bd68a",
    displayFont: "archivoWide",
    bodyFont: "plex",
    uppercaseHeadings: true,
    colorScheme: "dark",
  },
  login: {
    style: "cinematic",
    heroWord: "1%",
    introSubtitle: "Private mentorship",
    streakColor: "#ff8aa8",
    // No ambient background video supplied yet — the cinematic login falls
    // back to its animated-gradient backdrop (see LoginConfig.video doc).
    // Two-panel split: "1%" + emblem on the left, Discord sign-in boxed on
    // the right, cut by a diagonal seam — opt-in, see LoginConfig.split doc.
    split: { tagline: "Private mentorship" },
  },
  memberLayout: "sidebar",
  home: { style: "sakura", petalColor: "#ff8aa8" },
  introVideo: { src: "/tenants/onepercent/intro.mp4" },
  features: {
    courses: true,
    announcements: true,
    journal: true,
    homework: true,
    protectedVideo: true,
    discord: true,
    booking: true,
  },
  labels: {
    library: "Lectures",
    journal: "Journal",
    homework: "Homework",
  },
};
