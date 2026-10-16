'use client'

import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { InstallmentCalculator } from '@/components/installment-calculator'
import { useLanguage } from '@/components/language-provider'
import { CONTACT } from '@/lib/contact'

export function InstallmentsContent() {
  const { language } = useLanguage()
  const isArabic = language === 'ar'

  return (
    <main className="site-shell installments-page" dir={isArabic ? 'rtl' : 'ltr'}>
      <SiteHeader variant="solid" />
      <section className="installments-sheet section-pad">
        <div className="section-kicker">
          <span>01</span><i /><span>{isArabic ? 'احسب القسط' : 'INSTALLMENTS'}</span>
        </div>
        <div className="installments-heading">
          <h1>{isArabic ? <>احسب القسط <em>المناسب لوحدتك</em></> : <>Estimate the installment <em>for your unit</em></>}</h1>
          <p>
            {isArabic
              ? 'أربع خطوات واضحة: المشروع، النوع، المساحة، ثم طريقة السداد. أدخل اسمك ورقم هاتفك لنرسل الحسبة.'
              : 'Four steps: project, type, area, then payment. Add your name and phone and we will send the estimate.'}
          </p>
        </div>
        <InstallmentCalculator />
        <p className="installments-note">
          {isArabic ? 'أو اتصل على' : 'Or call'}{' '}
          <a href={CONTACT.phoneHref} dir="ltr">{CONTACT.hotline}</a>
        </p>
      </section>
      <SiteFooter />
    </main>
  )
}
