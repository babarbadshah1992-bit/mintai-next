"use client"

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function Comments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<any[]>([])
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  async function fetchComments() {
    const { data } = await supabase
      .from('blog_comments')
      .select('*')
      .eq('blog_slug', slug)
      .order('created_at', { ascending: false })
    setComments(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchComments()
  }, [slug])

  async function submitComment(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setSubmitting(true)
    const { error } = await supabase.from('blog_comments').insert({
      blog_slug: slug,
      author: author.trim() || 'Guest',
      content: content.trim()
    })
    if (!error) {
      setContent('')
      setAuthor('')
      fetchComments()
    } else {
      alert('Error posting comment: ' + error.message)
    }
    setSubmitting(false)
  }

  return (
    <div style={{ marginTop: '3rem', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
      <h3>💬 Comments ({comments.length})</h3>
      <form onSubmit={submitComment} style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Your name (optional)"
          value={author}
          onChange={e => setAuthor(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '30px', border: '1px solid #ccc' }}
        />
        <textarea
          placeholder="Write a comment..."
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={3}
          style={{ width: '100%', padding: '8px', borderRadius: '16px', border: '1px solid #ccc' }}
          required
        />
        <button type="submit" disabled={submitting} style={{ marginTop: '8px', background: '#2e9e4f', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '30px' }}>
          {submitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
      {loading ? <p>Loading comments...</p> : comments.map(c => (
        <div key={c.id} style={{ marginBottom: '1rem', padding: '12px', background: '#f9f9f9', borderRadius: '16px' }}>
          <strong>{c.author}</strong> <span style={{ fontSize: '0.7rem', color: '#888' }}>{new Date(c.created_at).toLocaleString()}</span>
          <p style={{ marginTop: '4px' }}>{c.content}</p>
        </div>
      ))}
    </div>
  )
}