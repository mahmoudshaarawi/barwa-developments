'use client'

import Link from 'next/link'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTiktok, FaYoutube } from 'react-icons/fa6'
import { useLanguage } from './language-provider'
import { CONTACT } from '@/lib/contact'
import { projects } from '@/lib/projects'

const coloredLogoUrl = '/brand/barwa logo-01.svg'
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
  const projectLinks = [...projects].reverse()

  return (
    <footer className="site-footer" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="site-footer-main">
        <div className="site-footer-brand">
          <Link href="/" className="brand-lockup footer-brand" aria-label="Barwa Developments">
            <img className="brand-logo brand-logo-colored" src={coloredLogoUrl} alt="" aria-hidden="true" />
          </Link>
          <p>{isArabic ? 'نبني التميز، نصنع القيمة.' : 'Building excellence, creating value.'}</p>
          <nav className="footer-social-links" aria-label={isArabic ? 'تابعونا على منصات التواصل الاجتماعي' : 'Follow Barwa on social media'}>
            {socialLinks.map(({ label, href, Icon }) => (
              <a className="footer-social-link" href={href} key={label} target="_blank" rel="noopener noreferrer" aria-label={label}>
                <Icon aria-hidden="true" />
              </a>
            ))}
          </nav>
        </div>

        <nav className="site-footer-col" aria-label={isArabic ? 'تصفح الموقع' : 'Explore'}>
          <h2>{isArabic ? 'تصفح' : 'Explore'}</h2>
          <Link href="/">{isArabic ? 'الرئيسية' : 'Home'}</Link>
          <Link href="/about-us">{isArabic ? 'من نحن' : 'About'}</Link>
          <Link href="/projects">{isArabic ? 'مشاريعنا' : 'Projects'}</Link>
          <Link href="/installments">{isArabic ? 'احسب القسط' : 'Installments'}</Link>
          <Link href="/news">{isArabic ? 'الأخبار' : 'News'}</Link>
          <Link href="/contact-us">{isArabic ? 'تواصل معنا' : 'Contact'}</Link>
        </nav>

        <nav className="site-footer-col" aria-label={isArabic ? 'المشاريع' : 'Projects'}>
          <h2>{isArabic ? 'المشاريع' : 'Projects'}</h2>
          {projectLinks.map((project) => (
            <Link key={project.slug} href={`/projects/${project.slug}`}>
              {isArabic ? project.arabic : project.displayName}
            </Link>
          ))}
        </nav>

        <div className="site-footer-col">
          <h2>{isArabic ? 'تواصل' : 'Contact'}</h2>
          <a href={CONTACT.phoneHref} dir="ltr">{CONTACT.hotline}</a>
          <a href={CONTACT.emailHref}>{CONTACT.email}</a>
          <a href={CONTACT.websiteHref}>{CONTACT.websiteLabel}</a>
          <span>{isArabic ? CONTACT.officeAddress.arabic : CONTACT.officeAddress.english}</span>
        </div>
      </div>
      <div className="site-footer-bottom">
        <span>© 2026 BARWA DEVELOPMENTS</span>
        <a href={CONTACT.websiteHref}>{CONTACT.websiteLabel}</a>
      </div>
    </footer>
  )
}
