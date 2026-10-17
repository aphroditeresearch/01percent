import type { Metadata } from "next";
import Link from "next/link";
import { PageTitle, Pill } from "@/components/ui/primitives";
import type { Submission } from "@/lib/domain";
import { formatDate } from "@/lib/format";
import { getHomework } from "@/server/data";
import { requireFeature } from "@/server/features";
import { getViewer } from "@/server/session";
import { getTenant } from "@/server/tenant";

export const metadata: Metadata = { title: "Homework" };

function StatusPill({ submission }: { submission: Submission | null }) {
  if (!submission) return <Pill>Not submitted</Pill>;
  if (submission.status === "approved") return <Pill tone="success">Approved</Pill>;
  if (submission.status === "revision") return <Pill tone="accent">Needs revision</Pill>;
  return <Pill>Submitted</Pill>;
}

export default async function HomeworkPage() {
  const tenant = await getTenant();
  requireFeature(tenant, "homework");
  const viewer = await getViewer(tenant);
  const items = await getHomework(tenant, viewer);

  return (
    <div className="space-y-14">
      <header className="border-t border-ink pt-8">
        <PageTitle className="text-4xl sm:text-5xl">{tenant.labels.homework}</PageTitle>
      </header>

      <ul className="border-b border-line">
        {items.map(({ assignment, lesson, submission }) => (
          <li key={assignment.id} className="space-y-4 border-t border-line py-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">{assignment.title}</h2>
                {lesson && (
                  <Link href={`/lessons/${lesson.slug}`} className="text-sm text-muted hover:text-ink">
                    From: {lesson.title}
                  </Link>
                )}
              </div>
              <StatusPill submission={submission} />
            </div>
            <p className="max-w-prose text-muted">{assignment.prompt}</p>
            {assignment.dueAt && !submission && (
              <p className="label-caps text-[0.65rem] text-accent">Due {formatDate(assignment.dueAt)}</p>
            )}
            {submission?.feedback && (
              <p className="border-l-2 border-accent pl-4">
                <span className="text-muted">Feedback: </span>
                {submission.feedback}
              </p>
            )}
            {!submission && (
              <p className="text-xs text-muted">Submitting work arrives in Phase 2 (demo).</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
