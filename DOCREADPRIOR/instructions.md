# Instructions - Alecia Panel

## Development Setup
1. Open terminal in `/Users/utilisateur/Desktop/alepanel/alecia-app`.
2. Install dependencies: `npm install`.
3. Set up `.env.local` with Neon, MSAL, and AI keys.
4. Run migrations: `npm run db:push`.
5. Seed initial data: `npm run db:seed:all`.
6. Start dev server: `npm run dev`.

## Coding Standards
- **Framework:** Next.js 16 (App Router + Turbopack).
- **Database:** Drizzle ORM. Use `db.query` for complex relational reads.
- **Components:** Radix UI primitives with Tailwind v4.
- **State:** Prefer server components for data fetching. Use React Hook Form for all inputs.
- **i18n:** Use `next-intl` dictionary keys. Never hardcode French/English strings.

## Session Workflow
- **Before:** Check `to_do.md` and `AUDIT_REPORT.md`.
- **After:** Update `features.md` and log session in `MitchSessions/alepanel/logs`.
