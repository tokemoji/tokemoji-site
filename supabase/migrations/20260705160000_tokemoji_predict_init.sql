-- ============================================================================
--  Tokemoji Prediction Market — initial schema (PLAN §3)
--  Project: tokemoji-predict (NOT sentiment-guru)
--  Apply to a Supabase project via: supabase db push  (or the dashboard SQL editor)
--  RLS is ENABLED on every table.
-- ============================================================================

-- Needed for the updated_at trigger below
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- profiles: extends auth.users
-- ---------------------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  handle text unique,
  avatar_url text,
  wallet_address text,          -- optional, editable, not required to forecast
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- rounds: one daily round per UTC day (plus weekly rounds)
-- ---------------------------------------------------------------------------
create table if not exists rounds (
  id bigint generated always as identity primary key,
  kind text not null check (kind in ('daily','weekly')),
  opens_at timestamptz not null,
  locks_at timestamptz not null,    -- cutoff 00:00 UTC
  settles_at timestamptz not null,
  status text not null default 'open' check (status in ('open','locked','settled','void')),
  results jsonb,                     -- after settle: ranked % change of all 12 tokens
  created_at timestamptz not null default now()
);

create index if not exists rounds_kind_status_idx on rounds(kind, status);
create index if not exists rounds_locks_at_idx on rounds(locks_at);

-- ---------------------------------------------------------------------------
-- predictions
-- ---------------------------------------------------------------------------
create table if not exists predictions (
  id bigint generated always as identity primary key,
  round_id bigint not null references rounds(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  up_picks text[] not null,        -- exactly 3, order matters (index 0 = position #1)
  down_picks text[] not null,      -- exactly 3
  fingerprint text,                -- anti-abuse (canvas fingerprint)
  created_at timestamptz not null default now(),
  score int,                       -- null until the round is settled
  unique (round_id, user_id)
);

create index if not exists predictions_round_idx on predictions(round_id);
create index if not exists predictions_user_idx on predictions(user_id);

-- ---------------------------------------------------------------------------
-- user_stats: aggregate, materialized by the settle cron
-- ---------------------------------------------------------------------------
create table if not exists user_stats (
  user_id uuid primary key references profiles(id) on delete cascade,
  total_points bigint not null default 0,
  daily_streak int not null default 0,
  last_played date,
  perfect_days int not null default 0,
  rounds_played int not null default 0
);

-- ---------------------------------------------------------------------------
-- Trigger: auto-create a profiles row on first signup.
-- Pulls handle from X OAuth raw_user_meta_data when present.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  meta_handle text;
  meta_avatar text;
begin
  meta_handle := coalesce(
    new.raw_user_meta_data ->> 'user_name',
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'name'
  );
  meta_avatar := coalesce(
    new.raw_user_meta_data ->> 'avatar_url',
    new.raw_user_meta_data ->> 'picture'
  );
  insert into public.profiles (id, handle, avatar_url)
  values (new.id, meta_handle, meta_avatar)
  on conflict (id) do nothing;

  insert into public.user_stats (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
--  Row Level Security
-- ============================================================================

alter table profiles   enable row level security;
alter table rounds     enable row level security;
alter table predictions enable row level security;
alter table user_stats enable row level security;

-- --- profiles: public read, self update (handle/avatar/wallet only) -------
drop policy if exists profiles_select_public on profiles;
create policy profiles_select_public on profiles
  for select using (true);

drop policy if exists profiles_update_self on profiles;
create policy profiles_update_self on profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists profiles_insert_self on profiles;
create policy profiles_insert_self on profiles
  for insert with check (auth.uid() = id);

-- --- rounds: public read (results reveal after lock) -----------------------
drop policy if exists rounds_select_public on rounds;
create policy rounds_select_public on rounds
  for select using (true);

-- Only the service role (settle cron) updates round status/results.
-- We do not grant update to anon/auth users.

-- --- predictions -----------------------------------------------------------
-- INSERT: only your own row, and only while the round is still open.
drop policy if exists predictions_insert_own_open on predictions;
create policy predictions_insert_own_open on predictions
  for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from rounds r
      where r.id = predictions.round_id
        and r.status = 'open'
    )
  );

-- SELECT: your own predictions always; others' only once the round is locked.
-- Secrecy — forecasts are hidden until the cutoff so nobody can free-ride.
drop policy if exists predictions_select_own_or_locked on predictions;
create policy predictions_select_own_or_locked on predictions
  for select using (
    auth.uid() = user_id
    or exists (
      select 1 from rounds r
      where r.id = predictions.round_id
        and r.status in ('locked','settled','void')
    )
  );

-- --- user_stats: public read, self update is NOT allowed (cron owns writes) -
drop policy if exists user_stats_select_public on user_stats;
create policy user_stats_select_public on user_stats
  for select using (true);

-- ============================================================================
--  Done. Set env in Supabase + Vercel, then run `supabase db push`.
-- ============================================================================
