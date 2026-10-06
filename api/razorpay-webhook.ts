import { adminClient, env, hmacHex, json, safeEqual } from "./_lib/server.js";
import { confirmPayment } from "./_lib/payments.js";

// POST /api/razorpay-webhook — backup path so a paid student is confirmed even if their browser closed before /razorpay-verify.
// In the Razorpay dashboard: Webhooks → URL https://<your-domain>/api/razorpay-webhook, events payment.captured + payment.failed.
export async function POST(request: Request) {
  const raw = await request.text(); // raw body is required for the signature check
  try {
    const signature = request.headers.get("x-razorpay-signature") ?? "";
    if (!signature || !safeEqual(hmacHex(env("RAZORPAY_WEBHOOK_SECRET"), raw), signature)) return json({ error: "Bad signature" }, 400);

    const event = JSON.parse(raw) as { event: string; payload?: { payment?: { entity?: { id: string; order_id: string } } } };
    const entity = event.payload?.payment?.entity;
    if (!entity?.order_id) return json({ ok: true });

    const admin = adminClient();
    if (event.event === "payment.captured") await confirmPayment(admin, entity.order_id, entity.id);
    else if (event.event === "payment.failed") await admin.from("payments").update({ status: "failed", payment_id: entity.id }).eq("order_id", entity.order_id).eq("status", "created");
    return json({ ok: true });
  } catch (e) {
    console.error("razorpay-webhook", e);
    return json({ error: "Webhook error" }, 500); // non-2xx makes Razorpay retry
  }
}
