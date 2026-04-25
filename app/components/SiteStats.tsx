"use client"

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { PRODUCTS } from '../lib/products'

export default function SiteStats() {
  const [visitors, setVisitors] = useState<number | null>(null)
  const [blogCount, setBlogCount] = useState<number | null>(null)
  const productCount = PRODUCTS.length

  useEffect(() => {
    const fetchStats = async () => {
      // Visitor count (unique visits)
      const today = new Date().toISOString().split('T')[0]
      const already = localStorage.getItem('visited_today')
      if (!already) {
        localStorage.setItem('visited_today', 'yes')
        const { data: existing } = await supabase.from('site_visits').select('count').eq('visit_date', today).single()
        if (existing) {
          await supabase.from('site_visits').update({ count: existing.count + 1 }).eq('visit_date', today)
        } else {
          await supabase.from('site_visits').insert({ visit_date: today, count: 1 })
        }
      }
      const { data: all } = await supabase.from('site_visits').select('count')
      const totalVisitors = all?.reduce((acc, cur) => acc + cur.count, 0) || 0
      setVisitors(totalVisitors)

      // Blog count
      const { count, error } = await supabase.from('blogs').select('*', { count: 'exact', head: true })
      if (!error) setBlogCount(count)
    }
    fetchStats()
  }, [])

  return (
    <div className="site-stats">
      <span>👁️ {visitors !== null ? visitors : '...'} Visitors</span>
      <span>🛍️ {productCount} Products</span>
      <span>📝 {blogCount !== null ? blogCount : '...'} Blogs</span>
    </div>
  )
}