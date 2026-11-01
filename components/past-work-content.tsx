'use client'

import { BrandLockup } from './brand-lockup'
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
          <div className="past-work-intro">
            <BrandLockup />
            <p className="past-work-lead">
              {isArabic
                ? 'أعمال سكنية تمتد عبر مختلف أحياء مدينة الشروق؛ من الحي الثالث شرق وحي النادي إلى الحي الأول والمنطقة الخامسة وغيرها، نُفّذت بالشراكة مع الراجحي للمشروعات العمرانية.'
                : 'Residential work across the districts of El Shorouk — from the Third District East and the Club District to the First District, the Fifth District and beyond — delivered in partnership with Al Rajhi for Urban Projects.'}
            </p>
            <ul className="past-work-stats">
              <li><b dir="ltr"><span className="figure-plus">+</span>150</b><span>{isArabic ? 'مشروعًا سكنيًا تم تسليمه' : 'Residential projects delivered'}</span></li>
              <li><b dir="ltr"><span className="figure-plus">+</span>1500</b><span>{isArabic ? 'عميل يثقون بنا' : 'Clients who trust us'}</span></li>
            </ul>
          </div>
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
