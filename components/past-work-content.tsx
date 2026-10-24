'use client'

import { SiteFooter } from './site-footer'
import { SiteHeader } from './site-header'
import { useLanguage } from './language-provider'

const photos = Array.from({ length: 12 }, (_, index) => {
  const number = String(index + 1).padStart(2, '0')
  return { src: `/past-work/pw${number}.jpg`, number: index + 1 }
})

function lightFrame(frame: HTMLElement) {
  frame.classList.remove('is-lit')
  void frame.offsetWidth
  frame.classList.add('is-lit')
  window.setTimeout(() => {
    if (!frame.matches(':hover')) frame.classList.remove('is-lit')
  }, 700)
}

export function PastWorkContent() {
  const { language } = useLanguage()
  const isArabic = language === 'ar'

  return (
    <main className="site-shell past-work-page" dir={isArabic ? 'rtl' : 'ltr'}>
      <SiteHeader variant="solid" />
      <section className="projects-page-intro section-pad" aria-labelledby="past-work-title">
        <div className="section-kicker">
          <span>01</span>
          <i />
          <span>{isArabic ? 'سابقة أعمالنا' : 'PREVIOUS WORK'}</span>
        </div>
        <div className="projects-page-heading">
          <div>
            <span className="eyebrow">{isArabic ? 'بروة للتطوير العقاري' : 'BARWA DEVELOPMENTS'}</span>
            <h1 id="past-work-title">{isArabic ? 'سابقة أعمالنا' : 'Previous Work'}</h1>
          </div>
          <p className="past-work-lead">
            {isArabic
              ? 'أكثر من 150 مشروعًا تم تسليمها لعملائنا في مدينة الشروق'
              : 'More than 150 projects delivered in El Shorouk City'}
          </p>
        </div>
      </section>

      <section className="section-pad past-work-gallery" aria-label={isArabic ? 'معرض سابقة الأعمال' : 'Previous work gallery'}>
        <ul className="past-work-grid">
          {photos.map((photo) => (
            <li key={photo.src}>
              <span
                className="past-work-frame"
                onPointerEnter={(event) => {
                  if (event.pointerType === 'mouse') lightFrame(event.currentTarget)
                }}
                onPointerDown={(event) => {
                  if (event.pointerType !== 'mouse') lightFrame(event.currentTarget)
                }}
                onPointerLeave={(event) => {
                  if (event.pointerType === 'mouse') event.currentTarget.classList.remove('is-lit')
                }}
              >
                <img
                  src={photo.src}
                  width={600}
                  height={600}
                  alt={isArabic ? `مشروع من سابقة أعمال بروة ${photo.number}` : `Barwa past project ${photo.number}`}
                />
              </span>
            </li>
          ))}
        </ul>
      </section>
      <SiteFooter />
    </main>
  )
}
