'use client'

import { useEffect, useRef } from 'react'
import { BrochureFigures } from './brochure-figures'
import Link from 'next/link'
import {
  ArrowUpLeft,
  ArrowUpRight,
  Building2,
  Layers3,
  Mail,
  MapPin,
  MoveUpRight,
  Phone,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SiteFooter } from './site-footer'
import { SiteHeader } from './site-header'
import { useLanguage } from './language-provider'
import { CONTACT } from '@/lib/contact'
import { projects } from '@/lib/projects'

const companyImage = '/projects/barwa-mall/gallery-01.jpg'
const visionImage = '/projects/central-mall/hero.jpg'
const missionImage = '/projects/hub5-mall/gallery-01.jpg'

export function AboutUsContent() {
  const { language } = useLanguage()
  const isArabic = language === 'ar'
  const pageRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const page = pageRef.current
    if (!page) return

    const revealItems = page.querySelectorAll<HTMLElement>('.about-reveal')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      revealItems.forEach((item) => item.classList.add('is-visible'))
      return
    }

    const revealInView = () => {
      revealItems.forEach((item) => {
        const bounds = item.getBoundingClientRect()
        if (bounds.top < window.innerHeight * 0.9 && bounds.bottom > 0) {
          item.classList.add('is-visible')
        }
      })
    }

    revealInView()
    window.addEventListener('scroll', revealInView, { passive: true })
    window.addEventListener('resize', revealInView)
    return () => {
      window.removeEventListener('scroll', revealInView)
      window.removeEventListener('resize', revealInView)
    }
  }, [])

  const projectOrder = ['barwa-mall', 'central-mall', 'hub5-mall']
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter((project): project is (typeof projects)[number] => Boolean(project))

  return (
    <main ref={pageRef} className="site-shell about-page" dir={isArabic ? 'rtl' : 'ltr'}>
      <SiteHeader variant="overlay" />

      <section className="about-hero" aria-labelledby="about-hero-title">
        <img className="about-hero-image" src="/projects/barwa-mall/hero.jpg" alt="" fetchPriority="high" />
        <div className="about-hero-shade" />
        <div className="about-hero-copy about-reveal">
          <span className="about-eyebrow">{isArabic ? 'بروة للتطوير العقاري' : 'BARWA DEVELOPMENTS'}</span>
          <h1 id="about-hero-title">{isArabic ? 'من نحن' : 'About Us'}</h1>
          <p>{isArabic ? 'نصنع وجهات تتجاوز مفهوم البناء' : 'Creating Destinations Beyond Buildings'}</p>
        </div>
        <span className="about-hero-index" dir="ltr">01 / 09</span>
      </section>

      <section className="about-company section-pad">
        <div className="about-company-image about-reveal">
          <img src={companyImage} alt={isArabic ? 'مشهد معماري من مشروعات بروة' : 'An architectural view from a Barwa development'} loading="lazy" />
          <span className="about-image-caption">{isArabic ? 'بروة للتطوير العقاري' : 'BARWA DEVELOPMENTS'}</span>
        </div>
        <div className="about-company-copy about-reveal">
          <span className="about-eyebrow">{isArabic ? '02 / عن بروة' : '02 / ABOUT BARWA'}</span>
          <h2>{isArabic ? 'بروة للتطوير العقاري' : 'Barwa Developments'}</h2>
          <p>
            {isArabic
              ? 'تأسست بروة للتطوير العقاري على يد ثلاثة مستثمرين في القطاع العقاري، ونمت لتصبح من الأسماء البارزة في سوق العقارات المصري.'
              : 'Founded by three real-estate investors, Barwa Developments has grown into a prominent player in Egypt’s real-estate sector.'}
          </p>
          <p>
            {isArabic
              ? 'سلّمت الشركة أكثر من 150 مشروعًا، بحجم استثمارات يبلغ 3.2 مليار جنيه، وتواصل العمل على 5 مشروعات تجارية جديدة. ويرتكز نهجها على اختيار المواقع المتميزة، وجودة التطوير، وتهيئة فرص استثمارية مدروسة.'
              : 'The company has delivered 150+ projects, with EGP 3.2 billion in investments, and is developing 5 new commercial projects. Its approach brings together distinguished locations, development quality and considered investment opportunities.'}
          </p>
          <p>
            {isArabic
              ? 'وتواصل بروة التوسع وتطوير مشروعاتها، مع التركيز على التصميم المعاصر والجودة في مختلف مراحل التطوير.'
              : 'Barwa continues to expand and develop its projects, with a focus on contemporary design and quality throughout the development process.'}
          </p>
        </div>
      </section>

      <section className="about-statistics" aria-label={isArabic ? 'أرقام بروة' : 'Barwa in numbers'}>
        <div className="about-statistics-heading about-reveal">
          <span className="about-eyebrow">{isArabic ? '03 / بروة بالأرقام' : '03 / BARWA IN NUMBERS'}</span>
          <h2>{isArabic ? 'خبرة تُبنى مع الزمن' : 'Experience Built Over Time'}</h2>
        </div>
        <BrochureFigures />
      </section>

      <section className="about-approach section-pad">
        <div className="about-section-heading about-reveal">
          <span className="about-eyebrow">{isArabic ? '04 / نهجنا' : '04 / OUR APPROACH'}</span>
          <h2>{isArabic ? 'ثلاث ركائز توجه عملنا' : 'Three Pillars That Guide Our Work'}</h2>
        </div>
        <div className="about-pillars">
          <Pillar number="01" Icon={MapPin} title={isArabic ? 'اختيار المواقع' : 'Strategic Locations'} text={isArabic ? 'نبدأ من الموقع، ونبحث عن الأماكن التي تمنح المشروع حضوراً وفرصة.' : 'We begin with place, seeking locations that give each development presence and opportunity.'} />
          <Pillar number="02" Icon={Building2} title={isArabic ? 'جودة التطوير' : 'Development Quality'} text={isArabic ? 'نهتم بجودة التطوير والتصميم المعاصر في تشكيل كل وجهة.' : 'We focus on development quality and contemporary design in shaping every destination.'} />
          <Pillar number="03" Icon={Layers3} title={isArabic ? 'قيمة مستدامة' : 'Lasting Value'} text={isArabic ? 'نطوّر فرصاً تستند إلى قيمة مدروسة وتطلّع طويل الأمد.' : 'We develop opportunities grounded in considered value and a long-term outlook.'} />
        </div>
      </section>

      <section className="about-vision-mission section-pad">
        <div className="about-section-heading about-reveal">
          <span className="about-eyebrow">{isArabic ? '05 / تطلعاتنا' : '05 / OUR DIRECTION'}</span>
          <h2>{isArabic ? 'رؤيتنا ورسالتنا' : 'Vision & Mission'}</h2>
        </div>
        <EditorialRow
          number="01"
          image={visionImage}
          imageAlt={isArabic ? 'واجهة معمارية لمشروع سنترال مول' : 'The architecture of Central Mall'}
          eyebrow={isArabic ? 'رؤيتنا' : 'OUR VISION'}
          title={isArabic ? 'وجهات تصنع قيمة' : 'Destinations That Create Value'}
          text={isArabic
            ? 'أن نواصل تطوير وجهات عقارية تجمع بين المواقع المتميزة وجودة التطوير والتصميم المعاصر، وتفتح آفاقاً لفرص استثمارية ذات قيمة.'
            : 'To continue developing real-estate destinations that bring together distinguished locations, development quality and contemporary design, opening opportunities for considered investment value.'}
          imageFirst
        />
        <EditorialRow
          number="02"
          image={missionImage}
          imageAlt={isArabic ? 'تفاصيل معمارية من مشروع هاب ٥' : 'Architectural detail from HUB 5'}
          eyebrow={isArabic ? 'رسالتنا' : 'OUR MISSION'}
          title={isArabic ? 'تطوير بعناية' : 'Developing with Care'}
          text={isArabic
            ? 'تطوير مشروعات عقارية بعناية، من خلال اختيار المواقع والاهتمام بجودة التطوير والتصميم المعاصر، وصناعة فرص استثمارية مدروسة.'
            : 'To develop real-estate projects with care: choosing locations thoughtfully, focusing on development quality and contemporary design, and creating considered investment opportunities.'}
        />
      </section>

      <section className="about-philosophy section-pad">
        <div className="about-philosophy-intro about-reveal">
          <span className="about-eyebrow">{isArabic ? '06 / فلسفتنا' : '06 / OUR PHILOSOPHY'}</span>
          <h2>{isArabic ? 'قيمة تبدأ من التفاصيل' : 'Value Begins in the Details'}</h2>
          <p>{isArabic ? 'نؤمن أن التطوير العقاري المتأنّي يجمع بين وضوح الرؤية والعناية بكل قرار.' : 'We believe considered real-estate development brings clarity of vision to every decision and care to every detail.'}</p>
        </div>
        <div className="about-principles">
          <Principle number="01" title={isArabic ? 'التصميم الهادف' : 'Purposeful Design'} />
          <Principle number="02" title={isArabic ? 'الجودة في التفاصيل' : 'Quality in Every Detail'} />
          <Principle number="03" title={isArabic ? 'الاستثمار في المستقبل' : 'Building Long-Term Value'} />
        </div>
      </section>

      <section className="about-journey section-pad">
        <div className="about-journey-heading about-reveal">
          <span className="about-eyebrow">{isArabic ? '07 / رحلتنا' : '07 / OUR JOURNEY'}</span>
          <h2>{isArabic ? 'مسيرة من التطوير المستمر' : 'A Journey of Continued Development'}</h2>
        </div>
        <div className="about-journey-track about-reveal">
          <div className="about-journey-origin">
            <span className="about-journey-year" dir="ltr"><span className="figure-plus">+</span>150</span>
            <span>{isArabic ? 'مشروعًا تم تسليمها' : 'Projects delivered'}</span>
          </div>
          <div className="about-journey-line"><i /></div>
          <div className="about-journey-story">
            <span className="about-eyebrow">{isArabic ? 'مسار مستمر' : 'A CONTINUING STORY'}</span>
            <p>
              {isArabic
                ? 'منذ تأسيسها على يد ثلاثة مستثمرين عقاريين، واصلت بروة تطوير حضورها في السوق المصري. واليوم، تعكس محفظتها أكثر من 150 مشروعًا تم تسليمها، واستثمارات بحجم 3.2 مليار جنيه، إلى جانب 5 مشروعات تجارية جديدة.'
                : 'Founded by three real-estate investors, Barwa has continued to build its presence in Egypt. Its portfolio now reflects 150+ delivered projects, EGP 3.2 billion in investments, and 5 new commercial projects.'}
            </p>
          </div>
        </div>
      </section>

      <section className="about-developments section-pad">
        <div className="about-section-heading about-reveal">
          <span className="about-eyebrow">{isArabic ? '08 / مشروعات مختارة' : '08 / FEATURED DEVELOPMENTS'}</span>
          <h2>{isArabic ? 'وجهات بروة اليوم' : 'Barwa Destinations Today'}</h2>
        </div>
        <div className="about-developments-grid">
          {projectOrder.map((project, index) => (
            <Link className="about-development about-reveal" href={`/projects/${project.slug}`} key={project.slug}>
              <span className="about-development-image">
                <img src={`${project.assetDirectory}/hero.jpg`} alt="" loading="lazy" />
                <span className="about-development-index" dir="ltr">0{index + 1}</span>
                <span className="about-development-arrow"><MoveUpRight aria-hidden="true" /></span>
              </span>
              <span className="about-development-meta">{isArabic ? project.location : project.englishLocation}</span>
              <span className="about-development-title" dir="auto">{isArabic ? project.arabic : project.displayName}</span>
              <span className="about-development-type">{isArabic ? project.type : project.englishType}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="about-cta">
        <img src="/projects/central-mall/gallery-01.jpg" alt="" loading="lazy" />
        <div className="about-cta-shade" />
        <div className="about-cta-content about-reveal">
          <span className="about-eyebrow">{isArabic ? '09 / الخطوة القادمة' : '09 / THE NEXT STEP'}</span>
          <h2>{isArabic ? <>نبني اليوم<br />وجهات للمستقبل</> : <>Building Today.<br />Creating Destinations for Tomorrow.</>}</h2>
          <Link className="about-cta-projects" href="/projects">
            {isArabic ? 'اكتشف مشاريعنا' : 'Explore Our Projects'}
            {isArabic ? <ArrowUpLeft aria-hidden="true" /> : <ArrowUpRight aria-hidden="true" />}
          </Link>
          <div className="about-cta-contact">
            <Link href="/contact-us"><Mail aria-hidden="true" />{isArabic ? 'تواصل معنا' : 'Contact Us'}</Link>
            <a href={CONTACT.phoneHref}><Phone aria-hidden="true" />{isArabic ? 'اتصل بنا' : 'Call'} · {CONTACT.hotline}</a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}

function Pillar({ number, Icon, title, text }: { number: string; Icon: LucideIcon; title: string; text: string }) {
  return (
    <article className="about-pillar about-reveal">
      <div className="about-pillar-top"><span dir="ltr">{number}</span><Icon aria-hidden="true" /></div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  )
}

function EditorialRow({ number, image, imageAlt, eyebrow, title, text, imageFirst = false }: {
  number: string
  image: string
  imageAlt: string
  eyebrow: string
  title: string
  text: string
  imageFirst?: boolean
}) {
  return (
    <article className={`about-editorial-row ${imageFirst ? 'image-first' : ''}`}>
      <div className="about-editorial-image about-reveal"><img src={image} alt={imageAlt} loading="lazy" /></div>
      <div className="about-editorial-copy about-reveal">
        <span className="about-editorial-number" dir="ltr">{number}</span>
        <span className="about-eyebrow">{eyebrow}</span>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </article>
  )
}

function Principle({ number, title }: { number: string; title: string }) {
  return (
    <div className="about-principle about-reveal">
      <span dir="ltr">{number}</span>
      <h3>{title}</h3>
      <i aria-hidden="true" />
    </div>
  )
}
