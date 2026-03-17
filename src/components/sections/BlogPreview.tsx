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
