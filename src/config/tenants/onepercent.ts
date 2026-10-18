import type { TenantConfig } from "./types";

/**
 * "1%" — private trading mentorship brand. Same cinematic-login launch
 * sequence, sidebar + sakura-dashboard shell, and red/pink sakura accent
 * family as tempo.ts (advanced-amd.com) — client asked for 1% to match
 * that site's palette, just on a white page instead of tempo's dark one —
 * but its own two-panel split login (see `login.split` below) instead of
 * tempo's single centred panel — a framed, cropped looping clip in a
 * centred card on the left next to the boxed Discord sign-in on the
 * right. Every "Japan"-specific brand element is swapped for "1%":
 * wordmark text, hero word. No kana — there's no Japanese-script
 * equivalent for "1%", so that line is simply omitted rather than
 * replaced.
 *
 * No `introVideo` here, same as tempo.ts — that would be a separate
 * full-screen video pre-roll layered on top of the cinematic login's own
 * intro burst, which reads as a muddled double-intro / cross-fade.
 * Omitting it keeps this tenant on the same shared intro mechanics as
 * tempo.ts (camera-shake, shutter slash) — see cinematic.module.css's
 * `.intro`. The burst rays themselves now diverge via `dimensionalRays`
 * (a second pink layer underneath the classic ones, this tenant only —
 * tempo stays on the classic single-colour burst).
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
    wordmarkSuffix: "by AM",
    introSubtitle: "Private mentorship",
    streakColor: "#ff8aa8",
    // Pink echo rays underneath the classic black burst — see
    // LoginConfig.dimensionalRays doc. Keeps tempo.ts's intro untouched.
    dimensionalRays: true,
    // White sakura scene in tempo's red/pink family (see file doc above) —
    // flips the intro rays to dark-on-light and the ambient backdrop to a
    // clean white, while the framed media card and sign-in panel below
    // stay on their own dark surface (see LoginConfig.pageBg doc).
    pageBg: "#ffffff",
    pageInk: "#11131c",
    // Kilo-style compact pill Discord button instead of the classic
    // full-width block — see LoginConfig.compactButton doc.
    compactButton: true,
    // Kilo-style smaller, tighter sign-in card — see LoginConfig.compactPanel doc.
    compactPanel: true,
    // "Raining petals" texture (a licensed Vecteezy dry-leaves/petals clip,
    // the same footage as home.overlayVideo below) layered on top of the
    // .ambientFallback glow gradient via the cloudVideo duotone+multiply
    // treatment — see LoginConfig.cloudVideo doc. Replaces the earlier blue
    // storm-cloud rain texture entirely: same mechanism, different clip, so
    // it reads as drifting pink petals instead of rain streaks. Moved here
    // (the opening screen) per the brand's direction — the blooming-tree
    // clip belongs behind the member-area content instead, see
    // `home.overlayVideo` below.
    cloudVideo: { src: "/tenants/onepercent/leaves-overlay.mp4" },
    // Lands the duotone recolour on a sakura red/pink instead of the
    // default blue — see LoginConfig.cloudHue doc.
    cloudHue: 330,
    // No full-bleed ambient `video` here — the cloudVideo texture above
    // plus the falling-petal layer below (LoginConfig.ambientPetals) are
    // the login's whole sakura treatment; a third full-bleed clip on top
    // would be too busy for the sign-in panel to stay legible. Omitting
    // `video` falls back to .ambientFallback (the pink-tuned gradient glow).
    //
    // Falling sakura-petal layer (see LoginConfig.ambientPetals doc) instead
    // of the classic halftone-dots + light-streak decoration — sits behind
    // the intro burst's shutters/flash (z-index 50) so it only becomes
    // visible once those resolve, i.e. "after the 1% popout".
    ambientPetals: true,
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
  // Journal, Booking, Account): flat black backdrop with a looping,
  // faded blooming-sakura-tree clip screen-blended on top instead of
  // tempo's drifting CSS sakura petals — see HomeConfig.overlayVideo doc
  // and petal-field.module.css's `.overlayVideo` (opacity) doc.
  home: { style: "sakura", petalColor: "#ff8aa8", overlayVideo: { src: "/tenants/onepercent/sakura-tree.mp4" } },
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
