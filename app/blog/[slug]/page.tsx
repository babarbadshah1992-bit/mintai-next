import { supabase } from '../../../lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const { data: blog, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (error || !blog) {
    console.error('Blog fetch error:', error)
    notFound()
  }

  // Ensure tags is an array
  const tagsArray = Array.isArray(blog.tags) ? blog.tags : []

  return (
    <article>
      <h1>{blog.title}</h1>
      <div className="tags" style={{ margin: '1rem 0' }}>
        {tagsArray.map((tag: string) => (
          <span key={tag} className="tag">#{tag}</span>
        ))}
      </div>
      <div dangerouslySetInnerHTML={{ __html: blog.content || '' }} />
      <Link href="/blog" style={{ display: 'inline-block', marginTop: '2rem', color: '#2e9e4f' }}>← Back to all blogs</Link>
    </article>
  )
}