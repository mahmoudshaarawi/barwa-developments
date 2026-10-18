'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowUpLeft, ArrowUpRight, Building2, ChevronLeft, ChevronRight, MapPin, Volume2, VolumeX } from 'lucide-react'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { CONTACT } from '@/lib/contact'
import { projects } from '@/lib/projects'

const showcase = [...projects].reverse()

function projectWordmark(displayName: string) {
  const parts = displayName.trim().split(/\s+/)
  if (parts.length > 1 && parts[parts.length - 1].toUpperCase() === 'MALL') {
    return { title: parts.slice(0, -1).join(' '), subtitle: 'MALL' }
  }
  return { title: displayName, subtitle: '' }
}

const promoVideo = '/banners/Barwa-Promo-1920X8686551.mp4'
const promoPoster = '/projects/barwa-mall/hero.jpg'

export default function Page() {
  const [active, setActive] = useState(0)
  const [fanHovered, setFanHovered] = useState(false)
  const [fanPaused, setFanPaused] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const [promoMuted, setPromoMuted] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const dragStartX = useRef<number | null>(null)
  const fanDragged = useRef(false)
  const fanPauseTimeout = useRef<number | null>(null)
  const promoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll)

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.14 },
    )
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element))

    return () => {
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const onVisibilityChange = () => setPageVisible(!document.hidden)
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMotionPreferenceChange = () => setReducedMotion(motionPreference.matches)
    onVisibilityChange()
    onMotionPreferenceChange()
    document.addEventListener('visibilitychange', onVisibilityChange)
    motionPreference.addEventListener('change', onMotionPreferenceChange)

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      motionPreference.removeEventListener('change', onMotionPreferenceChange)
    }
  }, [])

  useEffect(() => {
    const video = promoRef.current
    if (!video) return
    video.muted = true
    const play = video.play()
    if (play) play.catch(() => {})
  }, [])

  useEffect(() => {
    if (reducedMotion || !pageVisible || fanHovered || fanPaused) return
    const autoplay = window.setInterval(() => {
      setActive((current) => (current + 1) % showcase.length)
    }, 7000)
    return () => window.clearInterval(autoplay)
  }, [fanHovered, fanPaused, pageVisible, reducedMotion])

  useEffect(() => () => {
    if (fanPauseTimeout.current) window.clearTimeout(fanPauseTimeout.current)
  }, [])

  const pauseFan = () => {
    setFanPaused(true)
    if (fanPauseTimeout.current) window.clearTimeout(fanPauseTimeout.current)
    fanPauseTimeout.current = window.setTimeout(() => {
      setFanPaused(false)
      fanPauseTimeout.current = null
    }, 8000)
  }
  const move = (direction: number) => {
    setActive((current) => (current + direction + showcase.length) % showcase.length)
    pauseFan()
  }
  const togglePromoSound = () => {
    const video = promoRef.current
    if (!video) return
    const nextMuted = !video.muted
    video.muted = nextMuted
    setPromoMuted(nextMuted)
    if (!nextMuted) {
      const play = video.play()
      if (play) play.catch(() => {})
    }
  }
  const handleCarouselKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      move(1)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      move(-1)
    }
  }
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || (event.target instanceof Element && event.target.closest('button'))) return
    dragStartX.current = event.clientX
    fanDragged.current = false
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return
    const distance = event.clientX - dragStartX.current
    dragStartX.current = null
    if (Math.abs(distance) > 48) {
      fanDragged.current = true
      move(distance > 0 ? 1 : -1)
    }
  }
  const handleFanClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!fanDragged.current) return
    event.preventDefault()
    fanDragged.current = false
  }

  return (
    <main dir="rtl" className="site-shell" style={{ '--scroll-progress': `${scrollProgress}%` } as React.CSSProperties}>
      <div className="scroll-progress" aria-hidden="true" />
      <SiteHeader scrolled={scrolled} />

      <section id="projects" className="projects home-projects section-pad reveal">
        <div className="section-kicker"><span>01</span><i /><span>مشاريعنا</span></div>
        <div className="projects-heading home-projects-heading"><h2>وجهات صُممت <em>للمستقبل</em></h2></div>
        <div
          className="project-fan"
          role="region"
          aria-roledescription="carousel"
          aria-label="مشاريع بروة"
          tabIndex={0}
          onKeyDown={handleCarouselKeyDown}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => { dragStartX.current = null }}
          onClick={handleFanClick}
          onMouseEnter={() => setFanHovered(true)}
          onMouseLeave={() => setFanHovered(false)}
          onFocus={() => setFanHovered(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFanHovered(false)
          }}
        >
          <div className="project-fan-stage">
            {showcase.map((item, index) => {
              const offset = (index - active + showcase.length) % showcase.length
              const slot = offset === 0 ? 'center' : offset === 1 ? 'next' : 'prev'
              const mark = projectWordmark(item.displayName)
              const photo = `${item.assetDirectory}/hero.jpg`
              return (
                <a
                  key={item.slug}
                  className={`project-fan-card is-${slot}`}
                  href={`/projects/${item.slug}`}
                  aria-current={slot === 'center' ? 'true' : undefined}
                  aria-hidden={slot === 'center' ? undefined : true}
                  tabIndex={slot === 'center' ? 0 : -1}
                >
                  <span className="project-fan-photo">
                    <img className="project-fan-picture" src={photo} alt="" />
                    <span className="project-fan-mark" lang="en" dir="ltr">
                      <b>{mark.title}</b>
                      <i aria-hidden="true" />
                      {mark.subtitle && <small>{mark.subtitle}</small>}
                    </span>
                  </span>
                  <span className="project-fan-panel">
                    <span className="project-fan-location">
                      <MapPin aria-hidden="true" />
                      <span>{item.location}</span>
                    </span>
                    <strong className="project-fan-arabic">{item.arabic}</strong>
                    <span className="project-fan-english" lang="en" dir="ltr">{item.displayName}</span>
                    <span className="project-fan-rule" aria-hidden="true" />
                    <span className="project-fan-use">
                      <Building2 aria-hidden="true" />
                      <span>{item.type}</span>
                    </span>
                  </span>
                </a>
              )
            })}
          </div>
          <div className="project-fan-controls">
            <button type="button" onClick={() => move(-1)} aria-label="المشروع السابق"><ChevronRight /></button>
            <span aria-live="polite">{showcase[active].arabic}</span>
            <button type="button" onClick={() => move(1)} aria-label="المشروع التالي"><ChevronLeft /></button>
          </div>
        </div>
        <p className="home-projects-note">نصنع مساحات تلتقي فيها الحياة والعمل والاستثمار، بتفاصيل مدروسة وحضور لا يُنسى.</p>
      </section>


      <section id="top" className="home-promo" aria-label="عرض بروة">
        <video
          ref={promoRef}
          className="home-promo-video"
          src={promoVideo}
          poster={promoPoster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <button
          type="button"
          className="home-promo-sound"
          aria-pressed={!promoMuted}
          aria-label={promoMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
          onClick={togglePromoSound}
        >
          {promoMuted ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
        </button>
      </section>

      <section className="legacy section-pad reveal" aria-labelledby="legacy-title">
        <div className="legacy-intro">
          <div className="section-kicker"><span>02</span><i /><span>إرث من الإنجاز</span></div>
          <h2 id="legacy-title">إرث من <em>الإنجاز</em></h2>
        </div>
        <ol className="legacy-stats">
          <li><strong>55<sup>+</sup></strong><span>مشروعاً تم إنجازه خلال ١٥ عاماً</span></li>
          <li><strong>12<sup>+</sup></strong><span>عمارة سكنية تم تسليمها</span></li>
          <li><strong>15</strong><span>عاماً من الخبرة والتطوير العقاري</span></li>
        </ol>
      </section>

      <section className="approach section-pad reveal">
        <div className="approach-copy">
          <div className="section-kicker"><span>03</span><i /><span>عن بروة</span></div>
          <h2>نطور وجهات<br /><em>تصنع قيمة حقيقية</em></h2>
          <p>منذ تأسيسها، تواصل بروة للتطوير العقاري بناء إرث من التميز والإنجازات البارزة. نخلق مشاريع استثنائية تجمع بين المواقع المتميزة، الجودة، وفرص الاستثمار المدروسة.</p>
          <a className="text-link" href="#contact">تعرف على بروة <ArrowUpRight /></a>
        </div>
        <figure className="approach-figure">
          <img src="/projects/hub5-mall/hero.jpg" alt="" />
          <figcaption>
            <strong>3.2</strong>
            <span>مليار جنيه<small>حجم الاستثمارات</small></span>
          </figcaption>
        </figure>
      </section>

      <section className="philosophy reveal">
        <div className="philosophy-collage" aria-hidden="true">
          <img className="philosophy-main" src="/projects/barwa-mall/hero.jpg" alt="" />
          <img className="philosophy-float philosophy-float-top" src="/projects/central-mall/hero.jpg" alt="" />
          <img className="philosophy-float philosophy-float-bottom" src="/projects/hub5-mall/hero.jpg" alt="" />
        </div>
        <div className="philosophy-content"><div className="section-kicker light-kicker"><span>04</span><i /><span>فلسفة بروة</span></div><h2>نبني ما يبقى<br /><em>ويصنع الفرق</em></h2><div className="values"><div><strong>01</strong><span>قيمة مستدامة</span><p>وجهات مصممة لتبقى ذات صلة، وتخلق قيمة حقيقية للسكان والمستثمرين والمجتمعات.</p></div><div><strong>02</strong><span>تصميم مدروس</span></div><div><strong>03</strong><span>الثقة</span></div><div><strong>04</strong><span>التطور</span></div></div></div>
      </section>

      <section id="contact" className="brochure-close">
        <div className="brochure-close-photo" style={{ backgroundImage: 'url(/projects/barwa-mall/hero.jpg)' }} aria-hidden="true" />
        <div className="brochure-close-copy">
          <span className="eyebrow">HOTLINE · الخط الساخن</span>
          <a className="brochure-hotline" href={CONTACT.phoneHref} dir="ltr">{CONTACT.hotline}</a>
          <h2>اكتشف فرصتك القادمة<br /><em>مع بروة</em></h2>
          <p>استثمارات مدروسة، لمستقبل أكثر قيمة</p>
          <div className="brochure-close-links">
            <a href={CONTACT.emailHref}>{CONTACT.email}</a>
            <a href={CONTACT.websiteHref}>{CONTACT.websiteLabel}</a>
            <span>{CONTACT.officeAddress.arabic}</span>
          </div>
          <Link className="button-link" href="/contact-us">تواصل معنا الآن <ArrowUpLeft /></Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
