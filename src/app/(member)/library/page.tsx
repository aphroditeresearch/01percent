import type { Metadata } from "next";
import { getCoursesWithProgress } from "@/server/data";
import { requireFeature } from "@/server/features";
import { getViewer } from "@/server/session";
import { getTenant } from "@/server/tenant";
import { LibraryBrowser, type LibraryCourse } from "./library-browser";

export const metadata: Metadata = { title: "Library" };

export default async function LibraryPage({ searchParams }: PageProps<"/library">) {
  const tenant = await getTenant();
  requireFeature(tenant, "courses");
  const viewer = await getViewer(tenant);
  const courses = await getCoursesWithProgress(tenant, viewer);

  const { course: requested } = await searchParams;
  const activeSlug =
    courses.find((c) => c.slug === requested)?.slug ?? courses[0]?.slug ?? "";

  // Send the browser only what it renders. Video ids and full descriptions stay on the server.
  const clientCourses: LibraryCourse[] = courses.map((c) => ({
    slug: c.slug,
    title: c.title,
    doneCount: c.doneCount,
    lessons: c.lessons.map((l) => ({
      slug: l.slug,
      position: l.position,
      title: l.title,
      summary: l.summary,
      state: l.state,
    })),
  }));

  return (
    <LibraryBrowser title={tenant.labels.library} courses={clientCourses} activeSlug={activeSlug} />
  );
}
