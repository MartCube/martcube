# MartCube

The website of MartCube, a web and app studio. Built with Next.js, React and TypeScript, with a WebGL particle field and scroll-driven motion.

> Work in progress. The homepage is being built one small pull request at a time.

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
| Tests | Vitest and Testing Library |
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

## Project structure

```text
src/
  app/            routes, layout, metadata, icons
  components/ui/  small shared components (Logo, Button, Field)
  content/        all site text, typed (moves to a CMS later)
  motion/         scroll engine and slide stops
  scene/          WebGL particle field, shapes and shaders
  store/          Redux store
public/brand/     logo files and app icons
```

## How this repo is built

Every feature lands as its own small pull request with a preview link, on top of a site that already works. Pull request descriptions include a short "What's new in React" note, so the history doubles as learning notes.
