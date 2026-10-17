import "server-only";

/**
 * ⚠️ SAMPLE DATA — FICTIONAL, FOR THE VISUAL SHELL ONLY.
 *
 * Brands, people, lessons and announcements here are invented. This file is
 * replaced by Supabase queries in Phase 2. Nothing reads or writes a real
 * database yet, and nothing here is saved.
 */

import type {
  Announcement,
  Assignment,
  BookingSlot,
  Course,
  JournalEntry,
  Lesson,
  LessonResource,
  Submission,
  Viewer,
} from "@/lib/domain";

const M = "tnt_meridian";
const N = "tnt_northform";
const T = "tnt_tempo";
const O = "tnt_onepercent";

export const sampleViewers: Viewer[] = [
  {
    id: "usr_demo_m",
    tenantId: M,
    name: "Alex Rivera",
    email: "alex@example.com",
    role: "student",
    tierName: "Core Mentorship",
    accessStatus: "active",
    memberSince: "2026-06-02",
  },
  {
    id: "usr_demo_n",
    tenantId: N,
    name: "Sam Okafor",
    email: "sam@example.com",
    role: "student",
    tierName: "12-Week Programme",
    accessStatus: "active",
    memberSince: "2026-08-19",
  },
  {
    id: "usr_demo_t",
    tenantId: T,
    name: "Jordan Park",
    email: "jordan@example.com",
    role: "student",
    tierName: "Inner Circle",
    accessStatus: "active",
    memberSince: "2026-09-01",
  },
  {
    id: "usr_demo_o",
    tenantId: O,
    name: "Taylor Chen",
    email: "taylor@example.com",
    role: "student",
    tierName: "Inner Circle",
    accessStatus: "active",
    memberSince: "2026-09-01",
  },
];

export const sampleCourses: Course[] = [
  {
    id: "crs_m_core",
    tenantId: M,
    slug: "core",
    title: "Core Curriculum",
    description: "The full method, in order.",
    position: 1,
    unlockMode: "sequential",
  },
  {
    id: "crs_m_reviews",
    tenantId: M,
    slug: "session-reviews",
    title: "Session Reviews",
    description: "Recorded walkthroughs of past sessions.",
    position: 2,
    unlockMode: "open",
  },
  {
    id: "crs_n_base",
    tenantId: N,
    slug: "base-phase",
    title: "Base Phase",
    description: "Eight weeks of foundational strength.",
    position: 1,
    unlockMode: "sequential",
  },
  {
    id: "crs_n_mobility",
    tenantId: N,
    slug: "mobility",
    title: "Mobility Library",
    description: "Short follow-along routines.",
    position: 2,
    unlockMode: "open",
  },
  {
    id: "crs_t_core",
    tenantId: T,
    slug: "core",
    title: "Lectures",
    description: "Placeholder course — real content goes here.",
    position: 1,
    unlockMode: "sequential",
  },
  {
    id: "crs_t_recaps",
    tenantId: T,
    slug: "recaps",
    title: "Recaps",
    description: "Placeholder course — real content goes here.",
    position: 2,
    unlockMode: "open",
  },
  {
    id: "crs_o_c1",
    tenantId: O,
    slug: "c1",
    title: "C1 · The Basics",
    description: "Liquidity cycles, structure and timing — the model from the ground up.",
    position: 1,
    unlockMode: "sequential",
  },
  {
    id: "crs_o_c2",
    tenantId: O,
    slug: "c2",
    title: "C2 · The Awakened",
    description: "OTE, divergence and the Power of Three — where the edge sharpens.",
    position: 2,
    unlockMode: "sequential",
  },
  {
    id: "crs_o_c3",
    tenantId: O,
    slug: "c3",
    title: "C3 · The Ascended",
    description: "Higher-timeframe context: Power of Three, POC and the PD arrays that actually matter.",
    position: 3,
    unlockMode: "sequential",
  },
  {
    id: "crs_o_recaps",
    tenantId: O,
    slug: "recaps",
    title: "Session Recaps",
    description: "Recorded walkthroughs of live calls and session breakdowns.",
    position: 4,
    unlockMode: "open",
  },
];

const defaultResources: LessonResource[] = [
  { label: "Lesson notes", kind: "pdf" },
  { label: "Practice checklist", kind: "sheet" },
];

