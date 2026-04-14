"use client"

import { useState, useRef, useEffect } from "react"
import { supabase } from "../lib/supabase"
import { PRODUCTS } from "../lib/products"
import Link from "next/link"
import CameraMic from "../components/CameraMic"

export default function Home() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [blogs, setBlogs] = useState([])
  const [relatedProducts, setRelatedProducts] = useState([])
  const [relatedBlogs, setRelatedBlogs] = useState([])
  const [feedbackGiven, setFeedbackGiven] = useState({}) // track feedback per message
  const [likedMessages, setLikedMessages] = useState({}) // heart button
  const [copySuccess, setCopySuccess] = useState({})

  const messagesEndRef = useRef(null)
  const messageContainerRef = useRef(null)
  const lastAiMessageRef = useRef(null)
  const prevMessagesLength = useRef(0)
  const isFirstRender = useRef(true)

  // Fetch latest blogs
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

  // Auto-scroll
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

  const extractKeywords = (text) => {
    const stopWords = ["hai", "hain", "ka", "ki", "ke", "ko", "se", "mein", "par", "aur", "toh", "kya", "kaise", "kahan", "ye", "vo", "tha", "the", "raha", "rahi"]
    return text.toLowerCase().split(/[\s,?!.]+/).filter(w => w.length > 2 && !stopWords.includes(w))
  }

  const findRelatedProducts = (keywords) => {
    return PRODUCTS.filter(p => {
      const text = `${p.name} ${p.description} ${p.category || ''}`.toLowerCase()
      return keywords.some(k => text.includes(k))
    }).slice(0, 4)
  }

  const fetchRelatedBlogs = async (keywords) => {
    if (keywords.length === 0) return []
    const { data, error } = await supabase
      .from('blogs')
      .select('id, title, slug, excerpt, tags')
      .overlaps('tags', keywords)
      .limit(3)
    if (error) return []
    return data || []
  }

  const handleScan = (barcode) => {
    const product = PRODUCTS.find(p => p.barcode === barcode)
    if (product) {
      window.open(product.link, '_blank')
    } else {
      setInput(`Search product with barcode ${barcode}`)
      sendMessage()
    }
  }

  const handleMicResult = (text) => {
    setInput(text)
    setTimeout(() => sendMessage(), 50)
  }

  const handleLike = (index) => {
    setLikedMessages(prev => ({ ...prev, [index]: !prev[index] }))
  }

  const handleFeedback = (index, type) => {
    setFeedbackGiven(prev => ({ ...prev, [index]: type }))
    alert(`Thank you for your ${type === 'up' ? '👍 positive' : '👎 honest'} feedback!`)
  }

  const handleCopy = async (index, text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(prev => ({ ...prev, [index]: true }))
      setTimeout(() => setCopySuccess(prev => ({ ...prev, [index]: false })), 2000)
    } catch (err) {
      alert("Unable to copy")
    }
  }

  const handleShare = async (text) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MintAI Health Tip',
          text: text,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      alert("Share not supported on this browser. You can copy the text.")
    }
  }

  async function sendMessage() {
    const currentInput = input
    if (!currentInput.trim()) return

    const userMsg = { role: "user", content: currentInput }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setLoading(true)

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
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, { role: "ai", content: "Sorry, please try again." }])
    }
    setLoading(false)
  }

  return (
    <div className="animate-start">
      <div className="chat-container">
        <div ref={messageContainerRef} className="messages">
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: '#888', marginTop: '60px' }}>
              <div style={{ fontSize: '3rem' }}>💚🌿</div>
              <p style={{ fontSize: '1.2rem' }}>How can I help you today?</p>
              <p style={{ color: '#2e9e4f' }}>Ask about skincare, health, beauty, or natural remedies...</p>
            </div>
          )}
          {messages.map((msg, i) => {
            const isLastAi = i === messages.length - 1 && msg.role === "ai"
            return (
              <div key={i}>
                <div
                  ref={isLastAi ? lastAiMessageRef : null}
                  className={`message ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}
                >
                  <div className={`bubble ${msg.role === 'user' ? 'user-bubble' : 'ai-bubble'}`}>
                    {msg.content}
                  </div>
                </div>
                {/* Action buttons only for AI messages */}
                {msg.role === "ai" && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '12px', marginTop: '6px', marginLeft: '50px', flexWrap: 'wrap' }}>
                    <button onClick={() => handleLike(i)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: likedMessages[i] ? '#ff69b4' : '#ccc' }} title="Love this answer">
                      {likedMessages[i] ? '❤️' : '🤍'}
                    </button>
                    <button onClick={() => handleCopy(i, msg.content)} style={{ background: 'none', border: 'none', fontSize: '1rem', cursor: 'pointer', color: '#666' }} title="Copy answer">
                      📋 {copySuccess[i] ? 'Copied!' : 'Copy'}
                    </button>
                    <button onClick={() => handleShare(msg.content)} style={{ background: 'none', border: 'none', fontSize: '1rem', cursor: 'pointer', color: '#666' }} title="Share answer">
                      📤 Share
                    </button>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: '#888' }}>Was this helpful?</span>
                      <button onClick={() => handleFeedback(i, 'up')} style={{ background: 'none', border: 'none', fontSize: '1.1rem', cursor: 'pointer', color: feedbackGiven[i] === 'up' ? '#2e9e4f' : '#ccc' }}>👍</button>
                      <button onClick={() => handleFeedback(i, 'down')} style={{ background: 'none', border: 'none', fontSize: '1.1rem', cursor: 'pointer', color: feedbackGiven[i] === 'down' ? '#ff69b4' : '#ccc' }}>👎</button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
          {loading && (
            <div className="message ai-message">
              <div className="ai-typing">
                <span></span><span></span><span></span>
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

      {/* Related Products - shown FIRST after AI answer */}
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

      {/* Related Blogs - shown SECOND after AI answer */}
      {messages.length > 0 && messages[messages.length-1]?.role === "ai" && relatedBlogs.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2>📝 Related Blogs</h2>
          <div className="blog-grid">
            {relatedBlogs.map(blog => (
              <Link key={blog.id} href={`/blog/${blog.slug}`} className="blog-card">
                <h3>{blog.title}</h3>
                <p>{blog.excerpt}</p>
                <div className="tags">
                  {blog.tags?.map((tag) => <span key={tag} className="tag">#{tag}</span>)}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Latest Blogs - always visible at bottom */}
      {blogs.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2>📰 Latest Blogs</h2>
          <div className="blog-grid">
            {blogs.map(blog => (
              <Link key={blog.id} href={`/blog/${blog.slug}`} className="blog-card">
                <h3>{blog.title}</h3>
                <p>{blog.excerpt}</p>
                <div className="tags">
                  {blog.tags?.map((tag) => <span key={tag} className="tag">#{tag}</span>)}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}