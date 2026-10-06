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
    venue: e.venue, emoji: e.emoji, spots: e.spots, price: e.price, status: e.status, created_by: u.user?.id, poster_url: e.poster_url ?? null,
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

// ── Tech Admin: users, clubs, audit ─────────────────────────────────────────
export interface UiUser { id: string | number; name: string; email: string; role: string; university: string; status: string; joined: string; }

export async function currentUserId(): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export async function logAudit(action: string, target: string, detail?: string) {
  if (!supabase) return;
  const uid = await currentUserId();
  if (!uid) return;
  await supabase.from("audit_log").insert({ actor_id: uid, action, target, detail: detail ?? null }); // best effort
}

export async function fetchUsers(): Promise<UiUser[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("profiles").select("id,role,full_name,email,phone,status,created_at,universities(name)")
    .order("created_at", { ascending: false }).limit(500);
  if (error) throw error;
  return (data ?? []).map((p: any) => ({
    id: p.id, name: p.full_name || p.email || p.phone || "New user", email: p.email || p.phone || "—",
    role: p.role, university: p.universities?.name ?? "—", status: p.status,
    joined: new Date(p.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
  }));
}

export async function updateUserRole(id: string | number, role: string) {
  if (!supabase) return;
  const { error } = await supabase.from("profiles").update({ role }).eq("id", id);
  if (error) throw error;
}

export async function setUserStatus(id: string | number, status: "active" | "suspended") {
  if (!supabase) return;
  const { error } = await supabase.from("profiles").update({ status }).eq("id", id);
  if (error) throw error;
}

export interface AdminClub { id: string; name: string; category: string; emoji: string; level: string; admin_id: string | null; university: string; }

export async function fetchAdminClubs(): Promise<AdminClub[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from("clubs").select("id,name,category,emoji,level,admin_id,universities(name)").order("name");
  if (error) throw error;
  return (data ?? []).map((c: any) => ({ id: c.id, name: c.name, category: c.category ?? "General", emoji: c.emoji ?? "🏆", level: c.level ?? "university", admin_id: c.admin_id, university: c.universities?.name ?? "—" }));
}

export async function createClubDb(c: { name: string; category: string; emoji: string; level: string; university_id: string | null }) {
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase.from("clubs").insert({ name: c.name, category: c.category || "General", emoji: c.emoji || "🏆", level: c.level, university_id: c.university_id || null });
  if (error) throw error;
}

// Makes the user the club's admin (and promotes a student to the club role). One club per admin.
export async function assignClubAdmin(clubId: string, userId: string) {
  if (!supabase) throw new Error("Supabase not configured");
  const { data: other } = await supabase.from("clubs").select("id,name").eq("admin_id", userId).neq("id", clubId).limit(1).maybeSingle();
  if (other) throw new Error(`Already the admin of ${other.name}`);
  const { error } = await supabase.from("clubs").update({ admin_id: userId }).eq("id", clubId);
  if (error) throw error;
  await supabase.from("profiles").update({ role: "club" }).eq("id", userId).eq("role", "student");
}

// ── Faculty approvals + audit trail ─────────────────────────────────────────
export interface PendingEvent { id: string | number; title: string; club: string; date: string; submitted: string; category: string; }

export async function fetchPendingEvents(): Promise<PendingEvent[]> {
  if (!supabase) return [];
  const uid = await currentUserId();
  const { data: prof } = uid ? await supabase.from("profiles").select("university_id").eq("id", uid).maybeSingle() : { data: null };
  let q = supabase.from("events").select("id,title,date,category,created_at,clubs!inner(name,university_id)").eq("status", "pending").order("created_at");
  if (prof?.university_id) q = q.eq("clubs.university_id", prof.university_id); // faculty only see their own university
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map((e: any) => ({
    id: e.id, title: e.title, club: e.clubs?.name ?? "", date: e.date ?? "TBD", category: e.category ?? "General",
    submitted: new Date(e.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
  }));
}

export async function setEventStatus(id: string | number, status: "published" | "rejected") {
  if (!supabase) return;
  const { error } = await supabase.from("events").update({ status }).eq("id", id);
  if (error) throw error;
}

export interface AuditEntry { id: string | number; action: string; event: string; club: string; by: string; time: string; color: string; }

export async function fetchApprovalAudit(): Promise<AuditEntry[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("audit_log").select("id,action,target,detail,created_at,profiles(full_name,email)")
    .in("action", ["Approved", "Rejected"]).order("created_at", { ascending: false }).limit(200);
  if (error) throw error;
  return (data ?? []).map((a: any) => ({
    id: a.id, action: a.action, event: a.target ?? "", club: a.detail ?? "",
    by: a.profiles?.full_name || a.profiles?.email || "Unknown",
    time: new Date(a.created_at).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }),
    color: a.action === "Approved" ? "emerald" : "rose",
  }));
}

