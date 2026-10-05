-- ClubSphere schema (Batch 6). Run once in Supabase → SQL Editor.
-- Roles live in profiles.role and can only be changed by a techAdmin.

create table public.universities (
  id uuid primary key default gen_random_uuid(),
  name text not null, campus text, logo text default '🏫', active boolean default true,
  created_at timestamptz default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'student' check (role in ('student','club','faculty','techAdmin')),
  full_name text, enrollment text,
  university_id uuid references public.universities(id),
  created_at timestamptz default now()
);

create table public.clubs (
  id uuid primary key default gen_random_uuid(),
  university_id uuid references public.universities(id),
  name text not null, category text, description text, emoji text default '🏆',
  admin_id uuid references public.profiles(id),
  created_at timestamptz default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  club_id uuid references public.clubs(id) on delete cascade,
  title text not null, description text, category text default 'General',
  date text, time text, venue text, emoji text default '📌',
  spots int default 100, price int default 0, poster_url text,
  status text not null default 'published' check (status in ('draft','scheduled','published','cancelled')),
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'confirmed' check (status in ('pending','confirmed','cancelled')),
  attended boolean default false,
  created_at timestamptz default now(),
  unique (event_id, student_id)
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  club_id uuid references public.clubs(id) on delete cascade,
  title text not null, content text, emoji text default '📢',
  created_by uuid references public.profiles(id), created_at timestamptz default now()
);

create table public.volunteer_roles (
  id uuid primary key default gen_random_uuid(),
  club_id uuid references public.clubs(id) on delete cascade,
  title text not null, description text, open_slots int default 1,
  created_at timestamptz default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null, body text, read boolean default false, created_at timestamptz default now()
);

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id), action text not null, target text,
  created_at timestamptz default now()
);

-- Role helper (security definer avoids RLS recursion on profiles)
create or replace function public.app_role() returns text
language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;

-- Auto-create a student profile on first sign-in
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Row Level Security
alter table public.universities     enable row level security;
alter table public.profiles         enable row level security;
alter table public.clubs            enable row level security;
alter table public.events           enable row level security;
alter table public.registrations    enable row level security;
alter table public.announcements    enable row level security;
alter table public.volunteer_roles  enable row level security;
alter table public.notifications    enable row level security;
alter table public.audit_log        enable row level security;

-- profiles: read own (techAdmin/faculty read all); update own but never the role
create policy "profiles read" on public.profiles for select using (id = auth.uid() or public.app_role() in ('techAdmin','faculty'));
create policy "profiles update own" on public.profiles for update using (id = auth.uid())
  with check (id = auth.uid() and role = public.app_role());
create policy "profiles admin update" on public.profiles for update using (public.app_role() = 'techAdmin');

-- public catalogue (guest browsing allowed)
create policy "universities read" on public.universities for select using (true);
create policy "universities admin" on public.universities for all using (public.app_role() = 'techAdmin') with check (public.app_role() = 'techAdmin');
create policy "clubs read" on public.clubs for select using (true);
create policy "clubs manage" on public.clubs for all using (public.app_role() in ('club','faculty','techAdmin')) with check (public.app_role() in ('club','faculty','techAdmin'));
create policy "events read" on public.events for select using (status = 'published' or public.app_role() in ('club','faculty','techAdmin'));
create policy "events manage" on public.events for all using (public.app_role() in ('club','faculty','techAdmin')) with check (public.app_role() in ('club','faculty','techAdmin'));
create policy "announcements read" on public.announcements for select using (true);
create policy "announcements manage" on public.announcements for all using (public.app_role() in ('club','faculty','techAdmin')) with check (public.app_role() in ('club','faculty','techAdmin'));
create policy "volunteer read" on public.volunteer_roles for select using (true);
create policy "volunteer manage" on public.volunteer_roles for all using (public.app_role() in ('club','faculty','techAdmin')) with check (public.app_role() in ('club','faculty','techAdmin'));

-- registrations: students manage their own; organisers see and mark attendance
create policy "reg read" on public.registrations for select using (student_id = auth.uid() or public.app_role() in ('club','faculty','techAdmin'));
create policy "reg insert own" on public.registrations for insert with check (student_id = auth.uid());
create policy "reg cancel own" on public.registrations for update using (student_id = auth.uid()) with check (student_id = auth.uid() and attended = false);
create policy "reg organiser update" on public.registrations for update using (public.app_role() in ('club','faculty','techAdmin'));

