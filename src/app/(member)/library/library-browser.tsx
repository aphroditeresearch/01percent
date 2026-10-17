"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LessonStatus, PageTitle } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import type { LessonState } from "@/lib/domain";

export interface LibraryCourse {
  slug: string;
  title: string;
  doneCount: number;
  lessons: { slug: string; position: number; title: string; summary: string; state: LessonState }[];
}

export function LibraryBrowser({
  title,
  courses,
  activeSlug,
}: {
  title: string;
  courses: LibraryCourse[];
  activeSlug: string;
}) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  // With a search term, look across every course; otherwise show the selected course.
  const rows = useMemo(() => {
    const pool = q ? courses : courses.filter((c) => c.slug === activeSlug);
    return pool.flatMap((c) =>
      c.lessons
        .filter((l) => !q || l.title.toLowerCase().includes(q) || l.summary.toLowerCase().includes(q))
        .map((l) => ({ ...l, courseTitle: c.title })),
    );
  }, [courses, activeSlug, q]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 border-t border-ink pt-8 md:flex-row md:items-end md:justify-between">
        <PageTitle className="text-4xl sm:text-5xl">{title}</PageTitle>
        <label className="w-full md:max-w-md">
          <span className="sr-only">Search lessons</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lessons"
            className="w-full border border-line bg-surface px-4 py-3 text-sm placeholder:text-muted focus:border-ink focus:outline-none"
          />
        </label>
      </div>

      <nav aria-label="Courses" className="flex flex-wrap gap-x-8 gap-y-3">
        {courses.map((c) => {
          const active = !q && c.slug === activeSlug;
          return (
            <Link
              key={c.slug}
              href={`/library?course=${c.slug}`}
              scroll={false}
              onClick={() => setQuery("")}
              aria-current={active ? "page" : undefined}
              className={cn(
                "label-caps flex items-center gap-2 transition-colors",
                active ? "font-semibold text-ink" : "text-muted hover:text-ink",
              )}
            >
              <span aria-hidden className={cn("size-1.5 bg-accent", !active && "invisible")} />
              {c.title}
              <span className="tabular-nums text-muted">
                {c.doneCount}/{c.lessons.length}
              </span>
            </Link>
          );
        })}
      </nav>

      {rows.length === 0 ? (
        <p className="border-t border-line py-10 text-muted">No lessons match &ldquo;{query}&rdquo;.</p>
      ) : (
        <ol className="border-b border-line">
          {rows.map((lesson) => {
            const content = (
              <>
                <span className="w-8 shrink-0 tabular-nums text-muted">
                  {String(lesson.position).padStart(2, "0")}
                </span>
                <span className="flex-1">
                  <span className={cn("block", lesson.state === "locked" && "text-muted/70")}>
                    {lesson.title}
                  </span>
                  {q && (
                    <span className="mt-1 block text-xs text-muted">{lesson.courseTitle}</span>
                  )}
                </span>
                <LessonStatus state={lesson.state} />
              </>
            );
            return (
              <li key={lesson.slug} className="border-t border-line">
                {lesson.state === "locked" ? (
                  <div className="flex items-center gap-6 py-4" aria-label={`${lesson.title} (locked)`}>
                    {content}
                  </div>
                ) : (
                  <Link
                    href={`/lessons/${lesson.slug}`}
                    className="-mx-3 flex items-center gap-6 px-3 py-4 transition-colors hover:bg-surface"
                  >
                    {content}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
