# Architecture

## Summary

A **modular monolith**: one Next.js application, one database and one deployment serving every
tenant. Tenants differ by **configuration** (branding, theme, labels, enabled features,
integration settings), not by code. No microservices, and no separate codebase per client.

```
Browser ──► Vercel (Next.js 16, Node runtime)
              │  1. Host header → tenant            (src/server/tenant.ts)
              │  2. Session → user + membership     (Phase 2: Supabase Auth)
              │  3. Feature + permission checks     (requireFeature, data layer)
              │  4. Data access layer               (src/server/data)
              ▼
         Supabase Postgres (RLS on every table) · Supabase Storage (homework files)
              │
              ├── VdoCipher API   (server-side OTP for each playback; Phase 3)
              ├── Discord API     (role sync via one shared bot; Phase 5)
              └── Stripe          (webhooks → entitlements; Phase 7)
```

## Stack

| Concern | Choice | Why |
| --- | --- | --- |
| App framework | Next.js 16 (App Router), React 19, TypeScript | Server components keep secrets and data logic on the server by default. Well supported by AI tools. |
| Styling | Tailwind CSS v4 + CSS variables | Tenant themes are just CSS variables. No runtime CSS-in-JS. |
| Database | Supabase Postgres | Real Postgres with row-level security, plus Auth and Storage in one service. One project serves all tenants. |
| Auth | Supabase Auth (email magic link + Discord OAuth) | Discord is a built-in provider, so no separate auth vendor. |
| Video | VdoCipher | DRM (Widevine/FairPlay) with dynamic watermarking and a server-side OTP model. |
| Hosting | Vercel Pro | Built by the Next.js team. Wildcard subdomains and custom domains. Hobby forbids commercial use. |
| Tests | Vitest | Fast unit tests for security-critical pure logic. |

Deliberately **not** added yet: an ORM (Supabase client + SQL migrations are enough), a UI
component library (the design is simple and custom), a state library, analytics, or a separate
API server.

## Key decisions (ADRs)

**ADR-001 — Shared database, `tenant_id` on every row.** One Supabase project with a
`tenant_id` column, rather than a database per client. A project per client adds roughly
$10/month in compute each, plus migrations to run N times. Isolation is enforced twice:
server-side checks in the data layer and Postgres RLS policies (see SECURITY.md).

**ADR-002 — Tenant from the Host header only.** `resolveTenantFromHost` maps
`<slug>.<root-domain>` or a registered custom domain to a tenant. Unknown hosts return 404 and
never fall back. The browser never supplies a tenant id. In development, `localhost` maps to
`DEFAULT_TENANT_SLUG`. Production leaves it unset.

**ADR-003 — Tenant config in code now, database later.** `src/config/tenants/*.ts` uses the
same `TenantConfig` shape the `tenants` / `feature_settings` tables will hold. This is quick to
iterate on while there are 0–2 clients. It moves to the database in Phase 6 so onboarding needs
no deploy.

**ADR-004 — Next.js Cache Components disabled.** Next 16 can cache component output across
requests. Every page here is per-tenant and per-user, and one wrong `"use cache"` could serve
tenant A's content to tenant B. All routes render per request. We can revisit this for truly
public pages (marketing) later, with the tenant id in every cache key.

**ADR-005 — Data access layer is the only door.** Pages call `src/server/data/*` functions that
take the server-resolved `tenant` (and `viewer`). Phase 2 swaps sample data for Supabase queries
without changing pages. `server-only` imports make the build fail if this code is pulled into
the browser.

**ADR-006 — Feature flags gate routes and APIs as well as navigation.** `memberNav()` builds the
nav from `tenant.features`. `requireFeature()` returns 404 on pages, actions and APIs of disabled
modules.

**ADR-007 — Authentication ≠ entitlement.** Being signed in (Supabase Auth) only proves who
someone is. What they can access comes from `memberships` + `entitlements` rows. Phase 2 adds
these, and Phase 7 updates them from Stripe webhooks.

**ADR-008 — Fonts from a fixed set.** `next/font` must be declared at build time. Tenants choose
display fonts (`anton`, `fraunces`, `archivoWide` = Archivo at 125% width and weight 900) and body
fonts (`inter`, `plex` = IBM Plex Sans). Dela Gothic One is loaded for kana on the cinematic
login. Non-default fonts use `preload: false`, so a tenant only downloads what it uses. Adding a
font is a small code change.

**ADR-009 — Login styles are components, not forks.** `tenant.login.style` selects
`EditorialLogin` or `CinematicLogin` (`src/components/login/`). Big visual differences between
clients become a new *style option* that any tenant can choose, never a per-client code path.
The cinematic style uses a CSS Module for its keyframe-heavy styling. `next.config.ts` excludes
`*.module.css` from the Tailwind Turbopack loader, because otherwise module class names come
through empty.

## Request flow (target, Phase 2+)

1. `getTenant()` resolves the tenant from the host, or returns 404.
2. `getViewer(tenant)` reads the Supabase session cookie. With no session it redirects to `/login`.
   With a session but no membership for this tenant, the visitor gets an access-denied page.
3. The page calls `requireFeature(tenant, ...)` and data-layer functions.
4. Data-layer functions query Supabase with the **user's** session, so RLS applies, and also
   filter explicitly by `tenant.id`.
5. Server actions (mutations) repeat steps 1–3. They never trust ids from the form without
   re-checking ownership.

Sessions are per hostname. Each tenant domain has its own login cookie, which is the safest
default.

## Theming

`src/lib/theme.ts` turns `tenant.theme` into CSS variables (`--t-bg`, `--t-ink`, `--t-accent`, …)
on `<html>`. `globals.css` maps them to Tailwind tokens: `bg-bg`, `bg-surface`, `text-ink`,
`text-muted`, `border-line`, `bg-accent`, `text-success`, `font-display`. Shared components use
**only** these tokens. Colours must be strict `#rrggbb`, which blocks CSS injection once themes
come from the database.

Each theme also sets `colorScheme` (light or dark), so form controls and scrollbars match. Dark
tenants (Tempo) reuse every member page unchanged, because pages only use tokens.

Design language (from the reference brief): off-white ground, heavy condensed display type,
uppercase letter-spaced labels, hairline rules, one restrained accent, a solid ink call to
action, and minimal motion (respects `prefers-reduced-motion`).

## Environments

| Env | Where | Database |
| --- | --- | --- |
| Development | `npm run dev` on your Mac | Local sample data now. Later a Supabase *dev* project (or local Supabase via Docker) |
| Staging | Vercel preview deployments | Separate Supabase *staging* project |
| Production | Vercel production | Supabase *production* project (Pro, backups on) |

Never point development at the production database.
