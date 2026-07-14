import { NextResponse } from "next/server";

export const runtime = "edge";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const SERVER_PREFIX_RE = /^[a-z]{2,}\d+$/i;
const SUBSCRIBE_STATUSES = new Set([
  "subscribed",
  "pending",
  "unsubscribed",
  "cleaned",
  "transactional",
]);

type MailchimpError = {
  title?: string;
  detail?: string;
  status?: number;
};

function getString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function getServerPrefix(apiKey: string): string {
  const explicit = process.env.MAILCHIMP_SERVER_PREFIX?.trim();
  if (explicit) return explicit;
  return apiKey.split("-").at(-1)?.trim() ?? "";
}

function getSubscribeStatus(): string {
  const status = process.env.MAILCHIMP_SUBSCRIBE_STATUS?.trim() || "pending";
  return SUBSCRIBE_STATUSES.has(status) ? status : "pending";
}

function getTags(): string[] {
  return (process.env.MAILCHIMP_TAGS ?? "Website Signup")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

async function readMailchimpError(response: Response): Promise<MailchimpError> {
  try {
    const json = await response.json();
    if (json && typeof json === "object") return json as MailchimpError;
  } catch {
    // The API normally returns JSON, but keep failures generic and PII-safe.
  }
  return {};
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const payload = json && typeof json === "object" ? json : {};
  const email = getString((payload as Record<string, unknown>).email).toLowerCase();
  const honeypot = getString((payload as Record<string, unknown>).company_website);

  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email" }, { status: 422 });
  }

  const apiKey = process.env.MAILCHIMP_API_KEY?.trim();
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID?.trim();

  if (!apiKey || !audienceId) {
    console.warn("[newsletter] Mailchimp is not configured");
    return NextResponse.json(
      { error: "Newsletter signup is not connected yet" },
      { status: 503 }
    );
  }

  const serverPrefix = getServerPrefix(apiKey);
  if (!SERVER_PREFIX_RE.test(serverPrefix)) {
    console.error("[newsletter] Invalid Mailchimp server prefix");
    return NextResponse.json(
      { error: "Newsletter signup is not configured correctly" },
      { status: 503 }
    );
  }

  const tags = getTags();
  const response = await fetch(
    `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`ribs:${apiKey}`)}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        status: getSubscribeStatus(),
        ...(tags.length ? { tags } : {}),
      }),
    }
  );

  if (response.ok) {
    const result = await response.json().catch(() => ({}));
    const status = getString((result as Record<string, unknown>).status);
    return NextResponse.json({ ok: true, status });
  }

  const detail = await readMailchimpError(response);
  const title = detail.title ?? "";
  const message = detail.detail ?? "";
  const duplicate =
    response.status === 400 &&
    /member exists|already.+list|already.+subscribed/i.test(`${title} ${message}`);

  if (duplicate) {
    return NextResponse.json({ ok: true, alreadySubscribed: true });
  }

  const invalidEmail =
    response.status === 400 && /invalid|email/i.test(`${title} ${message}`);

  console.error("[newsletter] Mailchimp error:", {
    status: response.status,
    title: title || "Unknown error",
  });

  return NextResponse.json(
    {
      error: invalidEmail
        ? "Enter a valid email"
        : "Newsletter signup failed. Try again.",
    },
    { status: invalidEmail ? 422 : 502 }
  );
}
