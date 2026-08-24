# Rides — Landing

Public marketing site for **Rides**, the ride-hailing platform for Rwanda. This
is the site served at [rides.rw](https://rides.rw): home, about, drivers,
contact, privacy and terms pages.

It was split out of `Rides-web` (which now hosts only the admin console) so the
public site and the internal admin deploy independently.

## Stack

- Next.js (App Router, Turbopack)
- Tailwind CSS v4
- TypeScript
- i18n: EN / FR / RW (`app/i18n/`)

## Develop

```bash
npm install
cp .env.example .env.local   # fill in NEXT_PUBLIC_API_URL, Turnstile key
npm run dev        # http://localhost:3000
```

## Config

Two backend calls: the contact form and the `/waitlist` signup form, both
posting straight to the Go API. See `.env.example` for the full list —
notably `NEXT_PUBLIC_API_URL` (inlined at build time) and
`NEXT_PUBLIC_TURNSTILE_SITE_KEY` (Cloudflare Turnstile, fails open if unset
or unreachable — see `app/(pages)/waitlist/turnstile-widget.tsx`).

## Deploy — Cloudflare Workers (current path)

Via OpenNext (`@opennextjs/cloudflare`), same pattern as `kazimobility`:

```bash
npm run preview   # opennextjs-cloudflare build + local preview
npm run deploy    # opennextjs-cloudflare build + deploy
```

Infra is declared in `wrangler.jsonc` (routes, assets binding, etc.) — the
production `routes`/`custom_domain` entries are left as a commented
placeholder until Pacifique confirms the domain; `workers_dev: true` lets it
preview without one in the meantime.

## Deploy — Docker (legacy, currently unused)

`Dockerfile` and `.github/workflows/deploy.yml` still build/ship a standalone
Docker image to the box. They're left in place but unused while Cloudflare is
being validated — remove them once Cloudflare is confirmed as the deploy path
(Pacifique's call).

## Structure

- `app/(pages)/` — home, about, drivers, waitlist, privacy, terms
- `app/contact/` — contact page + form
- `app/components/` — landing UI components
- `app/i18n/` — EN/FR/RW dictionaries + provider/hooks
- `lib/api.ts` — minimal client (contact form + waitlist)
- `lib/driver-registration.ts`, `lib/rwanda-locations.ts` — shared with
  `Rides-web`'s copies; kept duplicated across repos as an accepted
  maintenance cost rather than a shared package.
