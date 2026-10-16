'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowUpLeft, ArrowUpRight, ChevronLeft, ChevronRight, MoveUpRight } from 'lucide-react'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { InstallmentCalculator } from '@/components/installment-calculator'
import { UsePills } from '@/components/use-pills'
import { CONTACT } from '@/lib/contact'
import { projects } from '@/lib/projects'

const showcase = [...projects].reverse()

const heroSlides = [
  {
    image: '/projects/barwa-mall/hero.jpg',
    eyebrow: 'مدينة الشروق · مصر',
    title: projects[2].arabic,
    emphasis: projects[2].tagline,
    englishName: projects[2].displayName,
    description: projects[2].englishTagline,
    href: `/projects/${projects[2].slug}`,
    type: projects[2].type,
    englishType: projects[2].englishType,
    imagePosition: 'center 50%',
    mobileImagePosition: '35% 53%',
  },
  {
    image: '/projects/central-mall/hero.jpg',
    eyebrow: projects[1].englishLocation,
    title: projects[1].arabic,
    emphasis: projects[1].tagline,
    englishName: projects[1].displayName,
    description: projects[1].englishTagline,
    href: `/projects/${projects[1].slug}`,
    type: projects[1].type,
    englishType: projects[1].englishType,
    imagePosition: 'center 50%',
    mobileImagePosition: 'center 50%',
  },
  {
    image: '/projects/hub5-mall/hero.jpg',
    eyebrow: 'مدينة الشروق · مصر',
    title: projects[0].arabic,
    emphasis: projects[0].tagline,
    englishName: projects[0].displayName,
    description: projects[0].englishTagline,
    href: `/projects/${projects[0].slug}`,
    type: projects[0].type,
    englishType: projects[0].englishType,
    imagePosition: 'center 50%',
    mobileImagePosition: 'center 50%',
  },
  {
    image: '/banners/offer.jpg',
    eyebrow: 'بروة للتطوير العقاري',
    title: 'نبني التميز',
    emphasis: 'نصنع القيمة',
    englishName: 'BARWA DEVELOPMENTS',
    description: 'وجهات استثنائية تصنع قيمة حقيقية لأجيال اليوم والغد.',
    href: '/projects',
    type: '',
    englishType: '',
    imagePosition: 'center 50%',
    mobileImagePosition: 'center 47%',
  },
]

