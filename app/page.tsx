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
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMsg = { role: "user", content: input }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input })
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
      // Show feedback popup after AI answer
      setShowFeedbackPopup(true)
      setTimeout(() => setShowFeedbackPopup(false), 5000)
    } catch (err) {
      setMessages(prev => [...prev, { role: "ai", content: "Sorry, please try again." }])
    }
    setLoading(false)
  }

  const handleImageCapture = (image: string) => {
    setInput("I've taken a photo. Please analyze my skin/hair condition.")
  }

  return (
    <div>
      {/* Chat Container */}
      <div className="chat-container">
        <div className="messages">
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: '#888', marginTop: '60px' }}>
              <div style={{ fontSize: '3rem' }}>🌺</div>
              <p style={{ fontSize: '1.2rem' }}>Kaise help kar sakte hain?</p>
              <p style={{ color: '#2e9e4f' }}>Poochhein skincare, health, ya beauty tips...</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}>
              <div className={`bubble ${msg.role === 'user' ? 'user-bubble' : 'ai-bubble'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="message ai-message">
              <div className="typing">
                <div className="dot"></div><div className="dot"></div><div className="dot"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area with Camera & Mic */}
        <div className="input-area">
          <CameraMic onCapture={handleImageCapture} />
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

      {/* Latest Blogs Section */}
      {blogs.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2>📰 Latest Blogs</h2>
          <div className="blog-grid">
            {blogs.map(blog => (
              <Link key={blog.id} href={`/blog/${blog.slug}`} className="blog-card">
                <h3>{blog.title}</h3>
                <p>{blog.excerpt}</p>
                <div className="tags">
                  {blog.tags?.map((tag: string) => (
                    <span key={tag} className="tag">#{tag}</span>
                  ))}
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