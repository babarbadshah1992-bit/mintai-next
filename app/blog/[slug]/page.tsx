import { supabase } from '../../../lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Comments from './Comments'

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: blog } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!blog) notFound()

  return (
    <div>
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
      <Comments slug={slug} />
    </div>
  )
}