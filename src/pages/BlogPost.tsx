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
