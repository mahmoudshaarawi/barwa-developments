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
          <h3>{isArabic ? 'متجذّرة في إرث من التميّز الإنشائي' : 'Rooted in a record of building excellence'}</h3>
          <p>
            {isArabic
              ? 'بروة للتطوير العقاري مطوّر عقاري مصري تأسّس في عام 2008 على يد ثلاثة من رواد الاستثمار العقاري أصحاب الرؤية، بهدف تقديم أفضل موقع وأعلى جودة وأفضل استثمار.'
              : 'Barwa Developments is an Egyptian developer founded in 2008 by three visionary real-estate investors, to offer the best location, the highest quality and the strongest investment.'}
          </p>
          <p>
            {isArabic
              ? 'انطلقت بروة من القاهرة وتحديدًا من شرق القاهرة، وتحوّلت عبر سنوات من العمل والتسليم إلى منارة للرقيّ والفخامة في المشهد العقاري المصري.'
              : 'Barwa started in Cairo, and in East Cairo in particular, and through years of work and delivery became a mark of refinement in the Egyptian real-estate landscape.'}
          </p>
          <p>
            {isArabic
              ? 'وبالشراكة مع الراجحي للمشروعات العمرانية تمتد سابقة أعمالنا إلى أكثر من 150 مشروعًا تم تسليمها وحجم استثمارات يبلغ 3.2 مليار جنيه. واليوم تطلق بروة 5 مشروعات تجارية وإدارية وطبية في أميز مواقع مدينة الشروق بشرق القاهرة.'
              : 'In partnership with Al Rajhi for Urban Projects, the track record extends to more than 150 delivered projects and EGP 3.2 billion in investments. Today Barwa is launching 5 commercial, administrative and medical projects in prime locations in El Shorouk, East Cairo.'}
          </p>
        </div>
      </section>

      <section className="about-ceo" aria-labelledby="ceo-message-title">
        <figure className="about-ceo-photo about-reveal">
          <span className="about-ceo-frame">
            <img
              src="/about/ceo.jpg"
              width={829}
              height={1200}
              alt={isArabic ? 'م. عبد الفتاح محمد، الرئيس التنفيذي لبروة للتطوير العقاري' : 'Eng. Abdelfattah Mohamed, CEO of Barwa Developments'}
              loading="lazy"
            />
          </span>
        </figure>
        <div className="about-ceo-copy about-reveal">
          <h2 id="ceo-message-title" className="about-eyebrow">{isArabic ? 'كلمة الرئيس التنفيذي' : 'CEO MESSAGE'}</h2>
          <blockquote className="about-ceo-quote">
            <p>
              {isArabic
                ? 'لا نبني جدرانًا تُضاف إلى المدينة، بل نصنع عناوين تُضيف إليها قيمة.'
                : 'We do not build walls to add to the city. We create addresses that add value to it.'}
            </p>
          </blockquote>
          <p>
            {isArabic
              ? 'منذ عام 2008، آمنّا في بروة بأن العقار التجاري ليس مساحاتٍ تُباع، بل منظومة متكاملة تصنع الفرص وتمنح الأعمال مكانتها. ومن شرق القاهرة — حيث الكثافة السكانية والنمو العمراني المتسارع — اخترنا أن نؤسّس لجيل جديد من الوجهات التجارية والإدارية والطبية التي تليق بطموح عملائنا وتواكب نمو المدينة.'
              : 'Since 2008 we have believed that commercial property is not space to be sold, but a complete system that creates opportunity and gives businesses their place. From East Cairo — where population density and rapid urban growth come together — we chose to establish a new generation of commercial, administrative and medical destinations worthy of our clients’ ambition and the city’s growth.'}
          </p>
          <p>
            {isArabic
              ? 'رؤيتنا أن يكون اسم بروة مرادفًا للثقة؛ ثقةٌ تبدأ من اختيار الموقع بدقة، وتمتد إلى تصميم معماري يعظّم العائد، وتنفيذ لا يقبل التنازل عن الجودة، والتزام بالتسليم يحوّل الوعد إلى واقع. لذلك نتابع كل تفصيلة بأنفسنا، فثقة المستثمر هي رأس مالنا الحقيقي.'
              : 'Our vision is that the name Barwa stands for trust: trust that begins with choosing the location precisely, extends to architecture that maximises return, execution that does not compromise on quality, and a commitment to delivery that turns a promise into reality. That is why we follow every detail ourselves. An investor’s trust is our real capital.'}
          </p>
          <p>
            {isArabic
              ? 'وما كنّا لنبلغ ما بلغناه دون شركاء نعتز بهم؛ من العلامات التجارية والمؤسسات الرائدة التي اختارت مشروعاتنا، إلى شركائنا في مسيرة البناء. معًا نمضي نحو مرحلة جديدة عنوانها التميّز، ووجهتها مستقبلٌ أكثر ازدهارًا لمدينتنا ولكل من وضع ثقته فينا.'
              : 'We would not have reached this point without partners we are proud of — from the brands and leading institutions that chose our projects, to our partners in building. Together we move toward a new stage whose title is distinction, and whose destination is a more prosperous future for our city and for everyone who placed their trust in us.'}
          </p>
          <p>{isArabic ? 'هذا عهدنا… وهذه بروة.' : 'This is our pledge. And this is Barwa.'}</p>
          <p className="about-ceo-sign">
            <strong>{isArabic ? 'م. عبد الفتاح محمد' : 'Eng. Abdelfattah Mohamed'}</strong>
            <span>{isArabic ? 'الرئيس التنفيذي' : 'CEO'}</span>
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
          <span className="about-eyebrow">{isArabic ? '04 / لماذا بروة' : '04 / WHY BARWA'}</span>
          <h2>{isArabic ? 'لماذا بروة؟' : 'Why Barwa?'}</h2>
        </div>
        <div className="about-pillars">
          <Pillar number="01" Icon={Building2} title={isArabic ? 'تخصص واضح' : 'A clear specialisation'} text={isArabic ? 'نتخصص في المباني التجارية والإدارية والطبية في شرق القاهرة.' : 'We specialise in commercial, administrative and medical buildings in East Cairo.'} />
          <Pillar number="02" Icon={MapPin} title={isArabic ? 'وسط كثافة سكنية' : 'Inside dense residential areas'} text={isArabic ? 'مشروعاتنا داخل مناطق سكنية كثيفة في مدينة الشروق بشرق القاهرة.' : 'Our projects sit inside dense residential districts in El Shorouk, East Cairo.'} />
          <Pillar number="03" Icon={Layers3} title={isArabic ? 'مساحات مرنة' : 'Flexible unit sizes'} text={isArabic ? 'وحدات بمساحات متنوعة تلائم النشاط التجاري والإداري والطبي.' : 'Units in a range of sizes for commercial, administrative and medical use.'} />
          <Pillar number="04" Icon={MapPin} title={isArabic ? 'على الطرق الرئيسية' : 'On the main roads'} text={isArabic ? 'مواقع على الطرق الرئيسية داخل مدينة الشروق بشرق القاهرة.' : 'Locations on the main roads of El Shorouk, East Cairo.'} />
          <Pillar number="05" Icon={Building2} title={isArabic ? 'استخدامات في مبنى واحد' : 'Mixed uses in one building'} text={isArabic ? 'نشاط تجاري وإداري وطبي يجتمع في المبنى نفسه.' : 'Commercial, administrative and medical uses together in the same building.'} />
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
            <span>{isArabic ? 'مشروعًا سكنيًا بالشراكة مع الراجحي' : 'Residential projects with Al Rajhi'}</span>
          </div>
          <div className="about-journey-line"><i /></div>
          <div className="about-journey-story">
            <span className="about-eyebrow">{isArabic ? 'مسار مستمر' : 'A CONTINUING STORY'}</span>
            <p>
              {isArabic
                ? 'منذ 2008 واصلت بروة بناء حضورها. سابقة الأعمال السكنية — أكثر من 150 مشروعًا و3.2 مليار جنيه وأكثر من 1500 عميل — تمت بالشراكة مع الراجحي للمشروعات العمرانية. ومحفظة بروة الخاصة اليوم 5 مشروعات تجارية وإدارية وطبية.'
                : 'Since 2008 Barwa has kept building its presence. The residential record — more than 150 projects, EGP 3.2 billion and more than 1,500 clients — was delivered with Al Rajhi for Urban Projects. Barwa’s own portfolio today is 5 commercial, administrative and medical projects.'}
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
