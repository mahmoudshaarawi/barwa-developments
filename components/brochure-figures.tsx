'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from './language-provider'

const stats = [
  { id: 'invest', target: 3.2, decimals: 1, plus: false, arabic: 'مليار جنيه حجم استثمارات', english: 'EGP billion in investments' },
  { id: 'projects', target: 150, decimals: 0, plus: true, arabic: 'مشروعًا مُسلَّمًا', english: 'Projects delivered' },
  { id: 'clients', target: 1500, decimals: 0, plus: true, arabic: 'عميل', english: 'Clients' },
  { id: 'own', target: 5, decimals: 0, plus: false, own: true, arabic: 'مشروعات تجارية · إدارية · طبية', english: 'Commercial · administrative · medical projects' },
]

function formatCount(value: number, decimals: number) {
  return decimals > 0 ? value.toFixed(decimals) : String(Math.round(value))
}

export function BrochureFigures() {
  const { language } = useLanguage()
  const isArabic = language === 'ar'
  const rootRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const [reduce, setReduce] = useState(false)
  const [counts, setCounts] = useState(() => stats.map(() => 0))

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => {
      const reduced = motion.matches
      setReduce(reduced)
      if (reduced) setCounts(stats.map((stat) => stat.target))
    }
    apply()
    motion.addEventListener('change', apply)
    return () => motion.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    const node = rootRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(true)
      },
      { threshold: 0.35 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!active) return
    if (reduce) {
      setCounts(stats.map((stat) => stat.target))
      return
    }
    const start = performance.now()
    const duration = 1400
    let frame = 0
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - progress) ** 3
      setCounts(stats.map((stat) => stat.target * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, reduce])

  return (
    <div className="record-band" ref={rootRef}>
      <div className="record-lockup">
        <p>{isArabic ? 'بالشراكة مع الراجحي' : 'In partnership with Al Rajhi'}</p>
      </div>
      <ol className="record-stats">
        {stats.map((stat, index) => (
          <li key={stat.id} className={stat.own ? 'is-own' : undefined}>
            <b className="record-value" dir="ltr">
              {stat.plus && <span className="figure-plus">+</span>}
              {formatCount(counts[index] ?? 0, stat.decimals)}
            </b>
            <span>{isArabic ? stat.arabic : stat.english}</span>
            {stat.own && (
              <small className="record-own-mark">{isArabic ? 'محفظة بروة الخاصة' : 'Barwa’s own portfolio'}</small>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}
