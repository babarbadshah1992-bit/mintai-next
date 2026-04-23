"use client"

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminPage() {
  const [topic, setTopic] = useState('')
  const [generatedBlog, setGeneratedBlog] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [message, setMessage] = useState('')

  const generateBlog = async () => {
    if (!topic.trim()) return
    setLoading(true)
    setMessage('')
    
    try {
      const res = await fetch('/api/generate-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      })
      const data = await res.json()
      
      if (data.error) throw new Error(data.error)
      
      setGeneratedBlog({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        tags: data.tags
      })
    } catch (err: any) {
      setMessage('Error: ' + err.message)
    }
    setLoading(false)
  }

  const publishBlog = async () => {
    if (!generatedBlog) return
    setPublishing(true)
    
    const { error } = await supabase
      .from('blogs')
      .insert([{
        title: generatedBlog.title,
        slug: generatedBlog.slug,
        excerpt: generatedBlog.excerpt,
        content: generatedBlog.content,
        tags: generatedBlog.tags
      }])
    
    if (error) {
      setMessage('Publish error: ' + error.message)
    } else {
      setMessage('✓ Blog published successfully!')
      setGeneratedBlog(null)
      setTopic('')
    }
    setPublishing(false)
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ marginBottom: '20px' }}>✍️ Admin - Blog Generator</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter blog topic (e.g., Sardi me kya khaye)"
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            border: '2px solid #ddd',
            borderRadius: '8px',
            marginBottom: '10px'
          }}
        />
        <button
          onClick={generateBlog}
          disabled={loading || !topic.trim()}
          style={{
            background: '#2e9e4f',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? 'Generating...' : 'Generate Blog'}
        </button>
      </div>

      {message && (
        <div style={{ padding: '10px', background: '#e8f5e9', borderRadius: '8px', marginBottom: '20px' }}>
          {message}
        </div>
      )}

      {generatedBlog && (
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '12px', background: '#f9f9f9' }}>
          <h2>Preview</h2>
          <h3>{generatedBlog.title}</h3>
          <p><strong>Slug:</strong> {generatedBlog.slug}</p>
          <p><strong>Excerpt:</strong> {generatedBlog.excerpt}</p>
          <div dangerouslySetInnerHTML={{ __html: generatedBlog.content }} />
          <p><strong>Tags:</strong> {generatedBlog.tags.join(', ')}</p>
          
          <button
            onClick={publishBlog}
            disabled={publishing}
            style={{
              background: '#ff69b4',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '20px',
              fontSize: '16px'
            }}
          >
            {publishing ? 'Publishing...' : '📢 Publish Blog'}
          </button>
        </div>
      )}
    </div>
  )
}