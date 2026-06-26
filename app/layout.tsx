import './globals.css';
import Link from 'next/link';
import Script from 'next/script';
import { Inter, Poppins } from 'next/font/google';
import type { Metadata } from 'next';
import InstallButton from '@/components/InstallButton';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mintai.in'),
  title: 'MintAI - Health & Beauty Assistant',
  description: 'AI-powered health and beauty recommendations',
  manifest: '/manifest.json',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/icon-192.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2363313291013618"
     crossOrigin="anonymous"></script>
      <body
        style={{
          margin: 0,
          padding: 0,
          background: 'linear-gradient(180deg, #f8fcf9 0%, #eef8f1 100%)',
          fontFamily: 'var(--font-inter)',
          color: '#1a2e1e',
        }}
      >
        {/* ===== HEADER (Your original design) ===== */}
        <header className="header">
          <div className="container">
            <div className="header-inner">
              <div className="logo">
                <h1>MintAI</h1>
                <p>Powered by AI</p>
              </div>
              <nav className="nav">
                <Link href="/">Home</Link>
                <Link href="/blog">Blog</Link>
                <Link href="/store">Store</Link>
                <Link href="/tools">Tools</Link>
                <Link href="/about">About</Link>
              </nav>
            </div>
          </div>
        </header>

        {/* ===== MAIN CONTENT ===== */}
        <main className="main">
          <div className="container">{children}</div>
        </main>

        {/* ===== FOOTER (Your original design, pixel perfect) ===== */}
        <footer
          style={{
            position: 'relative',
            marginTop: '40px',
            padding: '18px 14px',
            overflow: 'hidden',
          }}
        >
          {/* Glow blobs */}
          <div
            style={{
              position: 'absolute',
              top: '-100px',
              right: '-100px',
              width: '220px',
              height: '220px',
              borderRadius: '999px',
              background:
                'radial-gradient(circle, rgba(24,162,61,0.10) 0%, transparent 70%)',
              filter: 'blur(40px)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-100px',
              left: '-100px',
              width: '220px',
              height: '220px',
              borderRadius: '999px',
              background:
                'radial-gradient(circle, rgba(80,200,120,0.08) 0%, transparent 70%)',
              filter: 'blur(40px)',
              pointerEvents: 'none',
            }}
          />

          <div
            className="container"
            style={{
              position: 'relative',
              zIndex: 2,
            }}
          >
            <div
              style={{
                background: 'rgba(255,255,255,0.70)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                border: '1px solid rgba(255,255,255,0.8)',
                borderRadius: '24px',
                padding: '22px 18px',
                boxShadow: '0 8px 30px rgba(24,80,40,0.06)',
              }}
            >
              {/* TOP */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                {/* BRAND */}
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: 'clamp(30px, 8vw, 42px)',
                      fontWeight: 800,
                      color: '#18a23d',
                      letterSpacing: '-0.05em',
                      fontFamily: 'var(--font-poppins)',
                    }}
                  >
                    MintAI
                  </h2>
                  <p
                    style={{
                      margin: '8px 0 0',
                      color: '#607164',
                      fontSize: 'clamp(13px, 3vw, 14px)',
                      lineHeight: 1.5,
                    }}
                  >
                    Your AI health & beauty assistant
                  </p>
                </div>

                {/* NAVIGATION LINKS */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  {[
                    { label: 'Privacy Policy', href: '/privacy-policy' },
                    { label: 'Affiliate Disclosure', href: '/affiliate-disclosure' },
                    { label: 'Contact Us', href: '/contact' },
                    { label: 'Terms & Conditions', href: '/terms' },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      style={{
                        textDecoration: 'none',
                        color: '#445348',
                        fontWeight: 600,
                        fontSize: '14px',
                        transition: '0.2s ease',
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                {/* EMAIL */}
                <a
                  href="mailto:suport@mintai.in"
                  style={{
                    textDecoration: 'none',
                    color: '#18a23d',
                    fontWeight: 700,
                    fontSize: 'clamp(13px, 3vw, 15px)',
                    transition: '0.2s ease',
                    wordBreak: 'break-word',
                  }}
                >
                 support@mintai.in
                </a>
              </div>

              {/* DIVIDER */}
              <div
                style={{
                  width: '100%',
                  height: '1px',
                  margin: '18px 0',
                  background:
                    'linear-gradient(to right, transparent, rgba(24,162,61,0.16), transparent)',
                }}
              />

              {/* BOTTOM */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '14px',
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: '#819284',
                    fontSize: '12px',
                    lineHeight: 1.6,
                  }}
                >
                  © {new Date().getFullYear()} MintAI. All rights reserved.
                </p>

                <div
                  style={{
                    padding: '10px 18px',
                    borderRadius: '999px',
                    background: 'rgba(24,162,61,0.08)',
                    border: '1px solid rgba(24,162,61,0.12)',
                    color: '#14892f',
                    fontSize: '13px',
                    fontWeight: 600,
                    transition: '0.25s ease',
                    boxShadow: '0 4px 14px rgba(24,162,61,0.08)',
                  }}
                >
                  ⚠️ MintAI AI-powered wellness estimates deta hai. Yeh medical diagnosis nahi hai.
                </div>
              </div>
            </div>
          </div>
        </footer>

        {/* Install Button (Client Component) */}
        <InstallButton />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PY29ZCEGB1"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PY29ZCEGB1');
          `}
        </Script>
      </body>
    </html>
  );
}