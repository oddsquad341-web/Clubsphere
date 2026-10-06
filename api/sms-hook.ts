import { env, json, verifyStandardWebhook } from "./_lib/server.js";

// Supabase Auth → "Send SMS" HTTPS hook. Supabase generates the OTP; this function only delivers it through MSG91.
// Dashboard: Authentication → Hooks → Send SMS → HTTPS → https://<your-domain>/api/sms-hook, then copy the secret into SEND_SMS_HOOK_SECRET.
export async function POST(request: Request) {
  const raw = await request.text();
  try {
    if (!verifyStandardWebhook(raw, request.headers, env("SEND_SMS_HOOK_SECRET"))) {
      return json({ error: { http_code: 401, message: "Invalid signature" } }, 401);
    }
    const { user, sms } = JSON.parse(raw) as { user: { phone?: string }; sms: { otp: string } };
    const mobile = (user.phone ?? "").replace(/\D/g, ""); // MSG91 wants e.g. 919876543210 (no +)
    if (!mobile || !sms?.otp) return json({ error: { http_code: 400, message: "Missing phone or otp" } }, 400);

    const url = new URL("https://control.msg91.com/api/v5/otp");
    url.searchParams.set("template_id", env("MSG91_TEMPLATE_ID"));
    url.searchParams.set("mobile", mobile);
    url.searchParams.set("otp", sms.otp);
    url.searchParams.set("otp_length", String(sms.otp.length));
    const res = await fetch(url, { method: "POST", headers: { authkey: env("MSG91_AUTH_KEY"), "content-type": "application/json", accept: "application/json" }, body: "{}" });
    const out = (await res.json().catch(() => ({}))) as { type?: string; message?: string };
    // MSG91 can answer HTTP 200 with type:"error" (e.g. invalid authkey, IP not whitelisted, DLT template mismatch)
    if (!res.ok || out.type !== "success") {
      console.error("msg91", res.status, out);
      return json({ error: { http_code: 502, message: out.message ?? "SMS provider rejected the request" } }, 502);
    }
    return json({});
  } catch (e) {
    console.error("sms-hook", e);
    return json({ error: { http_code: 500, message: "SMS hook failed" } }, 500);
  }
}