function lessonsFor(
  tenantId: string,
  courseId: string,
  prefix: string,
  rows: [title: string, summary: string, minutes: number][],
): Lesson[] {
  return rows.map(([title, summary, minutes], i) => ({
    id: `${prefix}_${String(i + 1).padStart(2, "0")}`,
    tenantId,
    courseId,
    slug: `${prefix}-${String(i + 1).padStart(2, "0")}-${title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")}`,
    position: i + 1,
    title,
    summary,
    description: `${summary} Work through the video, then complete the checklist before moving on. (Sample lesson text.)`,
    durationMinutes: minutes,
    videoId: null,
    resources: defaultResources,
  }));
}

export const sampleLessons: Lesson[] = [
  ...lessonsFor(M, "crs_m_core", "core", [
    ["How Price Really Moves", "Auction theory, and why most retail models miss it.", 42],
    ["Liquidity & Order Flow", "Where resting orders sit and why price seeks them.", 51],
    ["Market Structure", "Reading swings, breaks and shifts without bias.", 38],
    ["Sessions & Timing", "How Asia, London and New York shape the day.", 47],
    ["Entries & Correlated Pairs", "Timing entries, and how the dollar index leads EUR/USD.", 55],
    ["Masterclass I", "A full live session, annotated end to end.", 94],
    ["Higher-Timeframe Bias & News", "Building a daily bias and planning around releases.", 49],
    ["Index Futures Playbook", "Adapting the model to NQ and ES.", 44],
    ["Divergence & Re-entries", "Second chances and when to stop taking them.", 40],
    ["Managing the Trade", "Partials, stops and holding winners.", 36],
    ["Masterclass II", "A second live session, focused on management.", 88],
    ["Building Your Playbook", "Turning the method into a written plan.", 33],
  ]),
  ...lessonsFor(
    M,
    "crs_m_reviews",
    "review",
    Array.from({ length: 18 }, (_, i): [string, string, number] => [
      `Session Review ${String(i + 1).padStart(2, "0")}`,
      ["London open, EUR/USD", "New York open, NQ", "Asia range into London", "News day, GBP/USD"][i % 4] +
        " — what was planned and what happened.",
      18 + ((i * 7) % 20),
    ]),
  ),
  ...lessonsFor(N, "crs_n_base", "base", [
    ["Welcome & Assessment", "Baseline lifts and how we'll track them.", 22],
    ["Squat Pattern", "Bracing, depth and bar path.", 31],
    ["Hinge Pattern", "Deadlift set-up and common faults.", 29],
    ["Press & Pull", "Upper-body balance for the base phase.", 27],
    ["Conditioning Basics", "Low-impact engine work.", 24],
    ["Recovery & Sleep", "The part of training that happens off the floor.", 19],
    ["Progression Rules", "When to add weight and when to hold.", 21],
    ["Re-test Week", "Measuring what changed.", 18],
  ]),
  ...lessonsFor(N, "crs_n_mobility", "mob", [
    ["Hips — 10 minutes", "Daily hip routine.", 10],
    ["Thoracic Spine", "Rotation and extension.", 9],
    ["Ankles & Calves", "For deeper squats.", 8],
    ["Shoulders", "Overhead readiness.", 11],
    ["Full-body Flow", "A complete reset.", 15],
    ["Desk Reset", "Five minutes between meetings.", 5],
  ]),
  ...lessonsFor(
    T,
    "crs_t_core",
    "tempo",
    Array.from({ length: 6 }, (_, i): [string, string, number] => [
      `Lecture ${String(i + 1).padStart(2, "0")}`,
      "Placeholder lecture — real content goes here.",
      30 + ((i * 11) % 40),
    ]),
  ),
  ...lessonsFor(
    T,
    "crs_t_recaps",
    "recap",
    Array.from({ length: 8 }, (_, i): [string, string, number] => [
      `Recap ${String(i + 1).padStart(2, "0")}`,
      "Placeholder recap — real content goes here.",
      52 + ((i * 5) % 25),
    ]),
  ),
  ...lessonsFor(O, "crs_o_c1", "c1", [
    ["LIT Cycle", "Liquidity, Inducement, Target — the three-beat cycle every setup in this course builds from.", 38],
    ["SMT & POI", "Smart money divergence across correlated pairs, and how to mark the point of interest it points to.", 44],
    ["RBOS vs FBOS", "Telling a real break of structure from a fake one before size is ever on the line.", 36],
    ["Timing", "Why the same setup works at 9:30 and fails at 1pm — session windows and kill zones.", 31],
    ["Entries", "Turning LIT, SMT and structure into one repeatable entry model.", 49],
    ["Masterclass of C1", "A full live read tying every C1 lesson into one session, start to finish.", 92],
  ]),
  ...lessonsFor(O, "crs_o_c2", "c2", [
    ["OTE", "Optimal Trade Entry — the fib zone where the highest-quality entries cluster.", 33],
    ["Divergence", "Reading price-action divergence as an early sign a move is losing conviction.", 29],
    ["PO3 OHLC / OLHC", "Power of Three and its two shapes — accumulation, manipulation, distribution, both ways round.", 41],
    ["News", "Trading around high-impact releases without getting run over by the spread.", 35],
  ]),
  ...lessonsFor(O, "crs_o_c3", "c3", [
    ["Hourly PO3", "Zooming Power of Three down to the hourly range for same-day context.", 37],
    ["POC", "Point of Control — where volume concentrated, and why price tends to react there again.", 28],
    ["MSNR", "Reading a market structure shift against the nearest reaction level before you commit to it.", 34],
    ["HTF AMD", "Higher-timeframe accumulation, manipulation, distribution — building weekly and daily bias.", 46],
    ["SNR", "The support and resistance that actually matters: levels price has already reacted from.", 30],
    ["HTF PDA Levels", "Higher-timeframe PD arrays — the order blocks, fair value gaps and liquidity pools worth marking.", 43],
  ]),
  ...lessonsFor(
    O,
    "crs_o_recaps",
    "orecap",
    Array.from({ length: 8 }, (_, i): [string, string, number] => [
      `Session Recap ${String(i + 1).padStart(2, "0")}`,
      ["London open liquidity sweep", "New York open, NQ", "Asia range into London", "FOMC / news-day reaction"][i % 4] +
        " — what was planned and what happened.",
      20 + ((i * 6) % 22),
    ]),
  ),
];

