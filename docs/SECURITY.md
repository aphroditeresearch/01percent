# Security

Status: **Phase 0.** No real users, data or secrets exist yet. The controls marked ✅ are in
code. The rest are the design that Phase 2+ must implement.

## Roles

| Role | Scope | Can |
| --- | --- | --- |
| Platform admin (you) | All tenants | Create tenants, manage domains/integrations, support. Listed in `platform_admins`. Must use 2FA |
| Owner / Mentor | One tenant | Manage content, students, homework review, announcements, branding within limits |
| Student | One tenant | Read entitled content, own progress, own journal, own submissions |

One person can hold different roles in different tenants. A role is always checked **for the
current tenant**.

## Tenant isolation

1. ✅ Tenant comes from the Host header only (`src/server/tenant.ts`). Unknown hosts → 404.
   Unit-tested, including lookalike domains and nested subdomains.
2. ✅ Every data-layer function takes the server-resolved tenant and filters by it. Ids from
   URLs are looked up *inside* that tenant, so a tenant B id on tenant A's site → 404. Checked
   manually in Phase 0.
3. ✅ Disabled modules 404 on direct URL (`requireFeature`). Checked manually: `/homework` on
   Northform.
4. ✅ Locked lessons are refused server-side, not just hidden in the list.
5. ✅ Client components receive minimal props. The library strips video ids and descriptions
   before sending lessons to the browser.
6. Phase 2: Postgres RLS on every table as a second layer (DATABASE.md). Composite FKs stop
   cross-tenant references.
7. Phase 2: automated cross-tenant tests against staging (DATABASE.md).

## Authentication and sessions (Phase 2)

- Supabase Auth via `@supabase/ssr`, with HTTP-only cookies scoped to each tenant hostname.
- Sign-in methods: email magic link and Discord OAuth. **Invitation-only**: signing in with no
  membership row for this tenant shows "no access", never auto-enrolment.
- Re-check `getUser()` on the server for every request. Don't trust unverified session
  contents.
- Sign-out is a POST server action (not a GET link) to prevent CSRF-style logouts.
- Server actions verify tenant + role + ownership themselves and never trust hidden form
  fields.

## Secrets

| Secret | Where it lives |
| --- | --- |
| Supabase service role key, Discord bot token, `INTEGRATION_SECRETS_KEY` | Vercel environment variables (server only), separate per environment |
| Per-tenant VdoCipher API secret | `integrations.secret_ciphertext`, encrypted with AES-256-GCM using `INTEGRATION_SECRETS_KEY`; no RLS read policy, so it's only ever decrypted server-side when needed |
| Supabase anon key | Public by design. Safe only because RLS is on everywhere |

Rules: no `NEXT_PUBLIC_` prefix on secrets, `.env*` is gitignored (except `.env.example`, which
holds placeholders only), and secrets are never logged or returned in API responses. Rotate a
secret immediately if it is ever pasted into chat, a ticket or a commit.

## Input, files, abuse

- Validate every server action / route input (types, lengths, enums) before use. We'll add a
  schema validator (zod) in Phase 2.
- Homework uploads go to a private Supabase Storage bucket. Only allow-listed MIME types and
  extensions (png, jpg, pdf), with a size cap (e.g. 10 MB) and a random server-generated file
  name, served through short-lived signed URLs.
- Rate-limit sign-in, playback OTP, uploads and journal writes. Pick an implementation in
  Phase 2 (e.g. Postgres counters or Upstash).
- ✅ Theme colours are validated as `#rrggbb` (blocks CSS injection from DB values).
- React escapes output by default. Never use `dangerouslySetInnerHTML` with user or mentor
  content. If mentors get rich text, sanitise it on the server.
- Add security headers (CSP, frame-ancestors, Referrer-Policy) in Phase 3, when the VdoCipher
  iframe origin is known.

## Audit and data lifecycle

- `audit_events` records role changes, access grants/revocations, content publishing, playback
  OTP issuance and integration changes.
- Account deletion workflow: remove the profile, memberships, journal and submissions, and keep
  minimal audit records, with documented retention periods (for the lawyer to confirm).
- Supabase Pro daily backups. Test a restore before launch.

## Threat model highlights

| Threat | Mitigation |
| --- | --- |
| Student reads another tenant's content by editing ids | Tenant-scoped lookups + RLS + tests |
| Student reads another student's journal | Owner-only RLS + user filter in data layer |
| Unpaid user gets premium content via Discord login | Entitlements are the source of truth (ADR-007) |
| Mentor hijacks another client's Discord server via the shared bot | Guild linked only through the install flow; unique `guild_id` |
| Video ripping / link sharing | DRM + short OTP + watermark + audit (limits documented honestly) |
| Leaked service role key | Server-only env, never in client, rotate; minimise where it's used |
| Cache serving one tenant's page to another | Cache Components off (ADR-004); no shared caching of authenticated pages |
| Platform admin account takeover | 2FA on GitHub, Vercel, Supabase, Discord, registrar, email |
