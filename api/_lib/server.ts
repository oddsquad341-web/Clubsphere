import crypto from "node:crypto";
import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

export function env(name: string, fallback?: string): string {
  const v = process.env[name] ?? (fallback ? process.env[fallback] : undefined);
  if (!v) throw new Error(`Missing environment variable ${name}`);
  return v;
}

/** Service-role client: bypasses RLS. Only ever used server-side, after the caller has been authenticated. */
export function adminClient(): SupabaseClient {
  return createClient(env("SUPABASE_URL", "VITE_SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Resolves the signed-in user from the `Authorization: Bearer <access token>` header. */
export async function getUser(request: Request, admin: SupabaseClient): Promise<User | null> {
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return null;
  const { data, error } = await admin.auth.getUser(token);
  return error ? null : data.user;
}

export function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

export const hmacHex = (secret: string, data: string) => crypto.createHmac("sha256", secret).update(data).digest("hex");

/** Standard Webhooks verification (used by Supabase Auth Hooks). Secret format: `v1,whsec_<base64>`; `|` separates rotated secrets. */
export function verifyStandardWebhook(raw: string, headers: Headers, secretList: string, toleranceSec = 300): boolean {
  const id = headers.get("webhook-id"), ts = headers.get("webhook-timestamp"), sigHeader = headers.get("webhook-signature");
  if (!id || !ts || !sigHeader) return false;
  const age = Math.abs(Date.now() / 1000 - Number(ts));
  if (!Number.isFinite(age) || age > toleranceSec) return false;
  const sigs = sigHeader.split(" ").map(p => p.split(",")).filter(p => p[0] === "v1").map(p => p[1] ?? "");
  return secretList.split("|").some(secret => {
    const key = Buffer.from(secret.trim().replace(/^v1,/, "").replace(/^whsec_/, ""), "base64");
    const expected = crypto.createHmac("sha256", key).update(`${id}.${ts}.${raw}`).digest("base64");
    return sigs.some(s => s && safeEqual(s, expected));
  });
}
