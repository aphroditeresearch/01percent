import Link from "next/link";
import type { TenantConfig } from "@/config/tenants";
import { leaveDemo } from "@/app/login/actions";
import { memberNav } from "@/lib/features";
import { buttonStyles } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import { NavLinks } from "./nav-links";

export function SiteHeader({ tenant }: { tenant: TenantConfig }) {
  return (
    <header className="border-b border-ink">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-[1400px] flex-col gap-3 px-4 py-4 sm:px-8 md:flex-row md:items-center md:justify-between"
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="heading-display text-2xl tracking-wide text-ink">
            {tenant.wordmark}
          </Link>
          <form action={leaveDemo} className="md:hidden">
            <button type="submit" className={cn(buttonStyles.outline, "px-4 py-2")}>
              Log out
            </button>
          </form>
        </div>
        <div className="flex min-w-0 items-center gap-8">
          <NavLinks items={memberNav(tenant)} />
          {/* Demo: goes back to the login screen. Phase 2 makes this a real sign-out action. */}
          <form action={leaveDemo} className="hidden md:block">
            <button type="submit" className={cn(buttonStyles.outline, "px-4 py-2.5")}>
              Log out
            </button>
          </form>
        </div>
      </nav>
    </header>
  );
}

export function SiteFooter({ tenant }: { tenant: TenantConfig }) {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-4 py-8 text-xs text-muted sm:px-8 md:flex-row md:justify-between">
        <p>{tenant.disclaimer ?? `© ${tenant.name}`}</p>
        <p>{tenant.footerNote}</p>
      </div>
    </footer>
  );
}
