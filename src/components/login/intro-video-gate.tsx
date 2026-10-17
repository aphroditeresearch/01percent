"use client";

import { useEffect, useRef, useState } from "react";
import s from "./intro-video-gate.module.css";

export interface IntroVideoGateProps {
  src: string;
  poster?: string;
}

/**
 * Full-screen black intro: a muted, autoplaying video sits centred (not
 * cropped — letterboxed) on black, then the whole thing cross-fades away
 * once the clip ends, revealing the sign-in screen underneath. Opt in per
 * tenant via `tenant.introVideo` (see config/tenants/types.ts) — tenants
 * that omit it never render this component and the login behaves exactly
 * as it did before this file existed.
 *
 * The only client JS this adds: listening for the video's `ended` event and
 * flipping a CSS opacity transition. Everything else (layout, the fade
 * itself) is plain CSS, same "minimal client JS" convention as
 * ambient-audio.tsx.
 */
export function IntroVideoGate({ src, poster }: IntroVideoGateProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fading, setFading] = useState(false);
  const [done, setDone] = useState(false);
  const [skip] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    if (skip) return;
    // Safety net: never trap a visitor behind a black screen — if playback
    // stalls, is blocked, or `ended` never fires, fade out anyway.
    const maxWait = window.setTimeout(() => setFading(true), 15000);
    return () => window.clearTimeout(maxWait);
  }, [skip]);

  if (skip || done) return null;

  return (
    <div
      className={s.overlay}
      data-fading={fading ? "true" : "false"}
      aria-hidden
      onTransitionEnd={(e) => {
        if (e.propertyName === "opacity" && fading) setDone(true);
      }}
    >
      <video
        ref={videoRef}
        className={s.video}
        src={src}
        poster={poster}
        autoPlay
        muted
        playsInline
        onEnded={() => setFading(true)}
        onError={() => setFading(true)}
      />
    </div>
  );
}
