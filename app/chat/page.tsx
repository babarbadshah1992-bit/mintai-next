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

  function cleanQuery(text: string) {
    return text.trim().toLowerCase();
  }

  async function searchContent(query: string) {
    console.log("🔍 SEARCHING:", query);
    
    const safeQuery = query.trim().toLowerCase();
    if (!safeQuery) return;

    try {
        // PRODUCTS (working)
        const { data: products } = await supabase
            .from('products')
            .select('*')
            .or(`name.ilike.%${safeQuery}%,category.ilike.%${safeQuery}%`)
            .limit(4);
        setRelatedProducts(products || []);

        // BLOGS (FIXED - no category column)
        // Search in title only
        let { data: blogs, error } = await supabase
            .from('blogs')
            .select('*')
            .ilike('title', `%${safeQuery}%`);
        
        // If no results, search in tags
        if (!blogs || blogs.length === 0) {
            const { data: tagBlogs } = await supabase
                .from('blogs')
                .select('*')
                .contains('tags', [safeQuery]);
            blogs = tagBlogs;
        }
        
        console.log("📚 BLOGS FOUND:", blogs?.length);
        console.log("📚 BLOG TITLES:", blogs?.map(b => b.title));
        
        setRelatedBlogs(blogs || []);

        // HEALTH TIP
        const tip = safeQuery.includes('sardi') 
            ? '🤧 Sardi ke liye: Adrak wali chai, bhatti ki bhap, aur aaram karein.'
            : '💚 Stay healthy!';
        setQuickHealthTip(tip);
        
    } catch (error) {
        console.log("ERROR:", error);
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
      console.log('API ERROR:', err);
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">

        {/* DEBUG PANEL - Shows if blogs are found */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mb-4 text-center text-sm">
          🔍 Debug: {relatedBlogs.length} Related Blogs Found
          {relatedBlogs.length > 0 && (
            <span className="ml-2 text-green-600">✅ Working!</span>
          )}
        </div>

        {/* CHAT BOX */}
        <div className="bg-white rounded-2xl shadow p-4 md:p-6 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            🤖 MintAI Wellness Assistant
          </h1>

          <div className="space-y-4 h-80 md:h-96 overflow-y-auto mb-4 pr-1">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 md:p-4 rounded-xl text-sm md:text-base ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white ml-8'
                    : 'bg-green-100 mr-8'
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="bg-green-50 rounded-xl p-3 mr-8 animate-pulse text-sm text-gray-500">
                Thinking...
              </div>
            )}
          </div>

          <div className="flex gap-2 md:gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask health questions..."
              className="flex-1 border p-3 md:p-4 rounded-xl text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 md:px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              {loading ? '...' : 'Send'}
            </button>
          </div>
        </div>

        {/* QUICK TIP */}
        <div className="bg-purple-100 p-4 md:p-6 rounded-2xl mb-6">
          <h2 className="font-bold text-lg md:text-xl mb-2">⚡ Quick Health Check</h2>
          <p className="text-sm md:text-base">{quickHealthTip}</p>
        </div>

        {/* RECOMMENDED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold mb-4">🛍 Recommended Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {relatedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow overflow-hidden"
                >
                  <div className="w-full h-28 md:h-36 flex items-center justify-center bg-gray-100 text-4xl md:text-5xl">
                    {product.image || '🌿'}
                  </div>
                  <div className="p-3 md:p-4">
                    <h3 className="font-bold text-sm md:text-base">{product.name}</h3>
                    <p className="text-green-600 font-bold text-sm md:text-base">₹{product.price}</p>
                    <p className="text-gray-500 text-xs mt-1 hidden md:block">{product.description}</p>
                    <a
                      href={product.link || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-3 bg-green-600 hover:bg-green-700 text-white text-center py-2 rounded-lg text-sm transition-colors"
                    >
                      Buy Now →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RELATED BLOGS - THIS IS WHAT YOU NEED */}
        {relatedBlogs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold mb-4">📖 Related Blogs</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              {relatedBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="bg-white rounded-2xl shadow overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="w-full h-36 md:h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                    <span className="text-4xl md:text-5xl">📖</span>
                  </div>
                  <div className="p-3 md:p-4">
                    <h3 className="font-bold text-sm md:text-base mb-2 line-clamp-2">{blog.title}</h3>
                    <p className="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2">{blog.excerpt}</p>
                    <Link
                      href={`/blog/${blog.id}`}
                      className="text-green-600 hover:text-green-700 font-semibold text-sm transition-colors"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LATEST BLOGS (shown when no search results yet) */}
        {relatedBlogs.length === 0 && latestBlogs.length > 0 && messages.length === 0 && (
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold mb-4">📰 Latest Blogs</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              {latestBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="bg-white rounded-2xl shadow overflow-hidden"
                >
                  <div className="w-full h-36 md:h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                    <span className="text-4xl md:text-5xl">📖</span>
                  </div>
                  <div className="p-3 md:p-4">
                    <h3 className="font-bold text-sm md:text-base mb-2 line-clamp-2">{blog.title}</h3>
                    <p className="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2">{blog.excerpt}</p>
                    <Link
                      href={`/blog/${blog.id}`}
                      className="text-green-600 hover:text-green-700 font-semibold text-sm transition-colors"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}