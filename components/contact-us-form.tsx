'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { ArrowUpLeft, ArrowUpRight } from 'lucide-react'
import { useLanguage } from './language-provider'
import { CONTACT } from '@/lib/contact'
import { projects } from '@/lib/projects'

const projectChoices = ['barwa-mall', 'central-mall', 'hub5-mall']
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter((project): project is (typeof projects)[number] => Boolean(project))
const projectSlugs = new Set(projectChoices.map((project) => project.slug))

export function ContactUsForm() {
  const { language } = useLanguage()
  const isArabic = language === 'ar'
  const [selectedProject, setSelectedProject] = useState('general-inquiry')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const requestedProject = new URLSearchParams(window.location.search).get('project')
    if (requestedProject && projectSlugs.has(requestedProject)) {
      setSelectedProject(requestedProject)
    }
  }, [])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const selected = projects.find((project) => project.slug === selectedProject)
    const projectName = selected
      ? isArabic ? selected.arabic : selected.displayName
      : isArabic ? 'استفسار عام' : 'General Inquiry'
    const subject = encodeURIComponent(isArabic ? `استفسار عن ${projectName}` : `Inquiry about ${projectName}`)
    const body = encodeURIComponent([
      `${isArabic ? 'الاسم' : 'Name'}: ${formData.get('name')}`,
      `${isArabic ? 'رقم الهاتف' : 'Phone'}: ${formData.get('phone')}`,
      `${isArabic ? 'البريد الإلكتروني' : 'Email'}: ${formData.get('email')}`,
      `${isArabic ? 'المشروع' : 'Project'}: ${projectName}`,
      `${isArabic ? 'الرسالة' : 'Message'}: ${formData.get('message')}`,
    ].join('\n'))

    setSubmitted(true)
    window.location.href = `${CONTACT.emailHref}?subject=${subject}&body=${body}`
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="contact-form-grid">
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
        <label>
          <span>{isArabic ? 'المشروع' : 'Project'}</span>
          <select name="project" value={selectedProject} onChange={(event) => setSelectedProject(event.target.value)}>
            <option value="general-inquiry">{isArabic ? 'استفسار عام' : 'General Inquiry'}</option>
            {projectChoices.map((project) => (
              <option key={project.slug} value={project.slug}>{project.displayName}</option>
            ))}
          </select>
        </label>
        <label className="contact-form-message">
          <span>{isArabic ? 'رسالتك' : 'Message'}</span>
          <textarea name="message" rows={5} required />
        </label>
      </div>
      <button type="submit" className="contact-form-submit">
        {isArabic ? 'إرسال الطلب' : 'Send Inquiry'}
        {isArabic ? <ArrowUpLeft aria-hidden="true" /> : <ArrowUpRight aria-hidden="true" />}
      </button>
      {submitted && (
        <p className="contact-form-status" role="status">
          {isArabic
            ? 'سيتم فتح تطبيق البريد الإلكتروني لإكمال إرسال طلبك.'
            : 'Your email application will open so you can complete sending your enquiry.'}
        </p>
      )}
    </form>
  )
}
