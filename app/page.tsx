'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowDownLeft, ArrowUpLeft, ArrowUpRight, ChevronLeft, ChevronRight, Menu, MoveUpRight, X } from 'lucide-react'

const whiteLogoUrl = '/brand/barwa logo w-01.svg'
const coloredLogoUrl = '/brand/barwa logo-01.svg'
const brandStarUrl = '/brand/barwa-star.svg'

const projects = [
  {
    name: 'HUB 5',
    arabic: 'هاب ٥',
    location: 'مدينة الشروق',
    type: 'تجاري · إداري · طبي',
    description: 'حيث تلتقي مسارات الحياة في مركز متعدد الاستخدامات صُمم ليصنع فرصاً استثنائية.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=85',
    number: '01',
  },
  {
    name: 'CENTRAL MALL',
    arabic: 'سنترال مول',
    location: 'المنطقة المركزية الثانية · مدينة الشروق',
    type: 'تجاري · إداري · طبي',
    description: 'تنبض التجارة بالحياة في قلب المنطقة المركزية الثانية، حيث يلتقي التصميم العصري بالحضور اليومي.',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1800&q=85',
    number: '02',
  },
  {
    name: 'BARWA MALL',
    arabic: 'بروة مول',
    location: 'مصر',
    type: 'وجهة تجارية',
    description: 'مساحات مدروسة تمنح الأعمال عنواناً يواكب تطلعات المستقبل.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=85',
    number: '03',
  },
]

const navItems = ['الرئيسية', 'من نحن', 'مشاريعنا', 'سابقة أعمالنا', 'الأخبار', 'تواصل معنا']

