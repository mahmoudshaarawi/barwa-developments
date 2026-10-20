'use client'

import { useState, type FormEvent } from 'react'
import { ArrowUpLeft, ArrowUpRight } from 'lucide-react'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { useLanguage } from '@/components/language-provider'
import { egyptianPhoneError, submitBarwaForm } from '@/lib/forms'

const jobSuggestions = [
  { ar: 'مبيعات', en: 'Sales' },
  { ar: 'تسويق', en: 'Marketing' },
  { ar: 'إداري', en: 'Administration' },
  { ar: 'هندسي', en: 'Engineering' },
  { ar: 'خدمة عملاء', en: 'Customer service' },
  { ar: 'أخرى', en: 'Other' },
]

export function CareersContent() {
  const { language } = useLanguage()
  const isArabic = language === 'ar'
  const [job, setJob] = useState('')
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const nextPhoneError = egyptianPhoneError(phone, isArabic)
    setPhoneError(nextPhoneError)
    if (nextPhoneError) return
    const position = job.trim()
    setStatus('sending')
    const accepted = await submitBarwaForm({
      _subject: `طلب توظيف - ${position}`,
      name: String(formData.get('name') ?? '').trim(),
      phone,
      email: String(formData.get('email') ?? '').trim(),
      job: position,
      years_of_experience: String(formData.get('experience') ?? '').trim(),
      linkedin_or_cv: String(formData.get('profile') ?? '').trim() || '—',
      message: String(formData.get('message') ?? '').trim(),
    }).catch(() => false)
    setStatus(accepted ? 'sent' : 'error')
  }

  return (
    <main className="site-shell careers-page" dir={isArabic ? 'rtl' : 'ltr'}>
      <SiteHeader variant="overlay" />
      <section className="careers-hero" aria-labelledby="careers-title">
        <img src="/careers/team.png" alt={isArabic ? 'فريق بروة في مقر العمل' : 'The Barwa team at the office'} />
        <div className="careers-hero-shade" />
        <div className="careers-hero-copy">
          <span className="eyebrow light">{isArabic ? 'بروة للتطوير العقاري' : 'BARWA DEVELOPMENTS'}</span>
          <h1 id="careers-title">{isArabic ? 'التوظيف' : 'Careers'}</h1>
          <p>
            {isArabic
              ? 'نبني وجهات، ونبني معها فريقاً يهتم بالتفاصيل.'
              : 'We build destinations, and the team that cares for the details.'}
          </p>
        </div>
      </section>

      <section className="careers-sheet">
        <div className="careers-card">
          <header className="careers-card-head">
            <span className="eyebrow">{isArabic ? 'طلب التوظيف' : 'APPLICATION'}</span>
            <h2>{isArabic ? 'قدّم طلبك' : 'Send your application'}</h2>
            <p>
              {isArabic
                ? 'إذا كنت تبحث عن دور في بروة، اكتب الوظيفة التي تتقدم لها. سنتواصل معك على بياناتك.'
                : 'If you would like to work at Barwa, tell us the role you are applying for. We will contact you using the details you share.'}
            </p>
          </header>

          {status === 'sent' ? (
            <p className="contact-form-status is-success" role="status">
              {isArabic ? 'تم إرسال طلب التوظيف. سنتواصل معك قريباً.' : 'Your application has been sent. We will be in touch shortly.'}
            </p>
          ) : (
            <form className="careers-form" onSubmit={handleSubmit}>
              <div className="careers-fields">
                <label>
                  <span>{isArabic ? 'الاسم بالكامل' : 'Full name'}</span>
                  <input name="name" type="text" autoComplete="name" required />
                </label>
                <label>
                  <span>{isArabic ? 'رقم الهاتف' : 'Phone'}</span>
                  <input
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    dir="ltr"
                    pattern="01[0-9]{9}"
                    minLength={11}
                    maxLength={11}
                    placeholder="01xxxxxxxxx"
                    value={phone}
                    aria-invalid={phoneError ? true : undefined}
                    onChange={(event) => {
                      const value = event.target.value.trim()
                      setPhone(value)
                      const message = value ? egyptianPhoneError(value, isArabic) : ''
                      event.target.setCustomValidity(message)
                      if (phoneError) setPhoneError(message)
                    }}
                    onInvalid={(event) => {
                      const message = egyptianPhoneError(event.currentTarget.value.trim(), isArabic)
                      event.currentTarget.setCustomValidity(message)
                      setPhoneError(message)
                    }}
                    required
                  />
                </label>
                <label>
                  <span>{isArabic ? 'البريد الإلكتروني' : 'Email'}</span>
                  <input name="email" type="email" autoComplete="email" required />
                </label>
                <label>
                  <span>{isArabic ? 'الوظيفة المتقدم لها' : 'Position applied for'}</span>
                  <input name="job" list="career-jobs" value={job} onChange={(event) => setJob(event.target.value)} required />
                  <datalist id="career-jobs">
                    {jobSuggestions.map((item) => (
                      <option key={item.en} value={isArabic ? item.ar : item.en} />
                    ))}
                  </datalist>
                </label>
                <label>
                  <span>{isArabic ? 'سنوات الخبرة' : 'Years of experience'}</span>
                  <input name="experience" type="number" inputMode="numeric" min={0} max={60} required />
                </label>
                <label>
                  <span>{isArabic ? 'رابط لينكدإن أو السيرة الذاتية' : 'LinkedIn or CV link'}</span>
                  <input name="profile" type="url" inputMode="url" placeholder="https://" />
                  <small>{isArabic ? 'اختياري' : 'Optional'}</small>
                </label>
              </div>
              <label className="careers-message">
                <span>{isArabic ? 'رسالتك' : 'Message'}</span>
                <textarea name="message" rows={5} required />
              </label>
              {phoneError && <p className="contact-form-status is-error" role="alert">{phoneError}</p>}
              <button type="submit" className="careers-submit" disabled={status === 'sending'}>
                {status === 'sending' ? (isArabic ? 'جارٍ الإرسال' : 'Sending') : (isArabic ? 'إرسال الطلب' : 'Send application')}
                {isArabic ? <ArrowUpLeft aria-hidden="true" /> : <ArrowUpRight aria-hidden="true" />}
              </button>
              {status === 'error' && (
                <p className="contact-form-status is-error" role="alert">
                  {isArabic ? 'تعذر إرسال الطلب الآن. يرجى الاتصال على ١٧٥٨٢.' : 'The request could not be sent. Please call 17582.'}
                </p>
              )}
            </form>
          )}
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
