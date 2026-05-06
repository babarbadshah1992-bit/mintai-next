"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  price: string;
  originalprice: string;
  discount: string;
  image: string;
  link: string;
  description: string;
  category: string;
  barcode: string;
}

interface CartItem extends Product {
  quantity: number;
}

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });
      if (!error && data) {
        const typedData = data as Product[];
        setProducts(typedData);
        setFilteredProducts(typedData);
        // Fix: Extract unique categories safely
        const uniqueCategories = [
          ...new Set(typedData.map(p => p.category).filter(Boolean)),
        ] as string[];
        setCategories(uniqueCategories);
      }
      setTimeout(() => setLoading(false), 500);
    };
    fetchProducts();
  }, []);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("mintai_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("mintai_cart", JSON.stringify(cart));
  }, [cart]);

  // Filter & sort products
  useEffect(() => {
    let result = [...products];

    if (selectedCategory !== "all") {
      result = result.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }

    if (sortBy === "price_asc") {
      result.sort((a, b) => parseInt(a.price.replace(/[^0-9]/g, "")) - parseInt(b.price.replace(/[^0-9]/g, "")));
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => parseInt(b.price.replace(/[^0-9]/g, "")) - parseInt(a.price.replace(/[^0-9]/g, "")));
    } else if (sortBy === "name_asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(result);
  }, [products, selectedCategory, searchTerm, sortBy]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev =>
      prev
        .map(i => i.id === id ? { ...i, quantity: i.quantity + delta } : i)
        .filter(i => i.quantity > 0)
    );
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((total, i) => {
      const priceNum = parseInt(i.price.replace(/[^0-9]/g, ""), 10);
      return total + priceNum * i.quantity;
    }, 0);
  };

  if (loading) return <div className="text-center p-10">Loading products...</div>;

  return (
    <div className="relative">
      {/* Header + Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">🛍️ All Products</h1>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-full border border-green-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-full border border-green-200 bg-white/50 backdrop-blur-sm"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-full border border-green-200 bg-white/50 backdrop-blur-sm"
          >
            <option value="default">Sort by: Default</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="product-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card glass-card">
            <div className="product-image">
              {product.image && product.image.startsWith("http") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.image} alt={product.name} className="w-28 h-28 object-contain mx-auto" />
              ) : (
                <span className="text-6xl">{product.image || "🛍️"}</span>
              )}
            </div>
            <h3 className="product-title">{product.name}</h3>
            <div className="product-rating">⭐ 4.5 (1.2k)</div>
            <div className="price">
              <span className="current">{product.price}</span>
              <span className="original">{product.originalprice}</span>
              <span className="discount">{product.discount}</span>
            </div>
            <p className="product-description">{product.description.slice(0, 80)}...</p>
            <div className="product-actions">
              <button onClick={() => addToCart(product)} className="cart-btn">🛒 Add to Cart</button>
              <a href={product.link} target="_blank" rel="noopener noreferrer" className="buy-btn">Buy Now →</a>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-10 text-gray-500">No products found. Try different filters.</div>
      )}

      {/* Cart Sidebar */}
      {isCartOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsCartOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-96 bg-white/95 backdrop-blur-sm shadow-2xl z-50 p-6 flex flex-col animate-slide-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
            </div>
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-10">Cart is empty.</p>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-3 border-b pb-3">
                      <div className="text-3xl">{item.image || "🛍️"}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <div className="text-sm text-gray-500">{item.price}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded-full bg-gray-200">-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded-full bg-gray-200">+</button>
                          <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm ml-2">Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between text-lg font-bold mb-4">
                    <span>Total:</span>
                    <span>₹{getCartTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={clearCart} className="flex-1 bg-gray-200 py-2 rounded-full">Clear Cart</button>
                    <button onClick={() => alert("Checkout coming soon")} className="flex-1 bg-green-500 text-white py-2 rounded-full">Checkout →</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}

      <style jsx>{`
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 28px;
          margin-top: 32px;
        }
        .product-card {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(8px);
          border-radius: 24px;
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex;
          flex-direction: column;
        }
        .product-card:hover {
          transform: translateY(-4px);
          background: rgba(255, 255, 255, 0.8);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
        }
        .product-image {
          text-align: center;
          margin-bottom: 12px;
        }
        .product-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 4px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .product-rating {
          font-size: 0.7rem;
          color: #ffc107;
          margin-bottom: 8px;
        }
        .price {
          display: flex;
          gap: 8px;
          align-items: baseline;
          flex-wrap: wrap;
          margin: 8px 0;
        }
        .current {
          font-weight: 700;
          color: #2e9e4f;
          font-size: 1.2rem;
        }
        .original {
          text-decoration: line-through;
          color: #999;
          font-size: 0.8rem;
        }
        .discount {
          background: #ff69b4;
          color: white;
          padding: 2px 6px;
          border-radius: 30px;
          font-size: 0.65rem;
        }
        .product-description {
          font-size: 0.8rem;
          color: #555;
          margin: 8px 0;
          flex: 1;
        }
        .product-actions {
          display: flex;
          gap: 12px;
          margin-top: 12px;
        }
        .cart-btn, .buy-btn {
          flex: 1;
          text-align: center;
          padding: 8px 0;
          border-radius: 40px;
          font-size: 0.85rem;
          font-weight: 500;
          transition: 0.2s;
          cursor: pointer;
        }
        .cart-btn {
          background: #e8f5e9;
          color: #2e9e4f;
          border: 1px solid #2e9e4f;
        }
        .cart-btn:hover {
          background: #2e9e4f;
          color: white;
        }
        .buy-btn {
          background: linear-gradient(135deg, #2e9e4f, #1e6e3a);
          color: white;
          text-decoration: none;
        }
        .buy-btn:hover {
          background: linear-gradient(135deg, #1e6e3a, #2e9e4f);
          transform: scale(1.02);
        }
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        @media (max-width: 640px) {
          .product-grid {
            grid-template-columns: 1fr;
          }
          .product-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}