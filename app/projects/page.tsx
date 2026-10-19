'use client'

import Link from 'next/link'
import { ArrowUpLeft, ArrowUpRight, Download, MapPin, MoveUpRight } from 'lucide-react'
import { LiveConstruction } from '@/components/live-construction'
import { ProjectInquiryForm } from '@/components/project-inquiry-form'
import { UsePills } from '@/components/use-pills'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { useLanguage } from '@/components/language-provider'
import { constructionStageLabel, projects } from '@/lib/projects'

const orderedProjects = [...projects].reverse()

export default function ProjectsPage() {
  const { language } = useLanguage()
  const isArabic = language === 'ar'

  return (
    <main className="site-shell projects-page" dir={isArabic ? 'rtl' : 'ltr'}>
      <SiteHeader variant="solid" />
      <section className="projects-page-intro section-pad">
        <div className="section-kicker"><span>01</span><i /><span>{isArabic ? 'وجهات بروة' : 'BARWA DESTINATIONS'}</span></div>
        <div className="projects-page-heading">
          <div>
            <span className="eyebrow">{isArabic ? 'بروة للتطوير العقاري' : 'BARWA DEVELOPMENTS'}</span>
            <h1>{isArabic ? 'مشاريعنا' : 'Our Projects'}</h1>
          </div>
          <p>
            {isArabic
              ? 'نصنع مساحات تلتقي فيها الحياة والعمل والاستثمار، بتفاصيل مدروسة وحضور لا يُنسى.'
              : 'We create spaces where life, work and investment meet, shaped by considered detail and a distinctive presence.'}
          </p>
        </div>
      </section>

      <section className="destination-list section-pad" aria-label={isArabic ? 'مشاريع بروة' : 'Barwa projects'}>
        {orderedProjects.map((project) => {
          const facts = project.facts.filter((fact) => fact.label !== 'الموقع').slice(0, 3)
          const highlights = (project.highlights ?? []).slice(0, 2)
          const name = isArabic ? project.arabic : project.displayName
          return (
            <article className="destination-card" key={project.slug}>
              <Link href={`/projects/${project.slug}`} className="destination-media" aria-label={isArabic ? `تفاصيل ${project.arabic}` : `${project.displayName} details`}>
                <img src={project.listingImage} alt={isArabic ? `واجهة ${name}` : `${name} facade`} style={{ objectPosition: project.imagePosition }} />
                <span className="stage-badge stage-badge-on-photo">{constructionStageLabel(project, isArabic)}</span>
              </Link>
              <div className="destination-copy">
                <h2>{name}</h2>
                <p className="destination-location"><MapPin aria-hidden="true" />{isArabic ? project.location : project.englishLocation}</p>
                <UsePills arabic={project.type} english={project.englishType} isArabic={isArabic} />
                {highlights.length > 0 && (
                  <ul className="destination-highlights">
                    {highlights.map((item) => (
                      <li key={item.english}>{isArabic ? item.arabic : item.english}</li>
                    ))}
                  </ul>
                )}
                <dl className="destination-facts">
                  {facts.map((fact) => (
                    <div key={fact.englishLabel}>
                      <dt>{isArabic ? fact.label : fact.englishLabel}</dt>
                      <dd>{isArabic ? fact.value : fact.englishValue}</dd>
                    </div>
                  ))}
                </dl>
                <div className="destination-actions">
                  <Link className="button-link" href={`/projects/${project.slug}`}>
                    {isArabic ? 'تفاصيل المشروع' : 'Project details'}
                    {isArabic ? <ArrowUpLeft aria-hidden="true" /> : <ArrowUpRight aria-hidden="true" />}
                  </Link>
                  <a className="project-brochure-link" href={project.brochure} download>
                    <Download aria-hidden="true" />
                    {isArabic ? 'تحميل البروشور' : 'Download brochure'}
                  </a>
                </div>
              </div>
            </article>
          )
        })}
      </section>

      <LiveConstruction items={orderedProjects} isArabic={isArabic} />

      <section className="projects-inquiry section-pad">
        <div className="projects-inquiry-image" aria-hidden="true" />
        <div className="projects-inquiry-content">
          <span className="eyebrow light">{isArabic ? 'بروة للتطوير العقاري' : 'BARWA DEVELOPMENTS'}</span>
          <h2>{isArabic ? 'اكتشف فرصتك القادمة معنا' : 'Discover your next opportunity with us'}</h2>
          <p>
            {isArabic
              ? 'استثمارات مدروسة، لمستقبل أكثر قيمة.'
              : 'Considered investments for a more valuable future.'}
          </p>
          <ProjectInquiryForm />
        </div>
      </section>

      <div className="projects-back-home">
        <Link className="text-link" href="/">
          {isArabic ? 'العودة إلى الرئيسية' : 'Back to home'} <MoveUpRight aria-hidden="true" />
        </Link>
      </div>
      <SiteFooter />
    </main>
  )
}
