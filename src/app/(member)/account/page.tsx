import type { Metadata } from "next";
import { ButtonLink, DetailRow, NotYet, PageTitle, Pill } from "@/components/ui/primitives";
import { isFeatureEnabled } from "@/lib/features";
import { formatDate } from "@/lib/format";
import { getViewer } from "@/server/session";
import { getTenant } from "@/server/tenant";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  const tenant = await getTenant();
  const viewer = await getViewer(tenant);

  return (
    <div className="space-y-14">
      <header className="border-t border-ink pt-8">
        <PageTitle className="text-4xl sm:text-5xl">Account</PageTitle>
      </header>

      <dl className="border-b border-line">
        <DetailRow label="Name">{viewer.name}</DetailRow>
        <DetailRow label="Email">{viewer.email}</DetailRow>
        <DetailRow label="Member since">{formatDate(viewer.memberSince)}</DetailRow>
        <DetailRow label="Membership">{viewer.tierName}</DetailRow>
        <DetailRow label="Access">
          <Pill tone={viewer.accessStatus === "active" ? "success" : "accent"}>
            {viewer.accessStatus}
          </Pill>
        </DetailRow>
        {isFeatureEnabled(tenant, "discord") && (
          <DetailRow label="Discord">
            <span className="flex flex-col items-start gap-2 sm:items-end">
              <span>Not connected</span>
              <button type="button" disabled className="label-caps text-muted">
                Connect Discord
              </button>
              <NotYet>Discord linking arrives in Phase 4.</NotYet>
            </span>
          </DetailRow>
        )}
      </dl>

      <ButtonLink href="/login" variant="outline">
        Log out
      </ButtonLink>
    </div>
  );
}
