import webpush from "web-push";
import { adminClient, env, json, safeEqual } from "./_lib/server.js";

// Supabase Database Webhook (table: notifications, event: INSERT) → this function → Web Push to every device the user enabled.
// Database webhooks are NOT signed, so we require a shared secret header: x-webhook-secret = PUSH_WEBHOOK_SECRET.
export async function POST(request: Request) {
  try {
    if (!safeEqual(request.headers.get("x-webhook-secret") ?? "", env("PUSH_WEBHOOK_SECRET"))) return json({ error: "Unauthorized" }, 401);

    const payload = (await request.json()) as { type?: string; record?: { user_id?: string; title?: string; body?: string } };
    const rec = payload.record;
    if (payload.type !== "INSERT" || !rec?.user_id) return json({ ok: true, skipped: true });

    webpush.setVapidDetails(`mailto:${env("VAPID_SUBJECT")}`, env("VAPID_PUBLIC_KEY", "VITE_VAPID_PUBLIC_KEY"), env("VAPID_PRIVATE_KEY"));
    const admin = adminClient();
    const { data: subs } = await admin.from("push_subscriptions").select("id,endpoint,p256dh,auth").eq("user_id", rec.user_id);

    let sent = 0, removed = 0;
    await Promise.all((subs ?? []).map(async s => {
      try {
        await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          JSON.stringify({ title: rec.title ?? "ClubSphere", body: rec.body ?? "", url: "/" }), { TTL: 3600 });
        sent++;
      } catch (err) {
        const code = (err as { statusCode?: number }).statusCode;
        if (code === 404 || code === 410) { await admin.from("push_subscriptions").delete().eq("id", s.id); removed++; } // device unsubscribed
        else console.error("push", code);
      }
    }));
    return json({ ok: true, sent, removed });
  } catch (e) {
    console.error("push-send", e);
    return json({ error: "Push failed" }, 500);
  }
}
