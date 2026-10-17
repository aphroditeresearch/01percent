import { cn } from "@/lib/cn";
import s from "./youtube-box.module.css";

/**
 * Framed, cropped, looping YouTube embed for the split-login's left panel
 * (see `cinematic-login.tsx`'s `SplitPanels`). Muted/no-controls/no-audio —
 * purely decorative, same spirit as `ambient-video.tsx` but for a YouTube
 * source instead of a file in /public. No client JS needed: a plain iframe
 * with the right player params autoplays muted and loops a single video.
 *
 * The source clip is landscape; the box is a portrait frame, so the iframe
 * is oversized and centred inside an `overflow: hidden` parent to crop it
 * like `object-fit: cover` would for a plain <video> (see .splitMediaFrame
 * in cinematic.module.css, which sizes this component from the outside via
 * `className`).
 *
 * A transparent guard pane sits on top of the iframe (see
 * youtube-box.module.css) so the browser's own native hover media controls
 * — which some browsers draw over an embedded <video> regardless of the
 * embed's `controls=0` param — never get a chance to appear: the pane
 * intercepts the hover before it reaches the iframe at all.
 */
export function YouTubeBox({ youtubeId, className }: { youtubeId: string; className?: string }) {
  const src =
    `https://www.youtube-nocookie.com/embed/${youtubeId}` +
    `?autoplay=1&mute=1&loop=1&playlist=${youtubeId}` +
    `&controls=0&disablekb=1&fs=0&modestbranding=1&playsinline=1&rel=0&iv_load_policy=3`;

  return (
    <div className={cn(s.wrap, className)} aria-hidden>
      <iframe
        className={s.iframe}
        src={src}
        title=""
        tabIndex={-1}
        allow="autoplay; encrypted-media"
        frameBorder={0}
      />
      <div className={s.guard} />
    </div>
  );
}
