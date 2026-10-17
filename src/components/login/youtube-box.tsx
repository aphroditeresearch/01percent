/**
 * Framed, cropped, looping YouTube embed for the split-login's left panel
 * (see `cinematic-login.tsx`'s `SplitPanels`). Muted/no-controls/no-audio —
 * purely decorative, same spirit as `ambient-video.tsx` but for a YouTube
 * source instead of a file in /public. No client JS needed: a plain iframe
 * with the right player params autoplays muted and loops a single video.
 *
 * The source clip is landscape; the box is a portrait frame, so the iframe
 * is oversized and centred inside an `overflow: hidden` parent to crop it
 * like `object-fit: cover` would for a plain <video> (see .splitMedia /
 * .splitMediaFrame in cinematic.module.css).
 */
export function YouTubeBox({ youtubeId, className }: { youtubeId: string; className?: string }) {
  const src =
    `https://www.youtube-nocookie.com/embed/${youtubeId}` +
    `?autoplay=1&mute=1&loop=1&playlist=${youtubeId}` +
    `&controls=0&disablekb=1&fs=0&modestbranding=1&playsinline=1&rel=0&iv_load_policy=3`;

  return (
    <div className={className} aria-hidden>
      <iframe
        src={src}
        title=""
        tabIndex={-1}
        allow="autoplay; encrypted-media"
        frameBorder={0}
      />
    </div>
  );
}
