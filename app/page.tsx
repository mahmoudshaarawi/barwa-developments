'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowUpLeft, ArrowUpRight, Building2, ChevronLeft, ChevronRight, MapPin, Volume2, VolumeX } from 'lucide-react'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { useLanguage } from '@/components/language-provider'
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
  const { language } = useLanguage()
  const isArabic = language === 'ar'
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
    const forward = isArabic ? event.key === 'ArrowLeft' : event.key === 'ArrowRight'
    const back = isArabic ? event.key === 'ArrowRight' : event.key === 'ArrowLeft'
    if (forward || back) {
      event.preventDefault()
      move(forward ? 1 : -1)
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
      const forward = isArabic ? distance > 0 : distance < 0
      move(forward ? 1 : -1)
    }
  }
  const handleFanClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!fanDragged.current) return
    event.preventDefault()
    fanDragged.current = false
  }

  return (
    <main dir={isArabic ? 'rtl' : 'ltr'} className="site-shell" style={{ '--scroll-progress': `${scrollProgress}%` } as React.CSSProperties}>
      <div className="scroll-progress" aria-hidden="true" />
      <SiteHeader scrolled={scrolled} />

      <section id="projects" className="projects home-projects section-pad reveal">
        <div className="section-kicker"><span>01</span><i /><span>{isArabic ? 'مشاريعنا' : 'PROJECTS'}</span></div>
        <div className="projects-heading home-projects-heading">
          <h2>{isArabic ? <>وجهات صُممت <em>للمستقبل</em></> : <>Destinations designed <em>for the future</em></>}</h2>
        </div>
        <div
          className="project-fan"
          role="region"
          aria-roledescription="carousel"
          aria-label={isArabic ? 'مشاريع بروة' : 'Barwa projects'}
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
                      <span>{isArabic ? item.location : item.englishLocation}</span>
                    </span>
                    <strong className="project-fan-arabic">{isArabic ? item.arabic : item.displayName}</strong>
                    {isArabic && <span className="project-fan-english" lang="en" dir="ltr">{item.displayName}</span>}
                    <span className="project-fan-rule" aria-hidden="true" />
                    <span className="project-fan-use">
                      <Building2 aria-hidden="true" />
                      <span>{isArabic ? item.type : item.englishType}</span>
                    </span>
                  </span>
                </a>
              )
            })}
          </div>
          <div className="project-fan-controls">
            <button type="button" onClick={() => move(-1)} aria-label={isArabic ? 'المشروع السابق' : 'Previous project'}>
              {isArabic ? <ChevronRight /> : <ChevronLeft />}
            </button>
            <span aria-live="polite">{isArabic ? showcase[active].arabic : showcase[active].displayName}</span>
            <button type="button" onClick={() => move(1)} aria-label={isArabic ? 'المشروع التالي' : 'Next project'}>
              {isArabic ? <ChevronLeft /> : <ChevronRight />}
            </button>
          </div>
        </div>
        <p className="home-projects-note">
          {isArabic
            ? 'نصنع مساحات تلتقي فيها الحياة والعمل والاستثمار، بتفاصيل مدروسة وحضور لا يُنسى.'
            : 'We create spaces where life, work and investment meet, shaped by considered detail and a distinctive presence.'}
        </p>
      </section>


      <section id="top" className="home-promo" aria-label={isArabic ? 'عرض بروة' : 'Barwa film'}>
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
          aria-label={promoMuted ? (isArabic ? 'تشغيل الصوت' : 'Play sound') : (isArabic ? 'كتم الصوت' : 'Mute')}
          onClick={togglePromoSound}
        >
          {promoMuted ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
        </button>
      </section>

      <section className="legacy section-pad reveal" aria-labelledby="legacy-title">
        <div className="legacy-intro">
          <div className="section-kicker"><span>02</span><i /><span>{isArabic ? 'إرث من الإنجاز' : 'A RECORD OF DELIVERY'}</span></div>
          <h2 id="legacy-title">{isArabic ? <>إرث من <em>الإنجاز</em></> : <>A record of <em>delivery</em></>}</h2>
        </div>
        <ol className="legacy-stats">
          <li><strong>55<sup>+</sup></strong><span>{isArabic ? 'مشروعاً تم إنجازه خلال ١٥ عاماً' : 'Projects delivered over 15 years'}</span></li>
          <li><strong>12<sup>+</sup></strong><span>{isArabic ? 'عمارة سكنية تم تسليمها' : 'Residential buildings handed over'}</span></li>
          <li><strong>15</strong><span>{isArabic ? 'عاماً من الخبرة والتطوير العقاري' : 'Years of real-estate development'}</span></li>
        </ol>
      </section>

      <section className="approach section-pad reveal">
        <div className="approach-copy">
          <div className="section-kicker"><span>03</span><i /><span>{isArabic ? 'عن بروة' : 'ABOUT BARWA'}</span></div>
          <h2>{isArabic ? <>نطور وجهات<br /><em>تصنع قيمة حقيقية</em></> : <>We develop destinations<br /><em>that create real value</em></>}</h2>
          <p>
            {isArabic
              ? 'منذ تأسيسها، تواصل بروة للتطوير العقاري بناء إرث من التميز والإنجازات البارزة. نخلق مشاريع استثنائية تجمع بين المواقع المتميزة، الجودة، وفرص الاستثمار المدروسة.'
              : 'Since its founding, Barwa Developments has built a record of distinction and delivery. We create exceptional projects that bring together distinguished locations, quality and considered investment opportunities.'}
          </p>
          <a className="text-link" href="#contact">{isArabic ? 'تعرف على بروة' : 'Discover Barwa'} <ArrowUpRight /></a>
        </div>
        <figure className="approach-figure">
          <img src="/projects/hub5-mall/hero.jpg" alt="" />
          <figcaption>
            <strong>3.2</strong>
            <span>{isArabic ? 'مليار جنيه' : 'EGP billion'}<small>{isArabic ? 'حجم الاستثمارات' : 'Investment volume'}</small></span>
          </figcaption>
        </figure>
      </section>

      <section className="philosophy reveal">
        <div className="philosophy-collage" aria-hidden="true">
          <img className="philosophy-main" src="/projects/barwa-mall/hero.jpg" alt="" />
          <img className="philosophy-float philosophy-float-top" src="/projects/central-mall/hero.jpg" alt="" />
          <img className="philosophy-float philosophy-float-bottom" src="/projects/hub5-mall/hero.jpg" alt="" />
        </div>
        <div className="philosophy-content">
          <div className="section-kicker light-kicker"><span>04</span><i /><span>{isArabic ? 'فلسفة بروة' : 'BARWA PHILOSOPHY'}</span></div>
          <h2>{isArabic ? <>نبني ما يبقى<br /><em>ويصنع الفرق</em></> : <>We build what lasts<br /><em>and makes a difference</em></>}</h2>
          <div className="values">
            <div>
              <strong>01</strong>
              <span>{isArabic ? 'قيمة مستدامة' : 'Lasting value'}</span>
              <p>{isArabic ? 'وجهات مصممة لتبقى ذات صلة، وتخلق قيمة حقيقية للسكان والمستثمرين والمجتمعات.' : 'Destinations designed to stay relevant and create real value for residents, investors and communities.'}</p>
            </div>
            <div><strong>02</strong><span>{isArabic ? 'تصميم مدروس' : 'Considered design'}</span></div>
            <div><strong>03</strong><span>{isArabic ? 'الثقة' : 'Trust'}</span></div>
            <div><strong>04</strong><span>{isArabic ? 'التطور' : 'Progress'}</span></div>
          </div>
        </div>
      </section>

      <section id="contact" className="brochure-close">
        <div className="brochure-close-photo" style={{ backgroundImage: 'url(/projects/barwa-mall/hero.jpg)' }} aria-hidden="true" />
        <div className="brochure-close-copy">
          <span className="eyebrow">{isArabic ? 'HOTLINE · الخط الساخن' : 'HOTLINE'}</span>
          <a className="brochure-hotline" href={CONTACT.phoneHref} dir="ltr">{CONTACT.hotline}</a>
          <h2>{isArabic ? <>اكتشف فرصتك القادمة<br /><em>مع بروة</em></> : <>Discover your next opportunity<br /><em>with Barwa</em></>}</h2>
          <p>{isArabic ? 'استثمارات مدروسة، لمستقبل أكثر قيمة' : 'Considered investments for a more valuable future'}</p>
          <div className="brochure-close-links">
            <a href={CONTACT.emailHref}>{CONTACT.email}</a>
            <a href={CONTACT.websiteHref}>{CONTACT.websiteLabel}</a>
            <span>{isArabic ? CONTACT.officeAddress.arabic : CONTACT.officeAddress.english}</span>
          </div>
          <Link className="button-link" href="/contact-us">{isArabic ? 'تواصل معنا الآن' : 'Contact us now'} {isArabic ? <ArrowUpLeft /> : <ArrowUpRight />}</Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
