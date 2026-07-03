// Minimal API client for the public landing site. The only backend call the
// landing makes is the contact form, which posts straight to the Go API.
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
