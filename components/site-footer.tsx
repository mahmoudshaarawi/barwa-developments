'use client'

import Link from 'next/link'
import { useLanguage } from './language-provider'
import { CONTACT } from '@/lib/contact'

const whiteLogoUrl = '/brand/barwa logo w-01.svg'

export function SiteFooter() {
  const { language } = useLanguage()
  const isArabic = language === 'ar'

  return (
    <footer dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="footer-top">
        <Link href="/" className="brand-lockup footer-brand" aria-label="Barwa Developments">
          <img className="brand-logo brand-logo-white" src={whiteLogoUrl} alt="" aria-hidden="true" />
        </Link>
        <p>{isArabic ? <>نبني التميز<br />نصنع القيمة</> : <>Building Excellence<br />Creating Value</>}</p>
        <div className="footer-contact">
          <span>{isArabic ? CONTACT.officeAddress.arabic : CONTACT.officeAddress.english}</span>
          <a href={CONTACT.phoneHref}>{CONTACT.hotline}</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 BARWA DEVELOPMENTS</span>
        <span>BarwaDevelopments.com</span>
        <span>AR <b>·</b> EN</span>
      </div>
    </footer>
  )
}
