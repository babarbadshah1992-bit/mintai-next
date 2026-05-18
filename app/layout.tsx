import './globals.css';
import Link from 'next/link';
import { Inter, Poppins } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata = {
  title: 'MintAI - Health & Beauty Assistant',
  description: 'AI-powered health and beauty recommendations',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌿</text></svg>',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body
        style={{
          margin: 0,
          padding: 0,
          background:
            'linear-gradient(180deg, #f8fcf9 0%, #eef8f1 100%)',
          fontFamily: 'var(--font-inter)',
          color: '#1a2e1e',
        }}
      >
        {/* HEADER */}
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
                <Link href="/about">About</Link>
              </nav>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="main">
          <div className="container">{children}</div>
        </main>

        {/* PREMIUM FOOTER */}
        <footer
          style={{
            position: 'relative',
            marginTop: '60px',
            padding: '24px 16px',
            overflow: 'hidden',
          }}
        >
          {/* Glow */}
          <div
            style={{
              position: 'absolute',
              top: '-120px',
              right: '-120px',
              width: '240px',
              height: '240px',
              borderRadius: '999px',
              background:
                'radial-gradient(circle, rgba(24,162,61,0.14) 0%, transparent 70%)',
              filter: 'blur(30px)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              position: 'absolute',
              bottom: '-120px',
              left: '-120px',
              width: '220px',
              height: '220px',
              borderRadius: '999px',
              background:
                'radial-gradient(circle, rgba(80,200,120,0.10) 0%, transparent 70%)',
              filter: 'blur(30px)',
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
                background: 'rgba(255,255,255,0.72)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.8)',
                borderRadius: '28px',
                padding: '24px',
                boxShadow:
                  '0 10px 40px rgba(24,80,40,0.08)',
              }}
            >
              {/* TOP */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '24px',
                  alignItems: 'center',
                }}
              >
                {/* LEFT */}
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: '32px',
                      fontWeight: 800,
                      color: '#18a23d',
                      letterSpacing: '-0.04em',
                      fontFamily: 'var(--font-poppins)',
                    }}
                  >
                    MintAI
                  </h2>

                  <p
                    style={{
                      marginTop: '8px',
                      marginBottom: 0,
                      color: '#5f6f63',
                      fontSize: '14px',
                      lineHeight: 1.6,
                    }}
                  >
                    Your AI health & beauty assistant
                  </p>
                </div>

                {/* CENTER */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    gap: '18px',
                  }}
                >
                  {[
                    { label: 'Home', href: '/' },
                    { label: 'Blog', href: '/blog' },
                    { label: 'Store', href: '/store' },
                    { label: 'About', href: '/about' },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      style={{
                        textDecoration: 'none',
                        color: '#445348',
                        fontWeight: 600,
                        fontSize: '14px',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                {/* RIGHT */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '12px',
                  }}
                >

                  <a
                    href="mailto:mintai@support.in"
                    style={{
                      textDecoration: 'none',
                      color: '#18a23d',
                      fontWeight: 700,
                      fontSize: '14px',
                    }}
                  >
                    mintai@support.in
                  </a>
                </div>
              </div>

              {/* DIVIDER */}
              <div
                style={{
                  width: '100%',
                  height: '1px',
                  margin: '20px 0',
                  background:
                    'linear-gradient(to right, transparent, rgba(24,162,61,0.18), transparent)',
                }}
              />

              {/* BOTTOM */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: '#7b8d7f',
                    fontSize: '13px',
                  }}
                >
                  © {new Date().getFullYear()} MintAI. All rights
                  reserved.
                </p>

                <div
                  style={{
                    padding: '8px 14px',
                    borderRadius: '999px',
                    background:
                      'rgba(24,162,61,0.08)',
                    border:
                      '1px solid rgba(24,162,61,0.10)',
                    color: '#14892f',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                >
                  Built by Mohammed Babar
                </div>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}