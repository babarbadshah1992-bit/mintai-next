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
      .then((data) => setAllProducts(data || []))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => setBlogs(data || []))
      .catch((err) => console.error(err));
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    const query = input.toLowerCase();
    
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
    
    const matchedProducts = allProducts.filter((product) => {
      const searchableText = `
        ${product.name || ""}
        ${product.description || ""}
        ${product.category || ""}
        ${Array.isArray(product.keywords) ? product.keywords.join(" ") : product.keywords || ""}
        ${Array.isArray(product.tags) ? product.tags.join(" ") : product.tags || ""}
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
        content: `Thanks for asking about "${input}"\n\n💡 Browse the related blogs and products below.\n\n🚀 MintAI Pro is launching soon with:\n🧠 AI Health & Beauty Assistant\n📄 Report Scanner\n🧪 Ingredient Checker\n⚠️ Side Effect Alerts`
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
        fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
        background: "linear-gradient(160deg, #f0f7f2 0%, #e8f4ec 50%, #f4f9f5 100%)",
        minHeight: "100vh",
        position: "relative",
        overflowX: "auto",
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

      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "40px 20px", position: "relative", zIndex: 1 }}>

        {/* ── CHAT SECTION ── */}
        <div 
          style={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.95)",
            borderRadius: "32px",
            boxShadow: "0 12px 48px rgba(24,80,40,0.08)",
            overflow: "hidden",
            marginBottom: "40px",
          }}
        >
          {/* PREMIUM HEADER */}
          <div style={{
            padding: "24px 28px",
            background: "linear-gradient(135deg, #15803d 0%, #18a23d 50%, #22c55e 100%)",
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "14px",
                background: "rgba(255,255,255,0.2)", 
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", flexShrink: 0,
              }}>🌿</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "20px", color: "#ffffff", letterSpacing: "-0.01em" }}>
                  MintAI Health Assistant
                </div>
                <div style={{ fontSize: "13px", color: "#bbf7d0", fontWeight: 500, display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                  <span style={{ width: "8px", height: "8px", background: "#4ade80", borderRadius: "50%", display: "inline-block", boxShadow: "0 0 8px #4ade80" }}></span> 
                  Online & Ready to Help
                </div>
              </div>
            </div>
            
            <div style={{ 
              background: "rgba(255,255,255,0.15)", 
              padding: "8px 16px", 
              borderRadius: "100px", 
              fontSize: "12px", 
              color: "white", 
              fontWeight: 600, 
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)"
            }}>
              ✨ AI-Powered
            </div>
          </div>
          
          {/* Messages */}
          <div
            ref={containerRef}
            style={{
              height: "450px",
              overflowY: "auto",
              padding: "24px 28px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(24,162,61,0.2) transparent",
            }}
          >
            {!messages.length && (
              <div style={{ textAlign: "center", marginTop: "50px" }}>
                <div style={{ fontSize: "56px", marginBottom: "16px", filter: "drop-shadow(0 4px 12px rgba(24,162,61,0.2))" }}>💚🌿</div>
                <p style={{ fontSize: "24px", fontWeight: 800, color: "#1a2e1e", marginBottom: "10px" }}>
                  👋 Welcome to MintAI
                </p>
                <p style={{ color: "#5a7060", fontSize: "15px", lineHeight: "1.7", marginBottom: "16px", maxWidth: "400px", margin: "0 auto 16px auto" }}>
                  Ask about health, beauty, ingredients, side effects, or find the best product before you buy.
                </p>
                <p style={{ color: "#16a34a", fontSize: "13px", fontWeight: 600, marginBottom: "24px" }}>
                  🛒 Compare Products • 📖 Read Blogs • 🤖 AI Recommendations
                </p>

                <div style={{ display: "flex", gap: "10px", overflowX: "auto", scrollSnapType: "x mandatory", paddingBottom: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                  {["🔥 Hair Fall", "✨ Glowing Skin", "⚖️ Weight Loss", "🌿 Ayurveda", "🤧 Cold & Cough", "🧘 Yoga", "🏋️ Gym"].map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        const query = item.replace(/^[^\w\s]+\s*/, "");
                        setInput(query);
                        setTimeout(() => { setInput(query); sendMessage(); }, 100);
                      }}
                      style={{
                        border: "1px solid #e5e7eb", borderRadius: "100px", padding: "10px 18px", background: "#fff",
                        cursor: "pointer", fontWeight: 600, color: "#374151", fontSize: "14px", boxShadow: "0 2px 4px rgba(0,0,0,0.02)", transition: "all 0.2s"
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
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
                      maxWidth: "80%",
                      padding: "16px 20px",
                      borderRadius: msg.role === "user" ? "20px 20px 6px 20px" : "20px 20px 20px 6px",
                      background: msg.role === "user" ? "linear-gradient(135deg, #18a23d, #1db84c)" : "#ffffff",
                      color: msg.role === "user" ? "#fff" : "#1a2e1e",
                      fontSize: "15px",
                      lineHeight: "1.6",
                      boxShadow: msg.role === "user" ? "0 6px 16px rgba(24,162,61,0.25)" : "0 2px 12px rgba(24,80,40,0.06)",
                      border: msg.role === "ai" ? "1px solid rgba(24,162,61,0.10)" : "none",
                    }}>
                      {msg.content}
                    </div>
                  </div>

                  {msg.role === "ai" && (
                    <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
                      {[
                        { label: liked[idx] ? "❤️ Love" : "🤍 Love", action: () => handleLike(idx), active: liked[idx] },
                        { label: copyMsg[idx] ? "📋 Copied!" : "📋 Copy", action: () => handleCopy(idx, msg.content), active: copyMsg[idx] },
                        { label: "📤 Share", action: () => handleShare(msg.content), active: false },
                        { label: "👍", action: () => handleFeedback(idx, "up"), active: feedbackGiven[idx] === "up" },
                        { label: "👎", action: () => handleFeedback(idx, "down"), active: feedbackGiven[idx] === "down" },
                      ].map((btn, i) => (
                        <button key={i} onClick={btn.action} style={{
                          background: btn.active ? "rgba(24,162,61,0.12)" : "rgba(255,255,255,0.80)", border: "1px solid rgba(24,162,61,0.14)",
                          borderRadius: "999px", padding: "6px 12px", fontSize: "12px", cursor: "pointer",
                          color: btn.active ? "#18a23d" : "#5a7060", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px"
                        }}>
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{
                  background: "#ffffff", border: "1px solid rgba(24,162,61,0.10)",
                  borderRadius: "20px 20px 20px 6px", padding: "14px 20px",
                  display: "flex", gap: "6px", alignItems: "center", boxShadow: "0 2px 12px rgba(24,80,40,0.06)",
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
          <div style={{ padding: "20px 28px", borderTop: "1px solid rgba(24,162,61,0.10)", background: "rgba(240,247,242,0.60)" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "12px",
              background: "#ffffff",
              border: "1.5px solid rgba(24,162,61,0.20)",
              borderRadius: "100px",
              padding: "8px 8px 8px 16px",
              boxShadow: "0 4px 16px rgba(24,80,40,0.04)",
            }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <button
                  onClick={() => setShowPlusMenu(!showPlusMenu)}
                  style={{
                    width: "36px", height: "36px", borderRadius: "50%",
                    background: showPlusMenu ? "linear-gradient(135deg,#18a23d,#1db84c)" : "#f3f7f3",
                    border: "none", cursor: "pointer", fontSize: "22px",
                    color: showPlusMenu ? "#fff" : "#18a23d", fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.20s ease",
                  }}
                >+</button>
                {showPlusMenu && (
                  <div style={{
                    position: "absolute", bottom: "48px", left: 0,
                    background: "#ffffff", borderRadius: "16px",
                    boxShadow: "0 12px 40px rgba(24,80,40,0.15)", border: "1px solid rgba(24,162,61,0.10)",
                    overflow: "hidden", minWidth: "180px", zIndex: 10,
                  }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", fontSize: "14px", fontWeight: 600, color: "#1a2e1e", cursor: "pointer", borderBottom: "1px solid rgba(24,162,61,0.08)" }}>
                      📷 Upload Photo
                      <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} />
                    </label>
                    <button onClick={() => { setShowCameraModal(true); setShowPlusMenu(false); }} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "12px 16px", fontSize: "14px", fontWeight: 600, color: "#1a2e1e", background: "transparent", border: "none", cursor: "pointer", borderBottom: "1px solid rgba(24,162,61,0.08)" }}>
                      📸 Open Camera
                    </button>
                    <button onClick={() => handleMic("")} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "12px 16px", fontSize: "14px", fontWeight: 600, color: "#1a2e1e", background: "transparent", border: "none", cursor: "pointer" }}>
                      🎤 Voice Message
                    </button>
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
                  flex: 1, width: "100%", minWidth: 0, border: "none", outline: "none",
                  background: "transparent", fontSize: "16px", color: "#1a2e1e", fontFamily: "inherit",
                }}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                style={{
                  width: "44px", height: "44px", borderRadius: "50%", flexShrink: 0,
                  background: loading || !input.trim() ? "#f3f7f3" : "linear-gradient(135deg, #18a23d, #1db84c)",
                  border: "none", cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                  color: loading || !input.trim() ? "#aaa" : "#fff", fontSize: "18px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: loading || !input.trim() ? "none" : "0 4px 12px rgba(24,162,61,0.30)",
                  transition: "all 0.20s ease", paddingLeft: "4px"
                }}
              >➤</button>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS + BLOGS */}
        {lastAiIndex !== -1 && (
          <div>
            {relatedProducts.length > 0 && (
              <div style={{ marginBottom: "40px" }}>
                <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#1a2e1e", marginBottom: "20px", letterSpacing: "-0.01em" }}>
                  🛍️ Related Products
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
                  {relatedProducts.map(p => (
                    <div key={p.id} style={{
                      background: "rgba(255,255,255,0.90)", borderRadius: "24px", padding: "20px", border: "1px solid rgba(24,162,61,0.08)",
                      boxShadow: "0 4px 20px rgba(24,80,40,0.05)", display: "flex", flexDirection: "column", gap: "12px",
                      transition: "transform 0.24s ease, box-shadow 0.24s ease",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 32px rgba(24,80,40,0.12)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(24,80,40,0.05)";
                    }}>
                      {p.image && p.image.startsWith('http') ? (
                        <img src={p.image} alt={p.name} style={{ width: "100%", height: "150px", objectFit: "contain", borderRadius: "16px", background: "#f9fbf9" }} />
                      ) : (
                        <div style={{ width: "100%", height: "150px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "60px", background: "#f9fbf9", borderRadius: "16px" }}>{p.image || "🌿"}</div>
                      )}
                      <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1a2e1e", lineHeight: 1.3 }}>{p.name}</h3>
                      <div style={{ display: "flex", gap: "8px", alignItems: "baseline", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "20px", fontWeight: 800, color: "#18a23d" }}>₹{p.price}</span>
                        {p.originalPrice && <span style={{ fontSize: "14px", color: "#aaa", textDecoration: "line-through" }}>₹{p.originalPrice}</span>}
                      </div>
                      <a href={p.link} target="_blank" rel="noopener noreferrer" style={{
                        display: "block", textAlign: "center", background: "#f0fdf4", color: "#18a23d",
                        fontWeight: 700, fontSize: "14px", padding: "12px", borderRadius: "100px", textDecoration: "none",
                        marginTop: "auto", transition: "all 0.2s"
                      }}>View Product</a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RELATED BLOGS */}
            {relatedBlogs.length > 0 && (
              <div style={{ marginBottom: "40px" }}>
                <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#1a2e1e", marginBottom: "20px", letterSpacing: "-0.01em" }}>
                  📝 Related Blogs
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
                  {relatedBlogs.map(blog => (
                    <Link key={blog.id} href={`/blog/${blog.slug}`} style={{
                      background: "rgba(255,255,255,0.90)", borderRadius: "24px", padding: "24px", textDecoration: "none",
                      border: "1px solid rgba(24,162,61,0.08)", boxShadow: "0 4px 20px rgba(24,80,40,0.05)",
                      display: "flex", flexDirection: "column", transition: "transform 0.24s ease, box-shadow 0.24s ease",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-4px)";
                      (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 12px 32px rgba(24,80,40,0.12)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 20px rgba(24,80,40,0.05)";
                    }}>
                      <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1a2e1e", marginBottom: "10px", lineHeight: 1.4 }}>{blog.title}</h3>
                      <p style={{ fontSize: "14px", color: "#5a7060", lineHeight: 1.6, marginBottom: "20px", flex: 1 }}>{blog.excerpt}</p>
                      <div style={{ marginTop: "auto", color: "#18a23d", fontWeight: 600, fontSize: "14px", display: "flex", alignItems: "center", gap: "4px" }}>
                        Read Article →
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
          <div style={{ marginBottom: "48px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#1a2e1e", marginBottom: "20px", letterSpacing: "-0.01em" }}>
              📰 Latest Wellness Blogs
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
              {blogs.map(blog => (
                <Link key={blog.id} href={`/blog/${blog.slug}`} style={{
                  background: "rgba(255,255,255,0.90)", borderRadius: "24px", padding: "24px", textDecoration: "none",
                  border: "1px solid rgba(24,162,61,0.08)", boxShadow: "0 4px 20px rgba(24,80,40,0.05)",
                  display: "flex", flexDirection: "column", transition: "transform 0.24s ease, box-shadow 0.24s ease",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 12px 32px rgba(24,80,40,0.12)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 20px rgba(24,80,40,0.05)";
                }}>
                  <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1a2e1e", marginBottom: "10px", lineHeight: 1.4 }}>{blog.title}</h3>
                  <p style={{ fontSize: "14px", color: "#5a7060", lineHeight: 1.6, marginBottom: "20px", flex: 1 }}>{blog.excerpt}</p>
                  <div style={{ marginTop: "auto", color: "#18a23d", fontWeight: 600, fontSize: "14px", display: "flex", alignItems: "center", gap: "4px" }}>
                    Read Article →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* QUICK HEALTH CHECK */}
        <div style={{
          background: "rgba(255,255,255,0.90)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(24,162,61,0.10)",
          borderRadius: "32px",
          padding: "36px 28px",
          boxShadow: "0 12px 48px rgba(24,80,40,0.08)",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🌟</div>
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#1a2e1e", letterSpacing: "-0.02em", marginBottom: "8px" }}>
              Quick Health Check
            </h2>
            <p style={{ fontSize: "15px", color: "#5a7060", lineHeight: 1.6 }}>
              Answer 3 simple questions to get your personal wellness score.
            </p>
          </div>

          <div style={{ maxWidth: "100%", margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "24px" }}>
              <input type="number" placeholder="Your Age" value={scoreAge} onChange={(e) => setScoreAge(e.target.value)} style={{ padding: "16px", borderRadius: "16px", border: "1px solid rgba(24,162,61,0.20)", outline: "none", fontSize: "15px", background: "#f9fbf9" }} />
              <select value={scoreSleep} onChange={(e) => setScoreSleep(e.target.value)} style={{ padding: "16px", borderRadius: "16px", border: "1px solid rgba(24,162,61,0.20)", outline: "none", fontSize: "15px", background: "#f9fbf9", color: "#1a2e1e" }}>
                <option value="">Sleep Hours</option><option value="<5">Less than 5</option><option value="5-6">5-6 Hours</option><option value="7-8">7-8 Hours</option><option value=">8">8+ Hours</option>
              </select>
              <select value={scoreStress} onChange={(e) => setScoreStress(e.target.value)} style={{ padding: "16px", borderRadius: "16px", border: "1px solid rgba(24,162,61,0.20)", outline: "none", fontSize: "15px", background: "#f9fbf9", color: "#1a2e1e" }}>
                <option value="">Stress Level</option><option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option>
              </select>
            </div>

            <button onClick={handleHealthScore} disabled={scoreLoading} style={{
              width: "100%", padding: "16px", borderRadius: "100px", border: "none", cursor: "pointer",
              background: "linear-gradient(135deg,#18a23d,#1db84c)", color: "#fff", fontWeight: 700, fontSize: "16px",
              marginBottom: "24px", boxShadow: "0 8px 24px rgba(24,162,61,0.25)", transition: "all 0.2s"
            }}>
              {scoreLoading ? "Calculating..." : "Check My Health Score"}
            </button>

            {scoreResult && (
              <div style={{ background: "#f0fdf4", border: "1px solid rgba(24,162,61,0.15)", borderRadius: "24px", padding: "32px 24px", textAlign: "center" }}>
                <h3 style={{ fontSize: "52px", fontWeight: 900, marginBottom: "8px", color: getScoreColor(scoreResult.score) }}>{scoreResult.score}<span style={{fontSize:"24px", color:"#aaa"}}>/100</span></h3>
                <p style={{ fontSize: "20px", fontWeight: 700, marginBottom: "12px", color: "#1a2e1e" }}>{getScoreLabel(scoreResult.score)}</p>
                <p style={{ fontSize: "15px", color: "#5a7060", lineHeight: 1.6, marginBottom: "24px", maxWidth: "400px", margin: "0 auto 24px auto" }}>{scoreResult.recommendation}</p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                  <button onClick={shareScoreOnWhatsApp} style={{ padding: "12px 24px", borderRadius: "100px", border: "none", cursor: "pointer", background: "#25D366", color: "#fff", fontWeight: 700, fontSize: "14px", boxShadow: "0 4px 12px rgba(37,211,102,0.2)" }}>WhatsApp Share</button>
                  <button onClick={downloadScorePDF} style={{ padding: "12px 24px", borderRadius: "100px", border: "none", cursor: "pointer", background: "#111827", color: "#fff", fontWeight: 700, fontSize: "14px", boxShadow: "0 4px 12px rgba(17,24,39,0.2)" }}>Download PDF</button>
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