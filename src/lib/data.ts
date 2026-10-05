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
