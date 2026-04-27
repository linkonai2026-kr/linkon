# Linkon Supabase Setup

This project uses the Linkon Supabase project as the canonical control plane for
identity, plans, service access, service-level admin roles, usage summaries,
launch notifications, sync jobs, and audit logs.

## 1. Create the Linkon project

1. Create a new Supabase project for Linkon.
2. Open `SQL Editor`.
3. Run the full contents of `supabase/schema.sql`.
4. Run the same SQL a second time. It should be safe to re-run.

The schema creates these public tables:

- `users`
- `service_accounts`
- `registration_preferences`
- `linkon_user_context`
- `admin_audit_logs`
- `service_sync_jobs`
- `launch_notifications`

Service-specific content such as counseling records, legal documents, tax files,
PDFs, reports, and detailed histories must remain in Vion, Rion, or Taxon.
Linkon stores only shared account state and operational summaries.

## 2. Configure Supabase Auth

In the Linkon Supabase dashboard:

1. Enable Email auth in `Authentication > Providers`.
2. Add the production Linkon URL to `Authentication > URL Configuration`.
3. Add the callback URL used by the app:
   - `https://<linkon-domain>/api/auth/callback`
4. Keep service-role keys server-side only. Never expose them to the browser.

## 3. Configure environment variables

Set these in Vercel and in local `.env.local` when testing locally:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
LINKON_SUPER_ADMIN_EMAIL=
LINKON_WEBHOOK_SECRET=
NEXT_PUBLIC_APP_URL=
```

Add downstream service variables only when that service is ready to receive
Linkon users:

```env
VION_SUPABASE_URL=
VION_SERVICE_ROLE_KEY=
NEXT_PUBLIC_VION_URL=

RION_SUPABASE_URL=
RION_SERVICE_ROLE_KEY=
NEXT_PUBLIC_RION_URL=

TAXON_SUPABASE_URL=
TAXON_SERVICE_ROLE_KEY=
NEXT_PUBLIC_TAXON_URL=
```

If Rion or Taxon is not launched yet, leave its URL/key unset. Linkon will keep
the canonical account state and show `service_unavailable` when users try to
enter an unconfigured service.

Generate `LINKON_WEBHOOK_SECRET` with:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 4. Bootstrap the first super admin

1. Set `LINKON_SUPER_ADMIN_EMAIL` to the founder/admin email.
2. Sign up or sign in with that exact email.
3. Visit `/admin`.
4. The app promotes that profile to `super_admin` during profile normalization.

## 5. Smoke test checklist

After deploying to Vercel Preview:

1. Register from `/register` and confirm no downstream service account is
   created until a service is selected.
2. Register from `/register?service=vion` and confirm only Vion is linked.
3. Visit `/api/auth/token?service=vion` while signed in and confirm service
   sync, usage count, and last access update.
4. Visit `/admin` as a non-admin and confirm access is blocked.
5. Visit `/admin` as the super admin and update role, status, plan, service
   enabled state, and service role.
6. Confirm `admin_audit_logs` records every admin action.
7. Re-run `supabase/schema.sql` to confirm the schema remains idempotent.

