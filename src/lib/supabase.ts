import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// When the env vars are missing the app runs in demo mode (hardcoded data, self-selected role).
export const supabaseEnabled = Boolean(url && key);
export const supabase = supabaseEnabled
  ? createClient(url!, key!, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false } })
  : null;

export type Role = "student" | "club" | "faculty" | "techAdmin";
export interface Profile { id: string; role: Role; full_name: string | null; enrollment: string | null; university_id: string | null; }

export const toE164 = (v: string) => {
  const d = v.replace(/[\s\-()]/g, "");
  return d.startsWith("+") ? d : `+91${d}`;
};

export async function sendOtp(channel: "email" | "phone", value: string) {
  if (!supabase) return { error: new Error("Supabase not configured") };
  return channel === "email"
    ? supabase.auth.signInWithOtp({ email: value.toLowerCase(), options: { shouldCreateUser: true } })
    : supabase.auth.signInWithOtp({ phone: toE164(value), options: { shouldCreateUser: true } });
}

export async function verifyOtp(channel: "email" | "phone", value: string, token: string) {
  if (!supabase) return { data: null, error: new Error("Supabase not configured") } as any;
  return channel === "email"
    ? supabase.auth.verifyOtp({ email: value.toLowerCase(), token, type: "email" })
    : supabase.auth.verifyOtp({ phone: toE164(value), token, type: "sms" });
}

export async function getProfile(userId: string): Promise<Profile | null> {
  if (!supabase) return null;
  const { data } = await supabase.from("profiles").select("id,role,full_name,enrollment,university_id").eq("id", userId).maybeSingle();
  return (data as Profile) ?? null;
}

export async function getCurrentSession(): Promise<{ role: Role; profile: Profile | null } | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;
  if (!user) return null;
  const profile = await getProfile(user.id);
  return { role: profile?.role ?? "student", profile };
}

export const signOut = async () => { if (supabase) await supabase.auth.signOut(); };

export function friendlyAuthError(e: any): string {
  const m = String(e?.message || "").toLowerCase();
  if (m.includes("rate") || m.includes("seconds")) return "Too many attempts. Please wait a minute and try again.";
  if (m.includes("expired") || m.includes("invalid")) return "That code is invalid or has expired.";
  if (m.includes("sms") || m.includes("phone provider")) return "Phone sign-in isn't available yet. Use email for now.";
  return "Something went wrong. Please try again.";
}
