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

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  const navItems = [
    { label: isArabic ? 'الرئيسية' : 'Home', href: '/' },
    { label: isArabic ? 'من نحن' : 'About', href: '/about-us' },
    { label: isArabic ? 'مشاريعنا' : 'Projects', href: '/projects' },
    { label: isArabic ? 'احسب القسط' : 'Installments', href: '/installments' },
    { label: isArabic ? 'سابقة أعمالنا' : 'Portfolio', href: '/past-work' },
    { label: isArabic ? 'الأخبار' : 'News', href: '/news' },
    { label: isArabic ? 'تواصل معنا' : 'Contact', href: '/contact-us' },
  ]

  return (
    <>
      <header className={`site-header ${isScrolled ? 'is-scrolled' : ''} ${variant === 'solid' ? 'site-header-solid' : ''} ${menuOpen ? 'is-menu-open' : ''}`}>
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
            type="button"
            className="menu-button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? (isArabic ? 'إغلاق القائمة' : 'Close menu') : (isArabic ? 'فتح القائمة' : 'Open menu')}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="mobile-menu"
          dir={isArabic ? 'rtl' : 'ltr'}
          role="dialog"
          aria-modal="true"
          aria-label={isArabic ? 'القائمة' : 'Menu'}
          onClick={() => setMenuOpen(false)}
        >
          <span className="eyebrow">BARWA / NAVIGATION</span>
          <nav aria-label={isArabic ? 'التنقل الرئيسي' : 'Main navigation'}>
            {navItems.map((item, index) => (
              <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>
                <span>0{index + 1}</span>{item.label}
              </Link>
            ))}
          </nav>
          <div className="mobile-menu-footer">
            <button
              type="button"
              className="mobile-language"
              onClick={(event) => {
                event.stopPropagation()
                toggleLanguage()
              }}
            >
              {isArabic ? 'English' : 'العربية'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
