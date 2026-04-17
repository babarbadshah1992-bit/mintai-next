"use client"

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function TransitionEffect({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [showLeaf, setShowLeaf] = useState(false)

  useEffect(() => {
    setShowLeaf(true)
    const timer = setTimeout(() => setShowLeaf(false), 2000)
    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <>
      {children}
      {showLeaf && <div className="page-transition-leaf">🌿✨</div>}
    </>
  )
}