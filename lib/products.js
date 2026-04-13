"use client"

import { useState, useRef, useEffect } from "react"
import { supabase } from "../lib/supabase"
import { PRODUCTS } from "../lib/products"
import Link from "next/link"
import CameraMic from "../components/CameraMic"

export default function Home() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [blogs, setBlogs] = useState<any[]>([])
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [relatedBlogs, setRelatedBlogs] = useState<any[]>([])
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messageContainerRef = useRef<HTMLDivElement>(null)
  const lastAiMessageRef = useRef<HTMLDivElement>(null)
  const prevMessagesLength = useRef(0)
  const isFirstRender = useRef(true)

  // Fetch latest blogs for home page
  useEffect(() => {
    const fetchBlogs = async () => {
      const { data } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3)
      if (data) setBlogs(data)
    }
    fetchBlogs()
  }, [])

  // Auto-scroll logic
  useEffect(() => {
    if (messages.length === 0) return
    const lastMessage = messages[messages.length - 1]
    const isNewMessage = messages.length > prevMessagesLength.current

    if (isFirstRender.current && messages.length > 0) {
      isFirstRender.current = false
      return
    }

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

  // Extract keywords from user query (Hindi + English)
  const extractKeywords = (text: string): string[] => {
    const stopWords = ["hai", "hain", "ka", "ki", "ke", "ko", "se", "mein", "par", "aur", "toh", "kya", "kaise", "kahan", "ye", "vo", "tha", "the", "raha", "rahi"]
    return text.toLowerCase().split(/[\s,?!.]+/).filter(w => w.length > 2 && !stopWords.includes(w))
  }

  // Find related products based on keywords
  const findRelatedProducts = (keywords: string[]) => {
    return PRODUCTS.filter(p => {
      const text = `${p.name} ${p.description} ${p.category}`.toLowerCase()
      return keywords.some(k => text.includes(k))
    }).slice(0, 4)
  }

  // Fetch related blogs from Supabase based on keywords
  const fetchRelatedBlogs = async (keywords: string[]) => {
    if (keywords.length === 0) return []
    const { data, error } = await supabase
      .from('blogs')
      .select('id, title, slug, excerpt, tags')
      .overlaps('tags', keywords)
      .limit(3)
    if (error) return []
    return data || []
  }

  const handleScan = (barcode: string) => {
    const product = PRODUCTS.find(p => p.barcode === barcode)
    if (product) {
      window.open(product.link, '_blank')
    } else {
      setInput(`Search product with barcode ${barcode}`)
      sendMessage()
    }
  }

  const handleMicResult = (text: string) => {
    setInput(text)
    // Force send after state update (use timeout)
    setTimeout(() => sendMessage(), 50)
  }

  async function sendMessage() {
    const currentInput = input
    if (!currentInput.trim()) return

    const userMsg = { role: "user", content: currentInput }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setLoading(true)

    // Extract keywords and find related content
    const keywords = extractKeywords(currentInput)
    const products = findRelatedProducts(keywords)
    setRelatedProducts(products)
    const blogs = await fetchRelatedBlogs(keywords)
    setRelatedBlogs(blogs)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: currentInput })
      })
      const data = await res.json()

      const aiMsg = { role: "ai", content: "" }
      setMessages(prev => [...prev, aiMsg])

      const cleanText = data.answer.replace(/\s+/g, ' ').trim()
      for (let i = 0; i <= cleanText.length; i++) {
        await new Promise(r => setTimeout(r, 20))
        setMessages(prev => {
          const newMsgs = [...prev]
          newMsgs[newMsgs.length - 1].content = cleanText.slice(0, i)
          return newMsgs
        })
      }
      setShowFeedbackPopup(true)
      setTimeout(() => setShowFeedbackPopup(false), 5000)
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, { role: "ai", content: "Sorry, please try again." }])
    }
    setLoading(false)
  }

  return (
    <div>
      <div className="chat-container">
        <div ref={messageContainerRef} className="messages">
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: '#888', marginTop: '60px' }}>
              {/* Replaced flower with professional health icon */}
              <div style={{ fontSize: '3rem' }}>💚🌿</div>
              <p style={{ fontSize: '1.2rem' }}>How can I help you today?</p>
              <p style={{ color: '#2e9e4f' }}>Ask about skincare, health, beauty, or natural remedies...</p>
            </div>
          )}
          {messages.map((msg, i) => {
            const isLastAi = i === messages.length - 1 && msg.role === "ai"
            return (
              <div
                key={i}
                ref={isLastAi ? lastAiMessageRef : null}
                className={`message ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}
              >
                <div className={`bubble ${msg.role === 'user' ? 'user-bubble' : 'ai-bubble'}`}>
                  {msg.content}
                </div>
              </div>
            )
          })}
          {loading && (
            <div className="message ai-message">
              <div className="typing">
                <div className="dot"></div><div className="dot"></div><div className="dot"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <CameraMic onScan={handleScan} onMicResult={handleMicResult} />
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && sendMessage()}
            placeholder="Apna sawaal poochhein..."
            disabled={loading}
          />
          <button onClick={sendMessage} disabled={loading || !input.trim()}>
            ➤
          </button>
        </div>
      </div>

      {/* Related Products Section (shown after AI answer) */}
      {messages.length > 0 && messages[messages.length-1]?.role === "ai" && relatedProducts.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2>🛍️ Related Products</h2>
          <div className="product-grid">
            {relatedProducts.map(p => (
              <a key={p.id} href={p.link} target="_blank" rel="noopener noreferrer" className="product-card">
                <div className="product-image">{p.image}</div>
                <h3>{p.name}</h3>
                <div className="price">
                  <span className="current">{p.price}</span>
                  <span className="original">{p.originalPrice}</span>
                  <span className="discount">{p.discount}</span>
                </div>
                <p>{p.description}</p>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Related Blogs Section */}
      {messages.length > 0 && messages[messages.length-1]?.role === "ai" && relatedBlogs.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2>📝 Related Blogs</h2>
          <div className="blog-grid">
            {relatedBlogs.map(blog => (
              <Link key={blog.id} href={`/blog/${blog.slug}`} className="blog-card">
                <h3>{blog.title}</h3>
                <p>{blog.excerpt}</p>
                <div className="tags">
                  {blog.tags?.map((tag: string) => <span key={tag} className="tag">#{tag}</span>)}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Latest Blogs Section (always visible) */}
      {blogs.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2>📰 Latest Blogs</h2>
          <div className="blog-grid">
            {blogs.map(blog => (
              <Link key={blog.id} href={`/blog/${blog.slug}`} className="blog-card">
                <h3>{blog.title}</h3>
                <p>{blog.excerpt}</p>
                <div className="tags">
                  {blog.tags?.map((tag: string) => <span key={tag} className="tag">#{tag}</span>)}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Feedback Popup */}
      {showFeedbackPopup && (
        <div className="feedback-popup">
          <div className="feedback-popup-content">
            <h3>Was this helpful?</h3>
            <div className="stars">
              {[1,2,3,4,5].map(s => (
                <button key={s} onClick={() => { setShowFeedbackPopup(false); alert("Thank you!"); }}>★</button>
              ))}
            </div>
            <button onClick={() => setShowFeedbackPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}