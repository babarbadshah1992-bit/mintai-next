'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
}

interface Blog {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  created_at?: string;
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

      setQuickHealthTip(
        '💚 Drink water, sleep properly, and walk daily.'
      );
    } catch (err) {
      console.log(err);
    }
  }

  // SAFE QUERY CLEANER
  function cleanQuery(text: string) {
    return text
      .replace(/[^\w\s]/gi, '')
      .trim()
      .toLowerCase();
  }

  async function searchContent(query: string) {
    const safeQuery = cleanQuery(query);

    if (!safeQuery) return;

    try {
      // PRODUCTS
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .or(
          `name.ilike.%${safeQuery}%,category.ilike.%${safeQuery}%`
        )
        .limit(4);

      setRelatedProducts(products || []);
      console.log(products);
      // BLOGS
      const { data: blogs } = await supabase
        .from('blogs')
        .select('*')
        .or(
          `title.ilike.%${safeQuery}%,excerpt.ilike.%${safeQuery}%`
        )
        .limit(3);

      setRelatedBlogs(blogs || []);

      // HEALTH TIPS
      const tips: Record<string, string> = {
        hair: '💆 Hair care tip: Use onion oil & protein-rich diet.',
        weight: '🏃 Walk daily & avoid sugary drinks.',
        acne: '🧼 Wash face twice daily.',
        sleep: '😴 Avoid mobile before sleeping.',
      };

      const matched = Object.keys(tips).find((key) =>
        safeQuery.includes(key)
      );

      setQuickHealthTip(
        matched
          ? tips[matched]
          : '💚 Stay healthy with good food & proper sleep.'
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function sendMessage() {
    if (!input.trim()) return;

    const query = input;

    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: query,
      },
    ]);

    setInput('');
    setLoading(true);

    await searchContent(query);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: query,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            data.reply ||
            quickHealthTip ||
            '💚 Stay healthy!',
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ AI response failed.',
        },
      ]);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2">
            🤖 MintAI Wellness Assistant
          </h1>

          <div className="space-y-4 h-96 overflow-y-auto mb-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-green-100'
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask health questions..."
              className="flex-1 border p-4 rounded-xl"
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-green-600 text-white px-6 rounded-xl"
            >
              {loading ? '...' : 'Send'}
            </button>
          </div>
        </div>

        {/* QUICK TIP */}
        <div className="bg-purple-100 p-6 rounded-2xl mb-6">
          <h2 className="font-bold text-xl mb-2">
            ⚡ Quick Health Check
          </h2>

          <p>{quickHealthTip}</p>
        </div>

        {/* PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              🛍 Recommended Products
            </h2>

            <div className="grid md:grid-cols-4 gap-4">
              {relatedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow overflow-hidden"
                >
                  <div
  className="w-full h-48 flex items-center justify-center bg-gray-100"
  style={{ fontSize: "70px" }}
>
  Image: {JSON.stringify(product.image)}
</div>

                  <div className="p-4">
                    <h3 className="font-bold">
                      {product.name}
                    </h3>

                    <p className="text-green-600 font-bold">
                      ₹{product.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BLOGS */}
        {relatedBlogs.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              📖 Related Blogs
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              {relatedBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="bg-white rounded-2xl shadow overflow-hidden"
                >
                  <Image
                    src={blog.image || '/placeholder.jpg'}
                    alt={blog.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />

                  <div className="p-4">
                    <h3 className="font-bold mb-2">
                      {blog.title}
                    </h3>

                    <p className="text-sm text-gray-600 mb-3">
                      {blog.excerpt}
                    </p>

                    <Link
                      href={`/blogs/${blog.id}`}
                      className="text-green-600 font-semibold"
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