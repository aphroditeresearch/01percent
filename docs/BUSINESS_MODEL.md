# Business model and cost analysis

Prices were checked on 12 Oct 2026 and change often. Re-verify before quoting clients.
VdoCipher figures come from third-party listings, because the official pricing page didn't
render them. Confirm them at vdocipher.com.

## Keep these lines separate on every quote

| Line | Who pays | Notes |
| --- | --- | --- |
| **Setup fee** | Client → you, once | Configuration, branding, content load, domain, testing |
| **Maintenance fee** | Client → you, monthly | Defined, capped scope (see below) |
| **Infrastructure** | You (shared across all clients) | Vercel, Supabase, domain, email |
| **Video hosting / DRM** | Client, directly to VdoCipher (recommended) | Scales with their audience. Don't bundle it |
| **Payment processing** | Client (from their sales) | Stripe fees on their revenue |
| **Custom development** | Client → you, quoted per request | Anything beyond configuration |

## Your fixed platform costs (all clients share these)

| Service | Plan | Cost |
| --- | --- | --- |
| Vercel | Pro (Hobby is personal / non-commercial only) | $20/mo, includes $20 usage credit |
| Supabase | Pro, one production project for all tenants | from $25/mo (8 GB DB, 100k MAU, 100 GB storage, 250 GB egress included) |
| Supabase staging | Free tier while small (pauses after 1 week idle) | $0, or about $10/mo as a second Pro project |
| Platform domain | Registrar | about $10–20/yr |
| Transactional email | Resend / Postmark etc. | often free or low cost at small volume. Verify |
| **Total** | | **about $45–60/mo** for the whole platform |

With 5 clients that's about $10/client/month. With 10 it's about $5. Shared infrastructure is
cheap. **Video and your time are the real costs.**

## Video: why it can't be inside a $50–100 fee

VdoCipher sells prepaid annual bandwidth (third-party listings):
Starter about **$149/yr for 1,000 GB**, Value about **$399/yr for 2,500 GB**, Pro about
**$1,599/yr for 15,000 GB**. There is a free trial (30 days, 4 videos, 5 GB).

Rough usage: HD streaming is about **0.7–1.5 GB per viewing hour**.

| Mentorship size | Viewing | ≈ GB / year | Fits |
| --- | --- | --- | --- |
| 30 students × 4 h/month | 1,440 h/yr | about 1,000–2,000 GB | Starter–Value (about $150–400/yr) |
| 100 students × 8 h/month | 9,600 h/yr | about 7,000–14,000 GB | Pro (about $1,600/yr ≈ $133/mo) |
| 300 students × 8 h/month | 28,800 h/yr | about 20,000–43,000 GB | Above Pro, negotiated |

A mid-sized trading community can burn through the Starter plan in about a month. That's why
the client should hold the VdoCipher account and pay for it directly.

## Your time is the real constraint

Estimated hours per new client once the platform is mature (config-only onboarding):

| Task | Hours |
| --- | --- |
| Kickoff, collecting brand assets and content list | 1–2 |
| Tenant config, theme, copy, disclaimer | 1–2 |
| Content load (courses, lessons, video ids, resources) | 2–6, depends on volume and whether the mentor does it in the admin |
| Domain, Discord server setup, VdoCipher account | 1–3 |
| QA across devices, access tests, handover call | 2–3 |
| **Total** | **about 7–16 h** |

At $400 setup that's roughly **$25–55/hour**. The first 2–3 clients will take longer while the
platform is still being finished.

## Assessment and recommendation

- **$300–500 standard setup is low** for a premium-looking portal with DRM video. It's
  defensible only as a *founding-client* price for the first 1–3 clients, in exchange for a
  testimonial, case-study rights and patience with rough edges.
- After that, consider about **$750–1,000 standard** and **$1,500–2,500 premium**.
  Comparable custom builds cost far more, and your marginal cost is mostly time.
- **Maintenance at $50–100/mo** is sustainable *only* with a written scope, for example:
  hosting on the shared platform, security updates, bug fixes, and up to 1 hour/month of small
  content or config changes. Anything more is billed hourly or quoted. Video, Stripe fees and
  any paid third-party subscriptions are excluded. About $100–150/mo is more comfortable once
  Discord sync and support load are included.
- Rough break-even: fixed costs of about $50/mo are covered by one maintenance client.
  Everything above that pays for your time.
- **Protect the template.** Every custom request should become either (a) configuration, (b) a
  reusable module that's off by default, or (c) a quoted job you decline to merge if it would
  fork the codebase. Don't make one-off code paths per client.

## Unknowns to resolve

- Actual VdoCipher pricing and overage policy (confirm with them).
- Vercel custom-domain limits and wildcard setup for your chosen domain.
- Email provider pricing at your volume.
- Stripe Connect fees if you go that route.
- Tax treatment of your fees (talk to an accountant).
