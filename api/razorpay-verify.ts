import { adminClient, env, getUser, hmacHex, json, safeEqual } from "./_lib/server.js";
import { confirmPayment } from "./_lib/payments.js";

// POST /api/razorpay-verify  { orderId, paymentId, signature }
// Verifies Razorpay's signature (HMAC-SHA256 of "order_id|payment_id" with the key secret), then confirms the registration.
export async function POST(request: Request) {
  try {
    const admin = adminClient();
    const user = await getUser(request, admin);
    if (!user) return json({ error: "Please sign in again." }, 401);

    const { orderId, paymentId, signature } = (await request.json().catch(() => ({}))) as { orderId?: string; paymentId?: string; signature?: string };
    if (!orderId || !paymentId || !signature) return json({ error: "Missing payment details." }, 400);

    const { data: payment } = await admin.from("payments").select("student_id,status").eq("order_id", orderId).maybeSingle();
    if (!payment || payment.student_id !== user.id) return json({ error: "Unknown payment." }, 404);
    if (payment.status === "paid") return json({ ok: true });

    const expected = hmacHex(env("RAZORPAY_KEY_SECRET"), `${orderId}|${paymentId}`);
    if (!safeEqual(expected, signature)) return json({ error: "Payment verification failed." }, 400);

    const result = await confirmPayment(admin, orderId, paymentId);
    return result.ok ? json({ ok: true }) : json({ error: "Unknown payment." }, 404);
  } catch (e) {
    console.error("razorpay-verify", e);
    return json({ error: "Couldn't verify the payment." }, 500);
  }
}
