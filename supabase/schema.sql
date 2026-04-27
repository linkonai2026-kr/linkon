-- ==============================
-- Linkon launch schema
-- Canonical identity + admin control plane + service sync outbox
-- ==============================

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  name text,
  role text not null default 'customer' check (role in ('customer', 'admin', 'super_admin')),
  account_status text not null default 'active' check (account_status in ('active', 'suspended', 'deleted')),
  plan text not null default 'free' check (plan in ('free', 'standard', 'premium', 'enterprise')),
  billing_state text not null default 'manual' check (billing_state in ('manual', 'active', 'past_due', 'canceled')),
  suspension_reason text,
  deleted_at timestamptz,
  last_synced_at timestamptz,
  last_login_at timestamptz,
  primary_service text check (primary_service in ('vion', 'rion', 'taxon')),
  most_used_service text check (most_used_service in ('vion', 'rion', 'taxon')),
  last_used_service text check (last_used_service in ('vion', 'rion', 'taxon')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.service_accounts (
  id uuid primary key default gen_random_uuid(),
  linkon_uid uuid not null references public.users(id) on delete cascade,
  service text not null check (service in ('vion', 'rion', 'taxon')),
  service_uid uuid,
  service_email text,
  is_enabled boolean not null default true,
  service_role text not null default 'user' check (service_role in ('user', 'service_admin')),
  sync_status text not null default 'pending' check (sync_status in ('pending', 'processing', 'succeeded', 'failed')),
  sync_error text,
  last_synced_at timestamptz,
  last_accessed_at timestamptz,
  usage_count integer not null default 0,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (linkon_uid, service),
  unique nulls not distinct (service, service_uid)
);

create table if not exists public.registration_preferences (
  id uuid primary key default gen_random_uuid(),
  linkon_uid uuid not null references public.users(id) on delete cascade,
  preferred_service text check (preferred_service in ('vion', 'rion', 'taxon')),
  marketing_agreed boolean not null default false,
  terms_agreed boolean not null default false,
  terms_agreed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (linkon_uid)
);

create table if not exists public.linkon_user_context (
  id uuid primary key default gen_random_uuid(),
  linkon_uid uuid not null references public.users(id) on delete cascade,
  user_traits jsonb not null default '{}'::jsonb,
  interest_tags text[] not null default '{}'::text[],
  preferred_service text check (preferred_service in ('vion', 'rion', 'taxon')),
  memo_summary text,
  risk_flags text[] not null default '{}'::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (linkon_uid)
);

create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_uid uuid references public.users(id) on delete set null,
  target_uid uuid not null references public.users(id) on delete cascade,
  action text not null,
  before_state jsonb,
  after_state jsonb,
  sync_result jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.service_sync_jobs (
  id uuid primary key default gen_random_uuid(),
  linkon_uid uuid not null references public.users(id) on delete cascade,
  service text not null check (service in ('vion', 'rion', 'taxon')),
  action text not null check (action in ('upsert', 'status', 'plan', 'role', 'delete', 'resync')),
  status text not null default 'pending' check (status in ('pending', 'processing', 'succeeded', 'failed')),
  payload jsonb not null default '{}'::jsonb,
  actor_uid uuid references public.users(id) on delete set null,
  attempts integer not null default 0,
  last_error text,
  synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.launch_notifications (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  service text not null check (service in ('rion', 'taxon')),
  source text not null default 'homepage',
  created_at timestamptz not null default now(),
  unique (email, service)
);

alter table public.users add column if not exists last_login_at timestamptz;
alter table public.users add column if not exists primary_service text check (primary_service in ('vion', 'rion', 'taxon'));
alter table public.users add column if not exists most_used_service text check (most_used_service in ('vion', 'rion', 'taxon'));
alter table public.users add column if not exists last_used_service text check (last_used_service in ('vion', 'rion', 'taxon'));
alter table public.service_accounts add column if not exists is_enabled boolean not null default true;
alter table public.service_accounts add column if not exists service_role text not null default 'user' check (service_role in ('user', 'service_admin'));
alter table public.service_accounts add column if not exists last_accessed_at timestamptz;
alter table public.service_accounts add column if not exists usage_count integer not null default 0;

create index if not exists idx_service_accounts_linkon_uid on public.service_accounts(linkon_uid);
create index if not exists idx_service_accounts_status on public.service_accounts(sync_status);
create index if not exists idx_service_accounts_usage on public.service_accounts(service, usage_count desc);
create index if not exists idx_linkon_user_context_linkon_uid on public.linkon_user_context(linkon_uid);
create index if not exists idx_audit_logs_target_uid on public.admin_audit_logs(target_uid, created_at desc);
create index if not exists idx_sync_jobs_status on public.service_sync_jobs(status, created_at desc);
create index if not exists idx_launch_notifications_service on public.launch_notifications(service, created_at desc);

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at
before update on public.users
for each row
execute function public.set_updated_at();

drop trigger if exists service_accounts_set_updated_at on public.service_accounts;
create trigger service_accounts_set_updated_at
before update on public.service_accounts
for each row
execute function public.set_updated_at();

drop trigger if exists registration_preferences_set_updated_at on public.registration_preferences;
create trigger registration_preferences_set_updated_at
before update on public.registration_preferences
for each row
execute function public.set_updated_at();

drop trigger if exists linkon_user_context_set_updated_at on public.linkon_user_context;
create trigger linkon_user_context_set_updated_at
before update on public.linkon_user_context
for each row
execute function public.set_updated_at();

drop trigger if exists service_sync_jobs_set_updated_at on public.service_sync_jobs;
create trigger service_sync_jobs_set_updated_at
before update on public.service_sync_jobs
for each row
execute function public.set_updated_at();

alter table public.users enable row level security;
alter table public.service_accounts enable row level security;
alter table public.registration_preferences enable row level security;
alter table public.linkon_user_context enable row level security;
alter table public.admin_audit_logs enable row level security;
alter table public.service_sync_jobs enable row level security;
alter table public.launch_notifications enable row level security;

drop policy if exists users_select_own on public.users;
create policy users_select_own on public.users
for select using (auth.uid() = id);

drop policy if exists service_accounts_select_own on public.service_accounts;
create policy service_accounts_select_own on public.service_accounts
for select using (auth.uid() = linkon_uid);

drop policy if exists registration_preferences_select_own on public.registration_preferences;
create policy registration_preferences_select_own on public.registration_preferences
for select using (auth.uid() = linkon_uid);

drop policy if exists linkon_user_context_select_own on public.linkon_user_context;
create policy linkon_user_context_select_own on public.linkon_user_context
for select using (auth.uid() = linkon_uid);

drop policy if exists admin_audit_logs_select_none on public.admin_audit_logs;
create policy admin_audit_logs_select_none on public.admin_audit_logs
for select using (false);

drop policy if exists service_sync_jobs_select_none on public.service_sync_jobs;
create policy service_sync_jobs_select_none on public.service_sync_jobs
for select using (false);

drop policy if exists launch_notifications_select_none on public.launch_notifications;
create policy launch_notifications_select_none on public.launch_notifications
for select using (false);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name'
  )
  on conflict (id) do update
    set email = excluded.email,
        name = coalesce(excluded.name, public.users.name);

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();
