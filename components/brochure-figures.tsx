'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { BrandLockup } from './brand-lockup'
import { useLanguage } from './language-provider'

const stats = [
  { id: 'invest', target: 3.2, decimals: 1, plus: false, arabic: 'مليار جنيه حجم استثمارات', english: 'EGP billion in investments' },
  { id: 'projects', target: 150, decimals: 0, plus: true, arabic: 'مشروعًا مُسلَّمًا', english: 'Projects delivered' },
  { id: 'clients', target: 1500, decimals: 0, plus: true, arabic: 'عميل', english: 'Clients' },
]

const portfolio = [
  { href: '/projects/barwa-mall', image: '/projects/barwa-mall/hero.jpg', arabic: 'بروة مول', english: 'Barwa Mall' },
  { href: '/projects/hub5-mall', image: '/projects/hub5-mall/hero.jpg', arabic: 'هاب ٥', english: 'HUB 5' },
  { href: '/projects/central-mall', image: '/projects/central-mall/hero.jpg', arabic: 'سنترال مول', english: 'Central Mall' },
  { href: null, image: '/launching/zahra-night.jpg', arabic: 'زهرة العاصمة', english: 'Zahra Capital' },
  { href: null, image: '/launching/shorouk-mega.jpg', arabic: 'الشروق ميجا', english: 'El Shorouk Mega' },
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
  const [counts, setCounts] = useState(() => stats.map((stat) => (0)))

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
        <BrandLockup pill />
        <p>{isArabic ? 'سابقة أعمال مشتركة — بالشراكة مع الراجحي' : 'Joint track record — with Al Rajhi'}</p>
      </div>
      <ol className="record-stats">
        {stats.map((stat, index) => (
          <li key={stat.id}>
            <b className="record-value" dir="ltr">
              {stat.plus && <span className="figure-plus">+</span>}
              {formatCount(counts[index] ?? 0, stat.decimals)}
            </b>
            <span>{isArabic ? stat.arabic : stat.english}</span>
          </li>
        ))}
      </ol>
      <section className="record-own" aria-label={isArabic ? 'محفظة بروة الخاصة' : 'Barwa’s own portfolio'}>
        <img className="record-own-logo" src="/brand/barwa%20logo%20w-01.svg" alt="Barwa Developments" />
        <div className="record-own-copy">
          <p>
            <b dir="ltr">5</b>
            <span>
              {isArabic ? 'مشروعات تجارية · إدارية · طبية' : 'Commercial · administrative · medical projects'}
              <small>{isArabic ? 'في شروق العاصمة والعاصمة الإدارية' : 'In Shorouk Capital and the New Administrative Capital'}</small>
            </span>
          </p>
        </div>
        <ul className="record-chips">
          {portfolio.map((item) => {
            const name = isArabic ? item.arabic : item.english
            const body = (
              <>
                <img src={item.image} alt="" />
                <span>{name}</span>
              </>
            )
            return (
              <li key={item.english}>
                {item.href ? (
                  <Link href={item.href}>{body}</Link>
                ) : (
                  <span className="record-chip-soon">{body}</span>
                )}
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
