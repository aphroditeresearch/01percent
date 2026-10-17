# Roadmap

## ✅ Phase 0 — Foundation and visual shell (done, 12 Oct 2026)

- Next.js 16 + React 19 + TypeScript + Tailwind v4 project; Node 22 LTS installed at `~/.local/node`.
- Tenant config system (`src/config/tenants`), with two fictional sample tenants: Meridian
  (trading) and Northform (fitness, homework disabled).
- Host → tenant resolution; unknown hosts 404. Theme → CSS variables; tokenised design system.
- Feature flags drive nav and 404 disabled routes.
- Pages: login (demo), dashboard, library (course tabs, search, done/open/locked), lesson
  (placeholder player, server-side lock check, resources, prev/next, demo complete button),
  journal, homework, account.
- Data access layer over clearly labelled sample data. A demo banner on every member page.
- 15 unit tests (tenant resolution, locking, theme validation, nav gating). Typecheck, lint and
  build pass.
- Docs: architecture, database, security, integrations, product spec, business model.

## ✅ Phase 0b — Second visual direction (13 Oct 2026)

- A per-tenant `login.style` setting, with a new **cinematic** login inspired by the structure
  of a reference site (intro line burst, ambient video, halftone, streaks, framed hero,
  staggered entrance). It is original code with no third-party assets, and the line values come
  from a seeded generator (`src/lib/burst.ts`, tested).
- A third sample tenant, **Tempo**: dark theme, Archivo Wide + IBM Plex Sans, and the cinematic
  login.
- Fixes: `typecheck` regenerates Next route types first; CSS Modules are excluded from the
  Tailwind loader.
- ⚠️ This project lives on an iCloud-synced Desktop, which created conflicting " 2" copies of
  build files. Move it to a non-synced folder (e.g. `~/Projects`) before Phase 1.

## ✅ Phase 0c — Cinematic login polish (17 Oct 2026)

- Tempo reworked into the first real personal-brand execution ("Japan"): bespoke hero/kana
  treatment, sakura ambient video, extruded sticker-style wordmark.
- The intro is retimed via two CSS custom properties on `.root` (`--hold-end`,
  `--cut-duration`) instead of scattered literals, so pacing is a one-line change per tenant.
  Title, subtitle and the radiating lines now dissolve out together, synced to the shutter cut,
  instead of fading early or abruptly.
- Two small opt-in client components — the only client JS in this login style — layer on top of
  the still-CSS-only intro: a two-video crossfade mask that hides the ambient clip's loop seam,
  and an ambient-audio helper (official YouTube IFrame API, muted until a user gesture,
  config-driven per tenant).
- Fixed the member area being reachable without ever seeing the login screen: `/` previously
  rendered the dashboard unconditionally. A demo-only cookie gate (`src/server/demo-session.ts`,
  server actions in `src/app/login/actions.ts`) now redirects to `/login` until "Continue with
  Discord" is clicked, and "Log out" actually clears it. Not real auth — flagged as such in code,
  same as the rest of the demo session.
- Fixed lag/motion-blur on the cinematic login: the sign-in panel used
  `backdrop-filter: blur(14px)` over the playing ambient video, re-blurring it every frame — now a
  solid-ish background instead. The ambient clip also played as two simultaneous full-resolution
  copies crossfaded to mask its loop seam; replaced with a single `<video loop>`
  (`ambient-video.tsx`, no client JS), trading a slightly visible loop cut for materially less
  decode cost and no double-exposure ghosting during playback.
- Retimed and punched up the intro: `--hold-end`/`--cut-duration` shortened (3.8s/0.55s →
  2.3s/0.4s) so the cut into the site arrives sooner, and added a short CSS camera-shake keyframe
  on the burst (`.intro`, skipped under reduced motion, same as the rest of the intro).
- New opt-in member-area shell: `memberLayout: "sidebar"` on a tenant (set for Tempo) swaps the
  top nav/footer for a left-rail shell (`sidebar-shell.tsx` — wordmark, vertical nav, sign-out,
  a soft accent-coloured glow) instead of `SiteHeader`/`SiteFooter`. Default (`"header"`, or
  unset) is unchanged for Meridian/Northform. Fixed the Account page's "Log out" button, which
  was a plain link and never actually cleared the demo-session cookie.
- Tempo's sample content was renamed from finished-looking trading copy to plainly-generic
  placeholders ("Lecture 01", "Recap 01", "Placeholder lecture — real content goes here.", etc.)
  across lessons, courses, the one assignment/submission, and the one announcement, so the demo
  reads as a shell waiting for real content rather than a second finished course.
- Removed Tempo's ambient audio (the YouTube-sourced background track on the cinematic login) by
  dropping its `ambientAudio` config. The `AmbientAudio` component and its `login.ambientAudio`
  config type stay in place, unused, in case a tenant wants it switched back on later.

## ▶ Phase 1 — Source control and first deploy (next)

1. Create a private GitHub repo and push. Set up branch protection on `main`.
2. Create a Vercel project from the repo. Every PR gets a preview URL.
3. Add CI (GitHub Actions running `npm run check`).
4. Show the deployed shell to a prospective pilot mentor and collect design feedback.

## Phase 2 — Real data and authentication

Supabase dev + staging projects, SQL migrations for core tables with RLS, Supabase Auth (magic
link + Discord), invitations, memberships and roles, real progress, journal CRUD, homework text
submissions, announcements (read), sign-out action, input validation, cross-tenant isolation
test suite. Remove the demo banner only once all of this is real.

## Phase 3 — Protected video

VdoCipher account (trial), encrypted per-tenant secret storage, `/api/playback` with full checks,
player component with loading, expired and error states, watermark, audit events, security
headers / CSP, and the unauthorised / expired / cross-tenant tests.

## Phase 4 — Mentor admin

`/admin` area gated by mentor role: courses and lessons (create, edit, reorder, publish, archive,
VdoCipher id field), resources, member invites and access, homework review with feedback,
announcements, branding within allowed fields, progress overview. Homework file uploads.

## Phase 5 — Discord

Shared bot, guild install flow, account linking, tier → role mapping, job queue with retries,
nightly reconcile, integration status page.

## Phase 6 — Second tenant and domains

Move tenant config to the database. Wildcard subdomains on the platform domain, custom domain
onboarding (Vercel domains API), and a tenant setup checklist. Launch client #2 with **no new
application code**. This is the real test of the architecture.

## Phase 7 — Payments

Stripe (likely Connect), tiers and prices, webhook-driven entitlements, grace periods,
cancellations, manual overrides with audit, and Discord sync from entitlements.

## Open decisions

| Decision | Recommendation | Needed by |
| --- | --- | --- |
| Platform domain name | Pick a neutral brand, so tenants get `client.yourplatform.com` | Phase 1 |
| Client-owned vs platform VdoCipher account | Client-owned | Phase 3 |
| Can mentors read student journals? | No by default; optional "share with mentor" later | Phase 2 |
| Stripe Connect vs. mentor's own Stripe | Connect (needs legal/accounting check) | Phase 7 |
