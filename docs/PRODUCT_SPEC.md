# Product spec

## What it is

A managed, white-label member portal for independent mentors. It starts with futures and forex
trading educators and is designed so that fitness, business and other coaching niches work
through configuration. You (the platform owner) set up and run each client site. It is **not**
self-serve SaaS at this stage.

## Users

- **Student / member**: learns, tracks progress, journals, submits homework.
- **Mentor / owner**: publishes content, reviews homework, posts announcements, manages members.
- **Platform admin**: creates tenants, configures branding, domains and integrations.

## Experience principles

Premium private portal, not a generic LMS. Editorial typography, an off-white ground, one accent,
hairline structure and minimal motion. Desktop-first, with mobile fully usable. Fast. Accessible:
semantic HTML, visible focus, readable contrast, reduced-motion support.

## MVP (first pilot client)

| Area | Scope | Status |
| --- | --- | --- |
| Visual shell | Login, dashboard, library, lesson, journal, homework, account | ✅ Phase 0 (sample data) |
| Multi-tenancy | Host → tenant, theme, labels, feature flags, isolation | ✅ Phase 0 (config in code) |
| Auth | Invitation-only; email magic link + Discord OAuth; roles per tenant | Phase 2 |
| Courses & lessons | Ordered lessons, sequential or open unlock, search, resources | Shell ✅ / data Phase 2 |
| Progress | Persisted completion, resume lesson, recent lessons | Phase 2 |
| Journal | Private CRUD with timestamps | Phase 2 |
| Homework | Text submission, status, mentor feedback; file upload | Phase 2 (text), Phase 4 (files) |
| Announcements | Pinned and dated, tenant-scoped | Phase 2 (read), Phase 4 (create) |
| Protected video | VdoCipher DRM, server OTP, watermark | Phase 3 |
| Mentor admin | Course/lesson CRUD, invites, homework review, announcements | Phase 4 |
| Discord | Link account, tier → role sync | Phase 5 |

**Out of MVP:** payments (manual access first), quizzes, certificates, cohorts, a plugin
marketplace, self-serve sign-up, native apps.

## Feature modules (configurable per tenant)

Implemented as flags today: `courses`, `announcements`, `journal`, `homework`,
`protectedVideo`, `discord`. Candidates for later, added only when a paying client needs them:
trading journal templates, chart screenshot uploads, trade review submissions, glossary,
resource library, Q&A, quizzes, prerequisites across courses, certificates, cohorts, workout
programmes and checklists.

Rule: a module is a folder of routes + data functions + a feature key. Disabled means hidden
**and** 404 on its routes and APIs.

## Per-tenant configuration

Name, wordmark/logo, tagline, login copy, login style (editorial or cinematic, with hero
word, kana, streak colour and optional background videos), theme colours, light/dark, display and
body fonts, heading case, nav labels,
features, disclaimer text, footer note, domains, and integration settings (VdoCipher, Discord
guild/roles, later Stripe).

## Trading-education specifics

- A disclaimer configurable per tenant appears on lesson pages and in the footer. The mentor
  supplies the wording and has it reviewed.
- No features that make performance claims (no "win rate" leaderboards, P&L showcases or
  income testimonials built into the product).
- The journal is framed as reflection and process, not signals.

## Legal and contractual items needing professional review before production

The platform does not make anyone compliant automatically. Get these reviewed by a lawyer:

1. **Your service agreement with mentors**: scope, what the monthly fee covers, change-request
   pricing, uptime expectations (no SLA promises yet), liability cap, termination and data
   export, and who owns code vs. content (you keep the platform; they own their content and
   member data).
2. **Data processing**: the mentor is usually the data *controller* and you the *processor*. A
   DPA is needed if any members are in the EU/UK. Privacy policy per tenant. Sub-processor list
   (Vercel, Supabase, VdoCipher, Discord, email provider, Stripe).
3. **Member terms per tenant**: content licence (no sharing or recording), account sharing,
   refunds, termination.
4. **Trading-education rules**: claims about returns, testimonials and the "not financial
   advice" wording. Rules vary by country (e.g. US CFTC/NFA and FTC, UK FCA). This is mainly
   the mentor's responsibility, but your contract should say so.
5. **Third-party terms**: VdoCipher (especially if you ever resell), Discord developer terms
   for the bot, Stripe Connect platform obligations.
6. **Data deletion and retention** periods, and the response process for deletion requests.
