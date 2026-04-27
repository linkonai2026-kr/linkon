# Linkon

Linkon is the canonical identity and operations hub for the `Vion`, `Rion`, and `Taxon` services.

This app ships as a single `Next.js` web app and manages:

- public product pages,
- unified signup/login,
- service handoff,
- admin control actions,
- downstream service synchronization.

## Stack

- `Next.js 16`
- `React 19`
- `Supabase SSR`
- `Supabase Auth Admin API`

## Local setup

1. Install dependencies.
2. Copy `.env.example` to `.env.local`.
3. Fill in only the fresh Linkon Supabase and app URL values first.
4. Apply [`supabase/schema.sql`](./supabase/schema.sql) to the Linkon Supabase project.
5. Set `LINKON_SUPER_ADMIN_EMAIL` to the email that should become the first super admin.
6. Add Vion/Rion/Taxon env values only when each service is ready to receive Linkon users.
7. Run the app:

```bash
npm run dev
```

## Production deployment

Recommended target: `Vercel`.

Required Linkon environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `LINKON_WEBHOOK_SECRET`
- `LINKON_SUPER_ADMIN_EMAIL`
- `NEXT_PUBLIC_APP_URL`

Optional downstream service variables:

- `VION_SUPABASE_URL`
- `VION_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_VION_URL`
- `RION_SUPABASE_URL`
- `RION_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_RION_URL`
- `TAXON_SUPABASE_URL`
- `TAXON_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_TAXON_URL`

Leave a downstream service blank until it is actually ready. Linkon will keep the
canonical account state and show a service unavailable flow for unconfigured
services.

## Reset before first real connection

There should be no committed `.env`, `.env.local`, or `.vercel` directory. If
they exist locally from an older setup, remove them before connecting the fresh
Supabase and Vercel projects.

In Vercel, delete old project environment variables before adding the new
Linkon values. In Supabase, run the current `supabase/schema.sql` in the new
Linkon project instead of reusing tables from an old project.

## Admin model

- Linkon is the source of truth for user role, status, plan, billing state, and audit history.
- The first admin is bootstrapped by matching the signed-in email with `LINKON_SUPER_ADMIN_EMAIL`.
- Admin actions are recorded in `admin_audit_logs`.
- Downstream writes are tracked in `service_sync_jobs`.

## Verification checklist

- `npx tsc --noEmit`
- `npm run build`
- Verify `/`, `/vion`, `/rion`, `/taxon`, `/privacy`, `/terms`, `/login`, `/register`, `/select-service`, `/admin`
- Verify signup, login, callback, service launch, status blocking, and admin actions
