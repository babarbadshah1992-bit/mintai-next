"use client"

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function BlogContent() {
  const searchParams = useSearchParams()
  const slug = searchParams.get('slug')
  const [blog, setBlog] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
        .catch(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [slug])

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
      <Link href="/blog" style={{ display: 'inline-block', marginTop: '2rem', color: '#2e9e4f' }}>← Back to all blogs</Link>
    </article>
  )
}

export default function ViewBlog() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogContent />
    </Suspense>
  )
}