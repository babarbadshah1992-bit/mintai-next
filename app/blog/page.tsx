"use client"

import { useState, useRef, useEffect } from "react"
import { PRODUCTS } from "@/lib/products"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

interface Message {
  role: "user" | "ai"
  content: string
}

interface Product {
  id: number
  name: string
  price: string
  originalPrice: string
  discount: string
  image: string
  link: string
  rating: number
  category: string
  description: string
  brand: string
  inStock: boolean
}

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  tags: string[]
  created_at: string
}

export default function Home() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [relatedBlogs, setRelatedBlogs] = useState<BlogPost[]>([])
  const [latestBlogs, setLatestBlogs] = useState<BlogPost[]>([])
  const [showSidebar, setShowSidebar] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const messageContainerRef = useRef<HTMLDivElement | null>(null)
  const lastAiMessageRef = useRef<HTMLDivElement | null>(null)
  const prevMessagesLength = useRef(0)

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      const { data } = await supabase
        .from('blogs')
        .select('id, title, slug, excerpt, tags, created_at')
        .order('created_at', { ascending: false })
        .limit(4)
      if (data) setLatestBlogs(data)
    }
    fetchLatestBlogs()
  }, [])

  useEffect(() => {
    if (messages.length === 0) return
    const lastMessage = messages[messages.length - 1]
    const isNewMessage = messages.length > prevMessagesLength.current

    if (isNewMessage) {
      if (lastMessage.role === "user") {
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
        }, 100)
      } else if (lastMessage.role === "ai") {
        setTimeout(() => {
          if (lastAiMessageRef.current && messageContainerRef.current) {
            const top = lastAiMessageRef.current.offsetTop - 20
            messageContainerRef.current.scrollTo({ top, behavior: "smooth" })
          }
        }, 200)
      }
    }
    prevMessagesLength.current = messages.length
  }, [messages])

  const extractKeywords = (text: string): string[] => {
    const stopWords = ["hai", "hain", "ka", "ki", "ke", "ko", "se", "mein", "par", "aur", "toh", "kya", "kaise", "kahan", "ye", "vo", "tha", "the", "raha", "rahi"]
    return text
      .toLowerCase()
      .split(/[\s,?!.]+/)
      .filter(word => word.length > 2 && !stopWords.includes(word))
  }

  const findRelatedProducts = (keywords: string[]): Product[] => {
    return PRODUCTS.filter(product => {
      const productText = `${product.name} ${product.description} ${product.category}`.toLowerCase()
      return keywords.some(keyword => productText.includes(keyword))
    }).slice(0, 4)
  }

  const fetchRelatedBlogs = async (keywords: string[]): Promise<BlogPost[]> => {
    if (keywords.length === 0) return []
    const { data, error } = await supabase
      .from('blogs')
      .select('id, title, slug, excerpt, tags, created_at')
      .overlaps('tags', keywords)
      .limit(3)
    if (error) {
      console.error('Supabase error:', error)
      return []
    }
    return data || []
  }

  async function sendMessage() {
    if (!input.trim()) return

    const userMessage: Message = { role: "user", content: input }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setLoading(true)

    const keywords = extractKeywords(input)
    const products = findRelatedProducts(keywords)
    setRelatedProducts(products)

    const blogs = await fetchRelatedBlogs(keywords)
    setRelatedBlogs(blogs)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input })
      })
      const data = await res.json()

      const aiMessage: Message = { role: "ai", content: "" }
      setMessages(prev => [...prev, aiMessage])

      const words = data.answer.split(" ")
      for (let i = 0; i < words.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 30))
        setMessages(prev => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1] = {
            role: "ai",
            content: (newMessages[newMessages.length - 1]?.content || "") + (i === 0 ? "" : " ") + words[i]
          }
          return newMessages
        })
      }
    } catch (err) {
      console.error('Chat error:', err)
      setMessages(prev => [...prev, { role: "ai", content: "😔 Kripya dubara try karein." }])
    }
    setLoading(false)
  }

  return (
    <div className="home-layout">
      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%,100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        .home-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 24px;
        }

        .chat-section {
          background: white;
          border-radius: 24px;
          border: 1px solid rgba(46,158,79,0.1);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .messages-container {
          height: 450px;
          overflow-y: auto;
          padding: 20px;
          scroll-behavior: smooth;
        }
        .message-row {
          display: flex;
          margin-bottom: 16px;
          align-items: flex-start;
        }
        .user-row { justify-content: flex-end; }
        .ai-row { justify-content: flex-start; }
        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          flex-shrink: 0;
        }
        .ai-avatar {
          background: linear-gradient(135deg, #2e9e4f, #1e6e3a);
          color: white;
          margin-right: 8px;
        }
        .user-avatar {
          background: #ff69b4;
          color: white;
          margin-left: 8px;
        }
        .message-bubble {
          padding: 10px 14px;
          border-radius: 18px;
          max-width: 85%;
          line-height: 1.5;
          font-size: 0.95rem;
        }
        .message-bubble.user {
          background: linear-gradient(135deg, #2e9e4f, #1e6e3a);
          color: white;
          border-radius: 18px 18px 5px 18px;
        }
        .message-bubble.ai {
          background: #f8faf8;
          color: #1a2e1a;
          border: 1px solid rgba(46,158,79,0.1);
          border-radius: 18px 18px 18px 5px;
        }
        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 10px 14px;
          background: #f8faf8;
          border-radius: 18px 18px 18px 5px;
          border: 1px solid rgba(46,158,79,0.1);
        }
        .typing-dot {
          width: 8px;
          height: 8px;
          background: linear-gradient(135deg, #2e9e4f, #1e6e3a);
          border-radius: 50%;
          animation: pulse 1.2s infinite;
        }
        .input-area {
          padding: 16px;
          border-top: 1px solid rgba(46,158,79,0.1);
          display: flex;
          gap: 10px;
        }
        .input-area input {
          flex: 1;
          padding: 12px 18px;
          border-radius: 40px;
          border: 2px solid #e8f0e8;
          font-size: 1rem;
          outline: none;
        }
        .input-area input:focus {
          border-color: #2e9e4f;
        }
        .input-area button {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, #2e9e4f, #1e6e3a);
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .input-area button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .recommendations {
          padding: 0 16px 16px;
        }
        .recommendation-group {
          margin-top: 20px;
        }
        .recommendation-group h3 {
          font-size: 1.1rem;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .recommendation-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 12px;
        }
        .product-card {
          display: flex;
          gap: 12px;
          padding: 12px;
          background: #f8faf8;
          border-radius: 16px;
          text-decoration: none;
          color: inherit;
          border: 1px solid rgba(46,158,79,0.1);
          transition: 0.2s;
        }
        .product-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .product-image {
          width: 60px;
          height: 60px;
          background: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
        }
        .product-info h4 {
          margin: 0 0 4px;
          font-size: 0.9rem;
          font-weight: 600;
        }
        .product-price {
          display: flex;
          gap: 6px;
          align-items: center;
          font-size: 0.9rem;
        }
        .current-price { font-weight: 700; color: #2e9e4f; }
        .original-price { text-decoration: line-through; color: #999; font-size: 0.8rem; }
        .discount-badge { background: #ff69b4; color: white; padding: 2px 6px; border-radius: 20px; font-size: 0.7rem; }

        .blog-card {
          display: block;
          padding: 14px;
          background: #f8faf8;
          border-radius: 16px;
          text-decoration: none;
          color: inherit;
          border: 1px solid rgba(46,158,79,0.1);
        }
        .blog-card h4 {
          margin: 0 0 6px;
          font-size: 1rem;
        }
        .blog-card p {
          font-size: 0.85rem;
          color: #666;
          margin-bottom: 8px;
        }
        .blog-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .tag {
          background: #e8f5e9;
          color: #2e9e4f;
          padding: 2px 8px;
          border-radius: 30px;
          font-size: 0.7rem;
        }

        .latest-blogs {
          margin-top: 32px;
          background: white;
          border-radius: 24px;
          border: 1px solid rgba(46,158,79,0.1);
          padding: 24px;
        }
        .latest-blogs h3 {
          font-size: 1.3rem;
          margin-bottom: 20px;
        }
        .view-all {
          display: inline-block;
          margin-top: 16px;
          color: #2e9e4f;
          font-weight: 600;
          text-decoration: none;
        }

        .sidebar {
          background: white;
          border-radius: 24px;
          padding: 20px;
          border: 1px solid rgba(46,158,79,0.1);
          height: fit-content;
          position: sticky;
          top: 20px;
        }
        .sidebar-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        .cuelinks-badge {
          background: #f0f7f0;
          padding: 4px 8px;
          border-radius: 20px;
          font-size: 0.7rem;
          color: #2e9e4f;
          margin-left: auto;
        }
        .sidebar-search {
          width: 100%;
          padding: 10px 14px;
          border-radius: 30px;
          border: 2px solid #e8f0e8;
          margin-bottom: 20px;
          outline: none;
        }
        .sidebar-products {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 400px;
          overflow-y: auto;
        }
        .sidebar-product {
          display: flex;
          gap: 12px;
          padding: 8px;
          border-radius: 12px;
          text-decoration: none;
          color: inherit;
        }
        .sidebar-product:hover { background: #f8faf8; }
        .sidebar-product-image {
          width: 50px;
          height: 50px;
          background: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
        }
        .sidebar-product-info h4 {
          margin: 0;
          font-size: 0.9rem;
          font-weight: 500;
        }
        .sidebar-product-price {
          display: flex;
          gap: 6px;
          font-size: 0.85rem;
        }
        .sidebar-footer {
          margin-top: 20px;
          padding: 12px;
          background: linear-gradient(135deg, #fff3e0, #fff0f5);
          border-radius: 16px;
          font-size: 0.8rem;
          text-align: center;
        }

        .sidebar-toggle {
          display: none;
          background: white;
          border: 1px solid rgba(46,158,79,0.2);
          border-radius: 30px;
          padding: 8px 16px;
          margin: 16px 0;
          cursor: pointer;
          text-align: center;
        }
        @media (max-width: 768px) {
          .home-grid {
            grid-template-columns: 1fr;
          }
          .sidebar {
            display: none;
          }
          .sidebar-toggle {
            display: block;
          }
          .sidebar.show {
            display: block;
          }
        }
      `}</style>

      <div className="home-grid">
        <div>
          <div className="chat-section">
            <div ref={messageContainerRef} className="messages-container">
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', color: '#888', marginTop: '60px' }}>
                  <div style={{ fontSize: '3rem' }}>🌺</div>
                  <p style={{ fontSize: '1.1rem' }}>Kaise help kar sakte hain?</p>
                  <p style={{ color: '#2e9e4f' }}>Poochhein skincare, health, ya beauty tips...</p>
                </div>
              )}
              {messages.map((msg, i) => {
                const isLastAi = i === messages.length - 1 && msg.role === "ai"
                return (
                  <div
                    key={i}
                    ref={isLastAi ? lastAiMessageRef : null}
                    className={`message-row ${msg.role === "user" ? "user-row" : "ai-row"}`}
                  >
                    {msg.role === "ai" && <div className="avatar ai-avatar">🌿</div>}
                    <div className={`message-bubble ${msg.role}`}>{msg.content}</div>
                    {msg.role === "user" && <div className="avatar user-avatar">👤</div>}
                  </div>
                )
              })}
              {loading && (
                <div className="message-row ai-row">
                  <div className="avatar ai-avatar">🌿</div>
                  <div className="typing-indicator">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {messages.length > 0 && messages[messages.length-1]?.role === "ai" && (
              <div className="recommendations">
                {relatedProducts.length > 0 && (
                  <div className="recommendation-group">
                    <h3>🛍️ Related Products</h3>
                    <div className="recommendation-grid">
                      {relatedProducts.map(p => (
                        <a key={p.id} href={p.link} target="_blank" rel="noopener noreferrer" className="product-card">
                          <div className="product-image">{p.image}</div>
                          <div className="product-info">
                            <h4>{p.name}</h4>
                            <div className="product-price">
                              <span className="current-price">{p.price}</span>
                              <span className="original-price">{p.originalPrice}</span>
                              <span className="discount-badge">{p.discount}</span>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                {relatedBlogs.length > 0 && (
                  <div className="recommendation-group">
                    <h3>📝 Related Blogs</h3>
                    <div className="recommendation-grid">
                      {relatedBlogs.map(b => (
                        <Link key={b.id} href={`/blog/${b.slug}`} className="blog-card">
                          <h4>{b.title}</h4>
                          <p>{b.excerpt}</p>
                          <div className="blog-tags">
                            {b.tags?.map(t => <span key={t} className="tag">#{t}</span>)}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="input-area">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === "Enter" && sendMessage()}
                placeholder="Apna sawaal poochhein..."
                disabled={loading}
              />
              <button onClick={sendMessage} disabled={loading || !input.trim()}>
                ➤
              </button>
            </div>
          </div>

          {latestBlogs.length > 0 && (
            <div className="latest-blogs">
              <h3>📰 Latest Health & Beauty Blogs</h3>
              <div className="recommendation-grid">
                {latestBlogs.map(blog => (
                  <Link key={blog.id} href={`/blog/${blog.slug}`} className="blog-card">
                    <h4>{blog.title}</h4>
                    <p>{blog.excerpt}</p>
                    <div className="blog-tags">
                      {blog.tags?.map(tag => <span key={tag} className="tag">#{tag}</span>)}
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/blog" className="view-all">View all blogs →</Link>
            </div>
          )}
        </div>

        <div>
          <button 
            className="sidebar-toggle" 
            onClick={() => setShowSidebar(!showSidebar)}
          >
            🛍️ {showSidebar ? 'Hide Products' : 'Show Products'} ({PRODUCTS.length})
          </button>
          <div className={`sidebar ${showSidebar ? 'show' : ''}`}>
            <div className="sidebar-header">
              <span>🛍️</span>
              <h3>All Products ({PRODUCTS.length})</h3>
              <span className="cuelinks-badge">Cuelinks Ready</span>
            </div>
            <input 
              type="text" 
              placeholder="🔍 Search products..." 
              className="sidebar-search" 
            />
            <div className="sidebar-products">
              {PRODUCTS.slice(0, 10).map(p => (
                <a 
                  key={p.id} 
                  href={p.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="sidebar-product"
                >
                  <div className="sidebar-product-image">{p.image}</div>
                  <div className="sidebar-product-info">
                    <h4>{p.name}</h4>
                    <div className="sidebar-product-price">
                      <span>{p.price}</span>
                      <span className="original">{p.originalPrice}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
            <div className="sidebar-footer">
              ❤️ Partner products • 100% authentic
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}