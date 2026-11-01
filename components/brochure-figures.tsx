'use client'

import { BrandLockup } from './brand-lockup'
import { useLanguage } from './language-provider'

const joint = [
  {
    value: '3.2',
    plus: false,
    arabic: 'مليار جنيه حجم استثمارات',
    english: 'EGP billion in investments',
  },
  {
    value: '150',
    plus: true,
    arabic: 'مشروعًا مُسلَّمًا',
    english: 'Projects delivered',
  },
  {
    value: '1500',
    plus: true,
    arabic: 'عميل',
    english: 'Clients',
  },
]

export function BrochureFigures() {
  const { language } = useLanguage()
  const isArabic = language === 'ar'

  return (
    <div className="numbers-board">
      <section className="numbers-joint" aria-label={isArabic ? 'سابقة أعمال مشتركة' : 'Joint track record'}>
        <header className="numbers-head">
          <BrandLockup />
          <div>
            <strong>{isArabic ? 'سابقة أعمال مشتركة' : 'Joint track record'}</strong>
            <em>{isArabic ? 'بالشراكة مع الراجحي' : 'Barwa × Al Rajhi'}</em>
          </div>
        </header>
        <ol>
          {joint.map((figure) => (
            <li key={figure.value}>
              <b dir="ltr">
                {figure.plus && <span className="figure-plus">+</span>}
                {figure.value}
              </b>
              <span>{isArabic ? figure.arabic : figure.english}</span>
              <small>{isArabic ? 'بالشراكة مع الراجحي' : 'With Al Rajhi'}</small>
            </li>
          ))}
        </ol>
      </section>
      <section className="numbers-own" aria-label={isArabic ? 'محفظة بروة' : 'Barwa portfolio'}>
        <header className="numbers-head">
          <img className="numbers-own-logo" src="/brand/barwa%20logo-01.svg" alt="" />
          <div>
            <strong>{isArabic ? 'محفظة بروة الخاصة' : 'Barwa’s own portfolio'}</strong>
            <em>{isArabic ? 'مملوكة ومطوّرة من بروة' : 'Owned and developed by Barwa'}</em>
          </div>
        </header>
        <p>
          <b dir="ltr">5</b>
          <span>
            {isArabic ? 'مشروعات تجارية · إدارية · طبية' : 'Commercial · administrative · medical projects'}
            <small>{isArabic ? 'في شروق العاصمة والعاصمة الإدارية' : 'In Shorouk Capital and the New Administrative Capital'}</small>
          </span>
        </p>
      </section>
    </div>
  )
}
