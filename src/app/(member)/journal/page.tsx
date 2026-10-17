import type { Metadata } from "next";
import { Eyebrow, PageTitle } from "@/components/ui/primitives";
import { formatDate } from "@/lib/format";
import { getJournalEntries } from "@/server/data";
import { requireFeature } from "@/server/features";
import { getViewer } from "@/server/session";
import { getTenant } from "@/server/tenant";
import { JournalComposer } from "./journal-composer";

export const metadata: Metadata = { title: "Journal" };

export default async function JournalPage() {
  const tenant = await getTenant();
  requireFeature(tenant, "journal");
  const viewer = await getViewer(tenant);
  const entries = await getJournalEntries(tenant, viewer);

  return (
    <div className="space-y-14">
      <header className="space-y-6 border-t border-ink pt-8">
        <PageTitle className="text-4xl sm:text-5xl">{tenant.labels.journal}</PageTitle>
        <p className="max-w-xl text-muted">
          Private to you. Your mentor can&rsquo;t read these entries unless you choose to share
          them.
        </p>
      </header>

      <JournalComposer />

      <section aria-labelledby="entries-heading" className="space-y-6">
        <Eyebrow>
          <span id="entries-heading">Entries</span>
        </Eyebrow>
        {entries.length === 0 ? (
          <p className="text-muted">No entries yet.</p>
        ) : (
          <ul className="border-b border-line">
            {entries.map((entry) => (
              <li key={entry.id} className="grid gap-2 border-t border-line py-6 md:grid-cols-[180px_1fr]">
                <time dateTime={entry.createdAt} className="label-caps pt-1 text-[0.65rem] text-muted">
                  {formatDate(entry.createdAt)}
                </time>
                <div className="space-y-2">
                  <h3 className="font-semibold">{entry.title}</h3>
                  <p className="max-w-prose text-muted">{entry.body}</p>
                  {entry.updatedAt !== entry.createdAt && (
                    <p className="text-xs text-muted">Edited</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
