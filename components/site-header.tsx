'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useLanguage } from './language-provider'

const whiteLogoUrl = '/brand/barwa logo w-01.svg'
const coloredLogoUrl = '/brand/barwa logo-01.svg'

type SiteHeaderProps = {
  scrolled?: boolean
  variant?: 'overlay' | 'solid'
}

export function SiteHeader({ scrolled: controlledScrolled, variant = 'overlay' }: SiteHeaderProps) {
  const [internalScrolled, setInternalScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { language, toggleLanguage } = useLanguage()
  const isScrolled = variant === 'solid' || (controlledScrolled ?? internalScrolled)
  const isArabic = language === 'ar'

  useEffect(() => {
    if (controlledScrolled !== undefined) return
    const onScroll = () => setInternalScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [controlledScrolled])

  const navItems = [
    { label: isArabic ? 'الرئيسية' : 'Home', href: '/' },
    { label: isArabic ? 'من نحن' : 'About', href: '/about-us' },
    { label: isArabic ? 'مشاريعنا' : 'Projects', href: '/projects' },
    { label: isArabic ? 'احسب القسط' : 'Installments', href: '/#installments' },
    { label: isArabic ? 'سابقة أعمالنا' : 'Portfolio', href: '/#contact' },
    { label: isArabic ? 'الأخبار' : 'News', href: '/#contact' },
    { label: isArabic ? 'تواصل معنا' : 'Contact', href: '/contact-us' },
  ]

  return (
    <>
      <header className={`site-header ${isScrolled ? 'is-scrolled' : ''} ${variant === 'solid' ? 'site-header-solid' : ''}`}>
        <Link href="/" className="brand-lockup" aria-label="Barwa Developments">
          <img className="brand-logo brand-logo-white" src={whiteLogoUrl} alt="" aria-hidden="true" />
          <img className="brand-logo brand-logo-colored" src={coloredLogoUrl} alt="" aria-hidden="true" />
        </Link>
        <nav className="desktop-nav" aria-label={isArabic ? 'التنقل الرئيسي' : 'Main navigation'}>
          {navItems.map((item) => <Link key={item.label} href={item.href}>{item.label}</Link>)}
        </nav>
        <div className="header-actions">
          <button
            className="language"
            onClick={toggleLanguage}
            aria-label={isArabic ? 'Switch to English' : 'التبديل إلى العربية'}
          >
            {isArabic ? 'EN' : 'عربي'}
          </button>
          <button
            className="menu-button"
            onClick={() => setMenuOpen(true)}
            aria-label={isArabic ? 'فتح القائمة' : 'Open menu'}
          >
            <Menu />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-menu" dir={isArabic ? 'rtl' : 'ltr'}>
          <button
            className="close-menu"
            onClick={() => setMenuOpen(false)}
            aria-label={isArabic ? 'إغلاق القائمة' : 'Close menu'}
          >
            <X />
          </button>
          <span className="eyebrow">BARWA / NAVIGATION</span>
          <nav aria-label={isArabic ? 'التنقل الرئيسي' : 'Main navigation'}>
            {navItems.map((item, index) => (
              <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>
                <span>0{index + 1}</span>{item.label}
              </Link>
            ))}
          </nav>
          <div className="mobile-menu-footer">
            <button onClick={toggleLanguage}>{isArabic ? 'English' : 'العربية'}</button>
          </div>
        </div>
      )}
    </>
  )
}
