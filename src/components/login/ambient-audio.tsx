"use client";

import { useEffect, useRef, useState } from "react";
import s from "./cinematic.module.css";

interface YTPlayer {
  playVideo(): void;
  mute(): void;
  unMute(): void;
  destroy(): void;
}

interface YTPlayerReadyEvent {
  target: YTPlayer;
}

interface YTPlayerOptions {
  videoId: string;
  playerVars?: {
    start?: number;
    autoplay?: 0 | 1;
    controls?: 0 | 1;
    disablekb?: 0 | 1;
    fs?: 0 | 1;
    modestbranding?: 0 | 1;
    playsinline?: 0 | 1;
    rel?: 0 | 1;
  };
  events?: {
    onReady?: (event: YTPlayerReadyEvent) => void;
  };
}

declare global {
  interface Window {
    YT?: { Player: new (elementId: HTMLElement, options: YTPlayerOptions) => YTPlayer };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<void> | null = null;

function loadYouTubeApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve();
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return apiPromise;
}

/**
 * Plays a YouTube clip as muted-by-default ambient audio once this element
 * scrolls into view (the sign-in panel), via the official IFrame Player API
 * — no video is downloaded or shown. Starts muted because browsers block
 * audible autoplay without a gesture; the toggle below unmutes on click.
 */
export function AmbientAudio({ youtubeId, startSeconds = 0 }: { youtubeId: string; startSeconds?: number }) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [visible, setVisible] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    loadYouTubeApi().then(() => {
      if (cancelled || !window.YT) return;
      playerRef.current = new window.YT.Player(host, {
        videoId: youtubeId,
        playerVars: {
          start: startSeconds,
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: (event) => {
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
  }, [visible, youtubeId, startSeconds]);

  const toggleSound = () => {
    const player = playerRef.current;
    if (!player) return;
    if (muted) {
      player.unMute();
    } else {
      player.mute();
    }
    setMuted(!muted);
  };

  return (
    <div ref={sentinelRef}>
      <div ref={hostRef} style={{ display: "none" }} aria-hidden />
      {visible && (
        <button type="button" className={s.soundToggle} onClick={toggleSound}>
          {muted ? "Enable sound" : "Mute sound"}
        </button>
      )}
    </div>
  );
}
