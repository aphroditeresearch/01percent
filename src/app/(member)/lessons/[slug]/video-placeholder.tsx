/**
 * Stand-in for the protected player. It deliberately looks unfinished so it
 * can't be mistaken for working video protection.
 */
export function VideoPlaceholder() {
  return (
    <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden bg-ink text-bg">
      <div className="space-y-3 px-6 text-center">
        <p className="label-caps text-bg/60">Protected video</p>
        <p className="heading-display text-3xl sm:text-4xl">Player not connected</p>
        <p className="mx-auto max-w-md text-sm text-bg/60">
          Sample lesson. The VdoCipher DRM player, with a per-member watermark, is added in Phase 3.
        </p>
      </div>
    </div>
  );
}
