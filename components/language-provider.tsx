'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { newsStories } from '@/data/news'
import { projects } from '@/lib/projects'

export type Language = 'ar' | 'en'

const pageCopy = {
  ar: {
    home: {
      title: 'بروة للتطوير العقاري | نبني التميز، نصنع القيمة',
      description: 'بروة للتطوير العقاري — وجهات استثنائية تصنع قيمة حقيقية لأجيال اليوم والغد.',
    },
    about: {
      title: 'من نحن | بروة للتطوير العقاري',
      description: 'تعرف على بروة للتطوير العقاري ونهجها في تطوير وجهات عقارية تجمع بين المواقع المميزة والجودة والقيمة.',
    },
    projects: {
      title: 'مشاريعنا | بروة للتطوير العقاري',
      description: 'وجهات بروة: بروة مول وسنترال مول وهاب ٥، مع مرحلة التنفيذ والبروشور وبث الإنشاءات.',
    },
    installments: {
      title: 'احسب القسط | بروة للتطوير العقاري',
      description: 'اختر مشروع بروة والنوع والمساحة، ثم أرسل اسمك ورقم هاتفك لنرسل حسبة القسط.',
    },
    news: {
      title: 'الأخبار | بروة للتطوير العقاري',
      description: 'تغطية صحفية منشورة عن تعاقدات بروة وشراكاتها وتعييناتها.',
    },
    contact: {
      title: 'تواصل معنا | بروة للتطوير العقاري',
      description: 'تواصل مع بروة للتطوير العقاري عبر الرقم الموحد 17582 أو أرسل استفسارك عن مشروعاتنا.',
    },
  },
  en: {
    home: {
      title: 'Barwa Developments | Building excellence, creating value',
      description: 'Barwa Developments — exceptional destinations that create real value for today’s and tomorrow’s generations.',
    },
    about: {
      title: 'About | Barwa Developments',
      description: 'Learn about Barwa Developments and its approach to destinations that combine distinguished locations, quality and value.',
    },
    projects: {
      title: 'Projects | Barwa Developments',
      description: 'Barwa destinations: Barwa Mall, Central Mall and HUB 5, with construction stage, brochure and live site view.',
    },
    installments: {
      title: 'Installments | Barwa Developments',
      description: 'Choose a Barwa project, unit type and area, then send your name and phone so we can return the estimate.',
    },
    news: {
      title: 'News | Barwa Developments',
      description: 'Published coverage of Barwa contracts, partnerships and appointments.',
    },
    contact: {
      title: 'Contact | Barwa Developments',
      description: 'Contact Barwa Developments on hotline 17582 or send an enquiry about our projects.',
    },
  },
} as const

function documentCopy(pathname: string, language: Language) {
  const pack = pageCopy[language]
  if (pathname.startsWith('/news/')) {
    const story = newsStories.find((item) => item.slug === pathname.split('/')[2])
    if (story) {
      return language === 'ar'
        ? { title: `${story.titleAr} | بروة للتطوير العقاري`, description: story.summaryAr }
        : { title: `${story.titleEn} | Barwa Developments`, description: story.summaryEn }
    }
  }
  if (pathname.startsWith('/projects/')) {
    const project = projects.find((item) => item.slug === pathname.split('/')[2])
    if (project) {
      return language === 'ar'
        ? { title: `${project.arabic} | بروة للتطوير العقاري`, description: project.description }
        : { title: `${project.displayName} | Barwa Developments`, description: project.englishDescription }
    }
  }
  if (pathname.startsWith('/about-us')) return pack.about
  if (pathname.startsWith('/projects')) return pack.projects
  if (pathname.startsWith('/installments')) return pack.installments
  if (pathname.startsWith('/news')) return pack.news
  if (pathname.startsWith('/contact-us')) return pack.contact
  return pack.home
}

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
