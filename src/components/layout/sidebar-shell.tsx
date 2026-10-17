import type { ReactNode } from "react";
import Link from "next/link";
import type { TenantConfig } from "@/config/tenants";
import { leaveDemo } from "@/app/login/actions";
import { memberNav } from "@/lib/features";
import { buttonStyles } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import { SidebarNavLinks } from "./nav-links";

/**
 * Left-rail member shell: wordmark, vertical nav and sign-out, with the page
 * content filling the rest of the viewport. Opt-in per tenant via
 * `memberLayout: "sidebar"` (see tempo.ts) — SiteHeader/SiteFooter stay the
 * default top-nav shell for every other tenant.
 */
export function SidebarShell({ tenant, children }: { tenant: TenantConfig; children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <aside className="relative shrink-0 overflow-hidden border-b border-line px-6 py-6 md:flex md:w-64 md:flex-col md:gap-10 md:border-b-0 md:border-r md:px-8 md:py-10">
        {/* Soft accent bloom, decorative only — colour comes from the tenant's own accent token. */}
        <div aria-hidden className="pointer-events-none absolute -top-16 -left-16 size-56 rounded-full bg-accent/15 blur-3xl" />

        <div className="relative flex items-center justify-between md:block">
          <Link href="/" className="heading-display text-xl tracking-wide text-ink">
            {tenant.wordmark}
          </Link>
          <form action={leaveDemo} className="md:hidden">
            <button type="submit" className={cn(buttonStyles.outline, "px-4 py-2 text-xs")}>
              Log out
            </button>
          </form>
        </div>

        <nav aria-label="Main" className="relative mt-6 md:mt-0">
          <SidebarNavLinks items={memberNav(tenant)} />
        </nav>

        <div className="relative mt-auto hidden flex-col gap-4 pt-10 md:flex">
          <form action={leaveDemo}>
            <button type="submit" className={cn(buttonStyles.outline, "w-full")}>
              Log out
            </button>
          </form>
          <p className="text-xs text-muted">{tenant.footerNote}</p>
        </div>
      </aside>

      <main id="main" className="min-w-0 flex-1 px-4 pt-10 pb-24 sm:px-8 sm:pt-14">
        {children}
      </main>
    </div>
  );
}
