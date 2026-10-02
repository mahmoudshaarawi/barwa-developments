'use client'

import { Mail, MapPin, Phone } from 'lucide-react'
import { SiteFooter } from './site-footer'
import { SiteHeader } from './site-header'
import { useLanguage } from './language-provider'
import { ContactUsForm } from './contact-us-form'
import { CONTACT } from '@/lib/contact'

export function ContactUsContent() {
  const { language } = useLanguage()
  const isArabic = language === 'ar'

  return (
    <main className="site-shell contact-page" dir={isArabic ? 'rtl' : 'ltr'}>
      <SiteHeader variant="overlay" />

      <section className="contact-page-hero">
        <img src="/projects/central-mall/hero.jpg" alt="" fetchPriority="high" />
        <div className="contact-page-hero-shade" />
        <div className="contact-page-hero-copy">
          <span className="contact-page-eyebrow">BARWA DEVELOPMENTS</span>
          <h1>{isArabic ? 'تواصل معنا' : 'Contact Us'}</h1>
          <p>{isArabic
            ? 'نحن هنا للإجابة عن استفساراتك ومساعدتك في اكتشاف المشروع المناسب لك.'
            : 'We are here to answer your questions and help you discover the right project for you.'}</p>
        </div>
      </section>

      <section className="contact-main section-pad">
        <div className="contact-details">
          <span className="contact-page-eyebrow">{isArabic ? 'تواصل مع بروة' : 'CONNECT WITH BARWA'}</span>
          <h2>{isArabic ? 'دعنا نبدأ الحديث' : 'Let’s Start a Conversation'}</h2>
          <p className="contact-details-intro">{isArabic
            ? 'يسعدنا مساعدتك والإجابة عن استفساراتك حول مشروعاتنا.'
            : 'We would be pleased to help and answer your questions about our developments.'}</p>

          <a className="contact-hotline" href={CONTACT.phoneHref} dir="ltr">
            <span>{isArabic ? 'الرقم الموحد' : 'Unified Hotline'}</span>
            <strong>{CONTACT.hotline}</strong>
            <span className="contact-hotline-action"><Phone aria-hidden="true" />{isArabic ? 'اتصل بنا' : 'Call us'}</span>
          </a>

          <div className="contact-detail-list">
            <div className="contact-detail-item">
              <span className="contact-detail-icon"><MapPin aria-hidden="true" /></span>
              <div>
                <span>{isArabic ? 'عنوان المكتب' : 'Office Address'}</span>
                <p>{isArabic ? CONTACT.officeAddress.arabic : CONTACT.officeAddress.english}</p>
              </div>
            </div>
            <a className="contact-detail-item" href={CONTACT.emailHref}>
              <span className="contact-detail-icon"><Mail aria-hidden="true" /></span>
              <div>
                <span>{isArabic ? 'البريد الإلكتروني' : 'Email'}</span>
                <p dir="ltr">{CONTACT.email}</p>
              </div>
            </a>
          </div>
        </div>

        <div className="contact-form-panel">
          <span className="contact-page-eyebrow">{isArabic ? 'نحن جاهزون للمساعدة' : 'WE’RE HERE TO HELP'}</span>
          <h2>{isArabic ? 'أرسل استفسارك' : 'Send an Enquiry'}</h2>
          <ContactUsForm />
        </div>
      </section>

      <section className="contact-location section-pad">
        <div className="contact-location-heading">
          <span className="contact-page-eyebrow">{isArabic ? 'موقعنا' : 'OUR LOCATION'}</span>
          <h2>{isArabic ? 'تجدنا في القاهرة' : 'Find Us in Cairo'}</h2>
        </div>
        <div className="contact-location-address">
          <MapPin aria-hidden="true" />
          <p>{isArabic ? CONTACT.officeAddress.arabic : CONTACT.officeAddress.english}</p>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
