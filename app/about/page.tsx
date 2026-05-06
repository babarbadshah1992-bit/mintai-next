"use client";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">🌿✨</div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
          About MintAI
        </h1>
        <p className="text-gray-600 mt-4 text-lg">
          Your AI-powered health & beauty companion, built for India.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <div className="text-center p-4 bg-white/50 rounded-2xl">
          <div className="text-3xl font-bold text-green-600">24/7</div>
          <div className="text-sm text-gray-500">AI Support</div>
        </div>
        <div className="text-center p-4 bg-white/50 rounded-2xl">
          <div className="text-3xl font-bold text-green-600">20+</div>
          <div className="text-sm text-gray-500">Products</div>
        </div>
        <div className="text-center p-4 bg-white/50 rounded-2xl">
          <div className="text-3xl font-bold text-green-600">10+</div>
          <div className="text-sm text-gray-500">Blog Posts</div>
        </div>
        <div className="text-center p-4 bg-white/50 rounded-2xl">
          <div className="text-3xl font-bold text-green-600">100%</div>
          <div className="text-sm text-gray-500">Free</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-green-100">
          <div className="text-4xl mb-3">🌟</div>
          <h2 className="text-xl font-bold mb-2">Our Vision</h2>
          <p className="text-gray-600">Har Indian ko affordable, accessible, aur AI-powered health & beauty guidance dena. Ek sehatmand aur khubsurat Bharat ka nirmaan.</p>
        </div>
        <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-green-100">
          <div className="text-4xl mb-3">🎯</div>
          <h2 className="text-xl font-bold mb-2">Our Mission</h2>
          <p className="text-gray-600">MintAI AI aur natural remedies ke dwara logon ko unke skin, hair aur health issues ke liye turant, behtar aur practical solutions pradaan karta hai.</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 mb-12">
        <h2 className="text-2xl font-bold mb-4 text-center">📖 Our Story</h2>
        <p className="text-gray-700 leading-relaxed text-center max-w-2xl mx-auto">
          Shuruaat ek simple idea se hui – jab mere grandfather ko health tips chahiye the aur unhe koi turant jawab nahi mil paata tha. Tab maine socha, kyun na AI ki madad se ek aisa chatbot banaya jaye jo har kisi ki bhasha (Hinglish) mein sehat aur beauty ke sawaalon ke jawab de. Isi soch ne MintAI ko janam diya.
        </p>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to start your wellness journey?</h2>
        <button onClick={() => window.location.href = '/'} className="bg-green-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-600 transition">
          Start Chatting 💬
        </button>
      </div>
    </div>
  );
}