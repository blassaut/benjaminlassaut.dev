# Personal Portfolio Site — benjaminlassaut.dev

## Goals

1. **Recruiter magnet** — attract better opportunities by showcasing QA expertise
2. **Thought leadership** — establish Benjamin Lassaut as a QA expert in web3 through blog content

## Tech Stack

| Tool | Purpose |
|------|---------|
| React + Vite | SPA framework, fast dev/build |
| TypeScript | Type safety |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Scroll animations, section reveals |
| React Router | Blog routes (`/blog/:slug`) |
| react-markdown | Render blog posts |
| gray-matter | Parse markdown frontmatter |
| rehype-highlight / shiki | Syntax highlighting in code blocks |

## Architecture

Single-page scroll site with blog on separate routes.

```
src/
  components/        # Navbar, Footer, Section wrappers
  pages/
    Home.tsx         # Single scroll (Hero, Experience, Skills, Blog preview, Contact)
    BlogIndex.tsx    # All posts, filterable by tag
    BlogPost.tsx     # Individual post renderer
  content/
    blog/            # Markdown files (YYYY-MM-DD-slug.md)
  assets/            # Images, resume PDF
```

## Visual Design

### Color Palette

| Role | Value |
|------|-------|
| Background | `#0a0a0f` (deep dark) with subtle gradient shifts between sections |
| Primary accent | `#14b8a6` (electric teal) |
| Text | `#f0f0f0` (warm white) |
| Muted text | `#6b7280` (gray) |

### Typography

- **Headings:** Space Grotesk — bold, geometric, modern
- **Body:** Inter — clean readability
- **Monospace accents:** Fira Code or JetBrains Mono — for tags, tech terms

### Effects

- Scroll-triggered section reveals (fade up + slight slide) via Framer Motion
- Subtle gradient mesh or grain texture on background
- Accent color used sparingly: links, borders, hover states, name in hero
- No heavy animations — creativity through typography and spacing

### Vibe

Dark, confident, clean. Signals "technical and quality-conscious" without being gimmicky.

## Page Sections

### Hero

- Name displayed large and bold, accent-colored
- One-liner: "QA Lead · Web3 · Making Smart Contracts Safer"
- CTA buttons: "See my work" (scroll down) + "Get in touch" (scroll to contact)
- Optional subtle animated element (blinking cursor or particle effect)

### Experience

- Timeline layout, most recent first
- Each entry: company, role, dates, 2-3 impact-focused bullet points
- Measurable outcomes over responsibilities (e.g., "Built AI-powered test generation that reduced manual scenario writing by 80%")
- Kiln as featured current role

### Skills

- Grid or tag cloud, grouped by category:
  - **QA & Testing:** Test automation, Smart contract testing, CI/CD, E2E testing
  - **Web3:** Solidity, EVM, Foundry/Hardhat, Multi-chain (Ethereum, Arbitrum, Base...)
  - **Tech:** TypeScript, React, Node.js, PostgreSQL, AI/LLM integration
- No progress bars or percentages

### Blog Preview

- 2-3 latest post cards: title, date, excerpt
- "View all posts →" link to `/blog`

### Contact

- Email, LinkedIn, GitHub, Twitter/X links
- Minimal — mailto link or simple form

## Blog System

- Posts stored as markdown in `src/content/blog/`
- Frontmatter format:
  ```md
  ---
  title: "Why QA in Web3 Is Different"
  date: 2026-03-17
  tags: [web3, qa, testing]
  excerpt: "Smart contracts are immutable. You can't hotfix production..."
  ---
  ```
- Blog index: all posts sorted by date, filterable by tag
- Blog post: rendered markdown with syntax-highlighted code blocks matching site theme
- No CMS, no database — write markdown, push to git, it's live

## Hosting

Vercel or Netlify — free tier, automatic deploys on push.
