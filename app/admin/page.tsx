"use client"

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminPage() {
  const [topic, setTopic] = useState('')
  const [generatedBlog, setGeneratedBlog] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [message, setMessage] = useState('')
  const [editMode, setEditMode] = useState(false)

  // Generate blog using AI
  const generateBlog = async () => {
    if (!topic.trim()) return
    setLoading(true)
    setMessage('')
    setEditMode(false)
    
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

  // Handle manual edits
  const handleContentEdit = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGeneratedBlog(prev => ({ ...prev, content: e.target.value }))
  }
  const handleTitleEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGeneratedBlog(prev => ({ ...prev, title: e.target.value }))
  }
  const handleExcerptEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGeneratedBlog(prev => ({ ...prev, excerpt: e.target.value }))
  }
  const handleTagsEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGeneratedBlog(prev => ({ ...prev, tags: e.target.value.split(',').map(t => t.trim()) }))
  }

  // Publish to Supabase
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
      setEditMode(false)
    }
    setPublishing(false)
  }

  // Word count helper
  const wordCount = (text: string) => text ? text.split(/\s+/).filter(w => w.length > 0).length : 0

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ marginBottom: '20px' }}>✍️ Admin - Blog Generator (Plus)</h1>
      
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2>📄 Preview & Edit</h2>
            <button onClick={() => setEditMode(!editMode)} style={{ background: '#ff69b4', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer' }}>
              {editMode ? 'Preview Mode' : 'Edit Mode'}
            </button>
          </div>

          {editMode ? (
            <div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Title:</label>
                <input type="text" value={generatedBlog.title} onChange={handleTitleEdit} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Excerpt:</label>
                <input type="text" value={generatedBlog.excerpt} onChange={handleExcerptEdit} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Tags (comma separated):</label>
                <input type="text" value={generatedBlog.tags?.join(', ') || ''} onChange={handleTagsEdit} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Content (HTML):</label>
                <textarea
                  value={generatedBlog.content}
                  onChange={handleContentEdit}
                  rows={12}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc', fontFamily: 'monospace' }}
                />
                <div style={{ textAlign: 'right', fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  Word count: {wordCount(generatedBlog.content)} words
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h3>{generatedBlog.title}</h3>
              <p><strong>Slug:</strong> {generatedBlog.slug}</p>
              <p><strong>Excerpt:</strong> {generatedBlog.excerpt}</p>
              <div dangerouslySetInnerHTML={{ __html: generatedBlog.content }} />
              <p><strong>Tags:</strong> {generatedBlog.tags?.join(', ')}</p>
            </div>
          )}
          
          <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
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
                fontSize: '16px'
              }}
            >
              {publishing ? 'Publishing...' : '📢 Publish Blog'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}