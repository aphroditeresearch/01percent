import s from "./cinematic.module.css";

/**
 * Looping ambient background clip for the cinematic login. A single
 * `<video loop>` — the dual-copy crossfade mask this used to do (two
 * simultaneous full-resolution decodes) cost more than the hard loop cut it
 * was hiding was worth, and showed up as visible lag/ghosting during
 * playback. No client JS needed for a plain looping video.
 */
export function AmbientVideo({ src, poster }: { src: string; poster?: string }) {
  return (
    <div className={s.ambientVideo} aria-hidden>
      <video
        className={s.ambientVideoLayer}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
      />
    </div>
  );
}
