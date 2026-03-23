import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import gherkin from 'highlight.js/lib/languages/gherkin'
import typescript from 'highlight.js/lib/languages/typescript'
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
    <div data-testid="blog-post" className="pt-24 pb-16 px-6">
      <Helmet>
        <title>{post.title} - Benjamin Lassaut</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={`https://benjaminlassaut.dev/blog/${slug}`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://benjaminlassaut.dev/blog/${slug}`} />
        <meta property="og:image" content="https://benjaminlassaut.dev/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content="https://benjaminlassaut.dev/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          datePublished: new Date(post.date).toISOString(),
          url: `https://benjaminlassaut.dev/blog/${slug}`,
          author: { '@type': 'Person', name: 'Benjamin Lassaut', url: 'https://benjaminlassaut.dev' },
          keywords: post.tags.join(', '),
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://benjaminlassaut.dev' },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://benjaminlassaut.dev/blog' },
            { '@type': 'ListItem', position: 3, name: post.title, item: `https://benjaminlassaut.dev/blog/${slug}` },
          ],
        })}</script>
      </Helmet>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <Link to="/blog" data-testid="blog-post-back" className="text-sm text-teal-400 hover:text-teal-500 font-body mb-8 inline-block">
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
            rehypePlugins={[[rehypeHighlight, { languages: { gherkin, typescript } }]]}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </motion.article>
    </div>
  )
}
