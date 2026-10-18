import type { TenantConfig } from "./types";

/**
 * "1%" — private trading mentorship brand. Same cinematic-login + sidebar +
 * sakura-dashboard shell as tempo.ts, same red/pink Japan palette and native
 * rays/shake/shutter launch intro, with no kana. Unlike tempo it opts into
 * `ambientPetals` (falling sakura instead of the halftone/streak backdrop)
 * and `login.split` (two-panel sign-in with a moving-wallpaper clip). This
 * file is the template for cloning a new tenant: copy it, swap the
 * colours/copy below, done.
 *
 * No `introVideo` here on purpose — that was a separate full-screen video
 * pre-roll layered on top of the cinematic login's own intro burst, which
 * read as a muddled double-intro / cross-fade. Omitting it means this
 * tenant's launch sequence is byte-for-byte the same code as tempo.ts (rays,
 * camera-shake, shutter slash) — see cinematic.module.css's `.intro`.
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
    // Distinct wordmark logotype — Anton, not the page's own Archivo
    // headings — so the giant "1%" reads as a deliberate brand mark
    // rather than just a scaled-up heading. See LoginConfig.heroFont doc.
    heroFont: "anton",
    introSubtitle: "Private mentorship",
    streakColor: "#ff8aa8",
    // No ambient background video supplied yet — the cinematic login falls
    // back to its animated-gradient backdrop (see LoginConfig.video doc).
    // Falling sakura petals instead of the default halftone/streak backdrop.
    ambientPetals: true,
    // Two-panel split: looping clip filling the left panel as a moving
    // wallpaper, "1%" + tagline overlaid on it, Discord sign-in boxed on
    // the right — opt-in, see LoginConfig.split doc. Self-hosted file
    // (public/tenants/onepercent/split.mp4) rather than the earlier
    // YouTube embed — avoids every iframe quirk (autoplay getting
    // blocked, YouTube's native play/pause control flashing over the
    // clip) since it's just a plain same-origin <video>.
    split: {
      tagline: "Private mentorship",
      media: { src: "/tenants/onepercent/split.mp4" },
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
