import { supabase } from '../../../lib/supabase'
import Link from 'next/link'

export default async function BlogPage() {
  const { data: blogs } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1>📝 All Blogs</h1>
      <div className="blog-grid">
        {blogs && blogs.length > 0 ? (
          blogs.map((blog) => (
            <Link key={blog.id} href={`/blog/view?slug=${blog.slug}`} className="blog-card">
              <h2>{blog.title}</h2>
              <p>{blog.excerpt}</p>
              <div className="tags">
                {(blog.tags || []).map((tag: string) => (
                  <span key={tag} className="tag">#{tag}</span>
                ))}
              </div>
            </Link>
          ))
        ) : (
          <p>No blogs yet. Add some in Supabase!</p>
        )}
      </div>
    </div>
  )
}