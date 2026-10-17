import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components is intentionally OFF. Every page in this app is
  // tenant- and user-specific, and a misplaced "use cache" could serve one
  // tenant's content to another. See docs/ARCHITECTURE.md (ADR-004).
  cacheComponents: false,
  // Lets tenant subdomains like northform.localhost:3000 use dev HMR.
  allowedDevOrigins: ["*.localhost"],
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        // CSS Modules (*.module.css) must keep Next's default handling, or
        // their scoped class names come through empty.
        condition: { not: { path: /\.module\.css$/ } },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
