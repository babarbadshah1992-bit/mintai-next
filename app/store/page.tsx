"use client";

import { useEffect, useState } from "react";

export default function StorePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [cartItems, setCartItems] = useState<number[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setProducts(data);
      });
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddToCart = (e: React.MouseEvent, productId: number, productName: string) => {
    e.stopPropagation();
    setCartItems((prev) => [...prev, productId]);
    setToastMessage(`${productName} added to cart!`);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleBuyNow = (e: React.MouseEvent, link: string) => {
    e.stopPropagation();
    window.open(link, "_blank");
  };

  const handleCardClick = (link: string) => {
    window.open(link, "_blank");
  };

  return (
    <div
      style={{
        padding: "20px 16px 60px",
        background: "linear-gradient(160deg, #f0f7f2 0%, #e8f4ec 50%, #f4f9f5 100%)",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#1a2e1e",
            color: "white",
            padding: "12px 24px",
            borderRadius: "40px",
            fontSize: "14px",
            fontWeight: 600,
            zIndex: 1000,
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            animation: "slideUp 0.3s ease",
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* BG GLOW */}
      <div
        style={{
          position: "fixed",
          top: "-200px",
          right: "-200px",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(24,162,61,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "-200px",
          left: "-150px",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(80,200,120,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* HEADER */}
      <div style={{ position: "relative", zIndex: 1, marginBottom: "32px" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#18a23d",
            background: "rgba(24,162,61,0.09)",
            border: "1px solid rgba(24,162,61,0.18)",
            borderRadius: "999px",
            padding: "5px 14px",
            marginBottom: "16px",
          }}
        >
          🌿 Natural & Certified
        </div>

        <h1
          style={{
            fontSize: "clamp(32px, 8vw, 62px)",
            marginBottom: "12px",
            color: "#1a2e1e",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          MintAI <span style={{ color: "#18a23d" }}>Herbal</span> Store
        </h1>

        <div
          style={{
            width: "56px",
            height: "3px",
            background: "linear-gradient(to right, #18a23d, #7de8a0)",
            borderRadius: "999px",
            marginBottom: "14px",
          }}
        />

        <p
          style={{
            fontSize: "clamp(14px, 4vw, 16px)",
            color: "#5a7060",
            maxWidth: "460px",
            lineHeight: 1.65,
            fontWeight: 400,
          }}
        >
          Premium herbal formulations crafted for modern wellness — clean ingredients, real results.
        </p>
      </div>

      {/* SEARCH */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          marginBottom: "28px",
        }}
      >
        <input
          type="text"
          placeholder="Search herbal products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 18px",
            borderRadius: "16px",
            border: "1px solid rgba(24,162,61,0.12)",
            outline: "none",
            fontSize: "15px",
            background: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(18px)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
            color: "#1a2e1e",
            WebkitBackdropFilter: "blur(18px)",
          }}
        />
      </div>

      {/* PRODUCT GRID */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
         gridTemplateColumns: "repeat(2, minmax(160px, 1fr))",
gap: "10px",
justifyContent: "center",
alignItems: "stretch",
        }}
      >
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => handleCardClick(product.link)}
            style={{
              background: "rgba(255,255,255,0.80)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.92)",
              borderRadius: "18px",
              padding: "12px",
              boxShadow: "0 4px 24px rgba(24,80,40,0.07), 0 1px 3px rgba(24,80,40,0.04)",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.28s cubic-bezier(.22,1,.36,1), box-shadow 0.28s cubic-bezier(.22,1,.36,1)",
             cursor: "pointer",
             width: "100%",
             height: "100%",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px) scale(1.012)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 56px rgba(24,80,40,0.13), 0 4px 16px rgba(24,80,40,0.07)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(0) scale(1)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 24px rgba(24,80,40,0.07), 0 1px 3px rgba(24,80,40,0.04)";
            }}
          >
            {/* IMAGE */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "18px",
                textAlign: "center",
                marginBottom: "20px",
                height: "220px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "radial-gradient(circle at 60% 30%, rgba(255,255,255,0.55) 0%, transparent 65%)",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  width: "220px",
                  height: "280px",
                  margin: "auto",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.45)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "60px",
                  boxShadow: "0 8px 32px rgba(24,80,40,0.10), inset 0 2px 8px rgba(255,255,255,0.6)",
                  position: "relative",
                  zIndex: 1,
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                }}
              >
               <img
  src={product.image}
  alt={product.name}
  style={{
    width: "100%",
    height: "100px",
    objectFit: "contain",
    borderRadius: "12px"
  }}
