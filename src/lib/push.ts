import { supabase } from "./supabase";

const VAPID = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined;

const b64ToBytes = (b64: string) => {
  const pad = "=".repeat((4 - (b64.length % 4)) % 4);
  const raw = atob((b64 + pad).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, c => c.charCodeAt(0));
};

export const pushSupported = () =>
  !!supabase && !!VAPID && typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;

export async function pushEnabled(): Promise<boolean> {
  if (!pushSupported() || Notification.permission !== "granted") return false;
  const reg = await navigator.serviceWorker.ready;
  return !!(await reg.pushManager.getSubscription());
}

export async function enablePush(): Promise<"ok" | "denied" | "unsupported"> {
  if (!pushSupported()) return "unsupported";
  const perm = await Notification.requestPermission();
  if (perm !== "granted") return "denied";
  const reg = await navigator.serviceWorker.ready;
  const sub = (await reg.pushManager.getSubscription()) ?? (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToBytes(VAPID!) }));
  const j = sub.toJSON();
  const { data: u } = await supabase!.auth.getUser();
  if (!u.user || !j.endpoint || !j.keys) throw new Error("Not signed in");
  const { error } = await supabase!.from("push_subscriptions").upsert(
    { user_id: u.user.id, endpoint: j.endpoint, p256dh: j.keys.p256dh, auth: j.keys.auth }, { onConflict: "endpoint" });
  if (error) throw error;
  return "ok";
}

/** Removes this device's subscription (called on logout so the next person on a shared device doesn't get your pushes). */
export async function disablePush() {
  if (!pushSupported()) return;
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.getSubscription();
  if (!sub) return;
  await supabase!.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
  await sub.unsubscribe();
}
