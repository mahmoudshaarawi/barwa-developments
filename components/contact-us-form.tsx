'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { ArrowUpLeft, ArrowUpRight } from 'lucide-react'
import { useLanguage } from './language-provider'
import { submitBarwaForm } from '@/lib/forms'
import { projects } from '@/lib/projects'

const projectChoices = ['barwa-mall', 'central-mall', 'hub5-mall']
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter((project): project is (typeof projects)[number] => Boolean(project))
const projectSlugs = new Set(projectChoices.map((project) => project.slug))

export function ContactUsForm() {
  const { language } = useLanguage()
  const isArabic = language === 'ar'
  const [selectedProject, setSelectedProject] = useState('general-inquiry')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  useEffect(() => {
    const requestedProject = new URLSearchParams(window.location.search).get('project')
    if (requestedProject && projectSlugs.has(requestedProject)) {
      setSelectedProject(requestedProject)
    }
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const selected = projects.find((project) => project.slug === selectedProject)
    const projectName = selected
      ? `${selected.displayName} — ${selected.arabic}`
      : 'General inquiry — استفسار عام'
    setStatus('sending')
    const accepted = await submitBarwaForm({
      _subject: `استفسار — ${selected ? selected.displayName : 'عام'}`,
      name: String(formData.get('name') ?? '').trim(),
      phone: String(formData.get('phone') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      project: projectName,
      message: String(formData.get('message') ?? '').trim(),
    }).catch(() => false)
    setStatus(accepted ? 'sent' : 'error')
  }

  if (status === 'sent') {
    return (
      <p className="contact-form-status is-success" role="status">
        {isArabic ? 'تم إرسال استفسارك. سنتواصل معك قريباً.' : 'Your enquiry has been sent. We will be in touch shortly.'}
      </p>
    )
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
              <option key={project.slug} value={project.slug}>{isArabic ? project.arabic : project.displayName}</option>
            ))}
          </select>
        </label>
        <label className="contact-form-message">
          <span>{isArabic ? 'رسالتك' : 'Message'}</span>
          <textarea name="message" rows={5} required />
        </label>
      </div>
      <button type="submit" className="contact-form-submit" disabled={status === 'sending'}>
        {status === 'sending' ? (isArabic ? 'جارٍ الإرسال' : 'Sending') : (isArabic ? 'إرسال الطلب' : 'Send Inquiry')}
        {isArabic ? <ArrowUpLeft aria-hidden="true" /> : <ArrowUpRight aria-hidden="true" />}
      </button>
      {status === 'error' && (
        <p className="contact-form-status is-error" role="alert">
          {isArabic ? 'تعذر إرسال الطلب الآن. يرجى الاتصال على ١٧٥٨٢.' : 'The request could not be sent. Please call 17582.'}
        </p>
      )}
    </form>
  )
}
