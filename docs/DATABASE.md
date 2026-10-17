# Database (planned, Phase 2)

Postgres on Supabase. **Not created yet.** The app reads `src/server/data/sample-data.ts`, whose
shapes mirror these tables (`src/lib/domain.ts`).

## Conventions

- Every tenant-owned table has `tenant_id uuid not null references tenants(id)`.
- Child tables use **composite foreign keys** that include `tenant_id`, so the database itself
  rejects a lesson that points at another tenant's course:
  `foreign key (course_id, tenant_id) references courses (id, tenant_id)`
  (this needs `unique (id, tenant_id)` on the parent).
- Primary keys are `uuid default gen_random_uuid()`. Timestamps are `timestamptz default now()`.
- Row-level security is **enabled on every table**, with no exceptions.
- Schema changes happen only through SQL migration files in `supabase/migrations/`, which are
  reviewed and applied to dev → staging → prod in order.

## Tables

| Table | Key columns | Notes |
| --- | --- | --- |
| `tenants` | id, slug (unique), name, status, theme jsonb, labels jsonb, disclaimer | Theme validated (hex colours) on write |
| `domains` | id, tenant_id, hostname (unique), verified_at | Custom domains (Phase 6) |
| `feature_settings` | tenant_id, feature_key, enabled, config jsonb | PK (tenant_id, feature_key) |
| `profiles` | id = auth.users.id, display_name, avatar_url | Global person record; one human can join several tenants |
| `memberships` | id, tenant_id, user_id, role (`student`/`mentor`/`owner`), status, created_at | unique (tenant_id, user_id). **The** link between a user and a tenant |
| `tiers` | id, tenant_id, name, description | Membership tiers |
| `entitlements` | id, tenant_id, user_id, tier_id, source (`manual`/`stripe`), status, starts_at, ends_at, grace_until | Paid access. Separate from auth (ADR-007) |
| `courses` | id, tenant_id, slug, title, description, position, unlock_mode, required_tier_id null, status (`draft`/`published`/`archived`) | unique (tenant_id, slug) |
| `lessons` | id, tenant_id, course_id, slug, position, title, summary, body, duration_minutes, status | unique (tenant_id, slug) |
| `lesson_videos` | lesson_id, tenant_id, provider (`vdocipher`), provider_video_id | Separate table: students can't select it directly (RLS); only the playback endpoint reads it |
| `lesson_resources` | id, tenant_id, lesson_id, label, kind, storage_path or url, position | Files in a private Storage bucket, served with signed URLs |
| `lesson_progress` | tenant_id, user_id, lesson_id, completed_at, last_viewed_at | PK (user_id, lesson_id) |
| `journal_entries` | id, tenant_id, user_id, title, body, created_at, updated_at | Owner-only. Mentors **cannot** read (product decision; revisit with a "share with mentor" flag) |
| `assignments` | id, tenant_id, course_id, lesson_id null, title, prompt, due_at null, status | |
| `assignment_submissions` | id, tenant_id, assignment_id, user_id, body, file_paths text[], status (`submitted`/`approved`/`revision`), feedback, reviewed_by, reviewed_at | |
| `announcements` | id, tenant_id, title, body, pinned, published_at, created_by | |
| `integrations` | id, tenant_id, provider (`vdocipher`/`discord`/`stripe`), config jsonb, secret_ciphertext bytea null, status, last_error | Secrets encrypted by the app (see SECURITY.md); never readable through RLS |
| `integration_jobs` | id, tenant_id, kind, payload, attempts, run_after, last_error, done_at | Outbox for Discord role sync retries |
| `audit_events` | id, tenant_id, actor_user_id, action, target_type, target_id, metadata, created_at | Append-only |
| `platform_admins` | user_id | You. Checked for platform-owner operations |

## Row-level security sketch

```sql
-- Helper functions. security definer, so they can read memberships under RLS.
create function app.is_member(t uuid) returns boolean ...      -- active membership in tenant t
create function app.has_role(t uuid, roles text[]) returns boolean ...

-- Students read published lessons in tenants they belong to
create policy lessons_read on lessons for select
  using (status = 'published' and app.is_member(tenant_id));

-- Mentors manage lessons in their own tenant
create policy lessons_write on lessons for all
  using (app.has_role(tenant_id, '{mentor,owner}'))
  with check (app.has_role(tenant_id, '{mentor,owner}'));

-- Journals: only the author, and only inside a tenant they belong to
create policy journal_owner on journal_entries for all
  using (user_id = auth.uid() and app.is_member(tenant_id))
  with check (user_id = auth.uid() and app.is_member(tenant_id));

-- lesson_videos, integrations, integration_jobs: no student/mentor policies at all.
-- Only the server, using the service role inside narrowly scoped functions, reads them.
```

RLS is the **safety net**. The app still checks tenant, role, feature, entitlement and lesson
lock state before each query. Locking (`done`/`open`/`locked`) is computed in
`src/lib/access.ts` and enforced on the lesson page and the playback endpoint.

## Tests required before go-live

An automated suite runs against a staging database with two tenants and three users
(student A in tenant 1, student B in tenant 1, mentor in tenant 2). It proves:
- A cannot read B's journal or submissions.
- The tenant 2 mentor cannot read or write anything in tenant 1.
- Students cannot select `lesson_videos` or `integrations`.
- Unpublished lessons are invisible to students.
