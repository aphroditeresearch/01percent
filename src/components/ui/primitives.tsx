import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { LessonState } from "@/lib/domain";

/** Small uppercase label with the accent square, e.g. "■ CONTINUE — CORE". */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("label-caps flex items-center gap-3 text-muted", className)}>
      <span aria-hidden className="size-1.5 shrink-0 bg-accent" />
      {children}
    </p>
  );
}

export function PageTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h1 className={cn("heading-display text-5xl text-ink sm:text-6xl", className)}>{children}</h1>
  );
}

/** A labelled row in a ruled list, like the dashboard summary. */
export function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 border-t border-line py-6 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
      <dt className="label-caps text-muted sm:pt-1">{label}</dt>
      <dd className="text-ink sm:text-right">{children}</dd>
    </div>
  );
}

const stateStyles: Record<LessonState, string> = {
  done: "text-success",
  open: "text-ink",
  locked: "text-muted/70",
};

const stateText: Record<LessonState, string> = { done: "Done", open: "Open", locked: "Locked" };

export function LessonStatus({ state }: { state: LessonState }) {
  return <span className={cn("label-caps font-semibold", stateStyles[state])}>{stateText[state]}</span>;
}

/** Bordered status pill, e.g. APPROVED. */
export function Pill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "accent";
}) {
  const tones = {
    neutral: "border-line text-muted",
    success: "border-success text-success",
    accent: "border-accent text-accent",
  };
  return (
    <span className={cn("label-caps inline-block border px-3 py-1.5 text-[0.65rem]", tones[tone])}>
      {children}
    </span>
  );
}

const buttonBase =
  "label-caps inline-flex items-center justify-center gap-3 px-6 py-4 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";

export const buttonStyles = {
  primary: cn(buttonBase, "bg-ink text-bg hover:bg-ink/85"),
  outline: cn(buttonBase, "border border-line text-ink hover:border-ink"),
  ghost: cn(buttonBase, "px-0 py-2 text-muted hover:text-ink"),
};

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: keyof typeof buttonStyles }) {
  return <Link className={cn(buttonStyles[variant], className)} {...props} />;
}

/** Short visible note that a control is not wired up yet. */
export function NotYet({ children }: { children: ReactNode }) {
  return <p className="text-xs text-muted">{children}</p>;
}
