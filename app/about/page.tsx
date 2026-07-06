"use client";

export default function AboutPage() {
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

      {/* BG GLOW */}
      <div style={{
        position: "fixed",
        top: "-200px",
        right: "-200px",
        width: "600px",
        height: "600px",
        background: "radial-gradient(circle, rgba(24,162,61,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: "0",
      }} />
      <div style={{
        position: "fixed",
        bottom: "-200px",
        left: "-150px",
        width: "500px",
        height: "500px",
        background: "radial-gradient(circle, rgba(80,200,120,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: "0",
      }} />

      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "60px 32px 80px", position: "relative", zIndex: "1" }}>

        {/* HERO SECTION */}
        <div style={{ textAlign: "center", marginBottom: "72px" }}>
          <div style={{ fontSize: "64px", marginBottom: "20px", lineHeight: "1" }}>🌿✨</div>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#18a23d",
            background: "rgba(24,162,61,0.09)",
            border: "1px solid rgba(24,162,61,0.18)",
            borderRadius: "999px",
            padding: "6px 16px",
            marginBottom: "24px",
          }}>
            🌱 AI-Powered Wellness
          </div>
          <h1 style={{
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: "800",
            color: "#1a2e1e",
            letterSpacing: "-0.03em",
            lineHeight: "1.1",
            marginBottom: "20px",
          }}>
            About <span style={{ color: "#18a23d" }}>MintAI</span>
          </h1>
          <div style={{
            width: "56px",
            height: "3px",
            background: "linear-gradient(to right, #18a23d, #7de8a0)",
            borderRadius: "999px",
            margin: "0 auto 24px",
          }} />
          <p style={{
            color: "#5a7060",
            fontSize: "18px",
            lineHeight: "1.7",
            maxWidth: "520px",
            margin: "0 auto",
            fontWeight: "400",
          }}>
            AI-powered wellness platform helping people discover smarter natural health solutions.
          </p>
        </div>

        {/* STATS SECTION */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "20px",
          marginBottom: "56px",
        }}>
          {[
           { icon: "🤖", value: "24/7", label: "AI Support" },
{ icon: "🧮", value: "10+", label: "Wellness Calculators" },
{ icon: "📝", value: "30+", label: "Blog Posts" },
{ icon: "💚", value: "100%", label: "Free Access" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                textAlign: "center",
                padding: "28px 16px",
                background: "rgba(255,255,255,0.80)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.92)",
                borderRadius: "24px",
                boxShadow: "0 4px 24px rgba(24,80,40,0.07)",
                transition: "transform 0.26s cubic-bezier(.22,1,.36,1), box-shadow 0.26s ease",
                cursor: "default",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-5px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 40px rgba(24,80,40,0.12)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 24px rgba(24,80,40,0.07)";
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "10px" }}>{stat.icon}</div>
              <div style={{ fontSize: "32px", fontWeight: "800", color: "#18a23d", letterSpacing: "-0.02em", lineHeight: "1" }}>{stat.value}</div>
              <div style={{ fontSize: "13px", color: "#7a9080", marginTop: "6px", fontWeight: "600", letterSpacing: "0.04em", textTransform: "uppercase" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* VISION + MISSION */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "24px",
          marginBottom: "56px",
        }}>
          <div
            style={{
              background: "rgba(255,255,255,0.80)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,200,50,0.22)",
              borderRadius: "24px",
              padding: "32px",
              boxShadow: "0 4px 24px rgba(24,80,40,0.06)",
              transition: "transform 0.26s cubic-bezier(.22,1,.36,1), box-shadow 0.26s ease",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 40px rgba(24,80,40,0.11)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 24px rgba(24,80,40,0.06)";
            }}
          >
            <div style={{
              width: "52px",
              height: "52px",
              borderRadius: "16px",
              background: "rgba(255,200,50,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "26px",
              marginBottom: "18px",
            }}>🌟</div>
            <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#1a2e1e", marginBottom: "12px", letterSpacing: "-0.01em" }}>Our Vision</h2>
            <p style={{ color: "#5a7060", lineHeight: "1.7", fontSize: "15px", fontWeight: "400" }}>
              To make AI-powered wellness guidance affordable, accessible, and understandable for every Indian family.
            </p>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.80)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(24,162,61,0.18)",
              borderRadius: "24px",
              padding: "32px",
              boxShadow: "0 4px 24px rgba(24,80,40,0.06)",
              transition: "transform 0.26s cubic-bezier(.22,1,.36,1), box-shadow 0.26s ease",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 40px rgba(24,80,40,0.11)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 24px rgba(24,80,40,0.06)";
            }}
          >
            <div style={{
              width: "52px",
              height: "52px",
              borderRadius: "16px",
              background: "rgba(24,162,61,0.07)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "26px",
              marginBottom: "18px",
            }}>🎯</div>
            <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#1a2e1e", marginBottom: "12px", letterSpacing: "-0.01em" }}>Our Mission</h2>
            <p style={{ color: "#5a7060", lineHeight: "1.7", fontSize: "15px", fontWeight: "400" }}>
              MintAI combines AI and natural wellness to help users discover better solutions for skin, hair, and health concerns.
            </p>
          </div>
        </div>

        {/* FOUNDER STORY */}
        <div style={{
          background: "linear-gradient(145deg, rgba(237,247,239,0.95) 0%, rgba(216,240,223,0.90) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(24,162,61,0.14)",
          borderRadius: "28px",
          padding: "48px 40px",
          marginBottom: "56px",
          boxShadow: "0 4px 24px rgba(24,80,40,0.06)",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            top: "-60px",
            right: "-60px",
            width: "200px",
            height: "200px",
            background: "radial-gradient(circle, rgba(24,162,61,0.10) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{ fontSize: "36px", marginBottom: "16px" }}>📖</div>
          <h2 style={{
            fontSize: "26px",
            fontWeight: "800",
            color: "#1a2e1e",
            marginBottom: "18px",
            letterSpacing: "-0.02em",
          }}>From a Small Dream to MintAI</h2>
          {/* Founder Section - AdSense E-E-A-T ke liye ZARURI */}
<section className="py-16 bg-white">
  <div className="max-w-4xl mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-12">Meet The Founder</h2>
    <div className="flex flex-col md:flex-row items-center gap-8">
      <img 
        src="/founder-babar.jpg" 
        alt="Md Babar, Founder of MintAI" 
        className="w-48 h-48 rounded-full object-cover shadow-lg"
      />
      <div>
        <h3 className="text-2xl font-semibold mb-2">Md Babar</h3>
        <p className="text-green-600 font-medium mb-4">Founder, MintAI.in | AI Health & Wellness Enthusiast</p>
        <p className="text-gray-700 mb-4">
          Housekeeping supervisor se self-taught AI developer tak ka safar. Surat, Gujarat se hoon. 
          Mera goal hai AI ko use karke har Indian family ko simple, affordable wellness guidance dena 
          unki apni language me.
        </p>
        <p className="text-gray-700">
          <strong>Note:</strong> Main doctor nahi hoon. MintAI AI-powered wellness estimates deta hai. 
          Kisi bhi health concern ke liye hamesha qualified doctor se salah lein.
        </p>
        <div className="mt-4">
          <a href="mailto:support@mintai.in" className="text-green-600 font-semibold">support@mintai.in</a>
          <span className="mx-2">|</span>
          <span className="text-gray-600">Surat, Gujarat, India</span>
        </div>
      </div>
    </div>
  </div>
</section>
          <div style={{ width: "40px", height: "2px", background: "#18a23d", borderRadius: "999px", marginBottom: "20px" }} />
          <p style={{
            color: "#3d5c42",
            lineHeight: "1.8",
            fontSize: "16px",
            maxWidth: "580px",
            fontWeight: "400",
          }}>
            MintAI wasn't built by a big company or a team of engineers. It started with one idea — helping people get simple wellness guidance in their own language.
          </p>
        </div>

        {/* FEATURE GRID */}
        <div style={{ marginBottom: "64px" }}>
          <h2 style={{
            textAlign: "center",
            fontSize: "28px",
            fontWeight: "800",
            color: "#1a2e1e",
            letterSpacing: "-0.02em",
            marginBottom: "8px",
          }}>What We Offer</h2>
          <p style={{ textAlign: "center", color: "#7a9080", fontSize: "15px", marginBottom: "32px" }}>Everything you need for your wellness journey</p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
          }}>
            {[
              { icon: "🤖", title: "AI Health Chat", desc: "Get instant wellness answers powered by advanced AI" },
              { icon: "🛒", title: "Herbal Store", desc: "Curated natural products for skin, hair & health" },
              { icon: "📝", title: "Wellness Blogs", desc: "Expert-written articles on natural living" },
              { icon: "💡", title: "Personalized Guidance", desc: "Recommendations tailored just for you" },
            ].map((feature) => (
              <div
                key={feature.title}
                style={{
                  background: "rgba(255,255,255,0.80)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.92)",
                  borderRadius: "22px",
                  padding: "28px 22px",
                  boxShadow: "0 4px 20px rgba(24,80,40,0.06)",
                  transition: "transform 0.26s cubic-bezier(.22,1,.36,1), box-shadow 0.26s ease",
                  cursor: "default",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-5px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 40px rgba(24,80,40,0.12)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(24,80,40,0.06)";
                }}
              >
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background: "rgba(24,162,61,0.09)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  marginBottom: "16px",
                }}>{feature.icon}</div>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1a2e1e", marginBottom: "8px" }}>{feature.title}</h3>
                <p style={{ fontSize: "13px", color: "#7a9080", lineHeight: "1.65", fontWeight: "400" }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA SECTION */}
        <div style={{
          background: "linear-gradient(135deg, #18a23d 0%, #1db84c 100%)",
          borderRadius: "28px",
          padding: "56px 40px",
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(24,162,61,0.30)",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "280px",
            height: "280px",
            background: "radial-gradient(circle, rgba(255,255,255,0.10) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute",
            bottom: "-60px",
            left: "-60px",
            width: "220px",
            height: "220px",
            background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{ fontSize: "40px", marginBottom: "16px" }}>🚀</div>
          <h2 style={{
            fontSize: "clamp(24px, 4vw, 36px)",
            fontWeight: "800",
            color: "#ffffff",
            marginBottom: "14px",
            letterSpacing: "-0.02em",
            lineHeight: "1.2",
          }}>Start Your Wellness Journey</h2>
          <p style={{ color: "rgba(255,255,255,0.80)", fontSize: "16px", marginBottom: "32px", lineHeight: "1.6" }}>
            Join thousands discovering smarter natural health with AI.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              background: "#ffffff",
              color: "#18a23d",
              border: "none",
              padding: "16px 40px",
              borderRadius: "999px",
              fontSize: "16px",
              fontWeight: "800",
              cursor: "pointer",
              boxShadow: "0 8px 28px rgba(0,0,0,0.15)",
              transition: "transform 0.20s ease, box-shadow 0.20s ease",
              letterSpacing: "0.01em",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px) scale(1.04)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 14px 36px rgba(0,0,0,0.20)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0) scale(1)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 28px rgba(0,0,0,0.15)";
            }}
          >
            Try MintAI Now 💬
          </button>
        </div>

      </div>
    </div>
  );
}
