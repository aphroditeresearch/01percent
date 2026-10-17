import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink, Eyebrow, PageTitle } from "@/components/ui/primitives";
import { getLessonView } from "@/server/data";
import { requireFeature } from "@/server/features";
import { getViewer } from "@/server/session";
import { getTenant } from "@/server/tenant";
import { CompleteButton } from "./complete-button";
import { VideoPlaceholder } from "./video-placeholder";

export async function generateMetadata({ params }: PageProps<"/lessons/[slug]">): Promise<Metadata> {
  const tenant = await getTenant();
  const viewer = await getViewer(tenant);
  const view = await getLessonView(tenant, viewer, (await params).slug);
  return { title: view && view.lesson.state !== "locked" ? view.lesson.title : "Lesson" };
}

export default async function LessonPage({ params }: PageProps<"/lessons/[slug]">) {
  const tenant = await getTenant();
  requireFeature(tenant, "courses");
  const viewer = await getViewer(tenant);
  const view = await getLessonView(tenant, viewer, (await params).slug);
  if (!view) notFound();

  const { course, lesson, previous, next } = view;
  const position = `${String(lesson.position).padStart(2, "0")} / ${String(course.lessons.length).padStart(2, "0")}`;

  // Server-side lock check. The library hides locked links, but a typed URL must be refused too.
  if (lesson.state === "locked") {
    const nextUp = course.lessons.find((l) => l.state === "open");
    return (
      <div className="max-w-2xl space-y-8">
        <Eyebrow>
          {course.title} · Lesson {position}
        </Eyebrow>
        <PageTitle>Locked</PageTitle>
        <p className="text-muted">
          Lessons in {course.title} unlock in order.
          {nextUp && <> Your next lesson is &ldquo;{nextUp.title}&rdquo;.</>}
        </p>
        <div className="flex flex-wrap gap-3">
          {nextUp && <ButtonLink href={`/lessons/${nextUp.slug}`}>Go to next lesson</ButtonLink>}
          <ButtonLink href={`/library?course=${course.slug}`} variant="outline">
            Back to {tenant.labels.library}
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <article className="space-y-12">
      <header className="space-y-6">
        <Link
          href={`/library?course=${course.slug}`}
          className="label-caps text-muted transition-colors hover:text-ink"
        >
          ← {tenant.labels.library}
        </Link>
        <Eyebrow>
          {course.title} · Lesson {position}
        </Eyebrow>
        <PageTitle className="max-w-5xl text-5xl sm:text-7xl">{lesson.title}</PageTitle>
      </header>

      {/* Phase 3: replaced by the VdoCipher player, fed a short-lived OTP from the server. */}
      <VideoPlaceholder />

      <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <p className="max-w-prose text-lg leading-relaxed">{lesson.description}</p>
          <p className="text-sm text-muted">{lesson.durationMinutes} minutes</p>
          {tenant.disclaimer && (
            <p className="max-w-prose border-l-2 border-accent pl-4 text-xs text-muted">
              {tenant.disclaimer}
            </p>
          )}
        </div>

        <aside className="space-y-8">
          <CompleteButton initiallyDone={lesson.state === "done"} />
          {lesson.resources.length > 0 && (
            <section aria-labelledby="resources-heading" className="space-y-3">
              <h2 id="resources-heading" className="label-caps text-muted">
                Resources
              </h2>
              <ul className="border-b border-line">
                {lesson.resources.map((r) => (
                  <li
                    key={r.label}
                    className="flex items-center justify-between border-t border-line py-3 text-sm"
                  >
                    <span>{r.label}</span>
                    <span className="label-caps text-[0.65rem] text-muted">{r.kind} · sample</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>

      <nav
        aria-label="Lesson navigation"
        className="grid gap-px border border-line bg-line sm:grid-cols-2"
      >
        <LessonNavLink lesson={previous} direction="Previous" />
        <LessonNavLink lesson={next} direction="Next" />
      </nav>
    </article>
  );
}

function LessonNavLink({
  lesson,
  direction,
}: {
  lesson: { slug: string; title: string; state: string } | null;
  direction: "Previous" | "Next";
}) {
  const align = direction === "Next" ? "sm:text-right" : "";
  if (!lesson) return <div className="bg-bg p-6" />;
  if (lesson.state === "locked") {
    return (
      <div className={`bg-bg p-6 ${align}`}>
        <p className="label-caps text-[0.65rem] text-muted">{direction} · Locked</p>
        <p className="mt-2 text-muted/70">{lesson.title}</p>
      </div>
    );
  }
  return (
    <Link href={`/lessons/${lesson.slug}`} className={`bg-bg p-6 transition-colors hover:bg-surface ${align}`}>
      <p className="label-caps text-[0.65rem] text-muted">{direction}</p>
      <p className="mt-2 font-medium">{lesson.title}</p>
    </Link>
  );
}
