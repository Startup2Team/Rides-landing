// Minimal API client for the public landing site. The backend calls the
// landing makes — contact form and waitlist — post straight to the Go API.
import { VEHICLE_BACKEND_CODE, type VehicleSlug } from "./driver-registration";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

export type ContactSubmission = {
  name: string;
  email: string;
  subject: string;
  category?: string;
  /** The API rejects the payload unless this field is literally `message`. */
  message: string;
};

// Backend envelope is `{ data: { message } }` — an acknowledgement string, no
// id and no created_at, so there is no reference number to show the sender.
export type ContactReceipt = { message?: string };

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
  return (json?.data ?? {}) as ContactReceipt;
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

// ── Careers: internship applications ──────────────────────────────────────

export type ApplicationPosition =
  | "FULL_STACK"
  | "BACKEND"
  | "FRONTEND"
  | "DEVOPS"
  | "GAME";

/** Onsite role, so the right to work in Rwanda is a hard filter, not a nicety. */
export type WorkRight = "CITIZEN" | "PERMIT" | "NEITHER";

export type ApplicantStatus = "STUDENT" | "GRADUATE" | "EMPLOYED";

export type ApplicationSubmission = {
  full_name: string;
  email: string;
  phone: string;
  city: string;
  work_right: WorkRight;
  status: ApplicantStatus;
  institution?: string;
  graduation_year?: string;
  position: ApplicationPosition;
  technologies: string;
  project_url: string;
  project_body: string;
  github_url: string;
  linkedin_url?: string;
  portfolio_url?: string;
  /** A link, not an upload — see the note on POST /careers below. */
  cv_url?: string;
  available_from_start: boolean;
  heard_from?: string;
  consent: boolean;
  source: string;
};

export type ApplicationReceipt = { message?: string };

export class ApplicationError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApplicationError";
    this.status = status;
  }
}

/**
 * POST /careers — NOT YET IMPLEMENTED BY THE BACKEND.
 *
 * As of this writing the staging API answers 404 here (while /contact answers
 * 400, i.e. exists and validates). Until the endpoint ships, every submission
 * fails and the form surfaces the "not open yet" message rather than a raw
 * error. The contract the backend needs:
 *
 *   POST /careers
 *   body:     the ApplicationSubmission fields above, snake_case, JSON
 *   success:  201 { "data": { "message": "..." } }   (envelope as /contact)
 *   failure:  4xx { "error": { "code": "...", "message": "..." } }
 *
 * Two things deliberately left out, both needing a decision first:
 *   · CV upload. `cv_url` takes a Drive/Dropbox link because file upload needs
 *     object storage (R2/S3), a size cap and a virus scan agreed first.
 *   · Turnstile. The waitlist posts `turnstile_token`; do the same here once
 *     the endpoint can verify it, or this form will collect spam.
 */
export async function submitApplication(
  input: ApplicationSubmission,
): Promise<ApplicationReceipt> {
  const res = await fetch(`${BASE_URL}/careers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = json?.error?.message ?? "Could not send your application.";
    throw new ApplicationError(res.status, msg);
  }
  return (json?.data ?? {}) as ApplicationReceipt;
}

export type CareersConfig = {
  is_open: boolean;
  max_applications: number;
  total_submitted: number;
  hero_title: string;
  hero_subtitle: string;
  open_at?: string;
  close_at?: string;
  closed_message: string;
  updated_at: string;
};

export async function getCareersConfig(): Promise<CareersConfig | null> {
  try {
    const res = await fetch(`${BASE_URL}/careers/config`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json().catch(() => null);
    return (json?.data ?? json) as CareersConfig;
  } catch {
    return null;
  }
}
