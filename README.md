# MartCube

The website of MartCube, a web and app studio. Built with Next.js, React and TypeScript, with a WebGL particle field and scroll-driven motion.

> Phase 1: a one-page site with a WebGL particle field, scroll-driven motion and a contact form. Showcase projects, a blog and a CMS come in later phases.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js (App Router), React 19 |
| Language | TypeScript, strict |
| Styling | Tailwind CSS v4, brand tokens in `src/app/globals.css` |
| Lint and format | ESLint with `eslint-config-next` and `@stylistic` (no Prettier) |
| State | Redux Toolkit |
| Motion | GSAP with ScrollTrigger, Lenis |
| 3D | React Three Fiber, custom shaders |
| Tests | Vitest and Testing Library (unit), Playwright (smoke tests on the production build) |
| Hosting | Netlify, with a preview deploy for every pull request |

## Getting started

Requires Node 22+ and pnpm.

```bash
pnpm install
pnpm dev         # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `pnpm dev` | Start the dev server |
| `pnpm build` | Production build |
| `pnpm lint` / `pnpm lint:fix` | Check / fix lint and formatting |
| `pnpm typecheck` | Generate route types and run `tsc` |
| `pnpm test` | Run unit tests once |
| `pnpm test:e2e` | Run Playwright smoke tests (run `pnpm build` first) |

## Project structure

```text
src/
  app/                 routes, layout, metadata, OG image, robots, sitemap, 404
  components/
    layout/            Header, HUD (slide counter, progress, dots)
    slides/            Hero, Services, Contact and their parts
    motion/            Lines (masked headline lines), KineticWord
    ui/                small shared components (Logo, Button, Field)
  content/             all site text, typed (moves to a CMS later)
  lib/                 contact form schema (shared by browser and server)
  motion/              scroll engine, stops, controller, text reveals
  scene/               WebGL particle field, poster fallback, shapes, shaders
  store/               Redux store (ui slice)
e2e/                   Playwright smoke tests
public/brand/          logo files and app icons
```

## How it works

```text
            scroll / keys / links
                    │
             motion/ScrollEngine ── Lenis + GSAP ScrollTrigger (desktop)
                    │                native scroll + CSS snap (touch)
                    ▼
      Redux ui slice { slide, service, progress, sent }
        │            │              │               │
       HUD     ServiceTabs   motion/Reveals   scene/ParticleField
                                               (reads the store and the
                                                slides' positions per frame)
```

- **Stops.** The page has six stops: hero, four service panels, contact (`motion/stops.ts`). Desktop moves one stop per wheel gesture; touch devices scroll natively with snapping. Links and arrow keys go through `motion/controller.ts`, so they work the same in both modes.
- **State.** Redux holds where the visitor is and how many messages they've sent. Components subscribe with typed hooks. The particle scene reads the store inside its render loop with `store.getState()`, so it never re-renders React.
- **Particles.** One `<points>` mesh with a spot for every particle in six shapes (cube, wave, store cards, page, phone, sphere), uploaded once. The vertex shader blends between them with one number, `uMorph` (0 to 5), that follows the scroll. Shapes are plain functions returning positions and tones (`scene/shapes/`), drawn with a small sketch kit.
- **Fallbacks.** No WebGL, data saver, or a lost GPU context shows a static poster instead. Touch devices show the poster first and start WebGL on the first touch or scroll. Reduced motion turns off idle movement, the cycling word and reveals.
- **Contact.** One Zod schema validates in the browser (live, after the first submit) and again in a Server Action (`app/actions/contact.ts`). Sending is simulated in phase 1; phase 2 wires up email.

## Deploying

Netlify builds every push to `main` and every pull request (preview link on the PR). `netlify.toml` holds the build settings. Netlify sets `URL`, which the site uses for canonical links, the sitemap and share images, so nothing needs configuring once a custom domain is added in Netlify.

## How this repo is built

Every feature lands as its own small pull request with a preview link, on top of a site that already works. Pull request descriptions include a short "What's new in React" note, so the history doubles as learning notes.
