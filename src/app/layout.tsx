import type { Metadata } from "next";
import { Anton, Archivo, Dela_Gothic_One, Fraunces, IBM_Plex_Sans, Inter } from "next/font/google";
import { findTenant } from "@/server/tenant";
import { themeToCssVars } from "@/lib/theme";
import "./globals.css";

// Fonts must be declared statically. Tenants choose between these in their theme.
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const anton = Anton({ variable: "--font-anton", weight: "400", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], preload: false });
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  preload: false,
});
const plex = IBM_Plex_Sans({
  variable: "--font-plex",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  preload: false,
});
// Used for the optional kana line on the cinematic login.
const delaGothic = Dela_Gothic_One({
  variable: "--font-dela",
  weight: "400",
  subsets: ["latin"],
  preload: false,
});

const fontVars = [inter, anton, fraunces, archivo, plex, delaGothic].map((f) => f.variable).join(" ");

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await findTenant();
  return {
    title: tenant ? { default: tenant.name, template: `%s · ${tenant.name}` } : "Not found",
    description: tenant?.tagline,
    // Member portals should never be indexed.
    robots: { index: false, follow: false },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const tenant = await findTenant();
  return (
    <html
      lang="en"
      className={`${fontVars} h-full antialiased`}
      style={tenant ? themeToCssVars(tenant.theme) : undefined}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
