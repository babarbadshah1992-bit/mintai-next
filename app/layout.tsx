import './globals.css'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'MintAI - Health & Beauty Assistant',
  description: 'AI-powered health and beauty recommendations',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <div className="container">
            <div className="header-inner">
              <Link href="/" className="logo">
                <Image src="/logo.png" alt="MintAI Logo" width={32} height={32} className="logo-image" />
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
        <main className="main">
          <div className="container">{children}</div>
        </main>
        <footer className="footer">
          <div className="container">
            <div className="footer-inner">
              <div className="footer-brand">
                <div className="footer-logo">
                  <Image src="/logo.png" alt="MintAI Logo" width={24} height={24} className="logo-image" />
                  <span>MintAI</span>
                </div>
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