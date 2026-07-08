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
           { icon: "🛒", value: "30+", label: "Herbal Products" },
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
        
        {/* FOUNDER CARD — PROFESSIONALLY REDESIGNED (FIXED) */}
        <div style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(24,162,61,0.15)",
          borderRadius: "32px",
          padding: "48px 44px",
          marginBottom: "56px",
          boxShadow: "0 8px 40px rgba(24,80,40,0.08), 0 2px 8px rgba(0,0,0,0.02)",
          transition: "box-shadow 0.4s ease, transform 0.4s cubic-bezier(.22,1,.36,1)",
          position: "relative",
          overflow: "hidden",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow = "0 24px 80px rgba(24,162,61,0.18), 0 4px 16px rgba(0,0,0,0.04)";
          e.currentTarget.style.transform = "translateY(-4px)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = "0 8px 40px rgba(24,80,40,0.08), 0 2px 8px rgba(0,0,0,0.02)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
        >
          {/* Decorative glows */}
          <div style={{
            position: "absolute",
            top: "-120px",
            right: "-120px",
            width: "300px",
            height: "300px",
            background: "radial-gradient(circle, rgba(24,162,61,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute",
            bottom: "-100px",
            left: "-80px",
            width: "220px",
            height: "220px",
            background: "radial-gradient(circle, rgba(24,162,61,0.05) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          {/* Label */}
          <span style={{
            display: "inline-block",
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#18a23d",
            background: "rgba(24,162,61,0.08)",
            padding: "5px 14px",
            borderRadius: "999px",
            marginBottom: "22px",
            border: "1px solid rgba(24,162,61,0.12)",
          }}>
            From a Small Dream to MintAI
          </span>

          {/* Heading */}
          <h2 style={{
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: "800",
            color: "#1a2e1e",
            letterSpacing: "-0.02em",
            lineHeight: "1.15",
            maxWidth: "700px",
            marginBottom: "20px",
          }}>
            Building India&apos;s Trusted AI Wellness Platform
          </h2>

          {/* Founder Info with Avatar placeholder */}
          <div style={{
  display: "flex",
  alignItems: "center",
  gap: "18px",
  flexWrap: "wrap",
  marginBottom: "24px",
}}>
{/* ----- AUR YEH P TAG KA BLOCK ----- */}
<p style={{
  fontWeight: "700",
  color: "#1a2e1e",
  margin: 0,
  lineHeight: "1.2"
}}>
  Md Babar / Founder, MintAI
</p>
<a
  href="https://youtube.com/@mintaiofficial?si=J_wadJrQLBd6V_1O"
  target="_blank"
  rel="noopener noreferrer"
 style={{
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  maxWidth: "100%",
  boxSizing: "border-box",
  gap: "8px",
  marginTop: "12px",
  padding: "10px 14px",
  background: "#FF0000",
  color: "#fff",
  borderRadius: "999px",
  textDecoration: "none",
  fontWeight: "700",
  fontSize: "14px",
  whiteSpace: "nowrap",
}}
>
  ▶YouTube
</a>
            </div>
          

          {/* Description */}
          <p style={{
            fontSize: "16px",
            lineHeight: "1.8",
            color: "#4a6050",
            maxWidth: "650px",
            marginBottom: "14px",
          }}>
            MintAI is a Made in India AI-powered wellness platform built to make
            trusted health and wellness guidance simple, affordable, and
            accessible for every Indian family.
          </p>
          <p style={{
            fontSize: "16px",
            lineHeight: "1.8",
            color: "#4a6050",
            maxWidth: "650px",
            marginBottom: "28px",
          }}>
            We combine Artificial Intelligence with educational wellness content,
            smart tools, and practical resources to help people make better
            everyday health decisions.
          </p>

          {/* Badges */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "32px",
          }}>
            {[
              { emoji: "🇮🇳", label: "Made in India" },
              { emoji: "🤖", label: "AI Powered" },
              { emoji: "🌿", label: "Wellness First" },
              { emoji: "🔒", label: "Privacy Focused" },
            ].map((badge) => (
              <span
                key={badge.label}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(255,255,255,0.70)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  border: "1px solid rgba(24,162,61,0.18)",
                  borderRadius: "999px",
                  padding: "8px 16px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#2d4a32",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                  transition: "box-shadow 0.2s ease, transform 0.2s ease",
                  cursor: "default",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(24,162,61,0.12)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.02)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <span style={{ fontSize: "16px" }}>{badge.emoji}</span>
                {badge.label}
              </span>
            ))}
          </div>

          {/* Vision Block */}
          <div style={{
            background: "linear-gradient(135deg, rgba(24,162,61,0.05), rgba(24,162,61,0.02))",
            border: "1px solid rgba(24,162,61,0.12)",
            borderRadius: "20px",
            padding: "20px 24px",
            marginBottom: "32px",
            maxWidth: "600px",
          }}>
            <p style={{
              fontSize: "11px",
              fontWeight: "700",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#18a23d",
              marginBottom: "6px",
            }}>
              Our Vision
            </p>
            <p style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#1a2e1e",
              lineHeight: "1.5",
              margin: 0,
            }}>
              To become India&apos;s most trusted AI-powered wellness platform.
            </p>
          </div>

          {/* Footer info — FIXED: no media query in style */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "8px 24px",
            paddingTop: "24px",
            borderTop: "1px solid rgba(0,0,0,0.06)",
            fontSize: "14px",
            color: "#5a7060",
            marginBottom: "16px",
          }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              📍 Surat, Gujarat, India
            </span>
            {/* Separator — now always visible, but it wraps nicely */}
            <span style={{ color: "#d0dcd0" }}>|</span>
            <a
              href="mailto:support@mintai.in"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "#18a23d",
                fontWeight: "600",
                textDecoration: "none",
                transition: "text-decoration 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
              onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
            >
              ✉️ support@mintai.in
            </a>
          </div>

          {/* Disclaimer + extra story */}
          <p style={{
            fontSize: "13px",
            lineHeight: "1.7",
            color: "#8aa098",
            maxWidth: "650px",
            marginBottom: "14px",
          }}>
             MintAI provides educational wellness information and is not a substitute for professional medical advice. 
             Always consult a qualified healthcare provider for medical concerns
          </p>
          <p style={{
            fontSize: "15px",
            lineHeight: "1.8",
            color: "#4a6050",
            maxWidth: "650px",
            fontStyle: "italic",
            padding: "16px 20px",
            background: "rgba(24,162,61,0.04)",
            borderRadius: "16px",
            borderLeft: "3px solid #18a23d",
          }}>
            MintAI wasn&apos;t built by a big company or a team of engineers. It started with one
            idea: to make wellness guidance simple, affordable, and accessible for every Indian family.
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