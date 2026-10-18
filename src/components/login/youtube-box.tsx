"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { loadYouTubeApi, type YTPlayer } from "@/lib/youtube";
import s from "./youtube-box.module.css";

// YouTube IFrame API player states we care about — see
// https://developers.google.com/youtube/iframe_api_reference#Playback_status
const YT_STATE_PLAYING = 1;
const YT_STATE_PAUSED = 2;
const YT_STATE_CUED = 5;

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
 * A third thing this guards against: even with `playVideo()` called
 * explicitly, autoplay can still get blocked (network conditions, browser
 * policy, an extension, whatever) — when that happens YouTube renders its
 * own static thumbnail with a big centre play button, which reads as
 * exactly the "stuck showing a play/pause button over a photo" bug this
 * was built to avoid. So the iframe stays at opacity 0, with YouTube's own
 * still thumbnail shown underneath instead, until `onStateChange` actually
 * reports PLAYING — only then does the real (controls-free, guarded)
 * video fade in. Worst case, the user sees a plain static photo with zero
 * chrome; best case, the looping clip. Either way, no play button.
 *
 * The source clip is landscape; the box is a portrait frame, so the iframe
 * is oversized and centred inside an `overflow: hidden` parent to crop it
 * like `object-fit: cover` would for a plain <video> (see .splitMediaFrame
 * in cinematic.module.css, which sizes this component from the outside via
 * `className`).
 *
 * Quality: the embedded player's "auto" algorithm picks a rendition sized
 * to whatever the player's DECLARED size is — which defaults to a tiny
 * 640×390 if left unset, capping the stream at a correspondingly blurry
 * rendition no matter how large .iframe's CSS then stretches it. Fixed by
 * passing the actual (oversized, DPR-scaled) on-screen size into the
 * Player constructor below, so a clip with a real 4K source has a shot at
 * actually streaming near 4K instead of being invisibly capped at 480p
 * then upscaled 3x by CSS on top of that.
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
      // Quality negotiates against the DECLARED player size, not whatever
      // size .iframe's CSS later stretches it to — see the width/height
      // doc on YTPlayerOptions. Measure `.wrap` (host's parent; host itself
      // is an empty, unsized div the API is about to replace) rather than
      // `host`, times 3 to match .iframe's 300% cover-crop oversize, times
      // devicePixelRatio so retina/4K screens actually request a 4K-ish
      // rendition instead of a 1x-css-pixel one. Capped at 4K either way —
      // no available YouTube rendition is sharper than that regardless of
      // how large this plays on screen.
      const box = host.parentElement?.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = Math.min(3840, Math.round((box?.width || window.innerWidth) * 3 * dpr));
      const height = Math.min(2160, Math.round((box?.height || window.innerHeight) * 3 * dpr));
      playerRef.current = new window.YT.Player(host, {
        width,
        height,
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
            // exactly what muted background playback needs. Starts at
            // opacity 0 (see .iframe) — .iframeVisible is added once
            // onStateChange actually confirms playback.
            const iframe = event.target.getIframe();
            iframe.className = s.iframe;
            iframe.tabIndex = -1;
            iframe.title = "";
            iframe.setAttribute("allow", "autoplay");
            event.target.mute();
            event.target.playVideo();
            // Officially a no-op on today's embedded player (YouTube's
            // auto-quality algorithm overrides it), but harmless, and the
            // real fix — the width/height passed into the Player
            // constructor above — is what actually moves the needle.
            event.target.setPlaybackQuality?.("hd2160");
          },
          onStateChange: (event) => {
            const iframe = event.target.getIframe();
            if (event.data === YT_STATE_PLAYING) {
              iframe.classList.add(s.iframeVisible);
            } else if (event.data === YT_STATE_PAUSED || event.data === YT_STATE_CUED) {
              // Autoplay didn't take the first time (or got paused) — nudge
              // it again rather than leaving YouTube's own paused-thumbnail
              // play button showing; the still-transparent iframe keeps that
              // hidden behind the poster below either way, but no reason
              // not to keep trying to actually get it moving.
              event.target.playVideo();
            }
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
      {/* YouTube's own static thumbnail, shown until real playback is
          confirmed — see the big comment above for why. */}
      <div
        className={s.poster}
        style={{ backgroundImage: `url(https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg)` }}
      />
      <div ref={hostRef} />
      <div className={s.guard} />
    </div>
  );
}
