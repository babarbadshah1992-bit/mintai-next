'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  link?: string;
}

interface Blog {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  created_at?: string;
  tags?: string[];
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [latestBlogs, setLatestBlogs] = useState<Blog[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [quickHealthTip, setQuickHealthTip] = useState('');

  useEffect(() => {
    loadLatestBlogs();
  }, []);

  async function loadLatestBlogs() {
    try {
      const { data } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      setLatestBlogs(data || []);
      setQuickHealthTip('💚 Drink water, sleep properly, and walk daily.');
    } catch (err) {
      console.log(err);
    }
  }

  async function searchContent(query: string) {
    const safeQuery = query.trim().toLowerCase();
    if (!safeQuery) return;

    try {
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${safeQuery}%,category.ilike.%${safeQuery}%`)
        .limit(4);

      setRelatedProducts(products || []);

      const { data: blogs } = await supabase
        .from('blogs')
        .select('*')
        .ilike('title', `%${safeQuery}%`);

      if (blogs && blogs.length > 0) {
        setRelatedBlogs(blogs);
      } else {
        setRelatedBlogs([]);
      }

      const tips: Record<string, string> = {
        diabetes: '🩸 Diabetes: Karela juice, methi seeds, and low sugar diet help control blood sugar.',
        sardi: '🤧 Sardi ke liye: Adrak wali chai, bhatti ki bhap, aur aaram karein.',
      };

      const matched = Object.keys(tips).find(key => safeQuery.includes(key));
      setQuickHealthTip(matched ? tips[matched] : '💚 Stay healthy!');
    } catch (error) {
      console.log("❌ SEARCH ERROR:", error);
    }
  }

  async function sendMessage() {
    if (!input.trim()) return;

    const query = input;
    setMessages((prev) => [...prev, { role: 'user', content: query }]);
    setInput('');
    setLoading(true);

    await searchContent(query);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply || quickHealthTip || '💚 Stay healthy!',
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '⚠️ AI response failed.' },
      ]);
    }

    setLoading(false);
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-[#fafdf8] font-sans flex flex-col">
      
      {/* 1. PROFESSIONAL GLASS HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-green-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-xl shadow-md shadow-green-200">
              🌿
            </div>
            <div>
              <div className="font-extrabold text-gray-800 text-lg leading-tight tracking-tight">MintAI</div>
              <div className="text-[11px] text-green-600 font-bold tracking-wide uppercase">Wellness AI</div>
            </div>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-semibold text-green-700">AI Online</span>
            </div>
            <Link href="/" className="text-sm font-semibold text-gray-600 hover:text-green-600 transition">
              ← Back Home
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 pb-32">
        
        {/* 2. MODERN CHAT BOX */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-green-100 shadow-xl shadow-green-900/5 overflow-hidden flex flex-col h-[70vh]">
          
          {/* Chat Header */}
          <div className="p-5 border-b border-green-50 bg-white/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl">🤖</div>
              <div>
                <h2 className="font-bold text-gray-800">MintAI Assistant</h2>
                <p className="text-xs text-gray-500">Ask anything about health & wellness</p>
              </div>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#fafdf8]/50">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                <div className="text-5xl mb-4">💚</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">How can I help you today?</h3>
                <p className="text-sm text-gray-500 max-w-sm">Ask about products, ingredients, side effects, or get health tips.</p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] md:max-w-[75%] p-4 rounded-2xl text-sm md:text-base leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-green-500 to-green-600 text-white rounded-br-sm shadow-md shadow-green-200'
                    : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-bl-sm shadow-sm flex gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
          </div>

          {/* 3. FLOATING INPUT BOX */}
          <div className="p-4 bg-white border-t border-green-50">
            <div className="relative flex items-center bg-gray-50 rounded-full border border-gray-200 shadow-inner focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-100 transition-all">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message MintAI..."
                className="w-full bg-transparent py-4 pl-6 pr-16 text-sm md:text-base outline-none text-gray-700 placeholder-gray-400"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className={`absolute right-2 p-2.5 rounded-full flex items-center justify-center transition-all ${
                  input.trim() 
                    ? 'bg-green-600 hover:bg-green-700 text-white shadow-md' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 -ml-0.5 mt-0.5">
                  <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* QUICK TIP & OTHER SECTIONS */}
        <div className="mt-8 space-y-8">
          
          {/* Quick Tip */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 p-5 rounded-2xl shadow-sm flex items-start gap-4">
            <div className="text-2xl">⚡</div>
            <div>
              <h2 className="font-bold text-green-900 mb-1">Daily Health Check</h2>
              <p className="text-sm text-green-800">{quickHealthTip || 'Loading tip...'}</p>
            </div>
          </div>

          {/* Recommended Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-green-100 p-1.5 rounded-lg text-green-700">🛍</span> Recommended Products
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
                    <div className="w-full h-40 bg-gray-50 p-4 flex items-center justify-center">
                      <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-sm text-gray-800 line-clamp-1">{product.name}</h3>
                      <p className="text-green-600 font-bold text-sm mt-1">₹{product.price}</p>
                      <a href={product.link || '#'} target="_blank" rel="noopener noreferrer" className="block mt-3 bg-green-50 hover:bg-green-100 text-green-700 text-center py-2 rounded-xl text-xs font-bold transition-colors">
                        View Product
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related/Latest Blogs */}
          {(relatedBlogs.length > 0 || (relatedBlogs.length === 0 && latestBlogs.length > 0 && messages.length === 0)) && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-green-100 p-1.5 rounded-lg text-green-700">📖</span> 
                {relatedBlogs.length > 0 ? 'Related Articles' : 'Latest Wellness Blogs'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(relatedBlogs.length > 0 ? relatedBlogs : latestBlogs).map((blog) => (
                  <div key={blog.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
                    <div className="w-full h-32 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                      <span className="text-4xl opacity-50 group-hover:scale-110 transition-transform">📄</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-sm text-gray-800 mb-2 line-clamp-2">{blog.title}</h3>
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{blog.excerpt}</p>
                      <Link href={`/blog/${blog.id}`} className="text-green-600 font-bold text-xs hover:text-green-700 flex items-center gap-1">
                        Read Article <span>→</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}