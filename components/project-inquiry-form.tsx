'use client'

import { useState, type FormEvent } from 'react'
import { ArrowUpLeft, ArrowUpRight } from 'lucide-react'
import { useLanguage } from './language-provider'
import { CONTACT } from '@/lib/contact'

export function ProjectInquiryForm() {
  const { language } = useLanguage()
  const isArabic = language === 'ar'
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const subject = encodeURIComponent(isArabic ? 'استفسار عن مشاريع بروة' : 'Barwa projects inquiry')
    const message = encodeURIComponent([
      `${isArabic ? 'الاسم' : 'Name'}: ${formData.get('name')}`,
      `${isArabic ? 'رقم الهاتف' : 'Phone'}: ${formData.get('phone')}`,
      `${isArabic ? 'البريد الإلكتروني' : 'Email'}: ${formData.get('email')}`,
    ].join('\n'))

    window.location.href = `${CONTACT.emailHref}?subject=${subject}&body=${message}`
    setSubmitted(true)
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
      <button type="submit" className="button-link">
        {isArabic ? 'إرسال' : 'Send inquiry'}
        {isArabic ? <ArrowUpLeft aria-hidden="true" /> : <ArrowUpRight aria-hidden="true" />}
      </button>
      {submitted && (
        <p className="project-inquiry-status" role="status">
          {isArabic ? 'يرجى إكمال إرسال رسالتك عبر تطبيق البريد الإلكتروني.' : 'Please complete sending your message in your email application.'}
        </p>
      )}
    </form>
  )
}
