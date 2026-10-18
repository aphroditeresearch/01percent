# public/assets

Shared static assets served at `/assets/...`. Anything placed in this folder
is reachable at that exact path on the live site — Next.js serves everything
under `public/` from the site root, unchanged.

## 1% login background clip

The "1%" tenant's split login (`src/config/tenants/onepercent.ts`,
`login.split.media.src`) is already wired to:

```
/assets/hero-bg.mp4
```

To make it appear, add a properly licensed (royalty-free / commercially
licensed) video file at:

```
public/assets/hero-bg.mp4
```

That's the only step — no code changes needed. The component
(`src/components/login/cinematic-login.tsx` → `SplitPanels`) already
references that exact path, muted/looped/autoplaying inside the framed
card on the left of the login screen. Until a file exists there, the
`<video>` element 404s quietly and the frame just renders empty over the
page's ambient background — everything else (build, typecheck, lint,
tests) is unaffected either way.

A few notes on the clip itself:
- Landscape-ish aspect ratio reads best — the frame crops to roughly 16:11.
- Keep it short and seamlessly loopable (a few seconds), since it autoplays
  on a continuous loop behind the hero word.
- Must be properly licensed for commercial use (royalty-free stock, or a
  clip you own/commissioned) — not sourced from anime-wallpaper sites or
  similar fan content, which carries copyright that this project can't
  legally display regardless of filename or non-affiliation disclaimers.
