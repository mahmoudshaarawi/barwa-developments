'use client'

import { useLanguage } from './language-provider'

const figures = [
  {
    value: '3.2',
    plus: false,
    arabic: 'مليار جنيه حجم الاستثمارات',
    english: 'EGP 3.2 bn in investments',
    lockup: 'EGP 3.2 BN IN INVESTMENTS',
  },
  {
    value: '150',
    plus: true,
    arabic: 'مشروعًا تم تسليمها',
    english: 'Projects delivered',
    lockup: '150+ PROJECTS DELIVERED',
  },
  {
    value: '5',
    plus: false,
    arabic: 'مشروعات تجارية جديدة',
    english: 'New commercial projects',
    lockup: 'NEW COMMERCIAL PROJECTS',
  },
]

export function BrochureFigures() {
  const { language } = useLanguage()
  const isArabic = language === 'ar'

  return (
    <ol className="brochure-figures">
      {figures.map((figure) => (
        <li key={figure.lockup}>
          <strong dir="ltr">
            {figure.plus && <span className="figure-plus">+</span>}
            {figure.value}
          </strong>
          <span className="figure-label">{isArabic ? figure.arabic : figure.english}</span>
          <small className="figure-lockup" lang="en" dir="ltr">{figure.lockup}</small>
        </li>
      ))}
    </ol>
  )
}
