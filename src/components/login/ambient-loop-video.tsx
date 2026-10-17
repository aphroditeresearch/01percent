"use client";

import { useEffect, useRef, useState } from "react";
import s from "./cinematic.module.css";

const FADE_WINDOW = 0.9;

function loopOpacity(currentTime: number, duration: number) {
  const distanceFromSeam = Math.min(currentTime, duration - currentTime);
  if (distanceFromSeam >= FADE_WINDOW) return 1;
  const t = Math.max(0, distanceFromSeam / FADE_WINDOW);
  return t * t * (3 - 2 * t); // smoothstep, gentler than a linear ramp
}

/**
 * Two offset copies of the same clip, each faded to 0 right as it hits its
 * own hard loop cut. The other copy (mid-playback at that moment) is
 * visible instead, so the cut itself is never shown. Not a real re-encode —
 * just a client-side mask, since this clip's own seam isn't cut cleanly.
 */
export function AmbientLoopVideo({ src, poster }: { src: string; poster?: string }) {
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const videoB = videoBRef.current;
    if (!videoB || !duration) return;
    videoB.currentTime = duration / 2;
    videoB.play().catch(() => {});
  }, [duration]);

  useEffect(() => {
    if (!duration) return;
    let frame: number;
    const tick = () => {
      const a = videoARef.current;
      const b = videoBRef.current;
      if (a && b) {
        a.style.opacity = String(loopOpacity(a.currentTime, duration));
        b.style.opacity = String(loopOpacity(b.currentTime, duration));
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration]);

  return (
    <div className={s.ambientVideo} aria-hidden>
      <video
        ref={videoARef}
        className={s.ambientVideoLayer}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />
      <video
        ref={videoBRef}
        className={s.ambientVideoLayer}
        src={src}
        muted
        loop
        playsInline
        style={{ opacity: 0 }}
      />
    </div>
  );
}
