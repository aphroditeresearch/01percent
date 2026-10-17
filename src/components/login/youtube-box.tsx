"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { loadYouTubeApi, type YTPlayer } from "@/lib/youtube";
import s from "./youtube-box.module.css";

/**
 * Framed, cropped, looping YouTube clip for the split-login's left panel
 * (see `cinematic-login.tsx`'s `SplitPanels`). Muted/no-controls/no-audio —
 * purely decorative, same spirit as `ambient-video.tsx` but for a YouTube
 * source instead of a file in /public.
 *
 * Driven by the official IFrame Player API (same pattern as
 * `ambient-audio.tsx`) rather than a plain `<iframe src=...?autoplay=1>`.
 * That matters for two reasons, both aimed at the same "it still shows a
 * play/pause button over the video" complaint:
 *
 * 1. URL-param autoplay can get silently blocked by the browser, which
 *    leaves the player sitting on its paused thumbnail with YouTube's own
 *    big centre play button showing. Explicitly calling `playVideo()` once
 *    the player reports ready is the reliable way to actually start it.
 * 2. The API lets us rewrite the generated iframe's `allow` attribute down
 *    to just `autoplay` — dropping `picture-in-picture`/`encrypted-media`,
 *    which some browsers (Safari in particular) otherwise treat as a
 *    standing invitation to draw their own native hover media-remote
 *    overlay (play/pause/skip) on top of ANY playing <video>, even one
 *    inside a cross-origin iframe. No permission for that feature, no
 *    affordance offered for it.
 *
 * On top of that, a transparent guard pane (see youtube-box.module.css)
 * sits above the generated iframe so no mouse/hover event reaches its
 * document at the DOM level at all — belt and suspenders.
 *
 * The source clip is landscape; the box is a portrait frame, so the iframe
 * is oversized and centred inside an `overflow: hidden` parent to crop it
 * like `object-fit: cover` would for a plain <video> (see .splitMediaFrame
 * in cinematic.module.css, which sizes this component from the outside via
 * `className`).
 */
export function YouTubeBox({ youtubeId, className }: { youtubeId: string; className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;

    loadYouTubeApi().then(() => {
      if (cancelled || !window.YT) return;
      playerRef.current = new window.YT.Player(host, {
        videoId: youtubeId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          loop: 1,
          playlist: youtubeId,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          iv_load_policy: 3,
        },
        events: {
          onReady: (event) => {
            // The API replaces `host` with its own <iframe>, which does not
            // inherit `host`'s class — restyle it directly so it fills and
            // crops to the frame, and trim its permissions policy down to
            // exactly what muted background playback needs.
            const iframe = event.target.getIframe();
            iframe.className = s.iframe;
            iframe.tabIndex = -1;
            iframe.title = "";
            iframe.setAttribute("allow", "autoplay");
            event.target.mute();
            event.target.playVideo();
          },
        },
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
    };
  }, [youtubeId]);

  return (
    <div className={cn(s.wrap, className)} aria-hidden>
      <div ref={hostRef} />
      <div className={s.guard} />
    </div>
  );
}
