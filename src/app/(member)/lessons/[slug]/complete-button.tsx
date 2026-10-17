"use client";

import { useState } from "react";
import { NotYet, buttonStyles } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";

/**
 * Demo only: toggles local state so the interaction can be reviewed.
 * Phase 2 replaces this with a server action that writes lesson_progress.
 */
export function CompleteButton({ initiallyDone }: { initiallyDone: boolean }) {
  const [done, setDone] = useState(initiallyDone);
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setDone((d) => !d)}
        aria-pressed={done}
        className={cn("w-full", done ? buttonStyles.outline : buttonStyles.primary)}
      >
        {done ? "✓ Completed" : "Mark as complete"}
      </button>
      <NotYet>Demo: progress isn&rsquo;t saved yet.</NotYet>
    </div>
  );
}
