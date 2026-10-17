import type { TenantConfig } from "./types";

/**
 * "1%" — private trading mentorship brand. Same cinematic-login + sidebar +
 * sakura-dashboard shell as tempo.ts, same red/pink Japan palette, sakura
 * petals and native rays/shake/shutter intro, with no kana. This file is
 * the template for cloning a new tenant: copy it, swap the colours/copy
 * below, done.
 *
 * No `introVideo` here on purpose — that was a separate full-screen video
 * pre-roll layered on top of the cinematic login's own intro burst, which
 * read as a muddled double-intro / cross-fade. Omitting it means this
 * tenant runs the exact same intro as tempo.ts (rays, camera-shake, shutter
 * slash) with zero extra code — see cinematic.module.css's `.intro`.
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
    // Two-panel split: looping clip + "1%" (sword-slashed) + tagline on the
    // left, Discord sign-in boxed on the right, cut by a diagonal seam —
    // opt-in, see LoginConfig.split doc.
    split: {
      tagline: "Private mentorship",
      media: { youtubeId: "-5RVEKRfbsY" },
    },
  },
  memberLayout: "sidebar",
  home: { style: "sakura", petalColor: "#ff8aa8" },
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
