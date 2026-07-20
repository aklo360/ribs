import { NextResponse } from "next/server";
import {
  bookingSchema,
  FOUR_HOUR_SET_LENGTH,
  TWO_HOUR_SET_LENGTH,
} from "@/lib/booking-schema";
import { estimateBookingQuote } from "@/lib/booking-quote";
import { SITE } from "@/lib/content";

// Edge-safe: uses only fetch + Web APIs, so it runs in dev and on Cloudflare Pages.
export const runtime = "edge";

type BookingEmailProvider = "mailchimp-transactional" | "resend" | "unconfigured";

type MailchimpTransactionalSendResult = {
  email?: string;
  status?: string;
  reject_reason?: string | null;
  _id?: string;
};

function getMailchimpTransactionalKey(): string {
  return (
    process.env.MAILCHIMP_TRANSACTIONAL_API_KEY?.trim() ||
    process.env.MANDRILL_API_KEY?.trim() ||
    ""
  );
}

function getBookingEmailProvider(): BookingEmailProvider {
  if (process.env.RESEND_API_KEY?.trim()) return "resend";
  if (getMailchimpTransactionalKey()) return "mailchimp-transactional";
  return "unconfigured";
}

export async function GET() {
  const transactionalConfigured = Boolean(getMailchimpTransactionalKey());
  const resendConfigured = Boolean(process.env.RESEND_API_KEY?.trim());
  const fromConfigured = Boolean(process.env.BOOKING_FROM_EMAIL?.trim());

  return NextResponse.json({
    ok: true,
    bookingEmail: SITE.bookingEmail,
    emailConfigured:
      fromConfigured && (resendConfigured || transactionalConfigured),
    emailProvider: getBookingEmailProvider(),
    transactionalConfigured,
    resendConfigured,
    fromConfigured,
  });
}

