import { supabase } from '../../../lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Comments from './Comments'
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  description?: string;
  image: string;
  link: string;
  keywords?: string[];
}

interface RelatedBlog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  tags: string[];
}

interface NextBlog {
  id: number;
  title: string;
  slug: string;
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  const { data: blog } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!blog) notFound()

  let nextBlog: NextBlog | null = null
  
  const { data: nextBlogData } = await supabase
    .from('blogs')
    .select('id, title, slug, created_at')
    .gt('created_at', blog.created_at)
    .order('created_at', { ascending: true })
    .limit(1)

  if (nextBlogData && nextBlogData.length > 0) {
    nextBlog = nextBlogData[0]
  }

  let relatedProducts: Product[] = []
  if (blog.tags && blog.tags.length > 0) {
    const { data: products } = await supabase
  .from('products')
  .select('*')

relatedProducts = (products || []).filter((product) =>
  product.keywords?.some((keyword: string) =>
    blog.tags.some((tag: string) =>
      tag.toLowerCase().includes(keyword.toLowerCase()) ||
      keyword.toLowerCase().includes(tag.toLowerCase())
    )
  )
).slice(0, 4)
  }

  let relatedBlogs: RelatedBlog[] = []
  if (blog.tags && blog.tags.length > 0) {
    const tagConditions = blog.tags.map((tag: string) => 
      `tags.cs.{${tag}}`
    ).join(',')
    
    const { data: blogs } = await supabase
      .from('blogs')
      .select('id, title, slug, excerpt, image, tags')
      .or(tagConditions)
      .neq('id', blog.id)
      .limit(3)
    
    relatedBlogs = blogs || []
  }

  if (relatedBlogs.length === 0) {
    const { data: blogs } = await supabase
      .from('blogs')
      .select('id, title, slug, excerpt, image, tags')
      .neq('id', blog.id)
      .order('created_at', { ascending: false })
      .limit(3)
    
    relatedBlogs = blogs || []
  }

  return (
    <div style={{
      maxWidth: "960px",
      margin: "0 auto",
      padding: "40px 20px",
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    }}>
      <style dangerouslySetInnerHTML={{
        __html: `
          .product-card {
            background: white;
            border-radius: 20px;
            padding: 16px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          .product-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px rgba(0,0,0,0.12);
          }
          .buy-btn {
            display: block;
            text-align: center;
            background: linear-gradient(135deg, #18a23d, #1db84c);
            color: white;
            padding: 10px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 600;
            font-size: 13px;
            transition: transform 0.2s ease;
          }
          .buy-btn:hover {
            transform: scale(1.02);
          }
          .blog-card {
            background: white;
            border-radius: 20px;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            height: 100%;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            text-decoration: none;
            display: block;
          }
          .blog-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px rgba(0,0,0,0.12);
          }
          .back-link {
            display: inline-block;
            color: #18a23d;
            text-decoration: none;
            font-weight: 600;
            padding: 10px 20px;
            border: 2px solid #18a23d;
            border-radius: 40px;
            background: transparent;
            transition: all 0.2s ease;
          }
          .back-link:hover {
            background: #18a23d;
            color: white;
            transform: translateX(-4px);
          }
          .next-link {
            display: inline-block;
            color: white;
            text-decoration: none;
            font-weight: 600;
            padding: 10px 24px;
            background: linear-gradient(135deg, #18a23d, #1db84c);
            border-radius: 40px;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(24,162,61,0.2);
          }
          .next-link:hover {
            transform: translateX(4px);
            box-shadow: 0 4px 16px rgba(24,162,61,0.4);
          }
          .next-container {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 32px;
          }
        `
      }} />

      <article>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, color: "#1a2e1e", marginBottom: "16px" }}>
          {blog.title}
        </h1>

        {blog.featured_image && (
      <img
    src={blog.featured_image}
    alt={blog.title}
    width={1200}
    height={675}
    style={{
      width: "100%",
      height: "auto",
      borderRadius: "12px",
      marginBottom: "25px"
    }}
  />
)}
        
        <div style={{ margin: "1rem 0", display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {(blog.tags || []).map((tag: string) => (
            <span key={tag} style={{
              fontSize: "11px",
              fontWeight: 700,
              padding: "4px 12px",
              borderRadius: "999px",
              background: "rgba(24,162,61,0.1)",
              color: "#18a23d",
            }}>#{tag}</span>
          ))}
        </div>
        
        <div 
          dangerouslySetInnerHTML={{ __html: blog.content || '' }} 
          style={{ lineHeight: 1.8, fontSize: "16px", color: "#333" }}
        />
      </article>
{blog.affiliate_link && (
  <div
    style={{
      marginTop: "30px",
      marginBottom: "30px",
      textAlign: "center",
      background: "#fff",
      padding: "20px",
      borderRadius: "12px"
    }}
  >
    {blog.product_image && (
      <img
        src={blog.product_image}
        alt={blog.title}
        style={{
          width: "220px",
          maxWidth: "100%",
          borderRadius: "12px",
          marginBottom: "15px"
        }}
      />
    )}

    <a
      href={blog.affiliate_link}
      target="_blank"
      rel="noopener noreferrer"
      style={{
  display: "inline-block",
  background: "#2e7d32",
  color: "#fff",
  padding: "14px 28px",
  borderRadius: "10px",
  textDecoration: "none",
  fontWeight: "bold",
  transition: "all 0.3s ease",
  cursor: "pointer"
}}
    >
      🛒 Buy on Amazon
    </a>
  </div>
)}

      {relatedProducts.length > 0 && (
        <div style={{ marginTop: "48px", marginBottom: "48px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#1a2e1e", marginBottom: "20px" }}>
            🛍️ Related Products
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px",
          }}>
            {relatedProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div style={{ fontSize: "48px", textAlign: "center", marginBottom: "12px" }}>
                  <img
  src={product.image}
  alt={product.name}
  style={{
    width: "100%",
    height: "220px",
    objectFit: "contain",
    borderRadius: "12px"
  }}
/>
                </div>
                <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "8px", lineHeight: 1.3 }}>
                  {product.name}
                </h3>
                <div style={{ display: "flex", gap: "8px", alignItems: "baseline", marginBottom: "12px" }}>
                  <span style={{ fontSize: "20px", fontWeight: 800, color: "#18a23d" }}>
                    ₹{product.price}
                  </span>
                  {product.originalPrice && (
                    <span style={{ fontSize: "12px", color: "#aaa", textDecoration: "line-through" }}>
                      ₹{product.originalPrice}
                    </span>
                  )}
                  {product.discount && (
                    <span style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "2px 6px",
                      borderRadius: "20px",
                      background: "linear-gradient(135deg, #ff4fa3, #ff79c6)",
                      color: "white",
                    }}>
                      {product.discount}
                    </span>
                  )}
                </div>
                <a href={product.link} target="_blank" rel="noopener noreferrer" className="buy-btn">
                  Buy Now →
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {relatedBlogs.length > 0 && (
        <div style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#1a2e1e", marginBottom: "20px" }}>
            📖 You May Also Like
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "20px",
          }}>
            {relatedBlogs.map((relatedBlog) => (
              <Link key={relatedBlog.id} href={`/blog/${relatedBlog.slug}`} className="blog-card">
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>
                  {relatedBlog.image || "📖"}
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1a2e1e", marginBottom: "8px", lineHeight: 1.35 }}>
                  {relatedBlog.title}
                </h3>
                <p style={{ fontSize: "13px", color: "#666", lineHeight: 1.5 }}>
                  {relatedBlog.excerpt?.substring(0, 100)}...
                </p>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "12px" }}>
                  {(relatedBlog.tags || []).slice(0, 2).map((tag: string) => (
                    <span key={tag} style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      padding: "3px 10px",
                      borderRadius: "20px",
                      background: "rgba(24,162,61,0.1)",
                      color: "#18a23d",
                    }}>#{tag}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "40px",
    marginBottom: "32px",
  }}
>
  <Link href="/blog" className="back-link">
    ← Back
  </Link>

  {nextBlog && (
    <Link href={`/blog/${nextBlog.slug}`} className="next-link">
      Next →
    </Link>
  )}
</div>

<Comments slug={slug} />
    </div>
  )
}