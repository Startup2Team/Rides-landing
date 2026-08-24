// Minimal API client for the public landing site. The backend calls the
// landing makes — contact form and waitlist — post straight to the Go API.
import { VEHICLE_BACKEND_CODE, type VehicleSlug } from "./driver-registration";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

export type ContactSubmission = {
  name: string;
  email: string;
  subject: string;
  category?: string;
  body: string;
};

export type ContactReceipt = { id: string; status: string; created_at: string };

export async function submitContact(input: ContactSubmission): Promise<ContactReceipt> {
  const res = await fetch(`${BASE_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = json?.error?.message ?? "Could not send message. Please try again.";
    throw new Error(msg);
  }
  return (json?.data ?? json) as ContactReceipt;
}

// ── Waitlist ──────────────────────────────────────────────────────────────

export type WaitlistRole = "CUSTOMER" | "DRIVER";

export type WaitlistSubmission = {
  role: WaitlistRole;
  name: string;
  /**
   * Fully optional — a rider/driver can join with just a name. Sent exactly
   * as typed, no country/format restriction (Rwanda + Uganda both use this
   * form).
   */
  phone?: string;
  /** Site slug (moto/rifani/cab/hilux/fuso) — mapped to the backend's VEHICLE_BACKEND_CODE before POSTing. */
  vehicle_type?: VehicleSlug;
  email?: string;
  referred_by?: string;
  consent_launch: boolean;
  consent_marketing: boolean;
  turnstile_token: string;
  source: string;
};

// Backend envelope is `{ data: { referral_code, role } }` — no top-level id.
// referral_code may be absent (e.g. if referrals aren't enabled yet), so the
// caller must degrade to a plain success message without a share link.
export type WaitlistReceipt = {
  referral_code?: string;
  role?: WaitlistRole;
};

/**
 * Thrown by submitWaitlist so the caller can map the HTTP status to a
 * trilingual message (the backend's own message is English-only and not fit
 * to show directly on a public EN/FR/RW page).
 */
export class WaitlistError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "WaitlistError";
    this.status = status;
  }
}

export async function submitWaitlist(input: WaitlistSubmission): Promise<WaitlistReceipt> {
  const body = {
    ...input,
    vehicle_type: input.vehicle_type ? VEHICLE_BACKEND_CODE[input.vehicle_type] : undefined,
  };
  const res = await fetch(`${BASE_URL}/waitlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = json?.error?.message ?? "Could not join the waitlist. Please try again.";
    throw new WaitlistError(res.status, msg);
  }
  return (json?.data ?? {}) as WaitlistReceipt;
}