export default function Page() {
  const [active, setActive] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const dragStartX = useRef<number | null>(null)

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

  const move = (direction: number) => setActive((active + direction + projects.length) % projects.length)
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
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <a href="#top" className="brand-lockup" aria-label="Barwa Developments">
          <img className="brand-logo brand-logo-white" src={whiteLogoUrl} alt="" aria-hidden="true" />
          <img className="brand-logo brand-logo-colored" src={coloredLogoUrl} alt="" aria-hidden="true" />
        </a>
        <nav className="desktop-nav" aria-label="التنقل الرئيسي">
          {navItems.map((item, index) => <a key={item} href={index === 0 ? '#top' : index === 2 ? '#projects' : '#contact'}>{item}</a>)}
        </nav>
        <div className="header-actions">
          <button className="language" aria-label="Switch to English">EN</button>
          <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="فتح القائمة"><Menu /></button>
        </div>
      </header>

      {menuOpen && <div className="mobile-menu">
        <button className="close-menu" onClick={() => setMenuOpen(false)} aria-label="إغلاق القائمة"><X /></button>
        <span className="eyebrow">BARWA / NAVIGATION</span>
        <nav>{navItems.map((item, index) => <a key={item} href={index === 2 ? '#projects' : '#contact'} onClick={() => setMenuOpen(false)}><span>0{index + 1}</span>{item}</a>)}</nav>
        <div className="mobile-menu-footer">AR <span>·</span> EN</div>
      </div>}

      <section id="top" className="hero">
        <div className="hero-image" />
        <div className="hero-grid" />
        <div className="hero-star" aria-hidden="true"><img src={brandStarUrl} alt="" /></div>
        <div className="hero-copy">
          <span className="eyebrow light">تطوير عقاري · القاهرة ٢٠٢٦</span>
          <h1>نبني التميز<br /><em>نصنع القيمة</em></h1>
          <p>وجهات استثنائية تصنع قيمة حقيقية<br />لأجيال اليوم والغد</p>
          <a className="text-link light-link" href="#projects">اكتشف مشاريعنا <MoveUpRight /></a>
        </div>
        <div className="hero-meta"><span>01</span><i /><span>03</span><small>اسحب للأسفل</small></div>
        <div className="hero-rail" aria-hidden="true"><span>01</span><i /><span>03</span></div>
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
          className="carousel-wrap"
          role="group"
          aria-label="مشاريع بروة"
          tabIndex={0}
          onKeyDown={handleCarouselKeyDown}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => { dragStartX.current = null }}
          onPointerLeave={() => { dragStartX.current = null }}
        >
          <div className="carousel-star" aria-hidden="true"><img src={brandStarUrl} alt="" /></div>
          <button className="carousel-arrow prev" onClick={() => move(-1)} aria-label="المشروع السابق"><ChevronRight /></button>
          {projects.map((item, index) => {
            const position = index === active ? 'active' : index === (active + projects.length - 1) % projects.length ? 'previous' : 'next'
            return (
              <article
                key={item.name}
                className={`project-card project-card-${position}`}
                style={{ backgroundImage: `linear-gradient(0deg, rgba(0,0,0,.88), rgba(0,0,0,.08) 70%), url(${item.image})` }}
                aria-current={position === 'active' ? 'true' : undefined}
              >
                {position !== 'active' && <button className="project-card-select" onClick={() => setActive(index)} aria-label={`استكشف ${item.arabic}`} />}
                <div className="project-card-top"><span>{item.number} / 0{projects.length}</span><span>BARWA DEVELOPMENTS</span></div>
                <div className="project-card-info">
                  <span className="eyebrow light">{item.location}</span>
                  <h3>{item.arabic}<small>{item.name}</small></h3>
                  <p>{item.type}</p>
                  <div className="project-card-bottom">
                    <span>{item.description}</span>
                    <a href="#contact" aria-label={`View Project / استكشف المشروع: ${item.arabic}`}>
                      <span className="project-cta-en">View Project</span>
                      <span className="project-cta-ar">استكشف المشروع</span>
                      <ArrowUpLeft />
                    </a>
                  </div>
                </div>
              </article>
            )
          })}
          <button className="carousel-arrow next" onClick={() => move(1)} aria-label="المشروع التالي"><ChevronLeft /></button>
        </div>
        <div className="carousel-footer"><span>اسحب للتنقل بين المشاريع</span><div className="pagination">{projects.map((item, index) => <button key={item.name} className={active === index ? 'active' : ''} onClick={() => setActive(index)} aria-label={`مشروع ${index + 1}`}><span>0{index + 1}</span></button>)}</div></div>
      </section>

      <section className="philosophy reveal">
        <div className="philosophy-image" />
        <div className="philosophy-content"><div className="section-kicker light-kicker"><span>04</span><i /><span>فلسفة بروة</span></div><span className="eyebrow light">OUR PHILOSOPHY</span><h2>نبني ما يبقى<br /><em>ويصنع الفرق</em></h2><div className="values"><div><strong>01</strong><span>قيمة مستدامة</span><p>وجهات مصممة لتبقى ذات صلة، وتخلق قيمة حقيقية للسكان والمستثمرين والمجتمعات.</p></div><div><strong>02</strong><span>تصميم مدروس</span></div><div><strong>03</strong><span>الثقة</span></div><div><strong>04</strong><span>التطور</span></div></div></div>
      </section>

      <section id="contact" className="contact section-pad"><div className="contact-star"><img src={brandStarUrl} alt="" /></div><span className="eyebrow">LET&apos;S BUILD VALUE</span><h2>اكتشف فرصتك القادمة<br /><em>مع بروة</em></h2><p>استثمارات مدروسة، لمستقبل أكثر قيمة</p><a className="button-link" href="mailto:info@barwa-eg.com">تواصل معنا الآن <ArrowUpLeft /></a></section>

      <footer><div className="footer-top"><a href="#top" className="brand-lockup footer-brand" aria-label="Barwa Developments"><img className="brand-logo brand-logo-white" src={whiteLogoUrl} alt="" aria-hidden="true" /></a><p>نبني التميز<br />نصنع القيمة</p><div className="footer-contact"><span>١٢ شارع المشير أحمد إسماعيل، شيراتون، القاهرة</span><a href="tel:+201270000101">+20 127 0000 101</a></div></div><div className="footer-bottom"><span>© 2026 BARWA DEVELOPMENTS</span><span>BarwaDevelopments.com</span><span>AR <b>·</b> EN</span></div></footer>
    </main>
  )
}
