# CLAUDE.md

## Project Overview

Personal portfolio site for Benjamin Lassaut — QA Lead at Kiln, specializing in web3 smart contract testing. Goals: recruiter magnet + thought leadership via blog.

## Tech Stack

- React + Vite + TypeScript
- Tailwind CSS v4
- Framer Motion (scroll animations)
- React Router (blog routes)
- react-markdown + gray-matter + rehype-highlight (blog system)

## Architecture

Single-page scroll site (Intro → Experience → Skills → Blog Preview → Contact) with blog on separate routes (`/blog`, `/blog/:slug`). Blog posts are markdown files in `src/content/blog/` with frontmatter.

## Development Commands

```bash
npm run dev          # Start Vite dev server
npm run build        # TypeScript check + production build
npx tsc --noEmit     # Type check only
```

## Design System

- **Background:** `#0a0a0f` (deep dark) with grain texture
- **Accent:** `#14b8a6` (electric teal)
- **Text:** `#f0f0f0` (warm white), `#6b7280` (muted)
- **Headings:** Space Grotesk
- **Body:** Inter
- **Monospace:** Fira Code

## Blog

Add posts as markdown files in `src/content/blog/`:

```md
---
title: "Post Title"
date: 2026-03-17
tags: [web3, qa]
excerpt: "Short description..."
---

Post content here...
```

## Hosting

Vercel with SPA rewrites configured in `vercel.json`.

## Common Tasks

### Add/edit work experience

Edit `src/data/experience.ts`. Each entry has `company`, `role`, `period`, `highlights` (array of impact-focused bullet points), and optional `current: true` for the active role. Add entries in reverse chronological order.

### Update contact links

Edit `src/components/sections/Contact.tsx`. The `links` array at the top contains `label`, `href`, and `icon` for each social link (Email, LinkedIn, GitHub, X/Twitter). Update the URLs to match your actual profiles.

### Write a blog post

1. Create a new markdown file in `src/content/blog/` named `YYYY-MM-DD-slug.md`
2. Add frontmatter at the top (title, date, tags, excerpt)
3. Write content below the frontmatter
4. Push — blog index and home page preview update automatically

### Preview locally

```bash
npm run dev    # http://localhost:5173
```

### Deploy

Push to `main`. Vercel auto-deploys on push.

## Key Files

- `src/data/experience.ts` — work history entries
- `src/data/skills.ts` — skill categories
- `src/lib/blog.ts` — markdown loading utilities
- `src/components/sections/` — home page sections
- `src/pages/` — route pages (Home, BlogIndex, BlogPost)
