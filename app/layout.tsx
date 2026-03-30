import './globals.css'
import Link from 'next/link'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'MintAI - Your Health & Beauty Assistant',
  description: 'AI-powered health and beauty recommendations with affiliate products and blogs.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="site-header">
          <div className="container header-inner">
            <Link href="/" className="logo">
              <span className="logo-icon">🌿✨</span>
              <span className="logo-text">MintAI</span>
            </Link>
            <nav className="main-nav">
              <Link href="/">Home</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/store">Store</Link>
            </nav>
          </div>
        </header>

        <main className="site-main">
          <div className="container">
            {children}
          </div>
        </main>

        <footer className="site-footer">
          <div className="container footer-inner">
            <div className="footer-info">
              <p>💚 Aapki sehat, hamari zimmedari</p>
              <p>&copy; {new Date().getFullYear()} MintAI. All rights reserved.</p>
            </div>
            <div className="footer-links">
              <Link href="/blog">Blog</Link>
              <Link href="/store">Store</Link>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}