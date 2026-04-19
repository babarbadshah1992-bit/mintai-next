"use client"

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import Link from 'next/link'

export default function ViewBlog() {
  const [blog, setBlog] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const slug = window.location.search.split('slug=')[1]
    if (slug) {
      supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .single()
        .then(({ data }) => {
          setBlog(data)
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  if (loading) return <div>Loading...</div>
  if (!blog) return <div>Blog not found</div>

  return (
    <article>
      <h1>{blog.title}</h1>
      <div className="tags" style={{ margin: '1rem 0' }}>
        {(blog.tags || []).map((tag: string) => (
          <span key={tag} className="tag">#{tag}</span>
        ))}
      </div>
      <div dangerouslySetInnerHTML={{ __html: blog.content || '' }} />
      <Link href="/blog">← Back to all blogs</Link>
    </article>
  )
}