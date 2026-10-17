import type { Course, Lesson, LessonState } from "./domain";

/**
 * Works out done / open / locked for each lesson in one course.
 * `lessons` may arrive in any order; position decides sequence.
 *
 * This is the single source of truth for locking. The lesson page must call
 * it too, so a locked lesson cannot be opened by typing its URL.
 */
export function lessonStates(
  course: Pick<Course, "unlockMode">,
  lessons: readonly Pick<Lesson, "id" | "position">[],
  completedLessonIds: ReadonlySet<string>,
): Map<string, LessonState> {
  const states = new Map<string, LessonState>();
  const ordered = [...lessons].sort((a, b) => a.position - b.position);
  let previousDone = true;

  for (const lesson of ordered) {
    const done = completedLessonIds.has(lesson.id);
    if (done) states.set(lesson.id, "done");
    else if (course.unlockMode === "open" || previousDone) states.set(lesson.id, "open");
    else states.set(lesson.id, "locked");
    previousDone = done;
  }
  return states;
}

export function percent(done: number, total: number): number {
  return total === 0 ? 0 : Math.round((done / total) * 100);
}
