# Integrations

None of these are connected yet. This document is the design. Every API detail here must be
re-checked against the provider's current official docs when the phase starts.

---

## VdoCipher (Phase 3)

### Account model: recommended, each client owns their VdoCipher account

| | Client-owned account (recommended) | One platform account |
| --- | --- | --- |
| Who pays for bandwidth | The client, directly | You, then you re-bill |
| Cost risk if a client's audience grows | None for you | Yours |
| Content ownership when a client leaves | Clean: videos stay in their account | You have to migrate files |
| Secrets to manage | One API secret per tenant (encrypted in the DB) | One secret in env |
| Reseller terms | Not an issue | Must check VdoCipher's ToS |

Bandwidth is the largest variable cost (see BUSINESS_MODEL.md), so it should sit with the client.
For a "managed" feel, you can set up and administer the account for them as part of onboarding.

### Playback flow

```
Browser                         Our server (route handler)                      VdoCipher
   │ POST /api/playback {lessonId}   │                                              │
   │────────────────────────────────►│ 1. tenant = from Host header                 │
   │                                 │ 2. user = session (else 401)                 │
   │                                 │ 3. active membership + entitlement for tier  │
   │                                 │ 4. lesson.tenant_id == tenant.id, published  │
   │                                 │ 5. lesson state != locked (src/lib/access)   │
   │                                 │ 6. feature protectedVideo enabled            │
   │                                 │ 7. rate limit per user                       │
   │                                 │ 8. read video id + decrypt tenant API secret │
   │                                 │ POST /api/videos/{id}/otp ──────────────────►│
   │                                 │   Authorization: Apisecret <secret>          │
   │                                 │   { ttl: 300, annotate: <watermark JSON> }   │
   │                                 │◄──────────────── { otp, playbackInfo } ──────│
   │◄──── { otp, playbackInfo } ─────│  (Cache-Control: no-store; never logged)     │
   │ iframe player.vdocipher.com ... │                                              │
```

- The browser sends only our `lessonId`. The VdoCipher video id and API secret never leave the
  server.
- A short TTL (about 5 minutes to *start* playback). On expiry or error the player shows "Reload
  video", which requests a fresh OTP. Don't use auto-retry loops.
- Watermark: dynamic text (`rtext`) with something that identifies the viewer, such as an email
  or member number plus a date, at low opacity and moving. This deters leaks and makes them
  traceable.
- Write an `audit_events` row per OTP issued (user, lesson, time), so leaks can be investigated.
- Verified from docs (Oct 2026, API v3): endpoint `POST https://dev.vdocipher.com/api/videos/{videoId}/otp`,
  `Authorization: Apisecret …` header, body `ttl` / `annotate`, response `otp` + `playbackInfo`.
  Re-check the advanced options (IP/geo binding, licence rules) when building.

### What DRM does and does not protect

**Does:** encrypts the stream so download extensions, "save video" tools and simply copying the
URL don't get a playable file. Each playback needs a fresh server-issued OTP, so links can't be
shared. On platforms with hardware-backed DRM (e.g. Safari/FairPlay, many Android devices),
screen capture is often blocked.

**Does not:** stop someone filming the screen with a phone. It does not reliably stop every
desktop screen recorder, since software-level DRM in desktop browsers is weaker than hardware
DRM. It does not stop a paying member sharing their login (that needs session/device limits,
which we can add later). **Never tell a client their content "cannot be copied".** Say it is
*protected and traceable*.

### Tests before production
- Signed-out request → 401. Member of tenant A requesting a tenant B lesson id → 404.
- Locked lesson → 403. Disabled `protectedVideo` feature → 404.
- Expired OTP → the player shows the recoverable error state.
- The API secret never appears in client bundles (grep the build output) or in logs.

---

## Discord (Phase 5)

### One bot, many servers
- **One** Discord application/bot owned by the platform. Its token lives only in server env
  (`DISCORD_BOT_TOKEN`).
- Each mentor adds the bot to *their* server through an install link that requests **only
  Manage Roles** (plus View Channels / Send Messages if welcome messages are enabled). Never
  Administrator.
- The bot's role must sit **above** the roles it manages in the server's role list. The setup
  screen checks this and explains it.
- Per tenant we store `guild_id`, a tier → role id mapping and an optional welcome channel id in
  `integrations.config`. These are ids, not secrets.

### ⚠️ Cross-tenant risk and mitigation
If a mentor could type any `guild_id`, they could point the shared bot at *another* client's
server and change roles there. So a guild can only be linked by **completing the bot install
flow from a signed-in mentor session** (OAuth2 `state` tied to that session and tenant). The
`guild_id` comes back from Discord, not from a form, and is `unique` across all tenants.

### Member linking and role sync
1. The student clicks "Connect Discord" → Discord OAuth2 with the `identify` scope (add
   `guilds.join` only if we auto-add them to the server). We store their Discord user id on the
   membership.
2. **Entitlements in our database are the source of truth.** Logging in with Discord proves
   identity, never payment.
3. When an entitlement starts, changes or ends, we enqueue an `integration_jobs` row. A worker
   (Vercel Cron) calls the Discord REST API to add or remove the role, honours rate limits,
   retries with backoff and records `last_error`.
4. A nightly reconcile compares expected roles with actual ones and repairs drift.
5. No always-on gateway process at first. REST calls are enough for role sync. Slash commands
   can later use Discord's HTTP interactions endpoint, which also suits serverless.

---

## Payments (Phase 7)

- Recommended: **Stripe**, probably with **Stripe Connect** so each mentor is the merchant of
  record and gets paid directly. You aren't handling their revenue, and refunds and chargebacks
  are theirs. Confirm this with an accountant or lawyer before choosing.
- Verified, signature-checked webhooks (`checkout.session.completed`,
  `customer.subscription.updated/deleted`, `invoice.payment_failed`) are the **only** way paid
  entitlements are created or ended. A success redirect page grants nothing.
- Webhook handling is idempotent: store processed event ids and ignore repeats.
- Grace periods come from tenant config (`entitlements.grace_until`).
- Until then: mentors or you grant access manually (`entitlements.source = 'manual'`), and each
  grant is audited.

---

## Email (Phase 2)

Supabase Auth's built-in email is rate-limited and meant for development. Production magic
links and invitations need a transactional email provider (for example Resend or Postmark).
Evaluate pricing when Phase 2 starts.
