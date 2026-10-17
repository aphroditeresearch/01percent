import { buttonStyles } from "@/components/ui/primitives";
import { enterDemo } from "@/app/login/actions";
import { cn } from "@/lib/cn";
import type { TenantConfig } from "@/config/tenants";

/** Quiet, centred sign-in: wordmark, rule, tagline and button. */
export function EditorialLogin({ tenant }: { tenant: TenantConfig }) {
  return (
    <main className="flex flex-1 flex-col items-center px-4 pt-24 pb-8">
      <div className="my-auto flex w-full max-w-md flex-col items-center gap-8 text-center">
        <h1 className="heading-display text-6xl text-ink sm:text-7xl">{tenant.wordmark}</h1>

        <div aria-hidden className="flex w-44 items-center gap-4">
          <span className="h-px flex-1 bg-line" />
          <span className="size-1.5 bg-accent" />
          <span className="h-px flex-1 bg-line" />
        </div>

        <p className="label-caps text-muted">{tenant.tagline}</p>
        <p className="leading-relaxed text-muted">{tenant.loginBlurb}</p>

        <div className="w-full space-y-3 pt-2">
          {/* Real Discord / email sign-in replaces this in Phase 2. */}
          <form action={enterDemo}>
            <button type="submit" className={cn(buttonStyles.primary, "w-full")}>
              Enter demo portal
            </button>
          </form>
          <button type="button" disabled className={cn(buttonStyles.outline, "w-full")}>
            Continue with Discord
          </button>
          <p className="text-xs text-muted">
            Demo mode: no real sign-in yet. Discord login is not connected.
          </p>
        </div>
      </div>
      <p className="pt-16 text-xs text-muted">{tenant.footerNote}</p>
    </main>
  );
}
