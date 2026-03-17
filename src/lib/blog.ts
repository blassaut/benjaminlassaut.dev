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
