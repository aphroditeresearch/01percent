/** Shown on every page until real authentication and a database exist. */
export function DemoBanner() {
  return (
    <div role="note" className="bg-ink px-4 py-2 text-center text-xs text-bg">
      <strong className="font-semibold">Demo mode.</strong> Sample data, no real sign-in. Nothing you
      do here is saved.
    </div>
  );
}