export default function Page() {
  const [active, setActive] = useState(0)
  const [heroActive, setHeroActive] = useState(0)
  const [heroHovered, setHeroHovered] = useState(false)
  const [heroFocused, setHeroFocused] = useState(false)
  const [heroInteractionPaused, setHeroInteractionPaused] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const dragStartX = useRef<number | null>(null)
  const heroDragStartX = useRef<number | null>(null)
  const heroPauseTimeout = useRef<number | null>(null)

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
    if (reducedMotion || !pageVisible || heroHovered || heroFocused || heroInteractionPaused) return
    const autoplay = window.setInterval(() => {
      setHeroActive((current) => (current + 1) % heroSlides.length)
    }, 6000)

    return () => window.clearInterval(autoplay)
  }, [heroFocused, heroHovered, heroInteractionPaused, pageVisible, reducedMotion])

  useEffect(() => () => {
    if (heroPauseTimeout.current) window.clearTimeout(heroPauseTimeout.current)
  }, [])

  const move = (direction: number) => setActive((current) => (current + direction + showcase.length) % showcase.length)
  const pauseHeroAfterInteraction = () => {
    setHeroInteractionPaused(true)
    if (heroPauseTimeout.current) window.clearTimeout(heroPauseTimeout.current)
    heroPauseTimeout.current = window.setTimeout(() => {
      setHeroInteractionPaused(false)
      heroPauseTimeout.current = null
    }, 6000)
  }
  const moveHero = (direction: number) => {
    setHeroActive((current) => (current + direction + heroSlides.length) % heroSlides.length)
    pauseHeroAfterInteraction()
  }
  const handleHeroKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      moveHero(1)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      moveHero(-1)
    }
  }
  const handleHeroPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (event.button !== 0 || (event.target instanceof Element && event.target.closest('a, button'))) return
    heroDragStartX.current = event.clientX
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const handleHeroPointerUp = (event: React.PointerEvent<HTMLElement>) => {
    if (heroDragStartX.current === null) return
    const distance = event.clientX - heroDragStartX.current
    heroDragStartX.current = null
    if (Math.abs(distance) > 48) moveHero(distance < 0 ? 1 : -1)
  }
  const handleCarouselKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      move(-1)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      move(1)
    }
  }
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || (event.target instanceof Element && event.target.closest('a, button'))) return
    dragStartX.current = event.clientX
  }
  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return
    const distance = event.clientX - dragStartX.current
    dragStartX.current = null
    if (Math.abs(distance) > 48) move(distance < 0 ? 1 : -1)
  }

  return (
    <main dir="rtl" className="site-shell" style={{ '--scroll-progress': `${scrollProgress}%` } as React.CSSProperties}>
      <div className="scroll-progress" aria-hidden="true" />
      <SiteHeader scrolled={scrolled} />

      <section
        id="top"
        className="hero"
        aria-label="مشاريع بروة"
        aria-roledescription="carousel"
        tabIndex={0}
        onKeyDown={handleHeroKeyDown}
        onPointerDown={handleHeroPointerDown}
        onPointerUp={handleHeroPointerUp}
        onPointerCancel={() => { heroDragStartX.current = null }}
        onPointerLeave={() => { heroDragStartX.current = null }}
        onMouseEnter={() => setHeroHovered(true)}
        onMouseLeave={() => setHeroHovered(false)}
        onFocus={() => setHeroFocused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHeroFocused(false)
        }}
      >
        <div className="hero-image" aria-hidden="true">
          {heroSlides.map((slide, index) => (
            <img
              key={slide.image}
              className={`hero-slide-image ${index === heroActive ? 'is-active' : ''}`}
              src={slide.image}
              alt=""
              aria-hidden="true"
              style={{
                '--image-position': slide.imagePosition,
                '--mobile-image-position': slide.mobileImagePosition,
              } as React.CSSProperties}
              fetchPriority={index === 0 ? 'high' : 'auto'}
            />
          ))}
        </div>
        <div className="hero-copy" key={heroActive} aria-live="polite">
          <span className="hero-kicker">{heroSlides[heroActive].eyebrow}</span>
          <h1>
            {heroSlides[heroActive].title}
            {heroSlides[heroActive].emphasis && <em>{heroSlides[heroActive].emphasis}</em>}
            <small lang="en" dir="ltr">{heroSlides[heroActive].englishName}</small>
          </h1>
          <p>{heroSlides[heroActive].description}</p>
          {heroSlides[heroActive].type && (
            <UsePills arabic={heroSlides[heroActive].type} english={heroSlides[heroActive].englishType} />
          )}
          <a className="hero-project-link" href={heroSlides[heroActive].href}>استكشف المشروع <MoveUpRight /></a>
        </div>
        <div className="hero-meta">
          <button type="button" className="hero-arrow" onClick={() => moveHero(-1)} aria-label="الشريحة السابقة"><ChevronRight /></button>
          <span>{String(heroActive + 1).padStart(2, '0')}</span><i /><span>04</span>
          <button type="button" className="hero-arrow" onClick={() => moveHero(1)} aria-label="الشريحة التالية"><ChevronLeft /></button>
          <small>اسحب للأسفل</small>
        </div>
        <nav className="hero-rail" aria-label="شرائح المشاريع">
          {heroSlides.map((slide, index) => (
            <button
              type="button"
              key={slide.image}
              className={heroActive === index ? 'is-active' : ''}
              onClick={() => {
                setHeroActive(index)
                pauseHeroAfterInteraction()
              }}
              aria-label={`الشريحة ${String(index + 1).padStart(2, '0')}`}
              aria-current={heroActive === index ? 'true' : undefined}
            >
              {String(index + 1).padStart(2, '0')}
            </button>
          ))}
        </nav>
      </section>

      <section className="intro section-pad reveal">
        <div className="section-kicker"><span>01</span><i /><span>عن بروة</span></div>
        <div className="intro-layout">
          <div className="intro-heading"><span className="eyebrow">OUR APPROACH</span><h2>نطور وجهات<br /><em>تصنع قيمة حقيقية</em></h2></div>
          <div className="intro-copy"><p>منذ تأسيسها، تواصل بروة للتطوير العقاري بناء إرث من التميز والإنجازات البارزة. نخلق مشاريع استثنائية تجمع بين المواقع المتميزة، الجودة، وفرص الاستثمار المدروسة.</p><a className="text-link" href="#contact">تعرف على بروة <ArrowUpRight /></a></div>
        </div>
        <div className="intro-visual"><div className="visual-caption">A SIGNATURE<br />OF QUALITY</div><div className="visual-number">3.2<span>مليار جنيه<br /><small>حجم الاستثمارات</small></span></div></div>
      </section>

      <section className="numbers">
        <div className="section-kicker light-kicker"><span>02</span><i /><span>إرث من الإنجاز</span></div>
        <div className="numbers-grid"><div><strong>55<sup>+</sup></strong><span>مشروعاً تم إنجازه<br />خلال ١٥ عاماً</span></div><div><strong>12<sup>+</sup></strong><span>عمارة سكنية<br />تم تسليمها</span></div><div><strong>15</strong><span>عاماً من الخبرة<br />والتطوير العقاري</span></div></div>
      </section>

      <section id="projects" className="projects section-pad reveal">
        <div className="section-kicker"><span>03</span><i /><span>مشاريعنا</span></div>
        <div className="projects-heading"><div><span className="eyebrow">SELECTED DESTINATIONS</span><h2>وجهات صُممت<br /><em>للمستقبل</em></h2></div><p>نصنع مساحات تلتقي فيها الحياة والعمل والاستثمار، بتفاصيل مدروسة وحضور لا يُنسى.</p></div>
        <div
          className="project-showcase"
          role="group"
          aria-label="مشاريع بروة"
          tabIndex={0}
          onKeyDown={handleCarouselKeyDown}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => { dragStartX.current = null }}
          onPointerLeave={() => { dragStartX.current = null }}
        >
          <article className="project-showcase-card" aria-current="true">
            <div className="project-showcase-media">
              <img src={showcase[active].image} alt="" />
            </div>
            <div className="project-showcase-copy">
              <span className="eyebrow">{showcase[active].location}</span>
              <h3>{showcase[active].arabic}<small lang="en" dir="ltr">{showcase[active].displayName}</small></h3>
              <UsePills arabic={showcase[active].type} english={showcase[active].englishType} />
              <p>{showcase[active].description}</p>
              <div className="project-showcase-actions">
                <button type="button" onClick={() => move(-1)} aria-label="المشروع السابق"><ChevronRight /></button>
                <a href={`/projects/${showcase[active].slug}`}>استكشف المشروع <ArrowUpLeft /></a>
                <button type="button" onClick={() => move(1)} aria-label="المشروع التالي"><ChevronLeft /></button>
              </div>
            </div>
          </article>
          <div className="project-thumbs">
            {showcase.map((item, index) => (
              <button
                key={item.slug}
                type="button"
                className={active === index ? 'is-active' : ''}
                onClick={() => setActive(index)}
                aria-label={item.arabic}
                aria-current={active === index ? 'true' : undefined}
              >
                <img src={item.image} alt="" />
                <span>{item.arabic}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="installments" className="installments section-pad">
        <div className="section-kicker"><span>04</span><i /><span>احسب القسط</span></div>
        <div className="installments-heading">
          <h2>احسب القسط <em>المناسب لوحدتك</em></h2>
          <p>اختر المشروع والنوع والمساحة، ثم أرسل بياناتك لنرسل لك الحسبة.</p>
        </div>
        <InstallmentCalculator />
      </section>

      <section className="philosophy reveal">
        <div className="philosophy-image" />
        <div className="philosophy-content"><div className="section-kicker light-kicker"><span>05</span><i /><span>فلسفة بروة</span></div><span className="eyebrow light">OUR PHILOSOPHY</span><h2>نبني ما يبقى<br /><em>ويصنع الفرق</em></h2><div className="values"><div><strong>01</strong><span>قيمة مستدامة</span><p>وجهات مصممة لتبقى ذات صلة، وتخلق قيمة حقيقية للسكان والمستثمرين والمجتمعات.</p></div><div><strong>02</strong><span>تصميم مدروس</span></div><div><strong>03</strong><span>الثقة</span></div><div><strong>04</strong><span>التطور</span></div></div></div>
      </section>

      <section id="contact" className="brochure-close">
        <div className="brochure-close-photo" style={{ backgroundImage: 'url(/projects/central-mall/gallery-01.jpg)' }} aria-hidden="true" />
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
