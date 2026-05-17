import { supabase } from '../../lib/supabase'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MintAI Wellness Library | Expert Health Articles & Natural Remedies',
  description: 'Discover expert wellness insights, natural remedies, ayurvedic tips, and holistic health guides.',
  keywords: 'wellness blog, health articles, natural remedies, ayurveda, holistic health',
}

interface Blog {
  id: string
  title: string
  excerpt: string
  slug: string
  tags: string[] | null
  created_at: string
}

export default async function BlogPage() {
  const { data: blogs, error } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Supabase error:', error)
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(160deg, #f0f7f2 0%, #e8f4ec 100%)',
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}>
        <div style={{
          background: 'white',
          padding: '48px',
          borderRadius: '24px',
          textAlign: 'center',
          maxWidth: '400px',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌿</div>
          <h2 style={{ color: '#1a2e1e', marginBottom: '8px' }}>Connection Error</h2>
          <p style={{ color: '#5a7060' }}>Unable to load blogs. Please try again.</p>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  const getReadTime = (excerpt: string) => {
    const wordsPerMinute = 200
    const wordCount = excerpt.split(/\s+/).length
    return Math.max(2, Math.ceil(wordCount / wordsPerMinute))
  }

  const featuredBlog = blogs && blogs.length > 0 ? blogs[0] : null
  const remainingBlogs = blogs && blogs.length > 1 ? blogs.slice(1) : []

  return (
    <div style={{
      background: '#fafdf8',
      minHeight: '100vh',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      {/* Navbar */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(250,253,248,0.98)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(24,162,61,0.1)',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #18a23d, #1db84c)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
            }}>🌿</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '18px', color: '#1a2e1e' }}>MintAI</div>
              <div style={{ fontSize: '11px', color: '#18a23d', fontWeight: 600 }}>Wellness Library</div>
            </div>
          </Link>
          <Link href="/" style={{
            padding: '8px 20px',
            borderRadius: '40px',
            background: 'linear-gradient(135deg, #18a23d, #1db84c)',
            color: 'white',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 600,
          }}>
            ← Back Home
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px 80px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{
            display: 'inline-block',
            padding: '6px 16px',
            borderRadius: '40px',
            background: 'rgba(24,162,61,0.08)',
            color: '#18a23d',
            fontSize: '12px',
            fontWeight: 600,
            marginBottom: '20px',
          }}>✦ Trusted Wellness Resource</div>
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 800,
            color: '#1a2e1e',
            marginBottom: '16px',
            letterSpacing: '-0.02em',
          }}>Wellness Library</h1>
          <p style={{
            fontSize: '18px',
            color: '#5a7060',
            maxWidth: '560px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}>Evidence-based health insights • Natural remedies • Holistic living</p>
        </div>

        {/* Featured Article */}
        {featuredBlog && (
          <div style={{ marginBottom: '64px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px',
            }}>
              <div style={{ width: '32px', height: '3px', background: '#18a23d', borderRadius: '2px' }}></div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#18a23d' }}>FEATURED ARTICLE</span>
            </div>
            
            <Link href={`/blog/${featuredBlog.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'white',
                borderRadius: '28px',
                padding: '40px',
                boxShadow: '0 12px 32px rgba(0,0,0,0.04)',
                border: '1px solid rgba(24,162,61,0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
                  {(featuredBlog.tags || []).slice(0, 3).map((tag: string) => (
                    <span key={tag} style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '5px 14px',
                      borderRadius: '40px',
                      background: 'rgba(24,162,61,0.08)',
                      color: '#18a23d',
                    }}>#{tag}</span>
                  ))}
                </div>
                <h2 style={{
                  fontSize: 'clamp(24px, 3.5vw, 34px)',
                  fontWeight: 800,
                  color: '#1a2e1e',
                  marginBottom: '16px',
                  lineHeight: 1.3,
                }}>{featuredBlog.title}</h2>
                <p style={{
                  fontSize: '16px',
                  color: '#5a7060',
                  lineHeight: 1.65,
                  marginBottom: '24px',
                }}>{featuredBlog.excerpt}</p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <span style={{ fontSize: '13px', color: '#7a9080' }}>📖 {getReadTime(featuredBlog.excerpt)} min read</span>
                    <span style={{ fontSize: '13px', color: '#7a9080' }}>📅 {formatDate(featuredBlog.created_at)}</span>
                  </div>
                  <span style={{
                    padding: '8px 24px',
                    borderRadius: '40px',
                    background: 'linear-gradient(135deg, #18a23d, #1db84c)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}>Read Article →</span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* All Articles Grid */}
        <div>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#1a2e1e',
            }}>All Articles</h2>
            <p style={{ color: '#7a9080', fontSize: '14px', marginTop: '4px' }}>{blogs?.length || 0} wellness insights</p>
          </div>

          {remainingBlogs.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '28px',
            }}>
              {remainingBlogs.map((blog: Blog) => (
                <Link key={blog.id} href={`/blog/${blog.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'white',
                    borderRadius: '24px',
                    padding: '28px',
                    border: '1px solid rgba(24,162,61,0.08)',
                    transition: 'all 0.3s ease',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                  }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                      {(blog.tags || []).slice(0, 2).map((tag: string) => (
                        <span key={tag} style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          padding: '4px 12px',
                          borderRadius: '40px',
                          background: 'rgba(24,162,61,0.06)',
                          color: '#18a23d',
                        }}>{tag}</span>
                      ))}
                    </div>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: 700,
                      color: '#1a2e1e',
                      marginBottom: '12px',
                      lineHeight: 1.4,
                    }}>{blog.title}</h3>
                    <p style={{
                      fontSize: '14px',
                      color: '#5a7060',
                      lineHeight: 1.65,
                      marginBottom: '20px',
                      flex: 1,
                    }}>{blog.excerpt}</p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '16px',
                      borderTop: '1px solid rgba(24,162,61,0.08)',
                    }}>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <span style={{ fontSize: '12px', color: '#7a9080' }}>📖 {getReadTime(blog.excerpt)} min</span>
                        <span style={{ fontSize: '12px', color: '#7a9080' }}>📅 {formatDate(blog.created_at)}</span>
                      </div>
                      <span style={{
                        fontSize: '18px',
                        color: '#18a23d',
                      }}>→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '80px 40px',
              background: 'white',
              borderRadius: '28px',
            }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>📚</div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1a2e1e' }}>More articles coming soon</h3>
              <p style={{ color: '#7a9080', marginTop: '8px' }}>Check back for new wellness insights</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}