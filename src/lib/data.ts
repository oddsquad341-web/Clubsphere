import { supabase } from "./supabase";

// Shape the UI already uses for events
export interface UiEvent {
  id: string | number; title: string; club: string; date: string; time: string; venue: string;
  category: string; spots: number; registered: number; emoji: string; desc: string;
  price: number; status: string; poster_url?: string | null;
}

const mapEvent = (r: any, counts: Record<string, number>): UiEvent => ({
  id: r.id, title: r.title, club: r.clubs?.name ?? "", date: r.date ?? "TBD", time: r.time ?? "TBD",
  venue: r.venue ?? "TBD", category: r.category ?? "General", spots: r.spots ?? 100,
  registered: counts[r.id] ?? 0, emoji: r.emoji ?? "📌", desc: r.description ?? "",
  price: r.price ?? 0, status: r.status, poster_url: r.poster_url,
});

export async function fetchEvents(): Promise<UiEvent[]> {
  if (!supabase) return [];
  const [ev, st] = await Promise.all([
    supabase.from("events").select("*, clubs(name)").order("created_at", { ascending: false }),
    supabase.from("event_stats").select("event_id, registered"),
  ]);
  if (ev.error) throw ev.error;
  const counts: Record<string, number> = {};
  (st.data ?? []).forEach((s: any) => { counts[s.event_id] = Number(s.registered); });
  return (ev.data ?? []).map(r => mapEvent(r, counts));
}

async function myClubId(): Promise<string | null> {
  if (!supabase) return null;
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return null;
  const { data } = await supabase.from("clubs").select("id").eq("admin_id", u.user.id).limit(1).maybeSingle();
  return data?.id ?? null;
}

export async function createEventDb(e: Omit<UiEvent, "id" | "registered" | "club" | "desc"> & { desc?: string }) {
  if (!supabase) throw new Error("Supabase not configured");
  const { data: u } = await supabase.auth.getUser();
  const club_id = await myClubId();
  const { data, error } = await supabase.from("events").insert({
    club_id, title: e.title, description: e.desc ?? "", category: e.category, date: e.date, time: e.time,
    venue: e.venue, emoji: e.emoji, spots: e.spots, price: e.price, status: e.status, created_by: u.user?.id,
  }).select("*, clubs(name)").single();
  if (error) throw error;
  return mapEvent(data, {});
}

export async function deleteEventDb(id: string | number) {
  if (!supabase) return;
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw error;
}

export async function getMyRegistration(eventId: string | number) {
  if (!supabase) return null;
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return null;
  const { data } = await supabase.from("registrations").select("id,status").eq("event_id", eventId).eq("student_id", u.user.id).maybeSingle();
  return data;
}

// Paid events are stored as 'pending' until real payment verification lands in Batch 8.
export async function registerForEvent(eventId: string | number, paid: boolean) {
  if (!supabase) throw new Error("Supabase not configured");
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Not signed in");
  const { error } = await supabase.from("registrations").insert({
    event_id: eventId, student_id: u.user.id, status: paid ? "pending" : "confirmed",
  });
  if (error) throw error;
}

// ── Clubs ────────────────────────────────────────────────────────────────────
export interface UiClub {
  id: string | number; name: string; emoji: string; category: string; members: number;
  events: number; following: boolean; desc: string; level: string;
}

export async function fetchClubs(): Promise<UiClub[]> {
  if (!supabase) return [];
  const { data: u } = await supabase.auth.getUser();
  const [cl, st, fo] = await Promise.all([
    supabase.from("clubs").select("*").order("name"),
    supabase.from("club_stats").select("club_id, followers, events"),
    u.user ? supabase.from("club_follows").select("club_id").eq("student_id", u.user.id) : Promise.resolve({ data: [] as any[] }),
  ]);
  if (cl.error) throw cl.error;
  const stats: Record<string, any> = {};
  (st.data ?? []).forEach((s: any) => { stats[s.club_id] = s; });
  const mine = new Set((fo.data ?? []).map((f: any) => f.club_id));
  return (cl.data ?? []).map((c: any) => ({
    id: c.id, name: c.name, emoji: c.emoji ?? "🏆", category: c.category ?? "General",
    members: Number(stats[c.id]?.followers ?? 0), events: Number(stats[c.id]?.events ?? 0),
    following: mine.has(c.id), desc: c.description ?? "", level: c.level ?? "university",
  }));
}

export async function setFollow(clubId: string | number, follow: boolean) {
  if (!supabase) return;
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Not signed in");
  const q = follow
    ? supabase.from("club_follows").insert({ club_id: clubId, student_id: u.user.id })
    : supabase.from("club_follows").delete().eq("club_id", clubId).eq("student_id", u.user.id);
  const { error } = await q;
  if (error) throw error;
}

// ── My applications (registrations) ─────────────────────────────────────────
export interface UiApp {
  id: string | number; event: string; club: string; date: string; applied: string;
  status: string; attended: boolean;
}
const STATUS_MAP: Record<string, string> = { confirmed: "approved", pending: "pending", cancelled: "rejected" };

export async function fetchMyApplications(): Promise<UiApp[]> {
  if (!supabase) return [];
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return [];
  const { data, error } = await supabase
    .from("registrations")
    .select("id,status,attended,created_at,events(title,date,clubs(name))")
    .eq("student_id", u.user.id).order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r: any) => ({
    id: r.id, event: r.events?.title ?? "Event", club: r.events?.clubs?.name ?? "",
    date: r.events?.date ?? "TBD",
    applied: new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    status: STATUS_MAP[r.status] ?? r.status, attended: !!r.attended,
  }));
}

