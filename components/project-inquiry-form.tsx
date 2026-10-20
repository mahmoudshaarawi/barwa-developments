'use client'

import { useState, type FormEvent } from 'react'
import { ArrowUpLeft, ArrowUpRight } from 'lucide-react'
import { useLanguage } from './language-provider'
import { submitBarwaForm } from '@/lib/forms'

export function ProjectInquiryForm() {
  const { language } = useLanguage()
  const isArabic = language === 'ar'
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setStatus('sending')
    const accepted = await submitBarwaForm({
      _subject: 'استفسار عن مشاريع بروة',
      name: String(formData.get('name') ?? '').trim(),
      phone: String(formData.get('phone') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      project: 'Barwa projects — مشاريع بروة',
      message: '—',
    }).catch(() => false)
    setStatus(accepted ? 'sent' : 'error')
  }

  if (status === 'sent') {
    return (
      <p className="project-inquiry-status is-success" role="status">
        {isArabic ? 'تم إرسال استفسارك. سنتواصل معك قريباً.' : 'Your enquiry has been sent. We will be in touch shortly.'}
      </p>
    )
  }

  return (
    <form className="project-inquiry-form" onSubmit={handleSubmit} dir={isArabic ? 'rtl' : 'ltr'}>
      <label>
        <span>{isArabic ? 'الاسم' : 'Name'}</span>
        <input name="name" type="text" autoComplete="name" required />
      </label>
      <label>
        <span>{isArabic ? 'رقم الهاتف' : 'Phone'}</span>
        <input name="phone" type="tel" autoComplete="tel" required />
      </label>
      <label>
        <span>{isArabic ? 'البريد الإلكتروني' : 'Email'}</span>
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <button type="submit" className="button-link" disabled={status === 'sending'}>
        {status === 'sending' ? (isArabic ? 'جارٍ الإرسال' : 'Sending') : (isArabic ? 'إرسال' : 'Send inquiry')}
        {isArabic ? <ArrowUpLeft aria-hidden="true" /> : <ArrowUpRight aria-hidden="true" />}
      </button>
      {status === 'error' && (
        <p className="project-inquiry-status is-error" role="alert">
          {isArabic ? 'تعذر إرسال الطلب الآن. يرجى الاتصال على ١٧٥٨٢.' : 'The request could not be sent. Please call 17582.'}
        </p>
      )}
    </form>
  )
}
