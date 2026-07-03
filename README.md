# Rides — Landing

Public marketing site for **Rides**, the ride-hailing platform for Rwanda. This
is the site served at [rides.rw](https://rides.rw): home, about, drivers,
contact, privacy and terms pages.

It was split out of `Rides-web` (which now hosts only the admin console) so the
public site and the internal admin deploy independently.

## Stack

- Next.js (App Router, Turbopack, `output: standalone`)
- Tailwind CSS v4
- TypeScript

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
```

## Config

The only backend call is the contact form, which posts to the Go API:

| Env var | Purpose | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the Rides API (inlined at build time) | `https://api.rides.rw/api/v1` |

## Deploy

- **Vercel** — connect this repo; set `NEXT_PUBLIC_API_URL` in the project's
  Environment Variables. Point the `rides.rw` / `www.rides.rw` domains here.
- **Docker** — `docker build --build-arg NEXT_PUBLIC_API_URL=... .` produces a
  standalone image serving on port 3000.

## Structure

- `app/(pages)/` — home, about, drivers, privacy, terms
- `app/contact/` — contact page + form
- `app/components/` — landing UI components
- `lib/api.ts` — minimal client (contact form only)