/** Lesson ids each demo viewer has completed. */
export const sampleCompletions: Record<string, string[]> = {
  usr_demo_m: [
    "core_01", "core_02", "core_03", "core_04",
    ...Array.from({ length: 10 }, (_, i) => `review_${String(i + 1).padStart(2, "0")}`),
  ],
  usr_demo_n: ["base_01", "base_02", "base_03", "mob_01", "mob_02"],
  usr_demo_t: ["tempo_01", "tempo_02", "tempo_03", "recap_01", "recap_02"],
  usr_demo_o: ["c1_01", "c1_02", "c1_03", "orecap_01", "orecap_02"],
};

/** Most recently opened lessons, newest first. */
export const sampleRecent: Record<string, string[]> = {
  usr_demo_m: ["core_05", "review_10", "core_04"],
  usr_demo_n: ["base_04", "mob_02"],
  usr_demo_t: ["tempo_04", "recap_02", "tempo_03"],
  usr_demo_o: ["c1_04", "orecap_02", "c1_03"],
};

/** Consecutive days with at least one lesson opened, up to and including today. */
export const sampleStreaks: Record<string, number> = {
  usr_demo_m: 5,
  usr_demo_n: 2,
  usr_demo_t: 3,
  usr_demo_o: 4,
};

export const sampleAssignments: Assignment[] = [
  {
    id: "asg_t_1",
    tenantId: T,
    courseId: "crs_t_core",
    lessonId: "tempo_02",
    title: "Placeholder assignment",
    prompt: "Real assignment text goes here.",
    dueAt: null,
  },
  {
    id: "asg_o_1",
    tenantId: O,
    courseId: "crs_o_c1",
    lessonId: "c1_02",
    title: "Mark SMT divergence across three pairs",
    prompt:
      "Pull up three correlated pairs intraday and mark every SMT divergence you can find at a liquidity pool. Screenshot each with the POI labeled.",
    dueAt: null,
  },
  {
    id: "asg_o_2",
    tenantId: O,
    courseId: "crs_o_c1",
    lessonId: "c1_05",
    title: "Three entries from the LIT cycle",
    prompt:
      "Submit three hypothetical entries built from the full LIT cycle — liquidity taken, inducement, target — and explain each leg.",
    dueAt: "2026-10-24",
  },
  {
    id: "asg_m_1",
    tenantId: M,
    courseId: "crs_m_core",
    lessonId: "core_03",
    title: "Mark up one week of structure",
    prompt: "Annotate five days of EUR/USD on the 1H. Label every break and shift.",
    dueAt: null,
  },
  {
    id: "asg_m_2",
    tenantId: M,
    courseId: "crs_m_core",
    lessonId: "core_04",
    title: "Session timing log",
    prompt: "Record the high and low formation time for each session over ten days.",
    dueAt: null,
  },
  {
    id: "asg_m_3",
    tenantId: M,
    courseId: "crs_m_core",
    lessonId: "core_05",
    title: "Three entries with DXY context",
    prompt: "Submit three hypothetical entries and explain how DXY confirmed or contradicted each.",
    dueAt: "2026-10-20",
  },
];

