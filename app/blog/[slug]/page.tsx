import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Feedback from '@/components/Feedback'

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const { data: blog } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!blog) notFound()

  return (
    <article style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>{blog.title}</h1>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {blog.tags?.map(tag => (
          <span key={tag} style={{
            background: '#f0f7f0',
            color: '#2e9e4f',
            padding: '4px 12px',
            borderRadius: '30px',
            fontSize: '0.8rem'
          }}>#{tag}</span>
        ))}
      </div>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '2rem',
        lineHeight: '1.8',
        fontSize: '1.05rem'
      }} dangerouslySetInnerHTML={{ __html: blog.content }} />

      {/* User Feedback Component */}
      <Feedback blogId={blog.id} />
    </article>
  )
}