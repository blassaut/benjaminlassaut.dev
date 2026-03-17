# Personal Portfolio Site Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build benjaminlassaut.dev — a modern creative personal portfolio site for Benjamin Lassaut, QA Lead at Kiln, showcasing QA expertise in web3 with a blog for thought leadership.

**Architecture:** Single-page scroll site (Hero → Experience → Skills → Blog Preview → Contact) with React Router handling blog routes (`/blog`, `/blog/:slug`). Blog posts are markdown files with frontmatter, rendered at build time via react-markdown + gray-matter.

**Tech Stack:** React, Vite, TypeScript, Tailwind CSS v4, Framer Motion, React Router, react-markdown, gray-matter, rehype-highlight

---

### Task 1: Scaffold Vite + React + TypeScript Project

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `tailwind.config.ts`, `postcss.config.js`

**Step 1: Scaffold project**

Run from `/Users/benjaminlassaut/Documents/github/benjaminlassaut.dev`:

```bash
npm create vite@latest . -- --template react-ts
```

Select: React, TypeScript

**Step 2: Install core dependencies**

```bash
npm install react-router-dom framer-motion react-markdown gray-matter rehype-highlight remark-gfm
npm install -D tailwindcss @tailwindcss/vite
```

**Step 3: Configure Tailwind**

In `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

Replace contents of `src/index.css` with:

```css
@import "tailwindcss";

@theme {
  --color-dark-900: #0a0a0f;
  --color-dark-800: #12121a;
  --color-dark-700: #1a1a25;
  --color-teal-400: #14b8a6;
  --color-teal-500: #0d9488;
  --color-muted: #6b7280;
  --color-light: #f0f0f0;
  --font-heading: 'Space Grotesk', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'Fira Code', monospace;
}
```

**Step 4: Add Google Fonts to `index.html`**

Add to `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Inter:wght@400;500;600&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
```

**Step 5: Verify dev server starts**

```bash
npm run dev
```

Expected: Vite dev server on `http://localhost:5173` with no errors.

**Step 6: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite + React + TS + Tailwind project"
```

---

### Task 2: Layout Shell (Navbar + Footer + Router)

**Files:**
- Create: `src/components/Navbar.tsx`
- Create: `src/components/Footer.tsx`
- Create: `src/components/Layout.tsx`
- Create: `src/pages/Home.tsx` (placeholder)
- Create: `src/pages/BlogIndex.tsx` (placeholder)
- Create: `src/pages/BlogPost.tsx` (placeholder)
- Modify: `src/App.tsx`

**Step 1: Create Navbar**

`src/components/Navbar.tsx`:

```tsx
import { Link } from 'react-router-dom'

const navItems = [
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-dark-900/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="font-heading text-lg font-bold text-teal-400">
          BL
        </Link>
        <div className="flex gap-6">
          {navItems.map((item) =>
            item.href.startsWith('#') ? (
              <a
                key={item.label}
                href={item.href}
                className="text-sm text-muted hover:text-light transition-colors font-body"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                to={item.href}
                className="text-sm text-muted hover:text-light transition-colors font-body"
              >
                {item.label}
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  )
}
```

**Step 2: Create Footer**

`src/components/Footer.tsx`:

```tsx
export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8">
      <div className="max-w-5xl mx-auto px-6 text-center text-sm text-muted font-body">
        © {new Date().getFullYear()} Benjamin Lassaut. All rights reserved.
      </div>
    </footer>
  )
}
```

**Step 3: Create Layout**

`src/components/Layout.tsx`:

```tsx
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-dark-900 text-light">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
```

**Step 4: Create placeholder pages**

`src/pages/Home.tsx`:

```tsx
export default function Home() {
  return <div className="pt-20 px-6">Home placeholder</div>
}
```

`src/pages/BlogIndex.tsx`:

```tsx
export default function BlogIndex() {
  return <div className="pt-20 px-6">Blog index placeholder</div>
}
```

`src/pages/BlogPost.tsx`:

```tsx
export default function BlogPost() {
  return <div className="pt-20 px-6">Blog post placeholder</div>
}
```

**Step 5: Wire up App.tsx with Router**

`src/App.tsx`:

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import BlogIndex from './pages/BlogIndex'
import BlogPost from './pages/BlogPost'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
```

**Step 6: Verify navigation works**

```bash
npm run dev
```