export const sampleSubmissions: Submission[] = [
  {
    id: "sub_o_1",
    tenantId: O,
    assignmentId: "asg_o_1",
    userId: "usr_demo_o",
    status: "revision",
    submittedAt: "2026-10-08",
    feedback:
      "Good divergence marks on EURUSD and GBPUSD, but the DXY POI is late — mark it at the sweep, not after the move's already run.",
  },
  {
    id: "sub_t_1",
    tenantId: T,
    assignmentId: "asg_t_1",
    userId: "usr_demo_t",
    status: "revision",
    submittedAt: "2026-10-08",
    feedback: "Placeholder feedback — real feedback goes here.",
  },
  {
    id: "sub_1",
    tenantId: M,
    assignmentId: "asg_m_1",
    userId: "usr_demo_m",
    status: "approved",
    submittedAt: "2026-09-14",
    feedback: "Clean markup. Your shift labels are consistent.",
  },
  {
    id: "sub_2",
    tenantId: M,
    assignmentId: "asg_m_2",
    userId: "usr_demo_m",
    status: "approved",
    submittedAt: "2026-09-29",
    feedback: "Looks good.",
  },
];

export const sampleAnnouncements: Announcement[] = [
  {
    id: "ann_m_1",
    tenantId: M,
    title: "New session reviews uploaded",
    body: "Reviews 17 and 18 are now in the library.",
    publishedAt: "2026-10-10",
    pinned: true,
  },
  {
    id: "ann_m_2",
    tenantId: M,
    title: "Live Q&A moved to Thursday",
    body: "This week's call moves to Thursday, same time.",
    publishedAt: "2026-10-06",
    pinned: false,
  },
  {
    id: "ann_n_1",
    tenantId: N,
    title: "Re-test week dates",
    body: "Re-testing opens on the 27th. Book your slot in the community.",
    publishedAt: "2026-10-09",
    pinned: true,
  },
  {
    id: "ann_t_1",
    tenantId: T,
    title: "Placeholder announcement",
    body: "Real announcement text goes here.",
    publishedAt: "2026-10-11",
    pinned: true,
  },
  {
    id: "ann_o_1",
    tenantId: O,
    title: "C3 — The Ascended is live",
    body: "Hourly PO3 through HTF PDA Levels — all six lessons are in the library now.",
    publishedAt: "2026-10-11",
    pinned: true,
  },
];

/** Upcoming 1-1 slots on the mentor's calendar. Only onepercent has `booking` enabled today. */
export const sampleBookingSlots: BookingSlot[] = [
  {
    id: "bkg_o_1",
    tenantId: O,
    startsAt: "2026-10-20T14:00:00Z",
    durationMinutes: 30,
    format: "1-1 video call (Discord)",
    spotsTotal: 1,
    spotsTaken: 0,
  },
  {
    id: "bkg_o_2",
    tenantId: O,
    startsAt: "2026-10-21T18:30:00Z",
    durationMinutes: 30,
    format: "1-1 video call (Discord)",
    spotsTotal: 1,
    spotsTaken: 0,
  },
  {
    id: "bkg_o_3",
    tenantId: O,
    startsAt: "2026-10-22T14:00:00Z",
    durationMinutes: 45,
    format: "1-1 chart review (Discord)",
    spotsTotal: 1,
    spotsTaken: 1,
  },
  {
    id: "bkg_o_4",
    tenantId: O,
    startsAt: "2026-10-23T19:00:00Z",
    durationMinutes: 30,
    format: "1-1 video call (Discord)",
    spotsTotal: 1,
    spotsTaken: 0,
  },
  {
    id: "bkg_o_5",
    tenantId: O,
    startsAt: "2026-10-27T14:00:00Z",
    durationMinutes: 60,
    format: "Monthly deep-dive review",
    spotsTotal: 3,
    spotsTaken: 1,
  },
];

export const sampleJournal: JournalEntry[] = [
  {
    id: "jnl_1",
    tenantId: M,
    userId: "usr_demo_m",
    title: "Waited for the London sweep",
    body: "Bias was bearish from the daily. Waited for Asia high to be taken before looking for shorts. Didn't chase the first move.",
    createdAt: "2026-10-09T09:12:00Z",
    updatedAt: "2026-10-09T09:12:00Z",
  },
  {
    id: "jnl_2",
    tenantId: M,
    userId: "usr_demo_m",
    title: "Overtraded after a win",
    body: "Took a clean first trade, then forced two more with no setup. Rule for next week: one A+ setup, then I'm done.",
    createdAt: "2026-10-07T15:40:00Z",
    updatedAt: "2026-10-07T16:02:00Z",
  },
];
