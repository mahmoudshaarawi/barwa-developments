'use client'

import Link from 'next/link'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTiktok, FaYoutube } from 'react-icons/fa6'
import { useLanguage } from './language-provider'
import { CONTACT } from '@/lib/contact'

const whiteLogoUrl = '/brand/barwa logo w-01.svg'
const socialLinks = [
  { label: 'TikTok', href: 'https://www.tiktok.com/@barwadevelopments', Icon: FaTiktok },
  { label: 'Facebook', href: 'https://www.facebook.com/BarwaDevelopments/', Icon: FaFacebookF },
  { label: 'Instagram', href: 'https://www.instagram.com/barwadevelopments/', Icon: FaInstagram },
  { label: 'YouTube', href: 'https://www.youtube.com/@BarwaDevelopments', Icon: FaYoutube },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/barwadevelopments', Icon: FaLinkedinIn },
]

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
      <nav className="footer-social-links" aria-label={isArabic ? 'تابعونا على منصات التواصل الاجتماعي' : 'Follow Barwa on social media'}>
        {socialLinks.map(({ label, href, Icon }) => (
          <a
            className="footer-social-link"
            href={href}
            key={label}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
          >
            <Icon aria-hidden="true" />
          </a>
        ))}
      </nav>
      <div className="footer-bottom">
        <span>© 2026 BARWA DEVELOPMENTS</span>
        <span>BarwaDevelopments.com</span>
        <span>AR <b>·</b> EN</span>
      </div>
    </footer>
  )
}