/>
              </div>
            </div>

            {/* BADGES */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px", pointerEvents: "none" }}>
              {product.discount && (
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    padding: "3px 10px",
                    borderRadius: "999px",
                    background: "linear-gradient(135deg, #ff4fa3, #ff79c6)",
                    color: "#fff",
                  }}
                >
                  {product.discount}
                </span>
              )}

              {product.id <= 3 && (
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    padding: "3px 10px",
                    borderRadius: "999px",
                    background: "#fff2d6",
                    color: "#c97a00",
                  }}
                >
                  Bestseller
                </span>
              )}

              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  padding: "3px 10px",
                  borderRadius: "999px",
                  background: "rgba(24,162,61,0.10)",
                  color: "#14892f",
                  border: "1px solid rgba(24,162,61,0.18)",
                }}
              >
                Natural
              </span>
            </div>

            {/* TITLE */}
            <h2
              style={{
                fontSize: "clamp(18px, 4vw, 20px)",
                marginBottom: "12px",
                color: "#1a2e1e",
                fontWeight: 700,
                lineHeight: 1.3,
                letterSpacing: "-0.01em",
                flex: 1,
                pointerEvents: "none",
              }}
            >
              {product.name}
            </h2>

            {/* PRICE */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "baseline",
                flexWrap: "wrap",
                marginBottom: "16px",
                pointerEvents: "none",
              }}
            >
              <span
                style={{
                  color: "#18a23d",
                  fontSize: "clamp(24px, 5vw, 28px)",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                {product.price}
              </span>

              <span
                style={{
                  textDecoration: "line-through",
                  color: "#aab5a8",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                {product.originalprice}
              </span>
            </div>

            <div
              style={{
                height: "1px",
                background: "linear-gradient(to right, rgba(24,162,61,0.14), transparent)",
                marginBottom: "16px",
                pointerEvents: "none",
              }}
            />

            {/* BUTTONS */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexDirection: "column",
              }}
            >
              <button
                onClick={(e) => handleAddToCart(e, product.id, product.name)}
                style={{
                  width: "100%",
                  border: "1.5px solid rgba(24,162,61,0.22)",
                  padding: "12px",
                  borderRadius: "14px",
                  background: "#edf7ef",
                  color: "#18a23d",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "clamp(13px, 3.5vw, 14px)",
                  fontFamily: "inherit",
                  transition: "all 0.18s ease",
                  position: "relative",
                  zIndex: 2,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#d8f0df";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 12px rgba(24,162,61,0.12)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#edf7ef";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                }}
                onTouchStart={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)";
                }}
                onTouchEnd={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                }}
              >
                Add to Cart
              </button>

              <button
                onClick={(e) => handleBuyNow(e, product.link)}
                style={{
                  width: "100%",
                  border: "none",
                  padding: "12px",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #18a23d 0%, #1db84c 100%)",
                  color: "white",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "clamp(13px, 3.5vw, 14px)",
                  fontFamily: "inherit",
                  boxShadow: "0 4px 14px rgba(24,162,61,0.28)",
                  transition: "all 0.18s ease",
                  position: "relative",
                  zIndex: 2,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "linear-gradient(135deg, #14892f 0%, #18a23d 100%)";
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "translateY(-2px)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 8px 22px rgba(24,162,61,0.38)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "linear-gradient(135deg, #18a23d 0%, #1db84c 100%)";
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "translateY(0)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 4px 14px rgba(24,162,61,0.28)";
                }}
                onTouchStart={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)";
                }}
                onTouchEnd={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                }}
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}