Expected: Dark page with sticky navbar, "BL" logo links home, nav links work, footer visible.

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: add layout shell with navbar, footer, and routing"
```

---

### Task 3: Hero Section

**Files:**
- Create: `src/components/sections/Hero.tsx`
- Modify: `src/pages/Home.tsx`

**Step 1: Create Hero component**

`src/components/sections/Hero.tsx`:

```tsx
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-3xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-heading font-bold"
        >
          Benjamin{' '}
          <span className="text-teal-400">Lassaut</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-xl text-muted font-body"
        >
          QA Lead · Web3 · Making Smart Contracts Safer
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex gap-4 justify-center"
        >
          <a
            href="#experience"
            className="px-6 py-3 bg-teal-400 text-dark-900 font-body font-semibold rounded-lg hover:bg-teal-500 transition-colors"
          >
            See my work
          </a>
          <a
            href="#contact"
            className="px-6 py-3 border border-teal-400 text-teal-400 font-body font-semibold rounded-lg hover:bg-teal-400/10 transition-colors"
          >
            Get in touch
          </a>
        </motion.div>
      </div>
    </section>
  )
}
```

**Step 2: Add Hero to Home page**

`src/pages/Home.tsx`:

```tsx
import Hero from '../components/sections/Hero'

export default function Home() {
  return (
    <>
      <Hero />
    </>
  )
}
```

**Step 3: Verify hero renders with animations**

```bash
npm run dev
```

Expected: Full-height hero, name animates in with teal accent, subtitle and buttons fade in sequentially.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add hero section with entrance animations"
```

---

### Task 4: Scroll Animation Wrapper

**Files:**
- Create: `src/components/AnimatedSection.tsx`

**Step 1: Create reusable scroll-triggered animation wrapper**

`src/components/AnimatedSection.tsx`:

```tsx
import { motion } from 'framer-motion'

interface Props {
  children: React.ReactNode
  className?: string
  id?: string
}

export default function AnimatedSection({ children, className = '', id }: Props) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.section>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/AnimatedSection.tsx
git commit -m "feat: add reusable scroll animation wrapper"
```

---

### Task 5: Experience Section

**Files:**
- Create: `src/components/sections/Experience.tsx`
- Create: `src/data/experience.ts`
- Modify: `src/pages/Home.tsx`

**Step 1: Create experience data**

`src/data/experience.ts`:

```ts
export interface ExperienceEntry {
  company: string
  role: string
  period: string
  highlights: string[]
  current?: boolean
}

export const experience: ExperienceEntry[] = [
  {
    company: 'Kiln',
    role: 'QA Lead',
    period: '2024 — Present',
    current: true,
    highlights: [
      'Built AI-powered test generation for smart contracts — no Solidity knowledge required',
      'Designed scenario-based testing platform covering 10+ EVM networks',
      'Established QA processes for blockchain staking infrastructure',
    ],
  },
  // TODO: Benjamin to fill in previous roles
]
```

**Step 2: Create Experience component**

`src/components/sections/Experience.tsx`:

```tsx
import AnimatedSection from '../AnimatedSection'
import { experience } from '../../data/experience'

export default function Experience() {
  return (
    <AnimatedSection id="experience" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-heading font-bold mb-12">Experience</h2>
        <div className="space-y-12">
          {experience.map((entry) => (
            <div key={entry.company} className="relative pl-8 border-l-2 border-teal-400/30">
              {entry.current && (
                <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-teal-400" />
              )}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 mb-3">
                <div>
                  <h3 className="text-xl font-heading font-semibold">{entry.role}</h3>
                  <p className="text-teal-400 font-body">{entry.company}</p>
                </div>
                <span className="text-sm text-muted font-mono">{entry.period}</span>
              </div>
              <ul className="space-y-2">
                {entry.highlights.map((h, i) => (
                  <li key={i} className="text-muted font-body text-sm leading-relaxed">
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}
```

**Step 3: Add to Home page**

Update `src/pages/Home.tsx`:

```tsx
import Hero from '../components/sections/Hero'
import Experience from '../components/sections/Experience'

export default function Home() {
  return (
    <>
      <Hero />
      <Experience />
    </>
  )
}
```

**Step 4: Verify timeline renders with scroll animation**

```bash
npm run dev
```

Expected: Timeline with Kiln entry, teal dot for current role, fades in on scroll.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add experience section with timeline layout"
```

---

### Task 6: Skills Section

**Files:**
- Create: `src/components/sections/Skills.tsx`
- Create: `src/data/skills.ts`
- Modify: `src/pages/Home.tsx`

**Step 1: Create skills data**

`src/data/skills.ts`:

```ts
export interface SkillCategory {
  name: string
  skills: string[]
}

