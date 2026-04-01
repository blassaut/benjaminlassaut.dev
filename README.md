# benjaminlassaut.dev

Personal portfolio site for **Benjamin Lassaut** — Lead QA Engineer at [Kiln](https://kiln.fi), specializing in web3 smart contract testing across 20+ blockchain networks.

## Tech Stack

- **Framework:** React 19 + Vite 7 + TypeScript 5.9
- **Styling:** Tailwind CSS v4 + Framer Motion
- **Routing:** React Router 7
- **Blog:** Markdown with gray-matter + react-markdown + rehype-highlight
- **Testing:** Vitest + Playwright + playwright-bdd (Gherkin/Cucumber)
- **Hosting:** Vercel

## Getting Started

```bash
npm install
npm run dev          # http://localhost:5173
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | TypeScript check + production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests (Vitest) |
| `npm run test:watch` | Run unit tests in watch mode |
| `npm run test:e2e` | Run end-to-end tests (Playwright) |
| `npm run test:e2e:ui` | Run E2E tests with Playwright UI |

## Project Structure

```
src/
  components/
    sections/       Home page sections (Intro, About, Experience, Skills, etc.)
    qa/             QA portfolio showcase components
    ui/             Reusable UI components
  pages/            Route pages (Home, BlogIndex, BlogPost, QA)
  data/             Static data (experience, skills, testimonials)
  content/blog/     Markdown blog posts
  lib/              Utilities (blog loader, resume generator, Gherkin parser)
  hooks/            Custom React hooks
  __tests__/        Unit & component tests
e2e/
  features/         Gherkin feature files
  steps/            Playwright step definitions
```

## Site Structure

- **`/`** — Single-page scroll: Intro, About, Experience, Skills, Testimonials, Blog Preview, Contact
- **`/blog`** — Blog index
- **`/blog/:slug`** — Individual blog post
- **`/qa`** — Interactive QA portfolio ("Who Tests the Tester?")

## Blog

Add a markdown file in `src/content/blog/` with frontmatter:

```md
---
title: "Post Title"
date: 2026-03-17
tags: [web3, qa]
excerpt: "Short description..."
---

Post content here...
```

## Design System

- **Background:** `#0a0a0f` (deep dark) with grain texture
- **Accent:** `#14b8a6` (electric teal)
- **Text:** `#f0f0f0` / `#6b7280`
- **Headings:** Exo 2
- **Body:** IBM Plex Sans
- **Monospace:** JetBrains Mono

## Deployment

Push to `main` — Vercel auto-deploys. CI runs on every push/PR via GitHub Actions (build, lint, unit tests, E2E).

## License

All rights reserved.
