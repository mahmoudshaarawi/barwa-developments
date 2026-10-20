'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useLanguage } from './language-provider'
import { projects } from '@/lib/projects'
import { submitBarwaForm } from '@/lib/forms'
import { areasForSelection, formatArea, usesForProject, type UnitUse } from '@/lib/unit-areas'

const showcaseOrder = ['barwa-mall', 'central-mall', 'hub5-mall']
const calculatorProjects = showcaseOrder
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter((project): project is (typeof projects)[number] => Boolean(project))

const phonePattern = /^01\d{9}$/

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
    setStatus('sending')
    const accepted = await submitBarwaForm({
      _subject: `Installment request — ${selectedProject.displayName}`,
      name: name.trim(),
      phone,
      project: `${selectedProject.displayName} — ${selectedProject.arabic}`,
      unit_type: useLabel ? `${useLabel.english} — ${useLabel.arabic}` : unitUse,
      area: formatArea(Number(area), 'en'),
      payment: payment === 'cash' ? 'Cash' : 'Installments',
      down_payment: payment === 'installments' ? `${downPayment} EGP` : '—',
      installment: payment === 'installments' ? `${installmentAmount} EGP` : '—',
    }).catch(() => false)
    setStatus(accepted ? 'sent' : 'error')
  }

  const steps = [
    { id: 1, label: isArabic ? 'المشروع' : 'Project', done: Boolean(projectSlug) },
    { id: 2, label: isArabic ? 'النوع' : 'Type', done: Boolean(unitUse) },
    { id: 3, label: isArabic ? 'المساحة' : 'Area', done: Boolean(area) },
    { id: 4, label: isArabic ? 'السداد' : 'Payment', done: Boolean(payment) && (payment === 'cash' || Boolean(downPayment && installmentAmount)) },
    { id: 5, label: isArabic ? 'بياناتك' : 'Details', done: Boolean(name.trim()) && phonePattern.test(phone) },
  ]
  const currentStep = steps.find((step) => !step.done)?.id ?? 5
  const useLabel = availableUses.find((item) => item.id === unitUse)

  if (status === 'sent') {
    return (
      <div className="installment-success" role="status">
        <img className="installment-success-star" src="/brand/barwa-star.svg" alt="" />
        <h2>{isArabic ? 'تم استلام طلب حساب القسط بنجاح!' : 'Your installment request has been received!'}</h2>
        <p>{isArabic ? 'شكرًا لاهتمامك بمشاريع بروة.' : 'Thank you for your interest in Barwa’s projects.'}</p>
        <p>
          {isArabic
            ? 'سيقوم أحد مستشارينا العقاريين بالتواصل معك قريبًا لتوضيح تفاصيل الأقساط وخيارات السداد المناسبة لك.'
            : 'One of our property consultants will contact you shortly to explain the installment details and the payment options that suit you.'}
        </p>
        <div className="installment-success-actions">
          <Link href="/projects">{isArabic ? 'العودة إلى المشاريع' : 'Back to projects'}</Link>
          <button type="button" onClick={() => setStatus('idle')}>{isArabic ? 'حساب جديد' : 'New calculation'}</button>
        </div>
      </div>
    )
  }

  return (
    <div className="calc-layout">
    <form className="installment-form" onSubmit={handleSubmit}>
      <ol className="calc-progress" aria-label={isArabic ? 'خطوات الحسبة' : 'Estimate steps'}>
        {steps.map((step) => (
          <li key={step.id} className={step.done ? 'is-done' : step.id === currentStep ? 'is-current' : ''}>
            <b>{String(step.id).padStart(2, '0')}</b>
            <span>{step.label}</span>
          </li>
        ))}
      </ol>
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
              <option key={value} value={value}>{formatArea(value, isArabic ? 'ar' : 'en')}</option>
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
    <aside className="calc-summary" aria-live="polite">
      <h2>{isArabic ? 'ملخص الطلب' : 'Request summary'}</h2>
      <dl>
        <div><dt>{isArabic ? 'المشروع' : 'Project'}</dt><dd>{selectedProject ? (isArabic ? selectedProject.arabic : selectedProject.displayName) : '—'}</dd></div>
        <div><dt>{isArabic ? 'النوع' : 'Type'}</dt><dd>{useLabel ? (isArabic ? useLabel.arabic : useLabel.english) : '—'}</dd></div>
        <div><dt>{isArabic ? 'المساحة' : 'Area'}</dt><dd>{area ? formatArea(Number(area), isArabic ? 'ar' : 'en') : '—'}</dd></div>
        <div><dt>{isArabic ? 'السداد' : 'Payment'}</dt><dd>{payment === 'cash' ? (isArabic ? 'كاش' : 'Cash') : payment === 'installments' ? (isArabic ? 'تقسيط' : 'Installments') : '—'}</dd></div>
        {payment === 'installments' && (
          <>
            <div><dt>{isArabic ? 'المقدم' : 'Down payment'}</dt><dd>{downPayment ? `${downPayment} ${isArabic ? 'جنيه' : 'EGP'}` : '—'}</dd></div>
            <div><dt>{isArabic ? 'القسط' : 'Installment'}</dt><dd>{installmentAmount ? `${installmentAmount} ${isArabic ? 'جنيه' : 'EGP'}` : '—'}</dd></div>
          </>
        )}
        <div><dt>{isArabic ? 'الاسم' : 'Name'}</dt><dd>{name.trim() || '—'}</dd></div>
        <div><dt>{isArabic ? 'الهاتف' : 'Phone'}</dt><dd dir="ltr">{phone || '—'}</dd></div>
      </dl>
    </aside>
    </div>
  )
}
