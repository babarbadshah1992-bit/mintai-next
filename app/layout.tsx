import './globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'MintAI - Health & Beauty Assistant',
  description: 'AI-powered health and beauty recommendations',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Header */}
        <header className="header">
          <div className="container">
            <div className="header-inner">
              <Link href="/" className="logo">
                <span className="logo-icon">🌿</span>
                <span className="logo-text">MintAI</span>
              </Link>
              <nav className="nav">
                <Link href="/">Home</Link>
                <Link href="/blog">Blog</Link>
                <Link href="/store">Store</Link>
                <Link href="/about">About</Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="main">{children}</main>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="footer-inner">
              <div className="footer-brand">
                <span className="footer-logo">🌿 MintAI</span>
                <p>Your AI health & beauty assistant</p>
              </div>
              <div className="footer-links">
                <Link href="/">Home</Link>
                <Link href="/blog">Blog</Link>
                <Link href="/store">Store</Link>
                <Link href="/about">About</Link>
              </div>
              <div className="footer-social">
                <span>📧 mintai@support.com</span>
              </div>
            </div>
            <div className="footer-bottom">
              <p>💚 Aapki sehat, hamari zimmedari</p>
              <p>&copy; {new Date().getFullYear()} MintAI. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}