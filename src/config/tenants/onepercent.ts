import type { TenantConfig } from "./types";

/**
 * "1%" — private trading mentorship brand. A 1-for-1 structural replica of
 * tempo.ts (same cinematic-login layout, same halftone/streak login
 * backdrop, same native rays/shake/shutter launch intro, same sidebar +
 * sakura-dashboard shell, same red/pink palette, same fonts) with every
 * "Japan"-specific brand element swapped for "1%": wordmark text, hero
 * word, ambient video asset. No kana — there's no Japanese-script
 * equivalent for "1%", so that line is simply omitted rather than
 * replaced. Earlier revisions of this tenant tried a two-panel split login
 * and a distinct Anton wordmark font to stand apart from tempo visually;
 * both were reverted so the two tenants are once again identical in
 * design, differing only in brand text/colours-that-already-matched and
 * the `booking` feature flag below. This file is the template for cloning
 * a new tenant: copy it, swap the colours/copy, done.
 *
 * No `introVideo` here, same as tempo.ts — that would be a separate
 * full-screen video pre-roll layered on top of the cinematic login's own
 * intro burst, which reads as a muddled double-intro / cross-fade.
 * Omitting it keeps this tenant's launch sequence byte-for-byte the same
 * code as tempo.ts (rays, camera-shake, shutter slash) — see
 * cinematic.module.css's `.intro`.
 */
export const onepercent: TenantConfig = {
  id: "tnt_onepercent",
  slug: "onepercent",
  // The Vercel-assigned production alias, so this tenant actually resolves
  // there while no real custom domain is set up yet. Add the real domain
  // here (and keep this one) once one exists.
  customDomains: ["01percent-aphrodite-research.vercel.app"],
  name: "1%",
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
    video: { ambient: "/tenants/onepercent/bg.mp4" },
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
