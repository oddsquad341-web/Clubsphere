import crypto from "node:crypto";
import { adminClient, env, getUser, json } from "./_lib/server.js";

// POST /api/razorpay-order  { eventId }  →  creates a Razorpay order for a paid event.
// The amount is always read from the database, never from the browser.
export async function POST(request: Request) {
  try {
    const admin = adminClient();
    const user = await getUser(request, admin);
    if (!user) return json({ error: "Please sign in again." }, 401);

    const { eventId } = (await request.json().catch(() => ({}))) as { eventId?: string };
    if (!eventId) return json({ error: "Missing event." }, 400);

    const { data: event } = await admin.from("events").select("id,title,price,spots,status").eq("id", eventId).maybeSingle();
    if (!event || event.status !== "published") return json({ error: "This event isn't open for registration." }, 404);
    if (!event.price || event.price <= 0) return json({ error: "This event is free." }, 400);

    const { data: existing } = await admin.from("registrations").select("status").eq("event_id", eventId).eq("student_id", user.id).maybeSingle();
    if (existing && existing.status === "confirmed") return json({ error: "You're already registered." }, 409);

    const { count } = await admin.from("registrations").select("*", { count: "exact", head: true }).eq("event_id", eventId).neq("status", "cancelled");
    if ((count ?? 0) >= (event.spots ?? 0)) return json({ error: "This event is full." }, 409);

    const keyId = env("RAZORPAY_KEY_ID"), keySecret = env("RAZORPAY_KEY_SECRET");
    const amount = Math.round(Number(event.price) * 100); // paise
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64") },
      body: JSON.stringify({ amount, currency: "INR", receipt: `cs_${crypto.randomUUID().slice(0, 12)}`, notes: { event_id: event.id, student_id: user.id } }),
    });
    const order = (await res.json()) as { id?: string; error?: { description?: string } };
    if (!res.ok || !order.id) return json({ error: order.error?.description ?? "Couldn't start the payment." }, 502);

    const { error } = await admin.from("payments").insert({ event_id: event.id, student_id: user.id, order_id: order.id, amount_paise: amount });
    if (error) return json({ error: "Couldn't record the payment." }, 500);

    return json({ orderId: order.id, amount, currency: "INR", keyId, eventTitle: event.title });
  } catch (e) {
    console.error("razorpay-order", e);
    return json({ error: "Payments aren't configured yet." }, 500);
  }
}
