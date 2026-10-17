# Mentor Platform

A white-label mentorship website system: one codebase that serves many branded member portals
(courses, protected video, progress, journal, homework, announcements). Each mentor is a
**tenant**. Their site is picked by hostname and styled from their tenant config.

> **Status: Phase 0, visual shell.** Pages run on clearly labelled **sample data**. There is
> **no real authentication, database, video protection or Discord integration yet.** A banner on
> every page says so. See [docs/ROADMAP.md](docs/ROADMAP.md).

## Local setup

Requirements: Node.js 22 LTS. On this machine it is installed at `~/.local/node`, and `~/.zshrc`
adds it to `PATH`. Open a new terminal if `node -v` isn't found.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open:

| URL | Tenant |
| --- | --- |
| http://localhost:3000 | Meridian (sample trading mentorship, the default tenant in dev) |
| http://meridian.localhost:3000 | Meridian, via its subdomain |
| http://northform.localhost:3000 | Northform (sample fitness brand, Homework disabled) |
| http://tempo.localhost:3000/login | Tempo (sample trading brand, dark theme, cinematic login) |
| http://anything-else.localhost:3000 | 404: unknown hosts never fall back to a tenant |

`*.localhost` resolves to your machine automatically in Chrome, Safari and Firefox.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |
| `npm test` | Unit tests (Vitest) |
| `npm run check` | Typecheck + lint + tests. Run before every commit |

## Project layout

```
src/
  app/                    Routes (Next.js App Router)
    (member)/             Member pages that share the header: /, /library, /lessons/[slug], /journal, /homework, /account
    login/                Sign-in screen (demo)
  components/             Shared UI (ui/ primitives, layout/ header and footer, login/ sign-in styles)
  config/tenants/         One file per tenant: branding, theme, enabled features, labels
  lib/                    Pure logic, safe on client or server (tenant resolution, locking, theme, features)
  server/                 Server-only code: tenant lookup, session, data access layer
    data/sample-data.ts   ⚠️ Fictional sample data. Replaced by Supabase in Phase 2
docs/                     Product, architecture, database, security, integrations, roadmap, business model
```

## Adding a new (sample) tenant

1. Copy `src/config/tenants/northform.ts` (light, editorial login) or `tempo.ts` (dark, cinematic
   login) and change id, slug, name, theme, login and features.
2. Add it to the list in `src/config/tenants/index.ts`.
3. Add sample courses and lessons for its `tenantId` in `src/server/data/sample-data.ts`, plus a demo viewer.
4. Run `npm run check`, then visit `http://<slug>.localhost:3000`.

## Login styles

Each tenant picks a sign-in screen in its config (`login.style`):

- **editorial**: a centred wordmark, rule, tagline and button on an off-white page.
- **cinematic**: a dark full-screen scene with a radiating-line intro, ambient video (or an
  animated gradient fallback), halftone corners, light streaks, and a framed hero with an
  extra-wide title and an optional kana line. It is pure CSS, ships no client JavaScript, and
  skips the intro for people who turn on "reduce motion". Client-supplied video loops go in
  `public/tenants/<slug>/` and are referenced from `login.video`.

## Documentation

- [Product spec](docs/PRODUCT_SPEC.md): scope, MVP, legal review checklist
- [Architecture](docs/ARCHITECTURE.md): stack, decisions, request flow
- [Database](docs/DATABASE.md): planned schema and row-level security
- [Security](docs/SECURITY.md): tenant isolation, secrets, threat model
- [Integrations](docs/INTEGRATIONS.md): VdoCipher, Discord, payments
- [Roadmap](docs/ROADMAP.md): done, current, next
- [Business model](docs/BUSINESS_MODEL.md): pricing and cost analysis
