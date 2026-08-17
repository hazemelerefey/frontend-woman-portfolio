# Frontend Woman — Shahd Portfolio

A scroll-driven portfolio built with Next.js 16, React 19, and GSAP ScrollTrigger.

## Highlights

- **Preloader** — counter sequence with flickering tagline
- **Hero** — phased exit: titles fade apart, solo portrait zoom, portrait fade, then the next section layers over the pinned hero
- **About → Mission** — the card grid pins while the Mission section is revealed through an expanding four-pointed star mask centered in the grid's "+" gap
- **Projects** — pinned horizontal scroll with full-bleed video slides and per-slide parallax
- **Approach** — split comparison card with scroll-driven row activation and a sticky counter badge (28 → 99)
- **Calculator** — live savings calculator with scrubbed word-collage headline
- Letter-split title reveals, marquees, letter-wave hover links throughout

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Docker

```bash
docker compose up dev --build    # dev mode with hot reload (port 3001)
docker compose up app --build    # production build (port 3000)
```

## Scripts

| Command             | Description        |
| ------------------- | ------------------ |
| `npm run dev`       | Dev server         |
| `npm run build`     | Production build   |
| `npm run start`     | Serve prod build   |
| `npm run lint`      | ESLint             |
| `npm run typecheck` | TypeScript check   |

## Structure

```
src/
  app/              # Next.js App Router (page, layout, globals.css)
  components/       # Section components + shared motion helpers
public/
  images/           # Portrait, logos, star.svg mask
  videos/           # Project videos
  fonts/            # Inter Tight (self-hosted)
docs/
  IMPLEMENTATION_GUIDE.md  # Full build documentation
```

## Tech

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger
