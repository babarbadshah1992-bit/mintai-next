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
  const [liked, setLiked] = useState({})
  const [copyMsg, setCopyMsg] = useState({})
  const [feedbackGiven, setFeedbackGiven] = useState({})

  const messagesEndRef = useRef(null)
  const containerRef = useRef(null)
  const lastAiRef = useRef(null)
  const prevLen = useRef(0)
  const isFirst = useRef(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data } = await supabase.from('blogs').select('*').order('created_at', { ascending: false }).limit(3)
      if (data) setBlogs(data)
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    if (!messages.length) return
    const last = messages[messages.length - 1]
    const isNew = messages.length > prevLen.current
    if (isFirst.current && messages.length > 0) { isFirst.current = false; return }
    if (isNew) {
      if (last.role === "user") {
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 100)
      } else if (last.role === "ai") {
        setTimeout(() => {
          if (lastAiRef.current && containerRef.current) {
            const top = lastAiRef.current.offsetTop - 20
            containerRef.current.scrollTo({ top, behavior: "smooth" })
          }
        }, 200)
      }
    }
    prevLen.current = messages.length
  }, [messages])

  const extractKeywords = (text) => {
    const stop = ["hai","hain","ka","ki","ke","ko","se","mein","par","aur","toh","kya","kaise","kahan","ye","vo","tha","the","raha","rahi"]
    return text.toLowerCase().split(/[\s,?!.]+/).filter(w => w.length > 2 && !stop.includes(w))
  }

  const findRelatedProducts = (keywords) => {
    return PRODUCTS.filter(p => {
      const txt = `${p.name} ${p.description} ${p.category || ''}`.toLowerCase()
      return keywords.some(k => txt.includes(k))
    }).slice(0, 4)
  }

  const fetchRelatedBlogs = async (keywords) => {
    if (!keywords.length) return []
    const { data } = await supabase.from('blogs').select('id,title,slug,excerpt,tags').overlaps('tags', keywords).limit(3)
    return data || []
  }

  const handleScan = (barcode) => {
    const prod = PRODUCTS.find(p => p.barcode === barcode)
    if (prod) window.open(prod.link, '_blank')
    else { setInput(`Barcode: ${barcode}`); sendMessage() }
  }

  const handleMic = (text) => {
    setInput(text)
    setTimeout(() => sendMessage(), 50)
  }

  const handleLike = (idx) => setLiked(prev => ({ ...prev, [idx]: !prev[idx] }))
  const handleCopy = async (idx, txt) => {
    await navigator.clipboard.writeText(txt)
    setCopyMsg({ ...copyMsg, [idx]: true })
    setTimeout(() => setCopyMsg({ ...copyMsg, [idx]: false }), 2000)
  }
  const handleShare = (txt) => {
    if (navigator.share) navigator.share({ title: 'MintAI', text: txt })
    else alert("Share not supported. You can copy the text.")
  }
  const handleFeedback = (idx, type) => {
    setFeedbackGiven(prev => ({ ...prev, [idx]: type }))
    alert(`Thank you for your ${type === 'up' ? 'positive' : 'honest'} feedback!`)
  }

  async function sendMessage() {
    const q = input.trim()
    if (!q) return
    setMessages(prev => [...prev, { role: "user", content: q }])
    setInput("")
    setLoading(true)

    const keywords = extractKeywords(q)
    const prods = findRelatedProducts(keywords)
    setRelatedProducts(prods)
    const relBlogs = await fetchRelatedBlogs(keywords)
    setRelatedBlogs(relBlogs)

    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: q }) })
      const data = await res.json()
      const aiMsg = { role: "ai", content: "" }
      setMessages(prev => [...prev, aiMsg])
      const clean = data.answer.replace(/\s+/g, ' ').trim()
      for (let i = 0; i <= clean.length; i++) {
        await new Promise(r => setTimeout(r, 20))
        setMessages(prev => {
          const newMsgs = [...prev]
          newMsgs[newMsgs.length-1].content = clean.slice(0, i)
          return newMsgs
        })
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "ai", content: "Sorry, something went wrong." }])
    }
    setLoading(false)
  }

  const lastAiIndex = messages.length && messages[messages.length-1]?.role === "ai" ? messages.length-1 : -1

  return (
    <div>
      <div className="chat-container">
        <div ref={containerRef} className="messages">
          {!messages.length && (
            <div style={{ textAlign: 'center', marginTop: '60px', color: '#888' }}>
              <div style={{ fontSize: '3rem' }}>💚🌿</div>
              <p style={{ fontSize: '1.2rem' }}>How can I help you today?</p>
              <p style={{ color: '#2e9e4f' }}>Ask about skincare, health, beauty, or natural remedies...</p>
            </div>
          )}
          {messages.map((msg, idx) => {
            const isLastAi = idx === messages.length-1 && msg.role === "ai"
            return (
              <div key={idx}>
                <div ref={isLastAi ? lastAiRef : null} className={`message ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}>
                  <div className={`bubble ${msg.role === 'user' ? 'user-bubble' : 'ai-bubble'}`}>{msg.content}</div>
                </div>
                {msg.role === "ai" && (
                  <div className="action-buttons">
                    <button className="action-btn" onClick={() => handleLike(idx)}>{liked[idx] ? '❤️' : '🤍'} Love</button>
                    <button className="action-btn" onClick={() => handleCopy(idx, msg.content)}>📋 {copyMsg[idx] ? 'Copied!' : 'Copy'}</button>
                    <button className="action-btn" onClick={() => handleShare(msg.content)}>📤 Share</button>
                    <div className="feedback-group">
                      <span style={{ fontSize: '0.8rem', color: '#888' }}>Helpful?</span>
                      <button className="action-btn" onClick={() => handleFeedback(idx, 'up')} style={{ color: feedbackGiven[idx] === 'up' ? '#2e9e4f' : '#ccc' }}>👍</button>
                      <button className="action-btn" onClick={() => handleFeedback(idx, 'down')} style={{ color: feedbackGiven[idx] === 'down' ? '#ff69b4' : '#ccc' }}>👎</button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
          {loading && (
            <div className="message ai-message">
              <div className="typing"><span></span><span></span><span></span></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="input-area">
          <CameraMic onScan={handleScan} onMicResult={handleMic} />
          <input value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && sendMessage()} placeholder="Apna sawaal poochhein..." disabled={loading} />
          <button onClick={sendMessage} disabled={loading || !input.trim()}>➤</button>
        </div>
      </div>

      {lastAiIndex !== -1 && (
        <div>
          {relatedProducts.length > 0 && (
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
          {relatedBlogs.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h2>📝 Related Blogs</h2>
              <div className="blog-grid">
                {relatedBlogs.map(blog => (
                  <Link key={blog.id} href={`/blog/${blog.slug}`} className="blog-card">
                    <h3>{blog.title}</h3>
                    <p>{blog.excerpt}</p>
                    <div className="tags">
                      {blog.tags?.map(tag => <span key={tag} className="tag">#{tag}</span>)}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {blogs.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2>📰 Latest Blogs</h2>
          <div className="blog-grid">
            {blogs.map(blog => (
              <Link key={blog.id} href={`/blog/${blog.slug}`} className="blog-card">
                <h3>{blog.title}</h3>
                <p>{blog.excerpt}</p>
                <div className="tags">
                  {blog.tags?.map(tag => <span key={tag} className="tag">#{tag}</span>)}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}