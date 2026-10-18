'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { useLanguage } from '@/components/language-provider'
import { newsStories, type NewsCategory, type NewsStory } from '@/data/news'

const filters: { id: 'all' | NewsCategory; ar: string; en: string }[] = [
  { id: 'all', ar: 'الكل', en: 'All' },
  { id: 'partnerships', ar: 'شراكات', en: 'Partnerships' },
  { id: 'contracts', ar: 'تعاقدات', en: 'Contracts' },
  { id: 'appointments', ar: 'تعيينات', en: 'Appointments' },
]

function formatDate(date: string, language: string) {
  return new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
}

function sourceCount(story: NewsStory, isArabic: boolean) {
  const count = story.sources.length
  if (isArabic) return count === 1 ? 'مصدر واحد' : `${count} مصادر`
  return count === 1 ? '1 source' : `${count} sources`
}

export function NewsListing() {
  const { language } = useLanguage()
  const isArabic = language === 'ar'
  const [filter, setFilter] = useState<(typeof filters)[number]['id']>('all')
  const visible = newsStories.filter((story) => filter === 'all' || story.category === filter)
  const featured = filter === 'all' ? visible[0] : undefined
  const rest = filter === 'all' ? visible.slice(1) : visible

  return (
    <main className="site-shell news-page" dir={isArabic ? 'rtl' : 'ltr'}>
      <SiteHeader variant="solid" />
      <section className="news-intro section-pad">
        <div className="section-kicker"><span>01</span><i /><span>{isArabic ? 'تغطية صحفية' : 'PRESS'}</span></div>
        <div className="news-heading">
          <h1>{isArabic ? 'الأخبار' : 'News'}</h1>
          <p>
            {isArabic
              ? 'ما نشرته الصحف عن بروة: التعاقدات، الشراكات، والتعيينات، مع روابط التغطية الأصلية.'
              : 'Published coverage of Barwa: contracts, partnerships and appointments, with links to the original outlets.'}
          </p>
        </div>
        <div className="news-filters" role="tablist" aria-label={isArabic ? 'تصنيف الأخبار' : 'News categories'}>
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={filter === item.id}
              className={filter === item.id ? 'is-active' : ''}
              onClick={() => setFilter(item.id)}
            >
              {isArabic ? item.ar : item.en}
            </button>
          ))}
        </div>
      </section>

      <section className="news-body section-pad" aria-label={isArabic ? 'قصص الأخبار' : 'News stories'}>
        {visible.length === 0 && (
          <p className="news-empty">{isArabic ? 'لا توجد أخبار في هذا التصنيف.' : 'No stories in this category.'}</p>
        )}
        {featured && (
          <article className="news-feature">
            <Link href={`/news/${featured.slug}`} className="news-feature-media">
              <img src={featured.image} alt={isArabic ? featured.imageAltAr : featured.imageAltEn} />
            </Link>
            <div className="news-feature-copy">
              <p className="news-meta">
                <span>{formatDate(featured.date, language)}</span>
                <i />
                <span>{isArabic ? featured.categoryAr : featured.categoryEn}</span>
              </p>
              <h2><Link href={`/news/${featured.slug}`}>{isArabic ? featured.titleAr : featured.titleEn}</Link></h2>
              <p>{isArabic ? featured.summaryAr : featured.summaryEn}</p>
              <Link className="text-link" href={`/news/${featured.slug}`}>
                {isArabic ? `اقرأ الخبر · ${sourceCount(featured, true)}` : `Read the story · ${sourceCount(featured, false)}`}
              </Link>
            </div>
          </article>
        )}
        {rest.length > 0 && (
          <div className="news-grid">
            {rest.map((story) => (
              <article className="news-card" key={story.slug}>
                <Link href={`/news/${story.slug}`} className="news-card-media">
                  <img src={story.image} alt={isArabic ? story.imageAltAr : story.imageAltEn} />
                </Link>
                <div className="news-card-copy">
                  <p className="news-meta">
                    <span>{formatDate(story.date, language)}</span>
                    <i />
                    <span>{isArabic ? story.categoryAr : story.categoryEn}</span>
                  </p>
                  <h2><Link href={`/news/${story.slug}`}>{isArabic ? story.titleAr : story.titleEn}</Link></h2>
                  <p>{isArabic ? story.summaryAr : story.summaryEn}</p>
                  <span className="news-count">{sourceCount(story, isArabic)}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <SiteFooter />
    </main>
  )
}
