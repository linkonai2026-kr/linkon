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
3. Fill in the Linkon, Vion, Rion, and Taxon Supabase credentials.
4. Apply [`supabase/schema.sql`](./supabase/schema.sql) to the Linkon Supabase project.
5. Set `LINKON_SUPER_ADMIN_EMAIL` to the email that should become the first super admin.
6. Run the app:

```bash
npm run dev
```

## Production deployment

Recommended target: `Vercel`.

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VION_SUPABASE_URL`
- `VION_SERVICE_ROLE_KEY`
- `RION_SUPABASE_URL`
- `RION_SERVICE_ROLE_KEY`
- `TAXON_SUPABASE_URL`
- `TAXON_SERVICE_ROLE_KEY`
- `LINKON_WEBHOOK_SECRET`
- `LINKON_SUPER_ADMIN_EMAIL`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_VION_URL`
- `NEXT_PUBLIC_RION_URL`
- `NEXT_PUBLIC_TAXON_URL`

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
