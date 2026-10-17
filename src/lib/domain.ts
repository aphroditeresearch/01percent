/**
 * Domain types shared by server and client code. These mirror the planned
 * database tables in docs/DATABASE.md. Every tenant-owned record carries tenantId.
 */

export type Role = "student" | "mentor" | "platform_admin";

export interface Viewer {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: Role;
  tierName: string;
  accessStatus: "active" | "grace" | "expired";
  memberSince: string;
}

export interface Course {
  id: string;
  tenantId: string;
  slug: string;
  title: string;
  description: string;
  position: number;
  /** sequential: each lesson unlocks after the previous one is completed. */
  unlockMode: "sequential" | "open";
}

export interface LessonResource {
  label: string;
  kind: "pdf" | "link" | "sheet";
}

export interface Lesson {
  id: string;
  tenantId: string;
  courseId: string;
  slug: string;
  position: number;
  title: string;
  summary: string;
  description: string;
  durationMinutes: number;
  /** VdoCipher video id. Never sent to the browser; only used server-side to mint playback OTPs. */
  videoId: string | null;
  resources: LessonResource[];
}

export type LessonState = "done" | "open" | "locked";

export interface Assignment {
  id: string;
  tenantId: string;
  courseId: string;
  lessonId: string | null;
  title: string;
  prompt: string;
  dueAt: string | null;
}

export interface Submission {
  id: string;
  tenantId: string;
  assignmentId: string;
  userId: string;
  status: "submitted" | "approved" | "revision";
  submittedAt: string;
  feedback: string | null;
}

export interface Announcement {
  id: string;
  tenantId: string;
  title: string;
  body: string;
  publishedAt: string;
  pinned: boolean;
}

/** A bookable 1-1 slot on the mentor's calendar. */
export interface BookingSlot {
  id: string;
  tenantId: string;
  /** ISO datetime, UTC. */
  startsAt: string;
  durationMinutes: number;
  format: string;
  spotsTotal: number;
  spotsTaken: number;
}

export interface JournalEntry {
  id: string;
  tenantId: string;
  userId: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}
