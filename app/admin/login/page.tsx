"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = () => {
    if (password === 'mintai2026') {
      document.cookie = 'admin=true; path=/'
      router.push('/admin')
    } else {
      alert('Wrong password')
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', textAlign: 'center' }}>
      <h1>Admin Login</h1>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
        style={{ width: '100%', padding: '12px', margin: '10px 0', fontSize: '16px' }}
      />
      <button onClick={handleLogin} style={{ padding: '10px 20px', background: '#2e9e4f', color: 'white', border: 'none', borderRadius: '8px' }}>Login</button>
    </div>
  )
}