create policy "notif own" on public.notifications for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "audit read" on public.audit_log for select using (public.app_role() in ('faculty','techAdmin'));
create policy "audit insert" on public.audit_log for insert with check (actor_id = auth.uid());

-- Storage: public-read bucket for event posters, organisers upload
insert into storage.buckets (id, name, public) values ('event-posters','event-posters', true) on conflict do nothing;
create policy "posters read" on storage.objects for select using (bucket_id = 'event-posters');
create policy "posters upload" on storage.objects for insert with check (bucket_id = 'event-posters' and public.app_role() in ('club','faculty','techAdmin'));
create policy "posters delete" on storage.objects for delete using (bucket_id = 'event-posters' and public.app_role() in ('club','faculty','techAdmin'));

-- To make yourself the first admin (run after you've signed in once):
-- update public.profiles set role = 'techAdmin' where id = (select id from auth.users where email = 'you@example.com');

-- Registration counts visible to everyone (RLS on registrations hides other students' rows).
-- Runs with owner rights on purpose; exposes only counts, never who registered.
create or replace view public.event_stats as
  select event_id, count(*) filter (where status <> 'cancelled') as registered
  from public.registrations group by event_id;
grant select on public.event_stats to anon, authenticated;

-- ── Batch 6c: clubs + follows ────────────────────────────────────────────────
alter table public.clubs add column if not exists level text default 'university' check (level in ('university','institute'));

create table if not exists public.club_follows (
  club_id uuid not null references public.clubs(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (club_id, student_id)
);
alter table public.club_follows enable row level security;
create policy "follows own" on public.club_follows for all using (student_id = auth.uid()) with check (student_id = auth.uid());
create policy "follows organiser read" on public.club_follows for select using (public.app_role() in ('club','faculty','techAdmin'));

-- follower + published-event counts for everyone (counts only)
create or replace view public.club_stats as
  select c.id as club_id,
         (select count(*) from public.club_follows f where f.club_id = c.id) as followers,
         (select count(*) from public.events e where e.club_id = c.id and e.status = 'published') as events
  from public.clubs c;
grant select on public.club_stats to anon, authenticated;

-- ── Batch 6d: universities stats, profile contact fields ─────────────────────
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists status text not null default 'active' check (status in ('active','suspended'));

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, phone) values (new.id, new.email, new.phone) on conflict do nothing;
  return new;
end $$;

-- backfill for users who signed in before this block was run
update public.profiles p set email = u.email, phone = u.phone from auth.users u where u.id = p.id and p.email is null and p.phone is null;

create or replace view public.university_stats as
  select u.id as university_id,
         (select count(*) from public.clubs c where c.university_id = u.id) as clubs,
         (select count(*) from public.profiles p where p.university_id = u.id) as students,
         (select count(*) from public.events e join public.clubs c on c.id = e.club_id
            where c.university_id = u.id and e.status = 'published') as events
  from public.universities u;
grant select on public.university_stats to anon, authenticated;

-- ── Batch 6e: user admin + hardened roles ────────────────────────────────────
-- Suspended accounts lose organiser/admin powers immediately (app_role() returns null)
create or replace function public.app_role() returns text
language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid() and status = 'active'
$$;
create or replace function public.my_status() returns text
language sql stable security definer set search_path = public as $$
  select status from public.profiles where id = auth.uid()
$$;

-- users may edit their own profile but never role or status (stops self-unsuspend / self-promote)
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles for update using (id = auth.uid())
  with check (id = auth.uid() and role = public.app_role() and status = public.my_status());

-- ── Batch 6f: event approval workflow + audit detail ─────────────────────────
alter table public.events drop constraint if exists events_status_check;
alter table public.events add constraint events_status_check
  check (status in ('draft','scheduled','pending','published','rejected','cancelled'));
alter table public.audit_log add column if not exists detail text;

-- Club admins cannot publish or reject their own events: new "published" events
-- become 'pending', and only faculty/techAdmin can move an event to published/rejected.
create or replace function public.events_guard_status() returns trigger
language plpgsql as $$
begin
  if public.app_role() = 'club' then
    if tg_op = 'INSERT' and new.status = 'published' then
      new.status := 'pending';
    elsif tg_op = 'UPDATE' and new.status is distinct from old.status and new.status in ('published','rejected') then
      raise exception 'Only faculty can approve or reject events';
    end if;
  end if;
  return new;
end $$;
drop trigger if exists events_guard_status on public.events;
create trigger events_guard_status before insert or update on public.events
  for each row execute function public.events_guard_status();
