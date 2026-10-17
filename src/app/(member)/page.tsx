import Link from "next/link";
import { SakuraDashboard } from "@/components/dashboard/sakura-dashboard";
import { DetailRow, Eyebrow, PageTitle } from "@/components/ui/primitives";
import { isFeatureEnabled } from "@/lib/features";
import { formatDate } from "@/lib/format";
import { getCoursesWithProgress, getDashboard } from "@/server/data";
import { getViewer } from "@/server/session";
import { getTenant } from "@/server/tenant";

export default async function DashboardPage() {
  const tenant = await getTenant();
  const viewer = await getViewer(tenant);
  const data = await getDashboard(tenant, viewer);
  const { resume, progress } = data;
  const firstName = viewer.name.split(" ")[0];

  // Opt-in per tenant (see tempo.ts) — every other tenant keeps the default
  // resume/summary page below, untouched.
  if (tenant.home?.style === "sakura") {
    const modules = await getCoursesWithProgress(tenant, viewer);
    return (
      <SakuraDashboard
        tenant={tenant}
        firstName={firstName}
        resume={resume}
        progress={progress}
        streakDays={data.streakDays}
        modules={modules}
      />
    );
  }

  return (
    <div className="space-y-20">
      <section aria-labelledby="resume-heading" className="space-y-8">
        {resume ? (
          <>
            <Eyebrow>Continue — {resume.course.title}</Eyebrow>
            <div className="space-y-5">
              <PageTitle className="text-6xl sm:text-8xl">
                <span id="resume-heading">{resume.title}</span>
              </PageTitle>
              <p className="max-w-2xl text-muted">{resume.summary}</p>
            </div>
            <Link
              href={`/lessons/${resume.slug}`}
              className="group flex items-center justify-between gap-4 bg-ink px-6 py-6 text-bg transition-colors hover:bg-ink/85 sm:px-7"
            >
              <span className="label-caps font-semibold">Resume lesson</span>
              <span className="label-caps tabular-nums">
                {progress.done} of {progress.total} · {progress.percent}%
              </span>
            </Link>
          </>
        ) : (
          <>
            <Eyebrow>Welcome back, {firstName}</Eyebrow>
            <PageTitle>
              <span id="resume-heading">You&rsquo;re all caught up</span>
            </PageTitle>
          </>
        )}
      </section>

      <dl aria-label="Your summary" className="border-b border-line">
        <DetailRow label="Progress">
          <span className="tabular-nums">
            {progress.done} of {progress.total} lessons · {progress.percent}%
          </span>
        </DetailRow>
        {isFeatureEnabled(tenant, "homework") && (
          <DetailRow label={tenant.labels.homework}>
            <Link href="/homework" className="hover:underline">
              {data.homework.outstanding === 0
                ? "All clear"
                : `${data.homework.outstanding} outstanding`}
            </Link>
          </DetailRow>
        )}
        {isFeatureEnabled(tenant, "journal") && (
          <>
            <DetailRow label={`${tenant.labels.journal} streak`}>
              <span className="text-2xl tabular-nums">{data.journal.streakDays}</span> days
            </DetailRow>
            <DetailRow label="Latest entry">
              {data.journal.latest ? (
                <Link href="/journal" className="hover:underline">
                  {data.journal.latest.title}
                </Link>
              ) : (
                "No entries yet"
              )}
            </DetailRow>
          </>
        )}
        {isFeatureEnabled(tenant, "announcements") &&
          data.announcements.slice(0, 2).map((a) => (
            <DetailRow key={a.id} label={a.pinned ? "Announcement · pinned" : "Announcement"}>
              <p className="font-semibold">{a.title}</p>
              <p className="mt-1 text-sm text-muted">{a.body}</p>
              <p className="label-caps mt-2 text-[0.65rem] text-muted">{formatDate(a.publishedAt)}</p>
            </DetailRow>
          ))}
      </dl>

      {data.recent.length > 0 && (
        <section aria-labelledby="recent-heading" className="space-y-6">
          <Eyebrow>
            <span id="recent-heading">Recently viewed</span>
          </Eyebrow>
          <ul className="grid gap-px border border-line bg-line sm:grid-cols-3">
            {data.recent.map((lesson) => (
              <li key={lesson.id} className="bg-bg">
                <Link
                  href={`/lessons/${lesson.slug}`}
                  className="flex h-full flex-col gap-3 p-6 transition-colors hover:bg-surface"
                >
                  <span className="label-caps text-[0.65rem] text-muted">{lesson.course.title}</span>
                  <span className="font-medium">{lesson.title}</span>
                  <span className="mt-auto text-sm text-muted">{lesson.durationMinutes} min</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
