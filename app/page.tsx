'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// Types
interface Message {
  role: 'user' | 'ai';
  content: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  description: string;
  image: string;
  link: string;
  keywords?: string[];
}

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  tags: string[];
}

interface ScoreResult {
  score: number;
  recommendation: string;
  product?: {
    name: string;
    link: string;
  };
}

// Helper functions
const getScoreColor = (score: number): string => {
  if (score >= 80) return '#18a23d';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
};

const getScoreLabel = (score: number): string => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  return 'Needs Attention';
};

// Camera Modal Component (simple version)
const CameraModal = ({ onClose, onResult }: { onClose: () => void; onResult: (result: string) => void }) => {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: '24px', padding: '24px', maxWidth: '400px', width: '90%' }}>
        <h3 style={{ marginBottom: '16px' }}>Camera Modal</h3>
        <button onClick={() => { onResult('captured'); onClose(); }}>Capture</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default function HomePage() {
  // Chat states
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [copyMsg, setCopyMsg] = useState<Record<number, boolean>>({});
  const [feedbackGiven, setFeedbackGiven] = useState<Record<number, 'up' | 'down' | null>>({});
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const lastAiRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Related content states
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [lastAiIndex, setLastAiIndex] = useState(-1);
  
  // Blogs state
  const [blogs, setBlogs] = useState<Blog[]>([]);
  
  // Health score states
  const [scoreAge, setScoreAge] = useState('');
  const [scoreSleep, setScoreSleep] = useState('');
  const [scoreStress, setScoreStress] = useState('');
  const [scoreLoading, setScoreLoading] = useState(false);
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);

  
  useEffect(() => {
  fetch("/api/products")
    .then((res) => res.json())
    .then((data) => {
      setAllProducts(data || []);
    })
    .catch((err) => console.error(err));
}, []);
useEffect(() => {
  fetch("/api/blogs")
    .then((res) => res.json())
    .then((data) => {
      setBlogs(data || []);
    })
    .catch((err) => console.error(err));
}, []);

  // FIXED: Send message with blog search from Supabase
  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    // Search blogs from Supabase based on user query
    const query = input.toLowerCase();
    
    // Fetch blogs from Supabase that match the query
    let matchedBlogs: Blog[] = [];
    try {
      const { data: supabaseBlogs, error } = await supabase
        .from('blogs')
        .select('*')
        .ilike('title', `%${query}%`);
      
      if (!error && supabaseBlogs && supabaseBlogs.length > 0) {
        matchedBlogs = supabaseBlogs.map((blog: any) => ({
          id: blog.id.toString(),
          title: blog.title,
          excerpt: blog.excerpt,
          slug: blog.slug,
          tags: blog.tags || []
        }));
      }
    } catch (err) {
      console.error("Blog fetch error:", err);
    }
    
    // Match products
    const matchedProducts = allProducts.filter((product) => {
  const searchableText = `
    ${product.name || ""}
    ${product.description || ""}
    ${product.category || ""}
    ${Array.isArray(product.keywords)
      ? product.keywords.join(" ")
      : product.keywords || ""}
    ${Array.isArray(product.tags)
      ? product.tags.join(" ")
      : product.tags || ""}
    ${product.brand || ""}
  `.toLowerCase();

  return searchableText.includes(query);
});
    
    setRelatedProducts(matchedProducts.length > 0 ? matchedProducts : []);
    setRelatedBlogs(matchedBlogs);
    setLastAiIndex(messages.length + 1);
    
    setTimeout(() => {
      const aiResponse: Message = {
  role: 'ai',
  content: `Thanks for asking about "${input}"

💡 Browse the related blogs and products below.

🚀 MintAI Pro is launching soon with:
🧠 AI Health & Beauty Assistant
📄 Report Scanner
🧪 Ingredient Checker
⚠️ Side Effect Alerts`
};
      setMessages(prev => [...prev, aiResponse]);
      setLoading(false);
    }, 500);
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('File uploaded:', file.name);
    }
    setShowPlusMenu(false);
  };
  
  const handleMic = (text: string) => {
    console.log('Voice message:', text);
    setShowPlusMenu(false);
  };
  
  const handleCameraResult = (result: string) => {
    console.log('Camera result:', result);
    setShowCameraModal(false);
  };
  
  const handleLike = (idx: number) => {
    setLiked(prev => ({ ...prev, [idx]: !prev[idx] }));
  };
  
  const handleCopy = (idx: number, content: string) => {
    navigator.clipboard.writeText(content);
    setCopyMsg(prev => ({ ...prev, [idx]: true }));
    setTimeout(() => {
      setCopyMsg(prev => ({ ...prev, [idx]: false }));
    }, 2000);
  };
  
  const handleShare = (content: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'MintAI Health Tip',
        text: content,
      });
    } else {
      navigator.clipboard.writeText(content);
      alert('Copied to clipboard!');
    }
  };
  
  const handleFeedback = (idx: number, type: 'up' | 'down') => {
    setFeedbackGiven(prev => ({ ...prev, [idx]: type }));
  };
  
  const handleHealthScore = () => {
    if (!scoreAge || !scoreSleep || !scoreStress) {
      alert('Please fill all fields');
      return;
    }
    
    setScoreLoading(true);
    
    setTimeout(() => {
      let score = 75;
      if (scoreSleep === '<5') score -= 20;
      else if (scoreSleep === '5-6') score -= 10;
      else if (scoreSleep === '>8') score += 5;
      
      if (scoreStress === 'High') score -= 25;
      else if (scoreStress === 'Medium') score -= 10;
      
      const ageNum = parseInt(scoreAge);
      if (ageNum > 50) score -= 10;
      else if (ageNum < 25) score += 5;
      
      score = Math.min(100, Math.max(0, score));
      
      setScoreResult({
        score,
        recommendation: score >= 80 
          ? 'Excellent health habits! Keep maintaining your routine.'
          : score >= 60 
            ? 'Good foundation. Focus on stress management and sleep quality.'
            : 'Time to prioritize your health. Start with small daily habits.',
        product: score < 70 ? {
          name: 'Stress Relief Supplement Pack',
          link: 'https://amazon.in',
        } : undefined,
      });
      setScoreLoading(false);
    }, 800);
  };
  
  const shareScoreOnWhatsApp = () => {
    if (scoreResult) {
      const text = `My MintAI Health Score: ${scoreResult.score}/100 - ${scoreResult.recommendation}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  };
  
  const downloadScorePDF = () => {
    if (scoreResult) {
      alert('PDF download feature - integrate with your PDF library');
    }
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        background: "linear-gradient(160deg, #f0f7f2 0%, #e8f4ec 50%, #f4f9f5 100%)",
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* BG GLOWS */}
      <div style={{
        position: "fixed", top: "-200px", right: "-200px",
        width: "600px", height: "600px",
        background: "radial-gradient(circle, rgba(24,162,61,0.09) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", bottom: "-200px", left: "-150px",
        width: "500px", height: "500px",
        background: "radial-gradient(circle, rgba(80,200,120,0.07) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "40px 20px" }}>
        {/* ── CHAT SECTION ── */}
        <div 
          style={{
            background: "rgba(255,255,255,0.82)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.92)",
            borderRadius: "28px",
            boxShadow: "0 8px 40px rgba(24,80,40,0.10)",
            overflow: "hidden",
            marginBottom: "36px",
          }}
        >
          {/* Chat header */}
          <div style={{
            padding: "20px 28px",
            borderBottom: "1px solid rgba(24,162,61,0.10)",
            background: "linear-gradient(135deg, rgba(24,162,61,0.06) 0%, rgba(255,255,255,0.0) 100%)",
            display: "flex", alignItems: "center", gap: "12px",
          }}>
            <div style={{
              width: "42px", height: "42px", borderRadius: "13px",
              background: "linear-gradient(135deg, #18a23d, #1db84c)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "21px", boxShadow: "0 4px 12px rgba(24,162,61,0.30)", flexShrink: 0,
            }}>🌿</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "16px", color: "#1a2e1e", letterSpacing: "-0.01em" }}>MintAI Health Assistant</div>
              <div style={{ fontSize: "12px", color: "#18a23d", fontWeight: 600 }}>● Online · AI-Powered</div>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={containerRef}
            style={{
              height: "420px",
              overflowY: "auto",
              padding: "24px 28px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(24,162,61,0.2) transparent",
            }}
          >
            {!messages.length && (
              <div style={{ textAlign: "center", marginTop: "60px" }}>
                <div style={{ fontSize: "52px", marginBottom: "16px" }}>💚🌿</div>
                <p style={{ fontSize: "18px", fontWeight: 700, color: "#1a2e1e", marginBottom: "8px" }}>How can I help you today?</p>
                <p style={{ color: "#5a7060", fontSize: "14px", lineHeight: "1.6" }}>
                  Ask about skincare, health, beauty, or natural remedies...
                </p>
              </div>
            )}

            {messages.map((msg, idx) => {
              const isLastAi = idx === messages.length - 1 && msg.role === "ai";
              return (
                <div key={idx}>
                  <div
                    ref={isLastAi ? lastAiRef : null}
                    style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}
                  >
                    <div style={{
                      maxWidth: "78%",
                      padding: "13px 18px",
                      borderRadius: msg.role === "user" ? "20px 20px 6px 20px" : "20px 20px 20px 6px",
                      background: msg.role === "user"
                        ? "linear-gradient(135deg, #18a23d, #1db84c)"
                        : "rgba(255,255,255,0.90)",
                      color: msg.role === "user" ? "#fff" : "#1a2e1e",
                      fontSize: "14px",
                      lineHeight: "1.65",
                      boxShadow: msg.role === "user"
                        ? "0 4px 14px rgba(24,162,61,0.28)"
                        : "0 2px 12px rgba(24,80,40,0.08)",
                      border: msg.role === "ai" ? "1px solid rgba(24,162,61,0.10)" : "none",
                      fontWeight: 400,
                    }}>
                      {msg.content}
                    </div>
                  </div>

                  {msg.role === "ai" && (
                    <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
                      <button
                        onClick={() => handleLike(idx)}
                        style={{
                          background: "rgba(255,255,255,0.80)", border: "1px solid rgba(24,162,61,0.14)",
                          borderRadius: "999px", padding: "5px 12px", fontSize: "12px", cursor: "pointer",
                          color: "#5a7060", fontWeight: 600,
                        }}
                      >{liked[idx] ? "❤️ Love" : "🤍 Love"}</button>
                      <button
                        onClick={() => handleCopy(idx, msg.content)}
                        style={{
                          background: "rgba(255,255,255,0.80)", border: "1px solid rgba(24,162,61,0.14)",
                          borderRadius: "999px", padding: "5px 12px", fontSize: "12px", cursor: "pointer",
                          color: "#5a7060", fontWeight: 600,
                        }}
                      >{copyMsg[idx] ? "📋 Copied!" : "📋 Copy"}</button>
                      <button
                        onClick={() => handleShare(msg.content)}
                        style={{
                          background: "rgba(255,255,255,0.80)", border: "1px solid rgba(24,162,61,0.14)",
                          borderRadius: "999px", padding: "5px 12px", fontSize: "12px", cursor: "pointer",
                          color: "#5a7060", fontWeight: 600,
                        }}
                      >📤 Share</button>
                      <button
                        onClick={() => handleFeedback(idx, "up")}
                        style={{
                          background: feedbackGiven[idx] === "up" ? "rgba(24,162,61,0.12)" : "rgba(255,255,255,0.80)",
                          border: "1px solid rgba(24,162,61,0.14)", borderRadius: "999px",
                          padding: "5px 10px", fontSize: "12px", cursor: "pointer",
                          color: feedbackGiven[idx] === "up" ? "#18a23d" : "#aaa", fontWeight: 600,
                        }}
                      >👍</button>
                      <button
                        onClick={() => handleFeedback(idx, "down")}
                        style={{
                          background: feedbackGiven[idx] === "down" ? "rgba(255,100,150,0.10)" : "rgba(255,255,255,0.80)",
                          border: "1px solid rgba(24,162,61,0.14)", borderRadius: "999px",
                          padding: "5px 10px", fontSize: "12px", cursor: "pointer",
                          color: feedbackGiven[idx] === "down" ? "#ff69b4" : "#aaa", fontWeight: 600,
                        }}
                      >👎</button>
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{
                  background: "rgba(255,255,255,0.90)", border: "1px solid rgba(24,162,61,0.10)",
                  borderRadius: "20px 20px 20px 6px", padding: "14px 20px",
                  display: "flex", gap: "6px", alignItems: "center",
                  boxShadow: "0 2px 12px rgba(24,80,40,0.08)",
                }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: "7px", height: "7px", borderRadius: "50%",
                      background: "#18a23d", opacity: 0.7,
                      animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div style={{
            padding: "16px 20px",
            borderTop: "1px solid rgba(24,162,61,0.10)",
            background: "rgba(240,247,242,0.60)",
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              background: "rgba(255,255,255,0.90)",
              border: "1.5px solid rgba(24,162,61,0.20)",
              borderRadius: "18px",
              padding: "8px 8px 8px 14px",
              boxShadow: "0 2px 12px rgba(24,80,40,0.07)",
            }}>
              {/* Plus menu */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <button
                  onClick={() => setShowPlusMenu(!showPlusMenu)}
                  style={{
                    width: "36px", height: "36px", borderRadius: "10px",
                    background: showPlusMenu ? "linear-gradient(135deg,#18a23d,#1db84c)" : "rgba(24,162,61,0.10)",
                    border: "none", cursor: "pointer", fontSize: "20px",
                    color: showPlusMenu ? "#fff" : "#18a23d", fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.20s ease",
                  }}
                >+</button>
                {showPlusMenu && (
                  <div style={{
                    position: "absolute", bottom: "44px", left: 0,
                    background: "rgba(255,255,255,0.97)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(24,162,61,0.16)",
                    borderRadius: "16px",
                    boxShadow: "0 12px 40px rgba(24,80,40,0.14)",
                    overflow: "hidden", minWidth: "170px", zIndex: 10,
                  }}>
                    <label style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      padding: "12px 16px", fontSize: "14px", fontWeight: 600,
                      color: "#1a2e1e", cursor: "pointer",
                      borderBottom: "1px solid rgba(24,162,61,0.08)",
                    }}>
                      📷 Upload Photo
                      <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} />
                    </label>
                    <button
                      onClick={() => { setShowCameraModal(true); setShowPlusMenu(false); }}
                      style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        width: "100%", padding: "12px 16px", fontSize: "14px", fontWeight: 600,
                        color: "#1a2e1e", background: "transparent", border: "none", cursor: "pointer",
                        borderBottom: "1px solid rgba(24,162,61,0.08)",
                      }}
                    >📸 Open Camera</button>
                    <button
                      onClick={() => handleMic("")}
                      style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        width: "100%", padding: "12px 16px", fontSize: "14px", fontWeight: 600,
                        color: "#1a2e1e", background: "transparent", border: "none", cursor: "pointer",
                      }}
                    >🎤 Voice Message</button>
                  </div>
                )}
              </div>

              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === "Enter" && sendMessage()}
                placeholder="Ask MintAI about health, skin, herbs..."
                disabled={loading}
                style={{
                  flex: 1,
                  width: "100%",
                  minWidth: 0,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "16px",
                  paddingRight: "8px",
                  color: "#1a2e1e",
                  fontFamily: "inherit",
                }}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                style={{
                  width: "48px",
                  height: "48px",
                  minWidth: "48px",
                  borderRadius: "14px",
                  flexShrink: 0,
                  background: loading || !input.trim()
                    ? "rgba(24,162,61,0.15)"
                    : "linear-gradient(135deg, #18a23d, #1db84c)",
                  border: "none",
                  cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                  color: loading || !input.trim() ? "#aaa" : "#fff",
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: loading || !input.trim() ? "none" : "0 4px 12px rgba(24,162,61,0.30)",
                  transition: "all 0.20s ease",
                }}
              >➤</button>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS + BLOGS */}
        {lastAiIndex !== -1 && (
          <div>
            {relatedProducts.length > 0 && (
              <div style={{ marginBottom: "36px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#1a2e1e", marginBottom: "18px", letterSpacing: "-0.01em" }}>
                  🛍️ Related Products
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "18px" }}>
                  {relatedProducts.map(p => (
                    <div
                      key={p.id}
                      style={{
                        background: "rgba(255,255,255,0.82)",
                        backdropFilter: "blur(16px)",
                        border: "1px solid rgba(255,255,255,0.92)",
                        borderRadius: "22px",
                        padding: "20px",
                        boxShadow: "0 4px 20px rgba(24,80,40,0.07)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        transition: "transform 0.24s cubic-bezier(.22,1,.36,1), box-shadow 0.24s ease",
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 14px 36px rgba(24,80,40,0.12)";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(24,80,40,0.07)";
                      }}
                    >
                     {p.image && p.image.startsWith('http') ? (
  <img
    src={p.image}
    alt={p.name}
    style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "14px" }}
  />
) : (
  <div style={{ width: "100%", height: "140px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "60px", background: "#f0f7f2", borderRadius: "14px" }}>
    {p.image || "🌿"}
  </div>
)}
                      <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#1a2e1e", lineHeight: 1.3 }}>{p.name}</h3>
                      <div style={{ display: "flex", gap: "8px", alignItems: "baseline", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "18px", fontWeight: 800, color: "#18a23d" }}>₹{p.price}</span>
                        {p.originalPrice && (
                          <span style={{ fontSize: "13px", color: "#aaa", textDecoration: "line-through" }}>₹{p.originalPrice}</span>
                        )}
                        {p.discount && (
                          <span style={{
                            fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "999px",
                            background: "linear-gradient(135deg,#ff4fa3,#ff79c6)", color: "#fff",
                          }}>{p.discount}</span>
                        )}
                      </div>
                      <p style={{ fontSize: "12px", color: "#7a9080", lineHeight: 1.55 }}>{p.description}</p>
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "block", textAlign: "center",
                          background: "linear-gradient(135deg,#18a23d,#1db84c)",
                          color: "#fff", fontWeight: 700, fontSize: "13px",
                          padding: "10px", borderRadius: "12px", textDecoration: "none",
                          boxShadow: "0 4px 12px rgba(24,162,61,0.25)",
                        }}
                      >Buy Now →</a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RELATED BLOGS SECTION - FIXED */}
            {relatedBlogs.length > 0 && (
              <div style={{ marginBottom: "36px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#1a2e1e", marginBottom: "18px", letterSpacing: "-0.01em" }}>
                  📝 Related Blogs
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "18px" }}>
                  {relatedBlogs.map(blog => (
                    <Link
                      key={blog.id}
                      href={`/blog/${blog.slug}`}
                      style={{
                        background: "rgba(255,255,255,0.82)",
                        backdropFilter: "blur(16px)",
                        border: "1px solid rgba(255,255,255,0.92)",
                        borderRadius: "22px",
                        padding: "22px",
                        textDecoration: "none",
                        boxShadow: "0 4px 20px rgba(24,80,40,0.07)",
                        display: "block",
                        transition: "transform 0.24s cubic-bezier(.22,1,.36,1), box-shadow 0.24s ease",
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-4px)";
                        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 14px 36px rgba(24,80,40,0.12)";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 20px rgba(24,80,40,0.07)";
                      }}
                    >
                      <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#1a2e1e", marginBottom: "8px", lineHeight: 1.35 }}>{blog.title}</h3>
                      <p style={{ fontSize: "13px", color: "#7a9080", lineHeight: 1.6, marginBottom: "12px" }}>{blog.excerpt}</p>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {blog.tags?.map((tag: string) => (
                          <span key={tag} style={{
                            fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "999px",
                            background: "rgba(24,162,61,0.09)", color: "#14892f",
                            border: "1px solid rgba(24,162,61,0.16)",
                          }}>#{tag}</span>
                        ))}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* LATEST BLOGS */}
        {blogs.length > 0 && (
          <div style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#1a2e1e", marginBottom: "18px", letterSpacing: "-0.01em" }}>
              📰 Latest Blogs
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "18px" }}>
              {blogs.map(blog => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.slug}`}
                  style={{
                    background: "rgba(255,255,255,0.82)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255,255,255,0.92)",
                    borderRadius: "22px",
                    padding: "22px",
                    textDecoration: "none",
                    boxShadow: "0 4px 20px rgba(24,80,40,0.07)",
                    display: "block",
                    transition: "transform 0.24s cubic-bezier(.22,1,.36,1), box-shadow 0.24s ease",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-4px)";
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 14px 36px rgba(24,80,40,0.12)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 20px rgba(24,80,40,0.07)";
                  }}
                >
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#1a2e1e", marginBottom: "8px", lineHeight: 1.35 }}>{blog.title}</h3>
                  <p style={{ fontSize: "13px", color: "#7a9080", lineHeight: 1.6, marginBottom: "12px" }}>{blog.excerpt}</p>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {blog.tags?.map((tag: string) => (
                      <span key={tag} style={{
                        fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "999px",
                        background: "rgba(24,162,61,0.09)", color: "#14892f",
                        border: "1px solid rgba(24,162,61,0.16)",
                      }}>#{tag}</span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* QUICK HEALTH CHECK */}
        <div style={{
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.92)",
          borderRadius: "28px",
          padding: "28px 20px",
          boxShadow: "0 8px 40px rgba(24,80,40,0.10)",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: "-60px", right: "-60px",
            width: "160px", height: "160px",
            background: "radial-gradient(circle, rgba(24,162,61,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div style={{ fontSize: "36px", marginBottom: "10px" }}>🌟</div>
            <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#1a2e1e", letterSpacing: "-0.02em", marginBottom: "8px" }}>
              Quick Health Check
            </h2>
            <p style={{ fontSize: "14px", color: "#7a9080", lineHeight: 1.6 }}>
              Answer 3 questions — get your personal wellness score & recommendation
            </p>
          </div>

          <div
          style={{
         maxWidth: "100%",
         margin: "0 auto",
         boxSizing: "border-box",
       }}
      >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              <input
                type="number"
                placeholder="Your Age"
                value={scoreAge}
                onChange={(e) => setScoreAge(e.target.value)}
                style={{
                  padding: "14px",
                  borderRadius: "14px",
                  border: "1px solid rgba(24,162,61,0.15)",
                  outline: "none",
                  fontSize: "14px",
                }}
              />

              <select
                value={scoreSleep}
                onChange={(e) => setScoreSleep(e.target.value)}
                style={{
                  padding: "14px",
                  borderRadius: "14px",
                  border: "1px solid rgba(24,162,61,0.15)",
                  outline: "none",
                  fontSize: "14px",
                }}
              >
                <option value="">Sleep Hours</option>
                <option value="<5">Less than 5</option>
                <option value="5-6">5-6 Hours</option>
                <option value="7-8">7-8 Hours</option>
                <option value=">8">8+ Hours</option>
              </select>

              <select
                value={scoreStress}
                onChange={(e) => setScoreStress(e.target.value)}
                style={{
                  padding: "14px",
                  borderRadius: "14px",
                  border: "1px solid rgba(24,162,61,0.15)",
                  outline: "none",
                  fontSize: "14px",
                }}
              >
                <option value="">Stress Level</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <button
              onClick={handleHealthScore}
              disabled={scoreLoading}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "16px",
                border: "none",
                cursor: "pointer",
                background: "linear-gradient(135deg,#18a23d,#1db84c)",
                color: "#fff",
                fontWeight: 700,
                fontSize: "15px",
                marginBottom: "24px",
              }}
            >
              {scoreLoading ? "Calculating..." : "Check My Health Score"}
            </button>

            {scoreResult && (
              <div
                style={{
                  background: "rgba(24,162,61,0.06)",
                  border: "1px solid rgba(24,162,61,0.12)",
                  borderRadius: "20px",
                  padding: "24px",
                  textAlign: "center",
                }}
              >
                <h3
                  style={{
                    fontSize: "42px",
                    marginBottom: "10px",
                    color: getScoreColor(scoreResult.score),
                  }}
                >
                  {scoreResult.score}/100
                </h3>

                <p
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    marginBottom: "10px",
                    color: "#1a2e1e",
                  }}
                >
                  {getScoreLabel(scoreResult.score)}
                </p>

                <p
                  style={{
                    fontSize: "14px",
                    color: "#5a7060",
                    lineHeight: 1.6,
                    marginBottom: "18px",
                  }}
                >
                  {scoreResult.recommendation}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    onClick={shareScoreOnWhatsApp}
                    style={{
                      padding: "10px 18px",
                      borderRadius: "12px",
                      border: "none",
                      cursor: "pointer",
                      background: "#25D366",
                      color: "#fff",
                      fontWeight: 700,
                    }}
                  >
                    WhatsApp Share
                  </button>

                  <button
                    onClick={downloadScorePDF}
                    style={{
                      padding: "10px 18px",
                      borderRadius: "12px",
                      border: "none",
                      cursor: "pointer",
                      background: "#111",
                      color: "#fff",
                      fontWeight: 700,
                    }}
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showCameraModal && (
        <CameraModal onClose={() => setShowCameraModal(false)} onResult={handleCameraResult} />
      )}
    </div>
  );
}