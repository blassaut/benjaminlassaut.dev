import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { getAllPosts } from '../lib/blog'

export default function BlogIndex() {
  const posts = getAllPosts()
  const allTags = [...new Set(posts.flatMap((p) => p.tags))]
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const filtered = activeTag ? posts.filter((p) => p.tags.includes(activeTag)) : posts

  return (
    <div data-testid="blog-index" className="pt-24 pb-16 px-6">
      <Helmet>
        <title>Blog - Benjamin Lassaut</title>
        <meta name="description" content="Thoughts on QA, web3, smart contract testing, and building quality into software." />
        <link rel="canonical" href="https://benjaminlassaut.dev/blog" />
        <meta property="og:title" content="Blog - Benjamin Lassaut" />
        <meta property="og:description" content="Thoughts on QA, web3, smart contract testing, and building quality into software." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://benjaminlassaut.dev/blog" />
        <meta property="og:image" content="https://benjaminlassaut.dev/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog - Benjamin Lassaut" />
        <meta name="twitter:description" content="Thoughts on QA, web3, smart contract testing, and building quality into software." />
        <meta name="twitter:image" content="https://benjaminlassaut.dev/og-image.png" />
      </Helmet>
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
              data-testid="blog-tag-all"
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
                data-testid={`blog-tag-${tag}`}
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
                data-testid={`blog-post-${post.slug}`}
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
