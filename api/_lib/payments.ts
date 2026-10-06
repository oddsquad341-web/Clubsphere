import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Marks a payment as paid and confirms the student's registration. Idempotent: safe to call from both
 * the browser verify step and the Razorpay webhook. Runs with the service role, so the capacity trigger
 * is skipped on purpose (a student who has paid is never left without a ticket).
 */
export async function confirmPayment(admin: SupabaseClient, orderId: string, paymentId: string) {
  const { data: payment, error } = await admin.from("payments").select("*").eq("order_id", orderId).maybeSingle();
  if (error) throw error;
  if (!payment) return { ok: false as const, reason: "unknown_order" };
  if (payment.status !== "paid") {
    const { error: upErr } = await admin.from("payments")
      .update({ status: "paid", payment_id: paymentId, paid_at: new Date().toISOString() }).eq("id", payment.id);
    if (upErr) throw upErr;
  }
  const { error: regErr } = await admin.from("registrations")
    .upsert({ event_id: payment.event_id, student_id: payment.student_id, status: "confirmed" }, { onConflict: "event_id,student_id" });
  if (regErr) throw regErr;
  return { ok: true as const, eventId: payment.event_id as string, studentId: payment.student_id as string };
}
