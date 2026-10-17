import type { TenantConfig } from "./types";

/**
 * SAMPLE TENANT — fictional trading mentorship used as the flagship demo.
 * Not a real business. Replace with a real client's config when onboarding.
 */
export const meridian: TenantConfig = {
  id: "tnt_meridian",
  slug: "meridian",
  customDomains: [],
  name: "Meridian",
  wordmark: "MERIDIAN",
  tagline: "Private trading mentorship",
  loginBlurb:
    "Membership is by invitation. Lessons are personal to each member and are not to be shared.",
  footerNote: "Sample tenant · Fictional brand for demonstration",
  disclaimer:
    "Educational content only. Nothing here is financial advice. Trading involves substantial risk of loss.",
  theme: {
    bg: "#f6f5f2",
    surface: "#eeece7",
    ink: "#111111",
    muted: "#6b6a66",
    line: "#dcdad4",
    accent: "#c8321f",
    success: "#2f6b3a",
    displayFont: "anton",
    bodyFont: "inter",
    uppercaseHeadings: true,
    colorScheme: "light",
  },
  login: { style: "editorial" },
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