// ── Universities ─────────────────────────────────────────────────────────────
export interface UiUniversity { id: string; name: string; campus: string; logo: string; active: boolean; clubs: number; students: number; events: number; }

export async function fetchUniversities(): Promise<UiUniversity[]> {
  if (!supabase) return [];
  const [un, st] = await Promise.all([
    supabase.from("universities").select("*").order("name"),
    supabase.from("university_stats").select("university_id, clubs, students, events"),
  ]);
  if (un.error) throw un.error;
  const stats: Record<string, any> = {};
  (st.data ?? []).forEach((s: any) => { stats[s.university_id] = s; });
  return (un.data ?? []).map((u: any) => ({
    id: u.id, name: u.name, campus: u.campus ?? "", logo: u.logo ?? "🏫", active: !!u.active,
    clubs: Number(stats[u.id]?.clubs ?? 0), students: Number(stats[u.id]?.students ?? 0), events: Number(stats[u.id]?.events ?? 0),
  }));
}

export async function createUniversityDb(u: { name: string; campus: string; logo: string }): Promise<UiUniversity> {
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase.from("universities").insert({ name: u.name, campus: u.campus, logo: u.logo || "🏫" }).select("*").single();
  if (error) throw error;
  return { id: data.id, name: data.name, campus: data.campus ?? "", logo: data.logo ?? "🏫", active: !!data.active, clubs: 0, students: 0, events: 0 };
}

export async function setUniversityActive(id: string, active: boolean) {
  if (!supabase) return;
  const { error } = await supabase.from("universities").update({ active }).eq("id", id);
  if (error) throw error;
}

export async function setMyUniversity(universityId: string) {
  if (!supabase) return;
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return;
  await supabase.from("profiles").update({ university_id: universityId }).eq("id", u.user.id).is("university_id", null);
}

// ── My club (club admin) ─────────────────────────────────────────────────────
export async function fetchMyClub(): Promise<{ id: string; name: string; followers: number } | null> {
  if (!supabase) return null;
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return null;
  const { data: c } = await supabase.from("clubs").select("id,name").eq("admin_id", u.user.id).limit(1).maybeSingle();
  if (!c) return null;
  const { data: s } = await supabase.from("club_stats").select("followers").eq("club_id", c.id).maybeSingle();
  return { id: c.id, name: c.name, followers: Number(s?.followers ?? 0) };
}

// ── Announcements ────────────────────────────────────────────────────────────
export interface UiAnnouncement { id: string | number; title: string; content: string; date: string; reach: number; emoji: string; }
const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export async function fetchAnnouncements(): Promise<UiAnnouncement[]> {
  if (!supabase) return [];
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return [];
  const club = await fetchMyClub();
  let q = supabase.from("announcements").select("*").order("created_at", { ascending: false });
  q = club ? q.eq("club_id", club.id) : q.eq("created_by", u.user.id);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map((a: any) => ({ id: a.id, title: a.title, content: a.content ?? "", date: fmtDate(a.created_at), reach: club?.followers ?? 0, emoji: a.emoji ?? "📢" }));
}

export async function createAnnouncementDb(a: { title: string; content: string; emoji: string }): Promise<UiAnnouncement> {
  if (!supabase) throw new Error("Supabase not configured");
  const { data: u } = await supabase.auth.getUser();
  const club = await fetchMyClub();
  const { data, error } = await supabase.from("announcements")
    .insert({ club_id: club?.id ?? null, title: a.title, content: a.content, emoji: a.emoji, created_by: u.user?.id })
    .select("*").single();
  if (error) throw error;
  return { id: data.id, title: data.title, content: data.content ?? "", date: fmtDate(data.created_at), reach: club?.followers ?? 0, emoji: data.emoji ?? "📢" };
}

export async function deleteAnnouncementDb(id: string | number) {
  if (!supabase) return;
  const { error } = await supabase.from("announcements").delete().eq("id", id);
  if (error) throw error;
}

// ── Volunteer / recruitment roles ───────────────────────────────────────────
export interface UiRole { id: string | number; title: string; open: number; applied: number; desc: string; }

export async function fetchRoles(): Promise<UiRole[]> {
  if (!supabase) return [];
  const club = await fetchMyClub();
  if (!club) return [];
  const { data, error } = await supabase.from("volunteer_roles").select("*").eq("club_id", club.id).order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r: any) => ({ id: r.id, title: r.title, open: r.open_slots ?? 1, applied: 0, desc: r.description ?? "" }));
}

export async function createRoleDb(r: { title: string; open: number; desc: string }): Promise<UiRole> {
  if (!supabase) throw new Error("Supabase not configured");
  const club = await fetchMyClub();
  if (!club) throw new Error("No club linked to this account");
  const { data, error } = await supabase.from("volunteer_roles")
    .insert({ club_id: club.id, title: r.title, description: r.desc, open_slots: r.open }).select("*").single();
  if (error) throw error;
  return { id: data.id, title: data.title, open: data.open_slots ?? 1, applied: 0, desc: data.description ?? "" };
}

export async function deleteRoleDb(id: string | number) {
  if (!supabase) return;
  const { error } = await supabase.from("volunteer_roles").delete().eq("id", id);
  if (error) throw error;
}
