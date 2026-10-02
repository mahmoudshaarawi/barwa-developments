'use client'

import Link from 'next/link'
import { ArrowUpLeft, ArrowUpRight, Mail, MoveUpRight, Phone } from 'lucide-react'
import { ProjectInquiryForm } from '@/components/project-inquiry-form'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { useLanguage } from '@/components/language-provider'
import { CONTACT } from '@/lib/contact'
import { projects } from '@/lib/projects'

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

      <section className="projects-listing section-pad" aria-label={isArabic ? 'مشاريع بروة' : 'Barwa projects'}>
        <div className="projects-listing-grid">
          {[...projects].reverse().map((project) => (
            <article className="listing-project-card" key={project.slug}>
              <Link href={`/projects/${project.slug}`} className="listing-project-image" aria-label={isArabic ? `تفاصيل ${project.arabic}` : `${project.name} project details`}>
                <img
                  src={project.listingImage}
                  alt=""
                  loading="lazy"
                  style={{ objectPosition: project.imagePosition }}
                />
                <span className="listing-project-number">{project.number}</span>
              </Link>
              <div className="listing-project-content">
                <span className="eyebrow">{isArabic ? project.location : project.englishLocation}</span>
                <h2 dir="auto">{isArabic ? project.arabic : project.displayName}</h2>
                <span className="listing-project-type">{isArabic ? project.type : project.englishType}</span>
                <p>{isArabic ? project.description : project.englishDescription}</p>
                <div className="listing-project-actions">
                  <div className="listing-project-contact">
                    <a
                      className="listing-contact-icon"
                      href={CONTACT.phoneHref}
                      aria-label={isArabic ? `اتصل للاستفسار عن ${project.arabic}` : `Call about ${project.displayName}`}
                      title={isArabic ? 'اتصال' : 'Call'}
                    >
                      <Phone aria-hidden="true" />
                    </a>
                    <Link
                      className="listing-contact-icon"
                      href={`/contact-us?project=${project.slug}`}
                      aria-label={isArabic ? `أرسل استفسارًا عن ${project.arabic}` : `Enquire about ${project.displayName}`}
                      title={isArabic ? 'استفسار' : 'Enquiry'}
                    >
                      <Mail aria-hidden="true" />
                    </Link>
                  </div>
                  <Link className="listing-project-link" href={`/projects/${project.slug}`}>
                    {isArabic ? 'تفاصيل المشروع' : 'Project Details'}
                    {isArabic ? <ArrowUpLeft aria-hidden="true" /> : <ArrowUpRight aria-hidden="true" />}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
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
