'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { documentCopy, type Language } from '@/lib/seo'

export type { Language }

const LanguageContext = createContext<{
  language: Language
  toggleLanguage: () => void
} | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [language, setLanguage] = useState<Language>('ar')
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem('barwa-language')
    if (savedLanguage === 'en' || savedLanguage === 'ar') setLanguage(savedLanguage)
    setInitialized(true)
  }, [])

  useEffect(() => {
    if (!initialized) return
    const apply = () => {
      document.documentElement.lang = language
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
      const copy = documentCopy(pathname, language)
      document.title = copy.title
      const description = document.querySelector('meta[name="description"]')
      if (description) description.setAttribute('content', copy.description)
    }
    apply()
    const timers = [0, 50, 300].map((delay) => window.setTimeout(apply, delay))
    window.localStorage.setItem('barwa-language', language)
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [initialized, language, pathname])

  const toggleLanguage = () => setLanguage((current) => current === 'ar' ? 'en' : 'ar')

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider')
  return context
}