function row(label: string, value: unknown): string {
  if (value === undefined || value === null || value === "") return "";
  const v = Array.isArray(value)
    ? value.length
      ? value.join(", ")
      : ""
    : typeof value === "boolean"
      ? value
        ? "Yes"
        : "No"
      : String(value);
  if (!v) return "";
  return `<tr>
    <td style="padding:6px 14px 6px 0;color:#8a93a8;font:500 13px/1.4 system-ui;white-space:nowrap;vertical-align:top">${label}</td>
    <td style="padding:6px 0;color:#10141f;font:500 14px/1.5 system-ui">${escapeHtml(v)}</td>
  </tr>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function sendMailchimpTransactionalEmail({
  key,
  from,
  to,
  replyTo,
  subject,
  html,
}: {
  key: string;
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  html: string;
}): Promise<{ ok: true } | { ok: false; status: number; detail: string }> {
  const response = await fetch(
    "https://mandrillapp.com/api/1.0/messages/send.json",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key,
        message: {
          html,
          subject,
          from_email: from,
          from_name: "Roots in Blue Stone",
          to: [{ email: to, type: "to" }],
          headers: { "Reply-To": replyTo },
          auto_text: true,
          track_opens: true,
          track_clicks: true,
          tags: ["booking-inquiry"],
        },
        async: false,
      }),
    }
  );

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    return { ok: false, status: response.status, detail };
  }

  const result = await response
    .json()
    .catch((): MailchimpTransactionalSendResult[] => []);
  const results = Array.isArray(result)
    ? (result as MailchimpTransactionalSendResult[])
    : [];
  const failed = results.find((entry) =>
    ["invalid", "rejected"].includes(String(entry.status ?? "").toLowerCase())
  );

  if (failed) {
    return {
      ok: false,
      status: 200,
      detail: `Mailchimp status: ${failed.status ?? "unknown"}${
        failed.reject_reason ? ` (${failed.reject_reason})` : ""
      }`,
    };
  }

  return { ok: true };
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const b = parsed.data;
  const quote = estimateBookingQuote(b);
  const performanceLength =
    b.repertoire === "Original Music"
      ? TWO_HOUR_SET_LENGTH
      : (b.setLength ?? (b.customHours === 4 ? FOUR_HOUR_SET_LENGTH : undefined));

  // Honeypot — silently accept bots without sending.
  if (b.company_website) {
    return NextResponse.json({ ok: true });
  }

  const html = `<div style="background:#0b0f1a;padding:24px">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#f4d699,#e0a84f);padding:20px 24px">
        <h1 style="margin:0;font:800 20px/1.2 system-ui;color:#1a1206">New Booking Inquiry</h1>
        <p style="margin:4px 0 0;font:500 13px/1.4 system-ui;color:#5a4515">Roots in Blue Stone</p>
      </div>
      <div style="padding:20px 24px">
        <table style="width:100%;border-collapse:collapse">
          ${row("Name", b.name)}
          ${row("Email", b.email)}
          ${row("Phone", b.phone)}
          ${row("Organization", b.organization)}
          ${row("Inquirer", b.inquirerType)}
          ${row("Event type", b.eventType)}
          ${row("Date", b.eventDate)}
          ${row("Flexible", b.dateFlexible)}
          ${row("Location", [b.city, b.region].filter(Boolean).join(", "))}
          ${row("Venue", b.venueName)}
          ${row("Setting", b.setting)}
          ${row("Audience", b.audienceSize)}
          ${row("Lineup", b.lineup)}
          ${row("Set length", performanceLength)}
          ${row("Repertoire", b.repertoire)}
          ${row("Live estimate shown", quote.label)}
          ${row("Sound", b.soundProvided)}
          ${row("Backline", b.backline)}
          ${row("Power on stage", b.powerAvailable)}
          ${row("Overhead coverage/shade", b.overheadCoverage)}
          ${row("Stage notes", b.stageNotes)}
          ${row("Message", b.message)}
        </table>
      </div>
    </div>
  </div>`;

  const provider = getBookingEmailProvider();
  const mailchimpTransactionalKey = getMailchimpTransactionalKey();
  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  const to = SITE.bookingEmail;
  const configuredFrom = process.env.BOOKING_FROM_EMAIL?.trim();
  const subject = `Booking: ${b.eventType ?? "Inquiry"} - ${b.name}${
    b.eventDate ? ` (${b.eventDate})` : ""
  }`;

  // Do not show a fake success on production if email delivery is not wired.
  if (provider === "unconfigured") {
    console.warn("[booking] Email delivery is not configured:", {
      hasName: Boolean(b.name),
      hasEmail: Boolean(b.email),
      eventType: b.eventType,
      date: b.eventDate,
      lineup: b.lineup,
      estimate: quote.label,
    });
    return NextResponse.json(
      {
        error: `Booking email is not connected yet. Please email ${SITE.bookingEmail} directly.`,
      },
      { status: 503 }
    );
  }

  if (!configuredFrom) {
    console.warn("[booking] Verified sender is not configured");
    return NextResponse.json(
      {
        error: `Booking email sender is not connected yet. Please email ${SITE.bookingEmail} directly.`,
      },
      { status: 503 }
    );
  }

  if (provider === "mailchimp-transactional") {
    const result = await sendMailchimpTransactionalEmail({
      key: mailchimpTransactionalKey,
      from: configuredFrom,
      to,
      replyTo: b.email,
      subject,
      html,
    });

    if (!result.ok) {
      console.error("[booking] Mailchimp Transactional error:", {
        status: result.status,
        detail: result.detail,
      });
      return NextResponse.json({ error: "Email failed to send" }, { status: 502 });
    }

    return NextResponse.json({
      ok: true,
      delivered: true,
      provider: "mailchimp-transactional",
    });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Roots in Blue Stone <${configuredFrom}>`,
      to: [to],
      reply_to: b.email,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("[booking] Resend error:", res.status, detail);
    return NextResponse.json({ error: "Email failed to send" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, delivered: true, provider: "resend" });
}
