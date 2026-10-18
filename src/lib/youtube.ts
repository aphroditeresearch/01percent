/**
 * Shared loader for the official YouTube IFrame Player API, used by any
 * client component that needs programmatic control over an embedded clip
 * (ambient-audio.tsx, youtube-box.tsx) rather than a plain `<iframe src=...>`.
 *
 * Why this matters beyond the URL `autoplay=1` param: browsers can silently
 * block that style of autoplay (muted or not), which leaves the player
 * sitting on its paused thumbnail with YouTube's own big centre play button
 * visible — exactly the "it still shows a play/pause button" look a plain
 * iframe embed is prone to. Driving playback explicitly via `playVideo()`
 * once the player reports `onReady` is the reliable way to avoid that
 * fallback state.
 */

export interface YTPlayer {
  playVideo(): void;
  mute(): void;
  unMute(): void;
  destroy(): void;
  getIframe(): HTMLIFrameElement;
  /**
   * Deprecated by YouTube (manual quality selection has had no effect on
   * the embedded player's actual auto-quality algorithm since ~2015) but
   * harmless to call — see youtube-box.tsx's `width`/`height` comment for
   * the knob that still matters.
   */
  setPlaybackQuality?(quality: string): void;
}

export interface YTPlayerReadyEvent {
  target: YTPlayer;
}

export interface YTPlayerOptions {
  videoId: string;
  /**
   * Initial declared player size. YouTube's "auto" quality algorithm picks
   * the smallest available rendition that still covers the player's own
   * reported element size (bandwidth permitting) — leaving this unset
   * defaults to a tiny 640×390, which caps the stream at a correspondingly
   * low rendition no matter how large the iframe is then stretched via
   * CSS afterwards. Callers that scale the generated iframe up via CSS
   * (see youtube-box.tsx) should pass the actual on-screen size here too,
   * or quality negotiates against the wrong (much smaller) number.
   */
  width?: number;
  height?: number;
  playerVars?: {
    start?: number;
    autoplay?: 0 | 1;
    controls?: 0 | 1;
    disablekb?: 0 | 1;
    fs?: 0 | 1;
    loop?: 0 | 1;
    playlist?: string;
    modestbranding?: 0 | 1;
    playsinline?: 0 | 1;
    rel?: 0 | 1;
    iv_load_policy?: 1 | 3;
  };
  events?: {
    onReady?: (event: YTPlayerReadyEvent) => void;
    onStateChange?: (event: { data: number; target: YTPlayer }) => void;
  };
}

declare global {
  interface Window {
    YT?: { Player: new (elementId: HTMLElement, options: YTPlayerOptions) => YTPlayer };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<void> | null = null;

export function loadYouTubeApi(): Promise<void> {
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
