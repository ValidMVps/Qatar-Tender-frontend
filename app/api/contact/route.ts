// File: app/api/contact/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

// --- Rate limiting configuration ---
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 3;
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return false;
  }
  if (now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return false;
  }
  record.count++;
  return record.count > RATE_LIMIT_MAX;
}

function escapeHtml(str = "") {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function containsHeaderInjection(value = "") {
  return /[\r\n]/.test(value);
}

// --- POST handler ---
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message, captchaToken, _honeypot } = body;

    if (_honeypot)
      return NextResponse.json({ success: false }, { status: 400 });

    if (!name || !email || !message || !captchaToken)
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );

    if (
      !isValidEmail(email) ||
      containsHeaderInjection(email) ||
      containsHeaderInjection(name)
    )
      return NextResponse.json(
        { success: false, error: "Invalid input format" },
        { status: 400 }
      );

    const ip =
      (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";

    if (rateLimit(ip))
      return NextResponse.json(
        { success: false, error: "Too many requests. Try again later." },
        { status: 429 }
      );

    // reCAPTCHA check
    const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;
    if (!RECAPTCHA_SECRET)
      return NextResponse.json(
        { success: false, error: "Server misconfiguration" },
        { status: 500 }
      );

    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${captchaToken}&remoteip=${ip}`;
    const verifyRes = await fetch(verifyUrl, { method: "POST" });
    const verifyData = await verifyRes.json();
    if (!verifyData.success)
      return NextResponse.json(
        { success: false, error: "CAPTCHA verification failed" },
        { status: 400 }
      );

    // Sanitize fields
    const safeName = escapeHtml(name.trim());
    const safeEmail = escapeHtml(email.trim());
    const safeMessage = escapeHtml(message.trim());

    // --- Use Resend for email sending ---
    const resend = new Resend(process.env.RESEND_API_KEY);

    const html = `
      <div style="font-family: system-ui, sans-serif; color:#111;">
        <h2>New message from Go Tenderly contact form</h2>
        <p><b>Name:</b> ${safeName}</p>
        <p><b>Email:</b> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
        <p><b>Message:</b></p>
        <pre style="background:#f9f9f9;padding:12px;border-radius:8px;">${safeMessage}</pre>
      </div>
    `;

    const data = await resend.emails.send({
      from: "Go Tenderly Contact <onboarding@resend.dev>",
      to: process.env.SUPPORT_EMAIL || "yourtestemail@gmail.com",
      subject: `Contact form message from ${safeName}`,
      html,
    });

    if (data.error) {
      console.error("Resend error:", data.error);
      return NextResponse.json(
        { success: false, error: "Email could not be sent" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
