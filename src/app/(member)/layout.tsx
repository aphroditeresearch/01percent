import { DemoBanner } from "@/components/layout/demo-banner";
import { SiteFooter, SiteHeader } from "@/components/layout/site-header";
import { getTenant } from "@/server/tenant";
import { IS_DEMO_SESSION } from "@/server/session";

/**
 * Shell for every member page.
 * Phase 2: this layout will redirect to /login when there is no session, but
 * each page and action still checks access itself. Layouts alone are not a
 * security boundary in the App Router.
 */
export default async function MemberLayout({ children }: LayoutProps<"/">) {
  const tenant = await getTenant();
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
