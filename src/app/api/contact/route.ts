import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

export const runtime = "nodejs";

const payloadSchema = z.object({
  contact: z.string().trim().min(3).max(120),
  message: z.string().trim().min(10).max(2000),
  company: z.string().optional()
});

type RateEntry = {
  count: number;
  resetAt: number;
  lastAt: number;
};

function getIp(headers: Headers) {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || "unknown";
  return headers.get("x-real-ip") || "unknown";
}

function getStore() {
  const globalAny = globalThis as unknown as { __contactRateLimit?: Map<string, RateEntry> };
  if (!globalAny.__contactRateLimit) globalAny.__contactRateLimit = new Map();
  return globalAny.__contactRateLimit;
}

function checkRateLimit(key: string) {
  const now = Date.now();
  const store = getStore();

  const windowMs = Number(process.env.CONTACT_RATE_LIMIT_WINDOW_MS ?? 10 * 60 * 1000);
  const max = Number(process.env.CONTACT_RATE_LIMIT_MAX ?? 3);
  const minIntervalMs = Number(process.env.CONTACT_RATE_LIMIT_MIN_INTERVAL_MS ?? 30_000);

  const entry = store.get(key);
  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs, lastAt: now });
    return { ok: true as const };
  }

  if (now - entry.lastAt < minIntervalMs) {
    const retryAfterSec = Math.ceil((minIntervalMs - (now - entry.lastAt)) / 1000);
    return { ok: false as const, retryAfterSec };
  }

  if (entry.count >= max) {
    const retryAfterSec = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
    return { ok: false as const, retryAfterSec };
  }

  entry.count += 1;
  entry.lastAt = now;
  store.set(key, entry);
  return { ok: true as const };
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  const ip = getIp(request.headers);
  const rate = checkRateLimit(`ip:${ip}`);
  if (!rate.ok) {
    return NextResponse.json(
      { ok: false, error: "RATE_LIMITED", retryAfterSec: rate.retryAfterSec },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSec) } }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "INVALID_JSON" }, { status: 400 });
  }

  const parsed = payloadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "INVALID_PAYLOAD" }, { status: 400 });
  }

  const { contact, message, company } = parsed.data;
  if (company && company.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM ?? process.env.SMTP_USER;
  const secure = (process.env.SMTP_SECURE ?? String(port === 465)) === "true";

  if (!host || !user || !pass || !to || !from) {
    return NextResponse.json({ ok: false, error: "NOT_CONFIGURED" }, { status: 503 });
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass }
  });

  const ua = request.headers.get("user-agent") ?? "";
  const referer = request.headers.get("referer") ?? "";
  const replyTo = isEmail(contact) ? contact : undefined;

  try {
    await transporter.sendMail({
      from,
      to,
      replyTo,
      subject: `[Portfolio] New message (${contact})`,
      text: [
        `Contact: ${contact}`,
        "",
        message,
        "",
        "---",
        `IP: ${ip}`,
        `User-Agent: ${ua}`,
        `Referer: ${referer}`
      ].join("\n")
    });
  } catch {
    return NextResponse.json({ ok: false, error: "SEND_FAILED" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

