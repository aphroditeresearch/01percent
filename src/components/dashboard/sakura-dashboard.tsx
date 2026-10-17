import type { CSSProperties } from "react";
import Link from "next/link";
import type { TenantConfig } from "@/config/tenants";
import type { CourseWithLessons } from "@/server/data";
import type { LessonState } from "@/lib/domain";
import { Eyebrow, Pill } from "@/components/ui/primitives";
import { sakuraPetals } from "@/lib/petals";
import { isHexColor } from "@/lib/theme";
import s from "./sakura-dashboard.module.css";

const PETALS = sakuraPetals();

interface ResumeLesson {
  slug: string;
  title: string;
  summary: string;
  state: LessonState;
  course: { title: string; position: number };
}

export interface SakuraDashboardProps {
  tenant: TenantConfig;
  firstName: string;
  resume: ResumeLesson | null;
  progress: { done: number; total: number; percent: number };
  streakDays: number;
  modules: CourseWithLessons[];
}

/** Falling petals + soft blossom glows. Decorative, seeded so markup is identical every render. */
function PetalField({ color }: { color: string }) {
  const vars = { "--petal": color } as CSSProperties;
  return (
    <div className={s.petalField} aria-hidden>
      <div className={s.glow} style={{ ...vars, top: "-12%", right: "-6%", width: 420, height: 420 }} />
      <div className={s.glow} style={{ ...vars, bottom: "-10%", left: "-8%", width: 320, height: 320 }} />
      {PETALS.map((p, i) => (
        <span
          key={i}
          className={s.petal}
          style={
            {
              "--petal": color,
              "--left": `${p.left}%`,
              "--size": `${p.size}px`,
              "--duration": `${p.duration}s`,
              "--delay": `${p.delay}s`,
              "--drift": `${p.drift}px`,
              "--rotate": `${p.rotate}deg`,
              "--opacity": p.opacity,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/**
 * Sakura-style member home page. Opt in per tenant via
 * `home: { style: "sakura" }` (see tempo.ts) — the default dashboard
 * (page.tsx) is unchanged for every other tenant.
 */
export function SakuraDashboard({ tenant, firstName, resume, progress, streakDays, modules }: SakuraDashboardProps) {
  const home = tenant.home;
  const petalColor =
    home?.style === "sakura" && home.petalColor && isHexColor(home.petalColor)
      ? home.petalColor
      : tenant.theme.accent;
  const modulesComplete = modules.filter((m) => m.lessons.length > 0 && m.doneCount === m.lessons.length).length;

  return (
    <div className="relative isolate overflow-hidden">
      <PetalField color={petalColor} />

      <div className="relative space-y-14">
        <section className="space-y-5">
          <Eyebrow>Welcome back, {firstName}</Eyebrow>
          <h1 className="heading-display text-5xl text-ink sm:text-6xl">
            {resume ? resume.title : "You’re all caught up"}
          </h1>
          {resume && <p className="max-w-xl text-muted">{resume.summary}</p>}
        </section>

        <section aria-label="Your progress" className="grid gap-px border border-line bg-line sm:grid-cols-3">
          <div className="space-y-4 bg-bg p-6">
            <p className="text-5xl font-bold tabular-nums text-ink">
              {progress.percent}
              <span className="text-accent">%</span>
            </p>
            <p className="label-caps text-muted">of the course finished</p>
            <div className="h-1.5 w-full bg-line">
              <div className="h-full bg-accent" style={{ width: `${progress.percent}%` }} />
            </div>
          </div>
          <div className="space-y-2 bg-bg p-6">
            <p className="text-5xl font-bold tabular-nums text-ink">
              {progress.done}
              <span className="text-xl text-muted">/{progress.total}</span>
            </p>
            <p className="label-caps text-muted">Lessons finished</p>
          </div>
          <div className="space-y-2 bg-bg p-6">
            <p className="text-5xl font-bold tabular-nums text-ink">
              {modulesComplete}
              <span className="text-xl text-muted">/{modules.length}</span>
            </p>
            <p className="label-caps text-muted">Modules complete</p>
          </div>
        </section>

        <section className="flex flex-col gap-4 border border-line bg-surface px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span aria-hidden className="text-2xl">
              🌸
            </span>
            <div>
              <p className="text-2xl font-bold tabular-nums text-ink">
                {streakDays} day{streakDays === 1 ? "" : "s"}
              </p>
              <p className="text-sm text-muted">Keep it going — come back tomorrow.</p>
            </div>
          </div>

          {resume && (
            <Link
              href={`/lessons/${resume.slug}`}
              className="group flex items-center justify-between gap-4 bg-ink px-6 py-4 text-bg transition-colors hover:bg-ink/85"
            >
              <span className="flex flex-col items-start">
                <span className="label-caps text-bg/60">Next up · Module {resume.course.position}</span>
                <span className="font-semibold">{resume.title}</span>
              </span>
              <span className="label-caps shrink-0">Continue</span>
            </Link>
          )}
        </section>

        <section className="space-y-6">
          <Eyebrow>Modules</Eyebrow>
          <div className="space-y-px border border-line bg-line">
            {modules.map((m) => {
              const pct = m.lessons.length === 0 ? 0 : Math.round((m.doneCount / m.lessons.length) * 100);
              const complete = m.lessons.length > 0 && m.doneCount === m.lessons.length;
              return (
                <div key={m.id} className="space-y-3 bg-bg p-5">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-medium text-ink">{m.title}</p>
                    {complete ? (
                      <Pill tone="accent">Complete</Pill>
                    ) : (
                      <span className="label-caps tabular-nums text-muted">
                        {m.doneCount}/{m.lessons.length}
                      </span>
                    )}
                  </div>
                  <div className="h-1 w-full bg-line">
                    <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
