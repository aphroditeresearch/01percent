"use client";

import { NotYet, buttonStyles } from "@/components/ui/primitives";

/** Demo form. Phase 2 wires this to a server action that writes journal_entries. */
export function JournalComposer() {
  return (
    <form className="space-y-4 border border-line bg-surface p-6" onSubmit={(e) => e.preventDefault()}>
      <label className="block space-y-2">
        <span className="label-caps text-muted">Title</span>
        <input
          name="title"
          maxLength={120}
          className="w-full border border-line bg-bg px-4 py-3 focus:border-ink focus:outline-none"
        />
      </label>
      <label className="block space-y-2">
        <span className="label-caps text-muted">Entry</span>
        <textarea
          name="body"
          rows={5}
          maxLength={10000}
          className="w-full resize-y border border-line bg-bg px-4 py-3 focus:border-ink focus:outline-none"
        />
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled className={buttonStyles.primary}>
          Save entry
        </button>
        <NotYet>Saving arrives with the database in Phase 2.</NotYet>
      </div>
    </form>
  );
}
