@AGENTS.md

# Project rules for AI assistants

- Read docs/ARCHITECTURE.md and docs/SECURITY.md before changing auth, data access, video or integrations.
- The tenant comes ONLY from `getTenant()` (Host header). Never accept a tenant id from the client.
- Pages, route handlers and server actions get data only through `src/server/data`. Every query filters by tenant (and user, for private records).
- Module pages, actions and APIs call `requireFeature()`. Hiding nav links is not access control.
- Never send secrets or VdoCipher video ids to client components. Map data to minimal client props.
- No hardcoded client branding in shared components. Use tenant config and theme tokens (`bg-bg`, `text-ink`, `text-muted`, `border-line`, `bg-accent`, `text-success`, `font-display`).
- Sample/demo behaviour must stay visibly labelled as such.
- Run `npm run check` after changes. Keep docs/ROADMAP.md current.