// ── Club admin: registrations, attendance, followers ────────────────────────
export interface UiReg { id: string | number; student: string; enroll: string; event: string; eventId: string | number | null; applied: string; status: string; attended: boolean; }

export async function fetchClubRegistrations(): Promise<UiReg[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("registrations")
    .select("id,status,attended,created_at,event_id,events(title),profiles(full_name,email,phone,enrollment)")
    .neq("status", "cancelled").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r: any) => ({
    id: r.id, student: r.profiles?.full_name || r.profiles?.email || r.profiles?.phone || "Student",
    enroll: r.profiles?.enrollment || r.profiles?.email || r.profiles?.phone || "—",
    event: r.events?.title ?? "Event", eventId: r.event_id,
    applied: new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    status: r.status === "confirmed" ? "approved" : r.status, attended: !!r.attended,
  }));
}

export async function setAttendedDb(regId: string | number, attended: boolean) {
  if (!supabase) return;
  const { error } = await supabase.from("registrations").update({ attended }).eq("id", regId);
  if (error) throw error;
}

export async function cancelRegistrationDb(regId: string | number) {
  if (!supabase) return;
  const { error } = await supabase.from("registrations").update({ status: "cancelled" }).eq("id", regId);
  if (error) throw error;
}

export interface UiFollower { id: string | number; name: string; enroll: string; }

export async function fetchFollowers(): Promise<UiFollower[]> {
  if (!supabase) return [];
  const club = await fetchMyClub();
  if (!club) return [];
  const { data, error } = await supabase.from("club_follows").select("student_id,profiles(full_name,email,phone,enrollment)").eq("club_id", club.id);
  if (error) throw error;
  return (data ?? []).map((f: any) => ({
    id: f.student_id, name: f.profiles?.full_name || f.profiles?.email || f.profiles?.phone || "Student",
    enroll: f.profiles?.enrollment || f.profiles?.email || f.profiles?.phone || "—",
  }));
}

export async function removeFollowerDb(studentId: string | number) {
  if (!supabase) return;
  const club = await fetchMyClub();
  if (!club) return;
  const { error } = await supabase.from("club_follows").delete().eq("club_id", club.id).eq("student_id", studentId);
  if (error) throw error;
}

// ── My profile + poster upload ──────────────────────────────────────────────
export interface MyProfile { name: string; enroll: string; branch: string; year: string; email: string; phone: string; bio: string; interests: string[]; university: string; }

export async function fetchMyProfile(): Promise<MyProfile | null> {
  if (!supabase) return null;
  const uid = await currentUserId();
  if (!uid) return null;
  const { data } = await supabase.from("profiles").select("*, universities(name)").eq("id", uid).maybeSingle();
  if (!data) return null;
  return {
    name: data.full_name ?? "", enroll: data.enrollment ?? "", branch: data.branch ?? "", year: data.year ?? "",
    email: data.email ?? "", phone: data.phone ?? "", bio: data.bio ?? "", interests: data.interests ?? [],
    university: (data as any).universities?.name ?? "",
  };
}

export async function saveMyProfile(p: { name: string; enroll: string; branch: string; year: string; bio: string; interests: string[] }) {
  if (!supabase) return;
  const uid = await currentUserId();
  if (!uid) throw new Error("Not signed in");
  const { error } = await supabase.from("profiles")
    .update({ full_name: p.name, enrollment: p.enroll, branch: p.branch, year: p.year, bio: p.bio, interests: p.interests }).eq("id", uid);
  if (error) throw error;
}

const POSTER_TYPES: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" };
export async function uploadPoster(file: File): Promise<string> {
  if (!supabase) throw new Error("Supabase not configured");
  const ext = POSTER_TYPES[file.type];
  if (!ext) throw new Error("Unsupported image type. Use PNG, JPG or WebP.");
  if (file.size > 2 * 1024 * 1024) throw new Error("Image must be under 2 MB.");
  const uid = await currentUserId();
  if (!uid) throw new Error("Not signed in");
  const path = `${uid}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("event-posters").upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  return supabase.storage.from("event-posters").getPublicUrl(path).data.publicUrl;
}
