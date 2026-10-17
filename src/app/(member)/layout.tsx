import { redirect } from "next/navigation";
import { DemoBanner } from "@/components/layout/demo-banner";
import { SiteFooter, SiteHeader } from "@/components/layout/site-header";
import { getTenant } from "@/server/tenant";
import { IS_DEMO_SESSION } from "@/server/session";
import { hasEnteredDemo } from "@/server/demo-session";

/**
 * Shell for every member page.
 * Redirects to /login until the visitor has clicked through the demo login
 * screen. This is a UX gate, not a security boundary — Phase 2 replaces it
 * with a real Supabase Auth session check, and each page/action still checks
 * access itself regardless of what the layout does.
 */
export default async function MemberLayout({ children }: LayoutProps<"/">) {
  const tenant = await getTenant();
  if (!(await hasEnteredDemo())) redirect("/login");
  return (
    <>
      {IS_DEMO_SESSION && <DemoBanner />}
      <SiteHeader tenant={tenant} />
      <main id="main" className="mx-auto w-full max-w-[1280px] flex-1 px-4 pt-16 pb-24 sm:px-8 sm:pt-24">
        {children}
      </main>
      <SiteFooter tenant={tenant} />
    </>
  );
}
