'use client'

import Link from 'next/link'
import { ArrowUpLeft, ArrowUpRight, Download, MoveUpRight } from 'lucide-react'
import { ProjectInquiryForm } from '@/components/project-inquiry-form'
import { UsePills } from '@/components/use-pills'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { useLanguage } from '@/components/language-provider'
import { projects, type Project } from '@/lib/projects'

function projectWordmark(displayName: string) {
  const parts = displayName.trim().split(/\s+/)
  if (parts.length > 1 && parts[parts.length - 1].toUpperCase() === 'MALL') {
    return { title: parts.slice(0, -1).join(' '), subtitle: 'MALL' }
  }
  return { title: displayName, subtitle: '' }
}

function currentStageLabel(project: Project, isArabic: boolean) {
  const stage = project.operations.constructionStages.find((item) => item.id === project.operations.currentConstructionStage)
  if (!stage) return ''
  return isArabic ? `مرحلة ${stage.titleAr}` : stage.titleEn
}

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
            <span className="eyebrow">{isArabic ? 'BARWA DEVELOPMENTS' : 'بروة للتطوير العقاري'}</span>
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
        {[...projects].reverse().map((project) => {
          const mark = projectWordmark(project.displayName)
          const facts = project.facts.filter((fact) => fact.label !== 'الموقع').slice(0, 3)
          return (
            <article className="destination-row" key={project.slug}>
              <Link href={`/projects/${project.slug}`} className="destination-media" aria-label={isArabic ? `تفاصيل ${project.arabic}` : `${project.displayName} details`}>
                <img src={project.listingImage} alt="" style={{ objectPosition: project.imagePosition }} />
                <span className="destination-mark" lang="en" dir="ltr">
                  <b>{mark.title}</b>
                  {mark.subtitle && <small>{mark.subtitle}</small>}
                </span>
                <span className="stage-badge stage-badge-on-photo">{currentStageLabel(project, isArabic)}</span>
              </Link>
              <div className="destination-copy">
                <span className="eyebrow" dir="ltr">{project.number} / 03</span>
                <h2>{isArabic ? project.arabic : project.displayName}</h2>
                <p className="destination-location">{isArabic ? project.location : project.englishLocation}</p>
                <UsePills arabic={project.type} english={project.englishType} isArabic={isArabic} />
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

      <section className="projects-inquiry section-pad">
        <div className="projects-inquiry-image" aria-hidden="true" />
        <div className="projects-inquiry-content">
          <span className="eyebrow light">{isArabic ? 'BARWA DEVELOPMENTS' : 'بروة للتطوير العقاري'}</span>
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
