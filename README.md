# Deepak Madhu Kumar N — Portfolio

Personal portfolio built with Next.js 15 (App Router), Tailwind CSS v4, shadcn/ui, GSAP, Framer Motion, and React Bits.

## Stack

- **Next.js 15** — App Router, React 19, TypeScript, Turbopack
- **Tailwind CSS v4** + **shadcn/ui** — component base, themed via CSS variables
- **GSAP + @gsap/react** — hero load timeline, experience timeline, pinned horizontal project gallery
- **Framer Motion** — scroll reveals, preloader, chat panel
- **React Bits** — Aurora background (OGL/WebGL, lazy-loaded), ShinyText, Magnet, SplitText
- **Lenis** — smooth scrolling wired into GSAP's ticker
- **cmdk** — ⌘K command palette

## Signature features

- **AI chatbot** — floating widget; answers from the data layer via a local retrieval engine out of the box, and automatically upgrades to Claude (`claude-haiku-4-5`) when `ANTHROPIC_API_KEY` is set (`app/api/chat/route.ts`).
- **Terminal easter egg** — press <code>`</code> (backtick) or use the footer/palette. Commands: `help`, `about`, `projects`, `sudo hire-me`…
- **⌘K command palette** — navigate, open projects, copy email, toggle theme, launch the terminal/chat.
- **Ultra-UI pass** — one-time page-load intro, custom cursor (fine pointers only), film grain, glass surfaces, gradient glow borders, ghost section numbers, skills marquee, 3D-tilt project cards, scroll progress bar. Everything heavy is disabled under `prefers-reduced-motion`.

## Local development

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build
pnpm start      # serve the production build
```

## Editing content

All copy lives in the typed data layer — no JSX edits needed:

| File | Contents |
| --- | --- |
| `data/profile.ts` | Name, role, tagline, bio, email, socials, resume URL, quick facts |
| `data/skills.ts` | Skill groups (frontend / backend / tools) |
| `data/experience.ts` | Timeline entries (`TODO`: replace scaffolding entries) |
| `data/projects.ts` | Projects (title, problem, stack, links) — drives cards, detail pages, sitemap |
| `data/site.ts` | Site URL (`TODO`: set production domain), title, description, nav |

## Contact form

`app/api/contact/route.ts` sends mail through [Resend](https://resend.com) when configured. Without a key it returns 501 and the form falls back to opening the visitor's mail client (`mailto:`).

Environment variables (see `.env.example`):

| Variable | Purpose |
| --- | --- |
| `ANTHROPIC_API_KEY` | Claude-powered chatbot (optional — local answer engine without it) |
| `RESEND_API_KEY` | Resend API key (optional — mailto fallback without it) |
| `CONTACT_FROM_EMAIL` | Verified sender, e.g. `Portfolio <hello@yourdomain.com>` (optional, defaults to Resend's onboarding sender) |

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new) — framework preset **Next.js**, no build config needed.
3. Add `RESEND_API_KEY` (and `CONTACT_FROM_EMAIL`) under Project → Settings → Environment Variables if you want real email delivery.
4. After the first deploy, set `site.url` in `data/site.ts` to your production domain (drives Open Graph URLs, sitemap, robots).

## Structure

```
app/                  # routes: /, /projects/[slug], /api/contact, sitemap, robots
components/
  ui/                 # shadcn/ui primitives
  bits/               # React Bits (vendored via shadcn registry)
  sections/           # navbar, hero, about, skills, experience, projects, contact, footer
data/                 # all site content (typed)
lib/                  # utilities
```

## Accessibility & motion

- Dark theme by default with a persisted light toggle (next-themes).
- All heavy motion (WebGL aurora, pinned horizontal scroll, GSAP timelines) is disabled under `prefers-reduced-motion`.
- Semantic landmarks, keyboard-focus styles, and labelled icon buttons throughout.
