import type { TenantConfig } from "./types";

/**
 * "1%" — private trading mentorship brand. Same cinematic-login launch
 * sequence and sidebar + sakura-dashboard shell as tempo.ts, but its own
 * electric-blue/near-black accent palette (tempo.ts stays red/pink — this
 * tenant deliberately diverges, per client request) and its own two-panel
 * split login (see `login.split` below) instead of tempo's single centred
 * panel — a framed, cropped looping clip in a centred card on the left
 * next to the boxed Discord sign-in on the right. Every "Japan"-specific
 * brand element is swapped for "1%": wordmark text, hero word. No kana —
 * there's no Japanese-script equivalent for "1%", so that line is simply
 * omitted rather than replaced.
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
    accent: "#2f6fed",
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
    streakColor: "#6aa1ff",
    // No full-bleed ambient `video` here — the previous Sharingan YouTube
    // loop was dropped entirely. Omitting `video` falls back to
    // .ambientFallback (an animated gradient), which doesn't matter in
    // practice while `split` (below) is set, since SplitPanels' own media
    // frame is what actually renders on the left.
    //
    // Two-panel split login (see LoginConfig.split doc). `media.src` points
    // at a placeholder path — /assets/hero-bg.mp4 does not exist in the
    // repo yet. This is intentional: the user is sourcing a properly
    // licensed clip themselves and will drop it in at that path. Until
    // then the <video> element 404s quietly and the frame just renders
    // empty/black; nothing else depends on the file existing (build,
    // typecheck, lint, tests all pass regardless). Swap this for a real
    // public/... path once the licensed asset lands, same pattern as
    // home.overlayVideo below.
    split: {
      tagline: "Private trading mentorship",
      media: { src: "/assets/hero-bg.mp4" },
    },
  },
  memberLayout: "sidebar",
  // Member area (behind Home's modules, Library, Lessons, Homework,
  // Journal, Booking, Account): flat black backdrop with a looping
  // dry-leaves clip screen-blended on top instead of tempo's drifting
  // sakura petals — see HomeConfig.overlayVideo doc.
  home: { style: "sakura", petalColor: "#ff8aa8", overlayVideo: { src: "/tenants/onepercent/leaves-overlay.mp4" } },
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
