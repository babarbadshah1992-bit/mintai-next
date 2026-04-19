import { supabase } from '../../../lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'

// Build time pe saare slugs generate karo
export async function generateStaticParams() {
  const { data: blogs } = await supabase
    .from('blogs')
    .select('slug')

  return blogs?.map((blog) => ({
    slug: blog.slug,
  })) || []
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const { data: blog, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (error || !blog) {
    notFound()
  }

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