"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { PRODUCTS } from "../lib/products";
import Link from "next/link";
import CameraModal from "../components/CameraModal";
import jsPDF from "jspdf";

export default function Home() {
  // Chat states
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);               // latest 3 blogs
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [liked, setLiked] = useState({});
  const [copyMsg, setCopyMsg] = useState({});
  const [feedbackGiven, setFeedbackGiven] = useState({});
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);

  // Health Score Widget States
  const [scoreAge, setScoreAge] = useState("");
  const [scoreSleep, setScoreSleep] = useState("");
  const [scoreStress, setScoreStress] = useState("");
  const [scoreResult, setScoreResult] = useState(null);
  const [scoreLoading, setScoreLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const lastAiRef = useRef(null);
  const prevLen = useRef(0);
  const isFirst = useRef(true);

  // Fetch latest blogs (top 3 by creation date) – used in "Latest Blogs" section
  useEffect(() => {
    const fetchLatestBlogs = async () => {
      const { data } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);
      if (data) setBlogs(data);
    };
    fetchLatestBlogs();
  }, []);

  // Auto‑scroll logic
  useEffect(() => {
    if (!messages.length) return;
    const last = messages[messages.length - 1];
    const isNew = messages.length > prevLen.current;
    if (isFirst.current && messages.length > 0) {
      isFirst.current = false;
      return;
    }
    if (isNew) {
      if (last.role === "user") {
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
        }, 100);
      } else if (last.role === "ai") {
        setTimeout(() => {
          if (lastAiRef.current && containerRef.current) {
            const top = lastAiRef.current.offsetTop - 20;
            containerRef.current.scrollTo({ top, behavior: "smooth" });
          }
        }, 200);
      }
    }
    prevLen.current = messages.length;
  }, [messages]);

  const extractKeywords = (text) => {
    const stop = ["hai","hain","ka","ki","ke","ko","se","mein","par","aur","toh","kya","kaise","kahan","ye","vo","tha","the","raha","rahi"];
    return text.toLowerCase().split(/[\s,?!.]+/).filter(w => w.length > 2 && !stop.includes(w));
  };

  const findRelatedProducts = (keywords) => {
    return PRODUCTS.filter(p => {
      const txt = `${p.name} ${p.description} ${p.category || ''}`.toLowerCase();
      return keywords.some(k => txt.includes(k));
    }).slice(0, 4);
  };

  const fetchRelatedBlogs = async (keywords) => {
    if (!keywords.length) return [];
    const { data } = await supabase
      .from("blogs")
      .select("id,title,slug,excerpt,tags")
      .overlaps("tags", keywords)
      .limit(3);
    return data || [];
  };

  const handleScan = (barcode) => {
    const prod = PRODUCTS.find(p => p.barcode === barcode);
    if (prod) window.open(prod.link, "_blank");
    else {
      setInput(`Barcode: ${barcode}`);
      sendMessage();
    }
  };

  const handleMic = (text) => {
    setInput(text);
    setTimeout(() => sendMessage(), 50);
  };

  const handleLike = (idx) => setLiked(prev => ({ ...prev, [idx]: !prev[idx] }));
  const handleCopy = async (idx, txt) => {
    await navigator.clipboard.writeText(txt);
    setCopyMsg({ ...copyMsg, [idx]: true });
    setTimeout(() => setCopyMsg({ ...copyMsg, [idx]: false }), 2000);
  };
  const handleShare = (txt) => {
    if (navigator.share) navigator.share({ title: "MintAI", text: txt });
    else alert("Share not supported. You can copy the text.");
  };
  const handleFeedback = (idx, type) => {
    setFeedbackGiven(prev => ({ ...prev, [idx]: type }));
    alert(`Thank you for your ${type === "up" ? "positive" : "honest"} feedback!`);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageData = event.target?.result;
        const res = await fetch("/api/analyze-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: imageData, type: "skin" }),
        });
        const data = await res.json();
        setInput(data.analysis || "Analysis complete.");
        setTimeout(() => sendMessage(), 100);
      };
      reader.readAsDataURL(file);
    }
    setShowPlusMenu(false);
  };

  const handleCameraResult = (result) => {
    setInput(result);
    setTimeout(() => sendMessage(), 50);
  };

  async function sendMessage() {
    const q = input.trim();
    if (!q) return;
    setMessages(prev => [...prev, { role: "user", content: q }]);
    setInput("");
    setLoading(true);
    const keywords = extractKeywords(q);
    setRelatedProducts(findRelatedProducts(keywords));
    const relBlogs = await fetchRelatedBlogs(keywords);
    setRelatedBlogs(relBlogs);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      const aiMsg = { role: "ai", content: "" };
      setMessages(prev => [...prev, aiMsg]);
      const clean = data.answer.replace(/\s+/g, " ").trim();
      for (let i = 0; i <= clean.length; i++) {
        await new Promise(r => setTimeout(r, 20));
        setMessages(prev => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1].content = clean.slice(0, i);
          return newMsgs;
        });
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "ai", content: "Sorry, something went wrong." }]);
    }
    setLoading(false);
  }

  const lastAiIndex =
    messages.length && messages[messages.length - 1]?.role === "ai" ? messages.length - 1 : -1;

  // Health Score handler
  const handleHealthScore = async () => {
    if (!scoreAge || !scoreSleep || !scoreStress) {
      alert("Please answer all questions");
      return;
    }
    setScoreLoading(true);
    try {
      const res = await fetch("/api/health-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: parseInt(scoreAge),
          sleep: scoreSleep,
          stress: scoreStress,
        }),
      });
      const data = await res.json();
      setScoreResult(data);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
    setScoreLoading(false);
  };

  const downloadScorePDF = () => {
    if (!scoreResult) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("🌿 MintAI Health Report", 20, 30);
    doc.setFontSize(14);
    doc.text(`Your Score: ${scoreResult.score}/100`, 20, 50);
    const problem = scoreResult.recommendation.split('.')[0] || scoreResult.recommendation;
    doc.text(`Key Insight: ${problem}`, 20, 70);
    doc.text("Recommended Product:", 20, 90);
    doc.text(scoreResult.product?.name || "Healthy habits", 20, 100);
    doc.setFontSize(10);
    doc.text("Generated by MintAI - Your Health Companion", 20, 270);
    doc.save("mintai_health_score.pdf");
  };

  const shareScoreOnWhatsApp = () => {
    if (!scoreResult) return;
    const text = encodeURIComponent(
      `🌿 My MintAI Health Score: ${scoreResult.score}/100\n\n${scoreResult.recommendation}\n✨ Try: ${scoreResult.product?.name || "healthy habits"}\n\nGet your score at https://mintai.in`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div>
      {/* Chat Container – same as before */}
      <div className="chat-container glass-card">
        <div ref={containerRef} className="messages">
          {!messages.length && (
            <div style={{ textAlign: "center", marginTop: "60px", color: "#555" }}>
              <div style={{ fontSize: "3rem" }}>💚🌿</div>
              <p style={{ fontSize: "1.2rem" }}>How can I help you today?</p>
              <p style={{ color: "#2e9e4f" }}>
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
                  className={`message ${msg.role === "user" ? "user-message" : "ai-message"}`}
                >
                  <div className={`bubble ${msg.role === "user" ? "user-bubble" : "ai-bubble"}`}>
                    {msg.content}
                  </div>
                </div>
                {msg.role === "ai" && (
                  <div className="action-buttons">
                    <button className="action-btn" onClick={() => handleLike(idx)}>
                      {liked[idx] ? "❤️" : "🤍"} Love
                    </button>
                    <button className="action-btn" onClick={() => handleCopy(idx, msg.content)}>
                      📋 {copyMsg[idx] ? "Copied!" : "Copy"}
                    </button>
                    <button className="action-btn" onClick={() => handleShare(msg.content)}>
                      📤 Share
                    </button>
                    <div className="feedback-group">
                      <span style={{ fontSize: "0.75rem", color: "#888" }}>Helpful?</span>
                      <button
                        className="action-btn"
                        onClick={() => handleFeedback(idx, "up")}
                        style={{ color: feedbackGiven[idx] === "up" ? "#2e9e4f" : "#ccc" }}
                      >
                        👍
                      </button>
                      <button
                        className="action-btn"
                        onClick={() => handleFeedback(idx, "down")}
                        style={{ color: feedbackGiven[idx] === "down" ? "#ff69b4" : "#ccc" }}
                      >
                        👎
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {loading && (
            <div className="message ai-message">
              <div className="typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="input-area">
          <div className="input-wrapper">
            <div className="plus-menu">
              <button className="plus-btn" onClick={() => setShowPlusMenu(!showPlusMenu)}>+</button>
              {showPlusMenu && (
                <div className="plus-popup">
                  <label className="popup-item">
                    📷 Upload Photo
                    <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} />
                  </label>
                  <button className="popup-item" onClick={() => { setShowCameraModal(true); setShowPlusMenu(false); }}>
                    📸 Open Camera
                  </button>
                  <button className="popup-item" onClick={handleMic}>🎤 Voice Message</button>
                </div>
              )}
            </div>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === "Enter" && sendMessage()}
              placeholder="Ask MintAI..."
              disabled={loading}
              className="chat-input"
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()} className="send-btn">
              ➤
            </button>
          </div>
        </div>
      </div>

      {/* 👇 AFTER AI ANSWER – ONLY Related Products + Related Blogs (appear only after typing) */}
      {lastAiIndex !== -1 && (
        <div>
          {relatedProducts.length > 0 && (
            <div style={{ marginTop: "2rem" }}>
              <h2>🛍️ Related Products</h2>
              <div className="product-grid">
                {relatedProducts.map(p => (
                  <a key={p.id} href={p.link} target="_blank" rel="noopener noreferrer" className="product-card glass-card">
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
            <div style={{ marginTop: "2rem" }}>
              <h2>📝 Related Blogs</h2>
              <div className="blog-grid">
                {relatedBlogs.map(blog => (
                  <Link key={blog.id} href={`/blog/${blog.slug}`} className="blog-card glass-card">
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

      {/* 👇 LATEST BLOGS – ALWAYS visible (even before any message) */}
      {blogs.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h2>📰 Latest Blogs</h2>
          <div className="blog-grid">
            {blogs.map(blog => (
              <Link key={blog.id} href={`/blog/${blog.slug}`} className="blog-card glass-card">
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

      {/* 👇 QUICK HEALTH CHECK – ALWAYS visible (bottom) */}
      <div className="mt-12 mb-8 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100">
        <h2 className="text-2xl font-bold text-center mb-2">🌟 Quick Health Check</h2>
        <p className="text-center text-gray-600 mb-6">
          Answer 3 questions – get your score & personal recommendation
        </p>
        <div className="max-w-md mx-auto space-y-4">
          <div>
            <label className="block font-medium mb-1">Your age</label>
            <input
              type="number"
              value={scoreAge}
              onChange={e => setScoreAge(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="e.g., 28"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Sleep (hours/day)</label>
            <select
              value={scoreSleep}
              onChange={e => setScoreSleep(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Select</option>
              <option value="<5">&lt;5 hours</option>
              <option value="5-6">5-6 hours</option>
              <option value="7-8">7-8 hours</option>
              <option value=">8">&gt;8 hours</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Stress level</label>
            <select
              value={scoreStress}
              onChange={e => setScoreStress(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Select</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <button
            onClick={handleHealthScore}
            disabled={scoreLoading}
            className="w-full bg-green-500 text-white py-2 rounded-xl font-semibold hover:bg-green-600 transition"
          >
            {scoreLoading ? "Getting your score..." : "🔍 Get My Health Score"}
          </button>
          {scoreResult && (
            <div className="mt-6 p-4 bg-white rounded-xl border border-green-200 text-center">
              <span className="text-3xl font-bold text-green-600">{scoreResult.score}</span>
              <span className="text-gray-500"> / 100</span>
              <p className="mt-2 text-gray-700">{scoreResult.recommendation}</p>
              {scoreResult.product && (
                <div className="mt-3">
                  <a href={scoreResult.product.link} target="_blank" className="text-green-600 underline font-medium">
                    ✨ Try: {scoreResult.product.name}
                  </a>
                </div>
              )}
              <div className="flex gap-3 justify-center mt-4">
                <button onClick={shareScoreOnWhatsApp} className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                  📱 WhatsApp
                </button>
                <button onClick={downloadScorePDF} className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                  📄 PDF Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCameraModal && (
        <CameraModal onClose={() => setShowCameraModal(false)} onResult={handleCameraResult} />
      )}
    </div>
  );
}