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
        <header className="header">
          <div className="container">
            <div className="header-inner">
              <Link href="/" className="logo">
                <span className="logo-icon">🌿</span>
                <span className="logo-text">MintAI</span>
              </Link>
              <nav className="nav-links">
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
            <p>💚 Aapki sehat, hamari zimmedari</p>
            <p>&copy; {new Date().getFullYear()} MintAI. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}