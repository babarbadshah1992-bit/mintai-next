import { supabase } from '../../../lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const { data: blog } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!blog) notFound()

  return (
    <article>
      <h1>{blog.title}</h1>
      <div className="tags">
        {blog.tags?.map((tag: string) => (
          <span key={tag} className="tag">#{tag}</span>
        ))}
      </div>
      <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      <Link href="/blog">← Back to all blogs</Link>
    </article>
  )
}