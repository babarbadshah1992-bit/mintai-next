"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Feedback({ blogId }: { blogId: number }) {
  const [rating, setRating] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleRating = async (value: number) => {
    setRating(value)
    // Optional: save to Supabase
    await supabase.from('blog_feedback').insert({ blog_id: blogId, rating: value })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        background: '#f0f7f0',
        borderRadius: '20px',
        textAlign: 'center'
      }}>
        🙏 Thank you for your feedback!
      </div>
    )
  }

  return (
    <div style={{
      marginTop: '2rem',
      padding: '1.5rem',
      background: 'white',
      borderRadius: '20px',
      border: '1px solid rgba(46,158,79,0.1)'
    }}>
      <p style={{ marginBottom: '1rem', fontWeight: '500' }}>Was this article helpful?</p>
      <div style={{ display: 'flex', gap: '12px' }}>
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => handleRating(star)}
            style={{
              background: rating === star ? '#2e9e4f' : '#e8f0e8',
              border: 'none',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              fontSize: '1.2rem',
              cursor: 'pointer',
              transition: '0.2s'
            }}
          >
            {star}★
          </button>
        ))}
      </div>
    </div>
  )
}