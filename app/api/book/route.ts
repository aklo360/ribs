import { NextResponse } from "next/server";
import { bookingSchema } from "@/lib/booking-schema";
import { estimateBookingQuote } from "@/lib/booking-quote";

// Edge-safe: uses only fetch + Web APIs, so it runs in dev and on Cloudflare Pages.
export const runtime = "edge";

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
  const performanceLength = b.customHours ? `${b.customHours} hours` : b.setLength;

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
          ${row("Sound/PA", b.soundProvided)}
          ${row("Backline", b.backline)}
          ${row("Power on stage", b.powerAvailable)}
          ${row("Overhead coverage/shade", b.overheadCoverage)}
          ${row("Stage notes", b.stageNotes)}
          ${row("Budget", b.budget)}
          ${row("Travel/lodging", b.travelLodging)}
          ${row("Formal/upscale dress", b.formalDress)}
          ${row("Heard via", b.heardFrom)}
          ${row("Message", b.message)}
        </table>
      </div>
    </div>
  </div>`;

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.BOOKING_TO_EMAIL;
  const from = process.env.BOOKING_FROM_EMAIL ?? "bookings@rootsinbluestone.com";

  // Graceful no-op when not configured (keeps local/dev + previews working).
  if (!apiKey || !to) {
    console.log("[booking] Inquiry received (email not configured):", {
      name: b.name,
      email: b.email,
      eventType: b.eventType,
      date: b.eventDate,
      lineup: b.lineup,
      estimate: quote.label,
      budget: b.budget,
    });
    return NextResponse.json({ ok: true, delivered: false });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Roots in Blue Stone <${from}>`,
      to: [to],
      reply_to: b.email,
      subject: `Booking: ${b.eventType ?? "Inquiry"} — ${b.name}${
        b.eventDate ? ` (${b.eventDate})` : ""
      }`,
      html,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("[booking] Resend error:", res.status, detail);
    return NextResponse.json({ error: "Email failed to send" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, delivered: true });
}
