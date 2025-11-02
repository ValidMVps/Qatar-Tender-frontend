// File: app/api/contact/route.ts (Next.js App Router)
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 3; // Max 3 requests per IP per minute
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

function rateLimit(ip: string): boolean {

  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return false; // not limited
  }
  if (now - record.timestamp > RATE_LIMIT_WINDOW) {
    // reset window
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return false;
  }
  record.count++;
  if (record.count > RATE_LIMIT_MAX) {
    return true; // rate-limited
  }
  return false;
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
  // conservative email check
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function containsHeaderInjection(value = "") {
  // block CRLF which can be used for header injection
  return /[\r\n]/.test(value);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message, captchaToken, _honeypot } = body;

    // Honeypot check (frontend should send a hidden field that must be empty)
    if (_honeypot) {
      console.warn("Honeypot triggered - possible bot");
      return NextResponse.json({ success: false }, { status: 400 });
    }

    // Basic required fields validation
    if (!name || !email || !message || !captchaToken) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (
      !isValidEmail(email) ||
      containsHeaderInjection(email) ||
      containsHeaderInjection(name)
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid input" },
        { status: 400 }
      );
    }

    // Length limits to avoid large payload abuse
    if (name.length > 100 || email.length > 254 || message.length > 2000) {
      return NextResponse.json(
        { success: false, error: "Input too long" },
        { status: 413 }
      );
    }

    // Gather metadata
    const ip =
      (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";

    if (rateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Verify reCAPTCHA token
    const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;
    if (!RECAPTCHA_SECRET) {
      console.error("RECAPTCHA_SECRET_KEY is not set");
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${captchaToken}&remoteip=${ip}`;
    const verifyRes = await fetch(verifyUrl, { method: "POST" });
    const verifyData = await verifyRes.json();

    if (!verifyData.success) {
      console.warn("reCAPTCHA verification failed:", verifyData["error-codes"]);
      return NextResponse.json(
        { success: false, error: "CAPTCHA verification failed" },
        { status: 400 }
      );
    }

    // Safe escaped values for HTML output
    const safeName = escapeHtml(name.trim());
    const safeEmail = escapeHtml(email.trim());
    const safeMessage = escapeHtml(message.trim());

    const userAgent = req.headers.get("user-agent") || "unknown";
    const createdAt = new Date().toISOString();

    // Create transporter - prefer a transactional provider (SendGrid/Mailgun/Postmark) for reliability
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465, // true when using 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // optional: pool: true, maxConnections: 5
    });

    // Plain-text fallback
    const plainText = [
      `New contact form message`,
      `Name: ${name}`,
      `Email: ${email}`,
      `IP: ${ip}`,
      `User-Agent: ${userAgent}`,
      `Date: ${createdAt}`,
      ``,
      `Message:`,
      `${message}`,
    ].join("\n");

    // HTML template (simple, safe, responsive-ish)
    const html = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <style>
            body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; color:#111; }
            .container { max-width:640px; margin:20px auto; padding:20px; border-radius:8px; background:#fff; box-shadow:0 6px 18px rgba(0,0,0,0.06); }
            .meta { font-size:12px; color:#6b7280; margin-bottom:12px; }
            .label { font-weight:600; margin-top:10px; }
            .message { white-space:pre-wrap; background:#f9fafb; padding:12px; border-radius:6px; margin-top:6px; }
            .footer { margin-top:18px; font-size:12px; color:#6b7280; }
            .logo { height:28px; margin-bottom:8px; }
          </style>
        </head>
        <body>
          <div class="container">
        
            <h2>New message from contact form</h2>
            <div>
              <div class="label">Name</div>
              <div>${safeName}</div>
              <div class="label">{t('email')}</div>
              <div><a href="mailto:${safeEmail}">${safeEmail}</a></div>
              <div class="label">{t('message')}</div>
              <div class="message">${safeMessage}</div>
            </div>
            <div class="footer">
              This email was generated by Go Tenderly contact form.
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"Go Tenderly Contact" <${process.env.SMTP_USER}>`,
      to: process.env.SUPPORT_EMAIL || process.env.SMTP_USER,
      replyTo: safeEmail,
      subject: `Contact form: ${safeName}`,
      text: plainText,
      html,
      // envelope: { from: process.env.SMTP_USER, to: process.env.SUPPORT_EMAIL }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { success: false, error: "Error sending message" },
      { status: 500 }
    );
  }
}
