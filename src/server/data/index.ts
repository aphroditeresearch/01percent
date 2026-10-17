import "server-only";

/**
 * Data access layer. Pages call these functions and never touch storage
 * directly. Today they read sample data; Phase 2 swaps the bodies for
 * Supabase queries without changing the signatures.
 *
 * Rule: every function takes the server-resolved tenant (and viewer where
 * relevant) and filters by it. Ids from the URL are only ever looked up
 * *within* that tenant.
 */

import type { TenantConfig } from "@/config/tenants";
import { lessonStates, percent } from "@/lib/access";
import type { Course, Lesson, LessonState, Viewer } from "@/lib/domain";
import {
  sampleAnnouncements,
  sampleAssignments,
  sampleCompletions,
  sampleCourses,
  sampleJournal,
  sampleLessons,
  sampleRecent,
  sampleSubmissions,
} from "./sample-data";

export interface LessonWithState extends Lesson {
  state: LessonState;
}

export interface CourseWithLessons extends Course {
  lessons: LessonWithState[];
  doneCount: number;
}

function completedSet(viewer: Viewer): Set<string> {
  return new Set(sampleCompletions[viewer.id] ?? []);
}

export async function getCoursesWithProgress(
  tenant: TenantConfig,
  viewer: Viewer,
): Promise<CourseWithLessons[]> {
  const done = completedSet(viewer);
  return sampleCourses
    .filter((c) => c.tenantId === tenant.id)
    .sort((a, b) => a.position - b.position)
    .map((course) => {
      const lessons = sampleLessons
        .filter((l) => l.tenantId === tenant.id && l.courseId === course.id)
        .sort((a, b) => a.position - b.position);
      const states = lessonStates(course, lessons, done);
      const withState = lessons.map((l) => ({ ...l, state: states.get(l.id)! }));
      return {
        ...course,
        lessons: withState,
        doneCount: withState.filter((l) => l.state === "done").length,
      };
    });
}

export interface LessonView {
  course: CourseWithLessons;
  lesson: LessonWithState;
  previous: LessonWithState | null;
  next: LessonWithState | null;
}

/** Looks up a lesson by slug inside the tenant. Returns null if missing — callers 404. */
export async function getLessonView(
  tenant: TenantConfig,
  viewer: Viewer,
  slug: string,
): Promise<LessonView | null> {
  const courses = await getCoursesWithProgress(tenant, viewer);
  for (const course of courses) {
    const index = course.lessons.findIndex((l) => l.slug === slug);
    if (index === -1) continue;
    return {
      course,
      lesson: course.lessons[index],
      previous: course.lessons[index - 1] ?? null,
      next: course.lessons[index + 1] ?? null,
    };
  }
  return null;
}

export async function getDashboard(tenant: TenantConfig, viewer: Viewer) {
  const courses = await getCoursesWithProgress(tenant, viewer);
  const allLessons = courses.flatMap((c) => c.lessons.map((l) => ({ ...l, course: c })));
  const doneCount = allLessons.filter((l) => l.state === "done").length;

  // Resume: first open lesson in the first sequential course, else first open anywhere.
  const resume =
    allLessons.find((l) => l.state === "open" && l.course.unlockMode === "sequential") ??
    allLessons.find((l) => l.state === "open") ??
    null;

  const recentIds = sampleRecent[viewer.id] ?? [];
  const recent = recentIds
    .map((id) => allLessons.find((l) => l.id === id))
    .filter((l): l is (typeof allLessons)[number] => Boolean(l));

  const announcements = await getAnnouncements(tenant);
  const homework = await getHomework(tenant, viewer);
  const journal = await getJournalEntries(tenant, viewer);

  return {
    resume,
    progress: { done: doneCount, total: allLessons.length, percent: percent(doneCount, allLessons.length) },
    recent,
    announcements,
    homework: {
      outstanding: homework.filter((h) => !h.submission || h.submission.status === "revision").length,
      total: homework.length,
    },
    journal: {
      latest: journal[0] ?? null,
      streakDays: 0,
    },
  };
}

export async function getAnnouncements(tenant: TenantConfig) {
  return sampleAnnouncements
    .filter((a) => a.tenantId === tenant.id)
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.publishedAt.localeCompare(a.publishedAt));
}

export async function getHomework(tenant: TenantConfig, viewer: Viewer) {
  const lessons = sampleLessons.filter((l) => l.tenantId === tenant.id);
  return sampleAssignments
    .filter((a) => a.tenantId === tenant.id)
    .map((assignment) => ({
      assignment,
      lesson: lessons.find((l) => l.id === assignment.lessonId) ?? null,
      // Students only ever see their OWN submission.
      submission:
        sampleSubmissions.find(
          (s) =>
            s.tenantId === tenant.id && s.assignmentId === assignment.id && s.userId === viewer.id,
        ) ?? null,
    }));
}

export async function getJournalEntries(tenant: TenantConfig, viewer: Viewer) {
  return sampleJournal
    .filter((e) => e.tenantId === tenant.id && e.userId === viewer.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
