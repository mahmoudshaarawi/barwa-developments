'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useLanguage } from './language-provider'
import { projects } from '@/lib/projects'
import { areasForSelection, formatArea, usesForProject, type UnitUse } from '@/lib/unit-areas'

const showcaseOrder = ['barwa-mall', 'central-mall', 'hub5-mall']
const calculatorProjects = showcaseOrder
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter((project): project is (typeof projects)[number] => Boolean(project))

const phonePattern = /^01\d{9}$/
const FORM_ENDPOINT = 'https://formsubmit.co/ajax/moud.designs@gmail.com'

type Payment = 'installments' | 'cash'

export function InstallmentCalculator({ initialProject = '' }: { initialProject?: string }) {
  const { language } = useLanguage()
  const isArabic = language === 'ar'
  const [projectSlug, setProjectSlug] = useState(initialProject)
  const [unitUse, setUnitUse] = useState<UnitUse | ''>('')
  const [area, setArea] = useState('')
  const [payment, setPayment] = useState<Payment | ''>('')
  const [downPayment, setDownPayment] = useState('')
  const [installmentAmount, setInstallmentAmount] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('project')
    if (requested && calculatorProjects.some((project) => project.slug === requested)) {
      setProjectSlug(requested)
    }
  }, [])

  const availableUses = useMemo(() => usesForProject(projectSlug), [projectSlug])
  const availableAreas = useMemo(() => areasForSelection(projectSlug, unitUse), [projectSlug, unitUse])
  const selectedProject = calculatorProjects.find((project) => project.slug === projectSlug)

  const chooseProject = (slug: string) => {
    setProjectSlug(slug)
    setUnitUse('')
    setArea('')
    setStatus('idle')
  }

  const chooseUse = (use: UnitUse) => {
    setUnitUse(use)
    setArea('')
    setStatus('idle')
  }

  const validatePhone = (value: string) => {
    if (!phonePattern.test(value)) {
      return isArabic ? 'أدخل رقم هاتف من ١١ رقمًا يبدأ بـ 01' : 'Enter an 11-digit phone number starting with 01'
    }
    return ''
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextPhoneError = validatePhone(phone)
    setPhoneError(nextPhoneError)
    if (nextPhoneError || !selectedProject || !unitUse || !area || !payment || !name.trim()) return
    if (payment === 'installments' && (!downPayment || !installmentAmount)) return

    const useLabel = availableUses.find((item) => item.id === unitUse)
    const payload = {
      _subject: `طلب حسبة أقساط — ${selectedProject.arabic}`,
      _template: 'table',
      _captcha: 'false',
      الاسم: name.trim(),
      الهاتف: phone,
      المشروع: `${selectedProject.arabic} / ${selectedProject.displayName}`,
      النوع: useLabel ? `${useLabel.arabic} / ${useLabel.english}` : unitUse,
      المساحة: formatArea(Number(area)),
      السداد: payment === 'cash' ? 'كاش' : 'تقسيط',
      المقدم: payment === 'installments' ? `${downPayment} جنيه` : '—',
      'القسط التقريبي': payment === 'installments' ? `${installmentAmount} جنيه` : '—',
    }

    setStatus('sending')
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json().catch(() => null) as { success?: boolean | string } | null
      const accepted = response.ok && String(data?.success) === 'true'
      if (!accepted) throw new Error('Form was not accepted')
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="installment-result" role="status">
        <p>سوف تصلك الحسبة خلال دقايق</p>
      </div>
    )
  }

  return (
    <form className="installment-form" onSubmit={handleSubmit}>
      <fieldset>
        <legend>{isArabic ? '١. اختر المشروع' : '1. Choose a project'}</legend>
        <div className="installment-choices">
          {calculatorProjects.map((project) => (
            <label key={project.slug} className={projectSlug === project.slug ? 'is-selected' : ''}>
              <input
                type="radio"
                name="project"
                value={project.slug}
                checked={projectSlug === project.slug}
                onChange={() => chooseProject(project.slug)}
                required
              />
              <span>{isArabic ? project.arabic : project.displayName}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset disabled={!projectSlug}>
        <legend>{isArabic ? '٢. اختر النوع' : '2. Choose a type'}</legend>
        <div className="installment-choices">
          {availableUses.map((use) => (
            <label key={use.id} className={unitUse === use.id ? 'is-selected' : ''}>
              <input
                type="radio"
                name="unit-use"
                value={use.id}
                checked={unitUse === use.id}
                onChange={() => chooseUse(use.id)}
                required
              />
              <span>{isArabic ? use.arabic : use.english}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset disabled={!unitUse}>
        <legend>{isArabic ? '٣. اختر المساحة' : '3. Choose an area'}</legend>
        <label className="installment-field">
          <span>{isArabic ? 'المساحات المتاحة في البروشور' : 'Areas published in the brochure'}</span>
          <select name="area" value={area} onChange={(event) => setArea(event.target.value)} required>
            <option value="">{isArabic ? 'اختر المساحة' : 'Select an area'}</option>
            {availableAreas.map((value) => (
              <option key={value} value={value}>{formatArea(value)}</option>
            ))}
          </select>
        </label>
      </fieldset>

      <fieldset disabled={!area}>
        <legend>{isArabic ? '٤. طريقة السداد' : '4. Payment'}</legend>
        <div className="installment-choices">
          <label className={payment === 'installments' ? 'is-selected' : ''}>
            <input type="radio" name="payment" value="installments" checked={payment === 'installments'} onChange={() => setPayment('installments')} required />
            <span>{isArabic ? 'تقسيط' : 'Installments'}</span>
          </label>
          <label className={payment === 'cash' ? 'is-selected' : ''}>
            <input type="radio" name="payment" value="cash" checked={payment === 'cash'} onChange={() => setPayment('cash')} />
            <span>{isArabic ? 'كاش' : 'Cash'}</span>
          </label>
        </div>
        {payment === 'installments' && (
          <div className="installment-amounts">
            <label className="installment-field">
              <span>{isArabic ? 'المقدم (جنيه)' : 'Down payment (EGP)'}</span>
              <input name="down-payment" inputMode="decimal" value={downPayment} onChange={(event) => setDownPayment(event.target.value)} required />
            </label>
            <label className="installment-field">
              <span>{isArabic ? 'القسط التقريبي (جنيه)' : 'Approximate installment (EGP)'}</span>
              <input name="installment-amount" inputMode="decimal" value={installmentAmount} onChange={(event) => setInstallmentAmount(event.target.value)} required />
            </label>
          </div>
        )}
      </fieldset>

      <fieldset disabled={!payment}>
        <legend>{isArabic ? 'بيانات التواصل' : 'Your details'}</legend>
        <div className="installment-amounts">
          <label className="installment-field">
            <span>{isArabic ? 'الاسم' : 'Name'}</span>
            <input name="name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required />
          </label>
          <label className="installment-field">
            <span>{isArabic ? 'الهاتف' : 'Phone'}</span>
            <input
              name="phone"
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
                const message = value ? validatePhone(value) : ''
                event.target.setCustomValidity(message)
                if (phoneError) setPhoneError(message)
              }}
              onInvalid={(event) => {
                const value = event.currentTarget.value.trim()
                const message = validatePhone(value)
                event.currentTarget.setCustomValidity(message)
                setPhoneError(message)
              }}
              required
            />
          </label>
        </div>
        {phoneError && <p className="installment-error" role="alert">{phoneError}</p>}
      </fieldset>

      <button className="installment-submit" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? (isArabic ? 'جارٍ الإرسال' : 'Sending') : (isArabic ? 'أظهر الحسبة' : 'Show the estimate')}
      </button>
      {status === 'error' && (
        <p className="installment-error" role="alert">
          {isArabic ? 'تعذر إرسال الطلب الآن. يرجى الاتصال على ١٧٥٨٢.' : 'The request could not be sent. Please call 17582.'}
        </p>
      )}
    </form>
  )
}
