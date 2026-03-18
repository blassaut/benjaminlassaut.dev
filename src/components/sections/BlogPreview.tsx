import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import AnimatedSection from '../AnimatedSection'
import { getAllPosts } from '../../lib/blog'

export default function BlogPreview() {
  const posts = getAllPosts().slice(0, 3)

  if (posts.length === 0) return null

  return (
    <AnimatedSection id="blog" className="py-28 px-6" data-testid="blog-preview-section">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-14">
          <h2 className="text-3xl font-heading font-bold">Latest Posts</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-teal-400/30 to-transparent" />
        </div>

        <div className="space-y-5">
          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link
                to={`/blog/${post.slug}`}
                data-testid={`blog-preview-card-${post.slug}`}
                className="block p-6 rounded-xl border border-white/5 bg-dark-800/30 hover:border-teal-400/20 transition-colors group"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 mb-2">
                  <h3 className="text-lg font-heading font-semibold group-hover:text-teal-400 transition-colors">
                    {post.title}
                  </h3>
                  <span className="text-xs text-muted font-mono tracking-wide shrink-0">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <p className="text-sm text-muted font-body leading-relaxed">{post.excerpt}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest text-teal-400/70 border border-teal-400/10 rounded-full bg-teal-400/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-muted group-hover:text-teal-400 transition-colors font-mono">
                    Read &rarr;
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/blog"
            className="inline-block px-6 py-2.5 text-sm font-body text-teal-400 border border-teal-400/20 rounded-lg hover:border-teal-400 hover:bg-teal-400/5 transition-all"
          >
            View all posts
          </Link>
        </div>
      </div>
    </AnimatedSection>
  )
}
