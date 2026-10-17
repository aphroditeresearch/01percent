"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import s from "./intro-video-gate.module.css";

export interface IntroVideoGateProps {
  src: string;
  poster?: string;
  /**
   * Brand word that fades in under the video's eye-line partway through
   * playback, e.g. the tenant's cinematic `heroWord` or wordmark. Omit to
   * skip the text entirely and just run the video + slash transition.
   */
  brandWord?: string;
}

type Phase = "playing" | "slashing" | "done";

/** How long the shard-slide transition runs, ms — must match the `.shard` transition duration in the CSS module. */
const SLASH_MS = 620;
/** Absolute fallback so a visitor is never trapped behind a black screen if metadata/timeupdate never fire. */
const SAFETY_MS = 8000;

/**
 * Full-screen black intro: a muted, autoplaying video sits centred (zoomed
 * to fill the screen — see the CSS module) on black. Partway through, the
 * brand word fades in under the eye-line; at the halfway point of the clip's
 * own duration (rather than waiting for the whole thing to play out — the
 * "shorten it in half" ask, done in playback logic since there's no video
 * encoder available in this environment to actually re-cut the file) a
 * diagonal "sword slash" tears the screen into two shards that fly apart,
 * revealing the sign-in screen underneath. Opt in per tenant via
 * `tenant.introVideo` (see config/tenants/types.ts) — tenants that omit it
 * never render this component and the login behaves exactly as it did
 * before this file existed.
 */
export function IntroVideoGate({ src, poster, brandWord }: IntroVideoGateProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<Phase>("playing");
  const [showBrand, setShowBrand] = useState(false);
  const halfRef = useRef<number | null>(null);
  const cutFiredRef = useRef(false);
  const [skip] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const triggerCut = () => {
    if (cutFiredRef.current) return;
    cutFiredRef.current = true;
    videoRef.current?.pause();
    setPhase((p) => (p === "playing" ? "slashing" : p));
  };

  useEffect(() => {
    if (skip) return;
    const maxWait = window.setTimeout(triggerCut, SAFETY_MS);
    return () => window.clearTimeout(maxWait);
  }, [skip]);

  // Once the slash starts, give the shards time to finish sliding before
  // unmounting the whole overlay.
  useEffect(() => {
    if (phase !== "slashing") return;
    const t = window.setTimeout(() => setPhase("done"), SLASH_MS + 30);
    return () => window.clearTimeout(t);
  }, [phase]);

  if (skip || phase === "done") return null;

  return (
    <div className={s.overlay} data-fading={phase === "slashing" ? "true" : "false"} aria-hidden>
      <video
        ref={videoRef}
        className={s.video}
        src={src}
        poster={poster}
        autoPlay
        muted
        playsInline
        onLoadedMetadata={(e) => {
          const { duration } = e.currentTarget;
          if (Number.isFinite(duration) && duration > 0) halfRef.current = duration / 2;
        }}
        onTimeUpdate={(e) => {
          const half = halfRef.current;
          if (half == null) return;
          const t = e.currentTarget.currentTime;
          if (!showBrand && t >= half * 0.55) setShowBrand(true);
          if (t >= half) triggerCut();
        }}
        onEnded={triggerCut}
        onError={triggerCut}
      />

      {brandWord && (
        <span className={s.brand} data-visible={showBrand ? "true" : "false"}>
          {brandWord}
        </span>
      )}

      {/* Always mounted (not conditional on phase) so the shard opacity flips
          instantly while the transform still animates — see the CSS module. */}
      <div className={s.blade} />
      <div className={cn(s.shard, s.shardTop)} />
      <div className={cn(s.shard, s.shardBottom)} />
    </div>
  );
}
