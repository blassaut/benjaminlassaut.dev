import { describe, it, expect } from 'vitest'
import { getAllPosts, getPostBySlug } from '../../lib/blog'

describe('getAllPosts', () => {
  it('returns an array of posts', () => {
    const posts = getAllPosts()
    expect(Array.isArray(posts)).toBe(true)
    expect(posts.length).toBeGreaterThan(0)
  })

  it('each post has required fields', () => {
    for (const post of getAllPosts()) {
      expect(post.slug).toBeTruthy()
      expect(post.title).toBeTruthy()
      expect(post.date).toBeTruthy()
      expect(Array.isArray(post.tags)).toBe(true)
      expect(typeof post.content).toBe('string')
    }
  })

  it('posts are sorted by date descending', () => {
    const posts = getAllPosts()
    for (let i = 1; i < posts.length; i++) {
      const prev = new Date(posts[i - 1].date).getTime()
      const curr = new Date(posts[i].date).getTime()
      expect(prev).toBeGreaterThanOrEqual(curr)
    }
  })
})

describe('getPostBySlug', () => {
  it('returns a post for a valid slug', () => {
    const posts = getAllPosts()
    const post = getPostBySlug(posts[0].slug)
    expect(post).toBeDefined()
    expect(post!.slug).toBe(posts[0].slug)
  })

  it('returns undefined for an unknown slug', () => {
    expect(getPostBySlug('nonexistent-post')).toBeUndefined()
  })
})
