'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Language = 'ar' | 'en'

const LanguageContext = createContext<{
  language: Language
  toggleLanguage: () => void
} | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar')
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem('barwa-language')
    if (savedLanguage === 'en' || savedLanguage === 'ar') setLanguage(savedLanguage)
    setInitialized(true)
  }, [])

  useEffect(() => {
    if (!initialized) return
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    window.localStorage.setItem('barwa-language', language)
  }, [initialized, language])

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
