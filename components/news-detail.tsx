'use client'

import Link from 'next/link'
import { ArrowUpLeft, ArrowUpRight } from 'lucide-react'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { useLanguage } from '@/components/language-provider'
import type { NewsStory } from '@/data/news'

function formatDate(date: string, language: string) {
  return new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
}

export function NewsDetail({ story }: { story: NewsStory }) {
  const { language } = useLanguage()
  const isArabic = language === 'ar'

  return (
    <main className="site-shell news-detail-page" dir={isArabic ? 'rtl' : 'ltr'}>
      <SiteHeader variant="solid" />
      <article>
        <header className="news-detail-hero">
          <img src={story.image} alt={isArabic ? story.imageAltAr : story.imageAltEn} />
        </header>
        <div className="news-detail-sheet section-pad">
          <Link className="news-back" href="/news">{isArabic ? 'الأخبار' : 'News'}</Link>
          <p className="news-meta">
            <span>{formatDate(story.date, language)}</span>
            <i />
            <span>{isArabic ? story.categoryAr : story.categoryEn}</span>
          </p>
          <h1>{isArabic ? story.titleAr : story.titleEn}</h1>
          <p className="news-detail-summary">{isArabic ? story.summaryAr : story.summaryEn}</p>
          <section className="news-sources" aria-labelledby="news-sources-title">
            <h2 id="news-sources-title">{isArabic ? 'نُشر في' : 'Published in'}</h2>
            <ul>
              {story.sources.map((source) => (
                <li key={source.href}>
                  <a href={source.href} target="_blank" rel="noopener noreferrer">
                    <span>{source.name}</span>
                    {isArabic ? <ArrowUpLeft aria-hidden="true" /> : <ArrowUpRight aria-hidden="true" />}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </article>
      <SiteFooter />
    </main>
  )
}
