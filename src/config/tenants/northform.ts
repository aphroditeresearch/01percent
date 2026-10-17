import type { TenantConfig } from "./types";

/**
 * SAMPLE TENANT — fictional fitness coaching brand. Exists to prove that a
 * second, differently branded site runs from the same code with config only.
 * Homework is disabled here so feature gating can be tested.
 */
export const northform: TenantConfig = {
  id: "tnt_northform",
  slug: "northform",
  customDomains: [],
  name: "Northform",
  wordmark: "Northform",
  tagline: "Strength coaching programme",
  loginBlurb: "Your programme, sessions and coaching notes live here.",
  footerNote: "Sample tenant · Fictional brand for demonstration",
  theme: {
    bg: "#f3f4f1",
    surface: "#e7eae4",
    ink: "#18221c",
    muted: "#5d6a62",
    line: "#d3d9d2",
    accent: "#2d6a4f",
    success: "#2d6a4f",
    displayFont: "fraunces",
    bodyFont: "inter",
    uppercaseHeadings: false,
    colorScheme: "light",
  },
  login: { style: "editorial" },
  features: {
    courses: true,
    announcements: true,
    journal: true,
    homework: false,
    protectedVideo: true,
    discord: false,
  },
  labels: {
    library: "Programmes",
    journal: "Training log",
    homework: "Check-ins",
  },
};
