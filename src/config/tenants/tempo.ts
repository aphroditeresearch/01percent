import type { TenantConfig } from "./types";

/**
 * Personal tenant — "Japan" mentorship brand, dark theme with the cinematic
 * login. Hero/ambient video supplied in public/tenants/tempo/bg.mp4.
 */
export const tempo: TenantConfig = {
  id: "tnt_tempo",
  slug: "tempo",
  customDomains: ["advanced-amd.com", "www.advanced-amd.com"],
  name: "Japan",
  wordmark: "Japan 日本",
  tagline: "Personal mentorship",
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
    heroWord: "JAPAN",
    heroKana: "日本",
    introSubtitle: "Mentorship",
    streakColor: "#ff8aa8",
    video: { ambient: "/tenants/tempo/bg.mp4" },
    ambientAudio: { youtubeId: "AraJg5IUD84", startSeconds: 20 },
  },
  features: {
    courses: true,
    announcements: true,
    journal: true,
    homework: true,
    protectedVideo: true,
    discord: true,
  },
  labels: {
    library: "Library",
    journal: "Journal",
    homework: "Homework",
  },
};
