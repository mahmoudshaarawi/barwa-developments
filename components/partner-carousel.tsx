'use client'

import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { useLanguage } from './language-provider'

type Partner = { src: string; name: string; englishName?: string }

const partners: Partner[] = [
  { src: '/partners/mrb.jpg', name: 'MRB Total Facility Management' },
  { src: '/partners/tawla.jpg', name: 'قهوة طاولة' },
  { src: '/partners/am-samir.jpg', name: 'عم سمير بتاع الفطير' },
  { src: '/partners/central-care.jpg', name: 'Central Care Clinics' },
  { src: '/partners/we.jpg', name: 'WE' },
  { src: '/partners/engineering-consultant.png', name: 'الاستشاري الهندسي', englishName: 'Engineering Consultant' },
]

const copies = 4

export function PartnerCarousel() {
  const { language } = useLanguage()
  const isArabic = language === 'ar'
  const [failed, setFailed] = useState<string[]>([])
  const trackRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)
  const pausedRef = useRef(false)
  const draggingRef = useRef(false)
  const pointerRef = useRef<{ id: number; x: number; offset: number } | null>(null)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let last = performance.now()
    const tick = (now: number) => {
      const track = trackRef.current
      const segment = track ? track.scrollWidth / copies : 0
      if (track && segment > 0 && !media.matches && !pausedRef.current && !draggingRef.current) {
        offsetRef.current = (offsetRef.current + (now - last) * 0.04) % segment
      }
      last = now
      if (track) track.style.transform = `translate3d(${-offsetRef.current}px,0,0)`
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  const segment = () => (trackRef.current ? trackRef.current.scrollWidth / copies : 0)

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    draggingRef.current = true
    pointerRef.current = { id: event.pointerId, x: event.clientX, offset: offsetRef.current }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const start = pointerRef.current
    if (!start || start.id !== event.pointerId) return
    const width = segment()
    let next = start.offset - (event.clientX - start.x)
    if (width > 0) next = ((next % width) + width) % width
    offsetRef.current = next
  }

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (pointerRef.current?.id !== event.pointerId) return
    pointerRef.current = null
    draggingRef.current = false
  }

  const visible = partners.filter((partner) => !failed.includes(partner.src))
  const loop = Array.from({ length: copies }, () => visible).flat()
  const hidePartner = (src: string) => {
    setFailed((current) => (current.includes(src) ? current : [...current, src]))
  }

  return (
    <div
      className="partner-viewport"
      dir="ltr"
      onMouseEnter={() => { pausedRef.current = true }}
      onMouseLeave={() => { pausedRef.current = false }}
      onFocus={() => { pausedRef.current = true }}
      onBlur={() => { pausedRef.current = false }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div className="partner-track" ref={trackRef}>
        {loop.map((partner, index) => (
          <figure className="partner-card" key={`${partner.src}-${index}`} aria-hidden={index >= visible.length}>
            <img
              src={partner.src}
              alt={index < visible.length ? (isArabic ? partner.name : partner.englishName ?? partner.name) : ''}
              draggable={false}
              onError={() => hidePartner(partner.src)}
            />
          </figure>
        ))}
      </div>
    </div>
  )
}