export const skillCategories: SkillCategory[] = [
  {
    name: 'QA & Testing',
    skills: ['Test Automation', 'Smart Contract Testing', 'CI/CD', 'E2E Testing', 'API Testing', 'Performance Testing'],
  },
  {
    name: 'Web3',
    skills: ['Solidity', 'EVM', 'Foundry', 'Hardhat', 'Ethereum', 'Arbitrum', 'Base', 'Optimism', 'Polygon'],
  },
  {
    name: 'Tech',
    skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AI/LLM Integration', 'Python', 'Docker'],
  },
]
```

**Step 2: Create Skills component**

`src/components/sections/Skills.tsx`:

```tsx
import AnimatedSection from '../AnimatedSection'
import { skillCategories } from '../../data/skills'

export default function Skills() {
  return (
    <AnimatedSection id="skills" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-heading font-bold mb-12">Skills</h2>
        <div className="space-y-10">
          {skillCategories.map((category) => (
            <div key={category.name}>
              <h3 className="text-lg font-heading font-semibold text-teal-400 mb-4">
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 text-sm font-mono bg-dark-700 border border-white/5 rounded-md text-light/80"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}
```

**Step 3: Add to Home page**

Update `src/pages/Home.tsx`:

```tsx
import Hero from '../components/sections/Hero'
import Experience from '../components/sections/Experience'
import Skills from '../components/sections/Skills'

export default function Home() {
  return (
    <>
      <Hero />
      <Experience />
      <Skills />
    </>
  )
}
```

**Step 4: Verify skill tags render**

```bash
npm run dev
```

Expected: Three skill categories with tag-style chips, fade in on scroll.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add skills section with grouped tag layout"
```

---

### Task 7: Blog System — Markdown Loading

**Files:**
- Create: `src/content/blog/2026-03-17-hello-world.md`
- Create: `src/lib/blog.ts`

**Step 1: Create a sample blog post**

`src/content/blog/2026-03-17-hello-world.md`:

```md
---
title: "Hello World — Why I Started This Blog"
date: 2026-03-17
tags: [meta]
excerpt: "A quick intro to who I am and what I'll be writing about — QA, web3, and the intersection of both."
---

# Hello World

I'm Benjamin Lassaut, QA Lead at Kiln. I've spent years making smart contracts safer, and I'm starting this blog to share what I've learned.

## What to expect

- **QA in Web3**: How testing blockchain software differs from traditional QA
- **Tools & Techniques**: The frameworks and approaches I use daily
- **Lessons Learned**: War stories from production incidents and how we prevented them

Stay tuned.
```

**Step 2: Create blog utility**

`src/lib/blog.ts`:

```ts
import matter from 'gray-matter'

export interface BlogPost {
  slug: string
  title: string
  date: string
  tags: string[]
  excerpt: string
  content: string
}

const posts = import.meta.glob('../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

export function getAllPosts(): BlogPost[] {
  return Object.entries(posts)
    .map(([path, raw]) => {
      const slug = path.split('/').pop()!.replace('.md', '')
      const { data, content } = matter(raw as string)
      return {
        slug,
        title: data.title,
        date: data.date,
        tags: data.tags || [],
        excerpt: data.excerpt || '',
        content,
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug)
}
```

**Step 3: Verify imports resolve**

```bash
npm run dev
```

Expected: No errors. Blog utils load but aren't rendered yet.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add blog system with markdown loading and gray-matter parsing"
```

---

### Task 8: Blog Preview Section (Home Page)

**Files:**
- Create: `src/components/sections/BlogPreview.tsx`
- Modify: `src/pages/Home.tsx`

**Step 1: Create BlogPreview component**

`src/components/sections/BlogPreview.tsx`:

```tsx
import { Link } from 'react-router-dom'
import AnimatedSection from '../AnimatedSection'
import { getAllPosts } from '../../lib/blog'

export default function BlogPreview() {
  const posts = getAllPosts().slice(0, 3)

  if (posts.length === 0) return null

  return (
    <AnimatedSection id="blog" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-heading font-bold mb-12">Latest Posts</h2>
        <div className="space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="block p-6 bg-dark-800 border border-white/5 rounded-lg hover:border-teal-400/30 transition-colors group"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 mb-2">
                <h3 className="text-lg font-heading font-semibold group-hover:text-teal-400 transition-colors">
                  {post.title}
                </h3>
                <span className="text-sm text-muted font-mono shrink-0">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <p className="text-sm text-muted font-body">{post.excerpt}</p>
              <div className="mt-3 flex gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-xs font-mono text-teal-400/70">
                    #{tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/blog"
            className="text-sm font-body text-teal-400 hover:text-teal-500 transition-colors"
          >
            View all posts →
          </Link>
        </div>
      </div>
    </AnimatedSection>
  )
}
```

**Step 2: Add to Home page**

Update `src/pages/Home.tsx`:

```tsx
import Hero from '../components/sections/Hero'
import Experience from '../components/sections/Experience'
import Skills from '../components/sections/Skills'
import BlogPreview from '../components/sections/BlogPreview'

export default function Home() {
  return (
    <>
      <Hero />
      <Experience />
      <Skills />
      <BlogPreview />
    </>
  )
}
```

**Step 3: Verify blog preview shows the hello-world post**

```bash
npm run dev
```

Expected: Blog preview section with the hello-world post card, clickable, tags shown.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add blog preview section on home page"
```

---

### Task 9: Contact Section

**Files:**
- Create: `src/components/sections/Contact.tsx`
- Modify: `src/pages/Home.tsx`

**Step 1: Create Contact component**

`src/components/sections/Contact.tsx`:

```tsx
import AnimatedSection from '../AnimatedSection'

const links = [
  { label: 'Email', href: 'mailto:benjamin@lassaut.dev', icon: '✉' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/benjaminlassaut', icon: 'in' },
  { label: 'GitHub', href: 'https://github.com/benjaminlassaut', icon: 'gh' },
  { label: 'X / Twitter', href: 'https://x.com/benjaminlassaut', icon: '𝕏' },
]

export default function Contact() {
  return (
    <AnimatedSection id="contact" className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-heading font-bold mb-4">Get in Touch</h2>
        <p className="text-muted font-body mb-10">
          Open to interesting opportunities and conversations about QA in web3.
        </p>
        <div className="flex justify-center gap-6">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 px-4 py-3 rounded-lg hover:bg-dark-700 transition-colors group"
            >
              <span className="text-2xl">{link.icon}</span>
              <span className="text-sm text-muted group-hover:text-teal-400 transition-colors font-body">
                {link.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}
```

**Step 2: Add to Home page**

Update `src/pages/Home.tsx`:

```tsx
import Hero from '../components/sections/Hero'
import Experience from '../components/sections/Experience'
import Skills from '../components/sections/Skills'
import BlogPreview from '../components/sections/BlogPreview'
import Contact from '../components/sections/Contact'

export default function Home() {
  return (
    <>
      <Hero />
      <Experience />
      <Skills />
      <BlogPreview />
      <Contact />
    </>
  )
}
```

**Step 3: Verify contact section renders**

```bash
npm run dev
```

Expected: Centered contact section with 4 link icons, hover effects.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add contact section with social links"
```

---

### Task 10: Blog Index Page

**Files:**
- Modify: `src/pages/BlogIndex.tsx`

**Step 1: Implement BlogIndex**

`src/pages/BlogIndex.tsx`:

```tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getAllPosts } from '../lib/blog'

export default function BlogIndex() {
  const posts = getAllPosts()
  const allTags = [...new Set(posts.flatMap((p) => p.tags))]
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const filtered = activeTag ? posts.filter((p) => p.tags.includes(activeTag)) : posts

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-heading font-bold mb-8"
        >
          Blog
        </motion.h1>

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            <button
              onClick={() => setActiveTag(null)}
              className={`px-3 py-1 text-sm font-mono rounded-md transition-colors ${
                !activeTag ? 'bg-teal-400 text-dark-900' : 'bg-dark-700 text-muted hover:text-light'
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-3 py-1 text-sm font-mono rounded-md transition-colors ${
                  activeTag === tag ? 'bg-teal-400 text-dark-900' : 'bg-dark-700 text-muted hover:text-light'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-6">
          {filtered.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/blog/${post.slug}`}
                className="block p-6 bg-dark-800 border border-white/5 rounded-lg hover:border-teal-400/30 transition-colors group"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 mb-2">
                  <h2 className="text-lg font-heading font-semibold group-hover:text-teal-400 transition-colors">
                    {post.title}
                  </h2>
                  <span className="text-sm text-muted font-mono shrink-0">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <p className="text-sm text-muted font-body">{post.excerpt}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-muted font-body">No posts found for this tag.</p>
        )}
      </div>
    </div>
  )
}
```

**Step 2: Verify blog index shows posts with tag filter**

```bash
npm run dev
```

Navigate to `/blog`. Expected: Post list with tag filter buttons, clicking a tag filters posts.

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add blog index page with tag filtering"
```

---

### Task 11: Blog Post Page

**Files:**
- Modify: `src/pages/BlogPost.tsx`

**Step 1: Implement BlogPost**

`src/pages/BlogPost.tsx`:

```tsx
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import { getPostBySlug } from '../lib/blog'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getPostBySlug(slug) : undefined

  if (!post) {
    return (
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-heading font-bold mb-4">Post not found</h1>
          <Link to="/blog" className="text-teal-400 hover:text-teal-500 font-body">
            ← Back to blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16 px-6">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <Link to="/blog" className="text-sm text-teal-400 hover:text-teal-500 font-body mb-8 inline-block">
          ← Back to blog
        </Link>

        <h1 className="text-4xl font-heading font-bold mb-4">{post.title}</h1>

        <div className="flex items-center gap-4 mb-10 text-sm text-muted">
          <span className="font-mono">
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <div className="flex gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="font-mono text-teal-400/70">#{tag}</span>
            ))}
          </div>
        </div>

        <div className="prose prose-invert prose-teal max-w-none font-body
          prose-headings:font-heading prose-code:font-mono prose-code:text-teal-400
          prose-a:text-teal-400 prose-a:no-underline hover:prose-a:underline
          prose-pre:bg-dark-800 prose-pre:border prose-pre:border-white/5"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </motion.article>
    </div>
  )
}
```

**Step 2: Add highlight.js theme for code blocks**

Add to `src/index.css`:

```css
@import 'highlight.js/styles/github-dark.css';
```

**Step 3: Verify blog post renders with syntax highlighting**

```bash
npm run dev
```

Navigate to `/blog/2026-03-17-hello-world`. Expected: Full post rendered, headings styled, code highlighted.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add blog post page with markdown rendering and syntax highlighting"
```

---

### Task 12: Background Texture + Section Gradients

**Files:**
- Modify: `src/index.css`
- Modify: `src/components/Layout.tsx`

**Step 1: Add subtle grain texture and gradient shifts**

Add to `src/index.css`:

```css
.bg-grain {
  position: relative;
}

.bg-grain::before {
  content: '';
  position: fixed;
  inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 0;
}
```

**Step 2: Apply grain class to Layout**

In `src/components/Layout.tsx`, add `bg-grain` class to the root div:

```tsx
<div className="min-h-screen bg-dark-900 text-light bg-grain">
```

**Step 3: Verify grain texture is visible but subtle**

```bash
npm run dev
```

Expected: Very subtle noise texture over the dark background.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add subtle grain background texture"
```

---

### Task 13: Meta Tags + Favicon + Final Polish

**Files:**
- Modify: `index.html`

**Step 1: Update index.html with meta tags**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Benjamin Lassaut — QA Lead · Web3</title>
    <meta name="description" content="Benjamin Lassaut — QA Lead specializing in web3 smart contract testing. Making smart contracts safer." />
    <meta property="og:title" content="Benjamin Lassaut — QA Lead · Web3" />
    <meta property="og:description" content="QA Lead specializing in web3 smart contract testing. Making smart contracts safer." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://benjaminlassaut.dev" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Benjamin Lassaut — QA Lead · Web3" />
    <meta name="twitter:description" content="QA Lead specializing in web3 smart contract testing." />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Inter:wght@400;500;600&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Step 2: Verify title and meta tags**

```bash
npm run dev
```

Expected: Browser tab shows "Benjamin Lassaut — QA Lead · Web3".

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add meta tags and SEO basics"
```

---

### Task 14: TypeScript Build Check + Deploy Config

**Files:**
- Create: `vercel.json`

**Step 1: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: No errors.

**Step 2: Run production build**

```bash
npm run build
```

Expected: Build succeeds, output in `dist/`.

**Step 3: Add Vercel config for SPA routing**

`vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: add Vercel config and verify production build"
```

---

### Task 15: Create GitHub Remote + Push

**Step 1: Create GitHub repo**

```bash
cd /Users/benjaminlassaut/Documents/github/benjaminlassaut.dev
gh repo create benjaminlassaut.dev --public --source=. --push
```

**Step 2: Verify repo exists on GitHub**

```bash
gh repo view --web
```

Expected: Repo visible on GitHub with all commits.
