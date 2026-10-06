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

-- ── Batch 6g: per-club access control (fixes over-broad club policies) ───────
-- Before this block ANY club admin could read/edit ANY club's events, registrations,
-- announcements and roles. Run this block to scope everything to the admin's own club.
create or replace function public.is_club_admin(cid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select public.app_role() = 'club' and exists (select 1 from public.clubs where id = cid and admin_id = auth.uid())
$$;
create or replace function public.is_event_club_admin(eid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select public.app_role() = 'club' and exists (
    select 1 from public.events e join public.clubs c on c.id = e.club_id where e.id = eid and c.admin_id = auth.uid())
$$;

-- events
drop policy if exists "events read" on public.events;
drop policy if exists "events manage" on public.events;
create policy "events read" on public.events for select
  using (status = 'published' or public.app_role() in ('faculty','techAdmin') or public.is_club_admin(club_id));
create policy "events staff manage" on public.events for all
  using (public.app_role() in ('faculty','techAdmin')) with check (public.app_role() in ('faculty','techAdmin'));
create policy "events club manage" on public.events for all
  using (public.is_club_admin(club_id)) with check (public.is_club_admin(club_id));

-- clubs
drop policy if exists "clubs manage" on public.clubs;
create policy "clubs staff manage" on public.clubs for all
  using (public.app_role() in ('faculty','techAdmin')) with check (public.app_role() in ('faculty','techAdmin'));
create policy "clubs own update" on public.clubs for update
  using (public.is_club_admin(id)) with check (public.is_club_admin(id) and admin_id = auth.uid());

-- announcements + volunteer roles
drop policy if exists "announcements manage" on public.announcements;
create policy "announcements staff manage" on public.announcements for all
  using (public.app_role() in ('faculty','techAdmin')) with check (public.app_role() in ('faculty','techAdmin'));
create policy "announcements club manage" on public.announcements for all
  using (public.is_club_admin(club_id)) with check (public.is_club_admin(club_id));
drop policy if exists "volunteer manage" on public.volunteer_roles;
create policy "volunteer staff manage" on public.volunteer_roles for all
  using (public.app_role() in ('faculty','techAdmin')) with check (public.app_role() in ('faculty','techAdmin'));
create policy "volunteer club manage" on public.volunteer_roles for all
  using (public.is_club_admin(club_id)) with check (public.is_club_admin(club_id));

-- registrations: students own; club admins only for their own events; staff all
drop policy if exists "reg read" on public.registrations;
drop policy if exists "reg organiser update" on public.registrations;
drop policy if exists "reg insert own" on public.registrations;
create policy "reg read" on public.registrations for select
  using (student_id = auth.uid() or public.app_role() in ('faculty','techAdmin') or public.is_event_club_admin(event_id));
create policy "reg organiser update" on public.registrations for update
  using (public.app_role() in ('faculty','techAdmin') or public.is_event_club_admin(event_id));
create policy "reg insert own" on public.registrations for insert
  with check (student_id = auth.uid() and exists (select 1 from public.events e where e.id = event_id and e.status = 'published'));

-- follows: club admins see/remove only their own club's followers
drop policy if exists "follows organiser read" on public.club_follows;
create policy "follows organiser read" on public.club_follows for select
  using (public.is_club_admin(club_id) or public.app_role() in ('faculty','techAdmin'));
create policy "follows club remove" on public.club_follows for delete using (public.is_club_admin(club_id));

-- let a club admin see names of students who follow or registered with their club
create policy "profiles club read" on public.profiles for select using (
  exists (select 1 from public.club_follows f join public.clubs c on c.id = f.club_id
          where f.student_id = profiles.id and c.admin_id = auth.uid())
  or exists (select 1 from public.registrations r join public.events e on e.id = r.event_id join public.clubs c on c.id = e.club_id
          where r.student_id = profiles.id and c.admin_id = auth.uid())
);

-- ── Batch 6h: profile fields + poster upload scoping ─────────────────────────
alter table public.profiles add column if not exists branch text;
alter table public.profiles add column if not exists year text;
alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists interests text[] default '{}';

-- posters must be uploaded into the uploader's own folder: <user id>/<file>
drop policy if exists "posters upload" on storage.objects;
drop policy if exists "posters delete" on storage.objects;
create policy "posters upload" on storage.objects for insert with check (
  bucket_id = 'event-posters' and public.app_role() in ('club','faculty','techAdmin')
  and (storage.foldername(name))[1] = auth.uid()::text);
create policy "posters delete" on storage.objects for delete using (
  bucket_id = 'event-posters' and (storage.foldername(name))[1] = auth.uid()::text);

-- ── Batch 6i: notifications (server-generated), core team ────────────────────
alter table public.notifications add column if not exists type text default 'event';
alter table public.notifications add column if not exists emoji text default '🔔';

-- clients can read/mark-read/delete their own notifications but cannot create them
drop policy if exists "notif own" on public.notifications;
create policy "notif read own" on public.notifications for select using (user_id = auth.uid());
create policy "notif update own" on public.notifications for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "notif delete own" on public.notifications for delete using (user_id = auth.uid());

create or replace function public.notify_registration() returns trigger
language plpgsql security definer set search_path = public as $$
declare t text;
begin
  select title into t from public.events where id = new.event_id;
  insert into public.notifications (user_id, title, body, type, emoji) values (
    new.student_id,
    case when new.status = 'pending' then 'Registration received' else 'Registration confirmed' end,
    case when new.status = 'pending' then 'Payment pending for ' || coalesce(t, 'the event')
         else 'You''re registered for ' || coalesce(t, 'the event') || ' ✓' end,
    'success', '🎟️');
  return new;
end $$;
drop trigger if exists notify_registration on public.registrations;
create trigger notify_registration after insert on public.registrations
  for each row execute function public.notify_registration();

create or replace function public.notify_event() returns trigger
language plpgsql security definer set search_path = public as $$
declare cname text; cemoji text;
begin
  if new.status = 'published' and (tg_op = 'INSERT' or old.status is distinct from 'published') and new.club_id is not null then
    select name, emoji into cname, cemoji from public.clubs where id = new.club_id;
    insert into public.notifications (user_id, title, body, type, emoji)
      select f.student_id, 'New event: ' || new.title, coalesce(cname, 'A club') || ' just posted a new event', 'event', coalesce(cemoji, '📅')
      from public.club_follows f where f.club_id = new.club_id;
  end if;
  if tg_op = 'UPDATE' and old.status = 'pending' and new.status in ('published','rejected') and new.created_by is not null then
    insert into public.notifications (user_id, title, body, type, emoji) values (
      new.created_by,
      case when new.status = 'published' then 'Event approved' else 'Event rejected' end,
      '"' || new.title || '" was ' || case when new.status = 'published' then 'approved by faculty' else 'rejected by faculty' end,
      case when new.status = 'published' then 'success' else 'warning' end,
      case when new.status = 'published' then '✅' else '❌' end);
  end if;
  return new;
end $$;
drop trigger if exists notify_event on public.events;
create trigger notify_event after insert or update on public.events
  for each row execute function public.notify_event();

create or replace function public.notify_announcement() returns trigger
language plpgsql security definer set search_path = public as $$
declare cname text;
begin
  if new.club_id is null then return new; end if;
  select name into cname from public.clubs where id = new.club_id;
  insert into public.notifications (user_id, title, body, type, emoji)
    select f.student_id, 'Announcement from ' || coalesce(cname, 'your club'), new.title, 'announcement', coalesce(new.emoji, '📢')
    from public.club_follows f where f.club_id = new.club_id;
  return new;
end $$;
drop trigger if exists notify_announcement on public.announcements;
create trigger notify_announcement after insert on public.announcements
  for each row execute function public.notify_announcement();

do $$ begin alter publication supabase_realtime add table public.notifications;
exception when duplicate_object then null; end $$;

create table if not exists public.club_team_members (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  name text not null, enrollment text, role_title text,
  created_at timestamptz default now()
);
alter table public.club_team_members enable row level security;
create policy "team staff" on public.club_team_members for all
  using (public.app_role() in ('faculty','techAdmin')) with check (public.app_role() in ('faculty','techAdmin'));
create policy "team club admin" on public.club_team_members for all
  using (public.is_club_admin(club_id)) with check (public.is_club_admin(club_id));

-- ── Batch 6j–9: settings, payments, push, club profile, capacity ─────────────
-- Platform settings (public read so the login screen can honour them; only Tech Admin writes)
create table if not exists public.platform_settings (
  key text primary key, value jsonb not null, updated_at timestamptz default now(), updated_by uuid references public.profiles(id)
);
alter table public.platform_settings enable row level security;
create policy "settings read" on public.platform_settings for select using (true);
create policy "settings admin write" on public.platform_settings for all
  using (public.app_role() = 'techAdmin') with check (public.app_role() = 'techAdmin');
insert into public.platform_settings (key, value) values
  ('otpEmail','true'),('otpSMS','true'),('guestBrowse','true'),('autoApprove','false'),
  ('maintenanceMode','false'),('maxClubs','50'),('idleMinutes','30')
on conflict (key) do nothing;

create or replace function public.setting_bool(k text, d boolean) returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select (value #>> '{}')::boolean from public.platform_settings where key = k), d)
$$;
create or replace function public.setting_int(k text, d int) returns int
language sql stable security definer set search_path = public as $$
  select coalesce((select (value #>> '{}')::int from public.platform_settings where key = k), d)
$$;

-- "Auto-approve club events" setting is now honoured by the approval trigger
create or replace function public.events_guard_status() returns trigger
language plpgsql as $$
declare auto boolean := public.setting_bool('autoApprove', false);
begin
  if public.app_role() = 'club' then
    if tg_op = 'INSERT' and new.status = 'published' and not auto then
      new.status := 'pending';
    elsif tg_op = 'UPDATE' and new.status is distinct from old.status
          and (new.status = 'rejected' or (new.status = 'published' and not auto)) then
      raise exception 'Only faculty can approve or reject events';
    end if;
  end if;
  return new;
end $$;

-- "Guest browsing" setting gates anonymous reads of events and clubs
drop policy if exists "events read" on public.events;
create policy "events read" on public.events for select using (
  (status = 'published' and (auth.uid() is not null or public.setting_bool('guestBrowse', true)))
  or public.app_role() in ('faculty','techAdmin') or public.is_club_admin(club_id));
drop policy if exists "clubs read" on public.clubs;
create policy "clubs read" on public.clubs for select using (auth.uid() is not null or public.setting_bool('guestBrowse', true));

-- "Max clubs per university" setting
create or replace function public.clubs_guard_limit() returns trigger
language plpgsql security definer set search_path = public as $$
declare mx int := public.setting_int('maxClubs', 50); n int;
begin
  if new.university_id is not null then
    select count(*) into n from public.clubs where university_id = new.university_id;
    if n >= mx then raise exception 'Club limit reached for this university'; end if;
  end if;
  return new;
end $$;
drop trigger if exists clubs_guard_limit on public.clubs;
create trigger clubs_guard_limit before insert on public.clubs for each row execute function public.clubs_guard_limit();

-- club public profile fields (about = description)
alter table public.clubs add column if not exists tagline text;
alter table public.clubs add column if not exists contact_email text;

-- Capacity is now enforced in the database (server/service-role confirmations are exempt so a paid student is never left without a ticket)
create or replace function public.registrations_guard_capacity() returns trigger
language plpgsql security definer set search_path = public as $$
declare cap int; n int;
begin
  if auth.role() = 'service_role' or new.status = 'cancelled' then return new; end if;
  select spots into cap from public.events where id = new.event_id;
  select count(*) into n from public.registrations where event_id = new.event_id and status <> 'cancelled';
  if cap is not null and n >= cap then raise exception 'Event is full'; end if;
  return new;
end $$;
drop trigger if exists registrations_guard_capacity on public.registrations;
create trigger registrations_guard_capacity before insert on public.registrations
  for each row execute function public.registrations_guard_capacity();

-- Payments: only the server (service role) writes; students can read their own
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete restrict,
  student_id uuid not null references public.profiles(id) on delete restrict,
  order_id text not null unique, payment_id text,
  amount_paise int not null, currency text not null default 'INR',
  status text not null default 'created' check (status in ('created','paid','failed')),
  created_at timestamptz default now(), paid_at timestamptz
);
alter table public.payments enable row level security;
create policy "payments read" on public.payments for select using (
  student_id = auth.uid() or public.app_role() in ('faculty','techAdmin') or public.is_event_club_admin(event_id));

-- Students can register themselves only for FREE events; paid registrations are created by /api/razorpay-verify
drop policy if exists "reg insert own" on public.registrations;
create policy "reg insert own" on public.registrations for insert with check (
  student_id = auth.uid() and exists (
    select 1 from public.events e where e.id = event_id and e.status = 'published' and coalesce(e.price, 0) = 0));

-- Web push subscriptions (one row per browser/device)
create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  endpoint text not null unique, p256dh text not null, auth text not null,
  created_at timestamptz default now()
);
alter table public.push_subscriptions enable row level security;
create policy "push own" on public.push_subscriptions for all using (user_id = auth.uid()) with check (user_id = auth.uid());
