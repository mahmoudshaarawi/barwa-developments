'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { auctionConfig, isPlaceholder } from '@/lib/auction/config'
import { formatEgp } from '@/lib/auction/money'
import { formatCairo } from '@/lib/auction/time'
import type { PublicSnapshot } from '@/lib/auction/store'
import { CONTACT } from '@/lib/contact'

type Me = { status: 'pending' | 'approved' | 'rejected'; name: string } | null
type Snapshot = PublicSnapshot & { me: Me }

const whatsAppHref = `https://wa.me/201270000101?text=${encodeURIComponent('مرحبًا، أرغب في الاستفسار عن مزاد وحدة G-21 في سنترال مول')}`

function parts(target: string, serverNow: string) {
  const offset = Date.parse(serverNow) - Date.now()
  const remaining = Math.max(0, Date.parse(target) - (Date.now() + offset))
  const total = Math.floor(remaining / 1000)
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  }
}

export function AuctionLanding({
  initial,
  features,
  location,
  locationDetail,
  hero,
}: {
  initial: Snapshot
  features: string[]
  location: string
  locationDetail: string
  hero: string
}) {
  const [state, setState] = useState(initial)
  const [tick, setTick] = useState(0)
  const [confirming, setConfirming] = useState(false)
  const [bidError, setBidError] = useState('')
  const [bidPending, setBidPending] = useState(false)
  const [formError, setFormError] = useState('')
  const [formPending, setFormPending] = useState(false)

  useEffect(() => {
    let stop = false
    const load = async () => {
      const response = await fetch('/api/auction/state', { cache: 'no-store' })
      if (!stop && response.ok) setState(await response.json())
    }
    const poll = window.setInterval(load, 4000)
    const clock = window.setInterval(() => setTick((value) => value + 1), 1000)
    return () => {
      stop = true
      window.clearInterval(poll)
      window.clearInterval(clock)
    }
  }, [])

  const target = state.phase === 'upcoming' ? state.startsAt : state.phase === 'live' ? state.endsAt : null
  const clock = target ? parts(target, state.serverNow) : null
  void tick
  const unit = auctionConfig.unit
  const payments = auctionConfig.payments
  const paymentReady = !isPlaceholder(payments.instapayHandle) || !isPlaceholder(payments.accountNumber) || !isPlaceholder(payments.iban)

  async function submitRegistration(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')
    setFormPending(true)
    const response = await fetch('/api/auction/register', {
      method: 'POST',
      body: new FormData(event.currentTarget),
    })
    const data = await response.json().catch(() => null) as { error?: string } | null
    setFormPending(false)
    if (!response.ok) {
      setFormError(data?.error || 'تعذر إرسال الطلب.')
      return
    }
    const fresh = await fetch('/api/auction/state', { cache: 'no-store' })
    if (fresh.ok) setState(await fresh.json())
  }

  async function confirmBid() {
    if (state.nextBidEgp == null) return
    setBidError('')
    setBidPending(true)
    const response = await fetch('/api/auction/bid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: state.nextBidEgp }),
    })
    const data = await response.json().catch(() => null) as { error?: string; snapshot?: PublicSnapshot } | null
    setBidPending(false)
    setConfirming(false)
    if (data?.snapshot) setState((current) => ({ ...current, ...data.snapshot }))
    if (!response.ok) setBidError(data?.error || 'تعذر تسجيل العطاء.')
  }

  return (
    <div className="auction-page">
      <section className="auction-hero">
        <img src={hero} alt="واجهة سنترال مول في المنطقة المركزية بمدينة الشروق" />
        <div className="auction-hero-shade" />
        <div className="auction-hero-copy">
          <span className="eyebrow">مزاد علني · سنترال مول</span>
          <h1>مزاد وحدة {unit.number}</h1>
          <p>محل تجاري في سنترال مول، مدينة الشروق بشرق القاهرة. مزاد واحد، ووحدة واحدة، لمدة ثلاثة أيام.</p>
        </div>
      </section>

      <section className="auction-status section-pad" aria-live="polite">
        <div>
          <span className="eyebrow">
            {state.phase === 'upcoming' ? 'قبل الافتتاح' : state.phase === 'live' ? 'المزاد جارٍ' : 'انتهى المزاد'}
          </span>
          <h2>
            {state.phase === 'upcoming' && 'يبدأ العد التنازلي للافتتاح'}
            {state.phase === 'live' && 'الوقت المتبقي للإغلاق'}
            {state.phase === 'ended' && 'أُغلق باب المزايدة'}
          </h2>
          <p>الافتتاح {formatCairo(state.startsAt)} — الإغلاق {formatCairo(state.endsAt)} بتوقيت القاهرة.</p>
        </div>
        {clock && (
          <ol className="auction-clock">
            <li><strong>{clock.days}</strong><span>يوم</span></li>
            <li><strong>{clock.hours}</strong><span>ساعة</span></li>
            <li><strong>{clock.minutes}</strong><span>دقيقة</span></li>
            <li><strong>{clock.seconds}</strong><span>ثانية</span></li>
          </ol>
        )}
        {state.phase === 'ended' && (
          <div className="auction-winner">
            {state.winner
              ? <><span>العطاء الفائز</span><strong>{formatEgp(state.winner.amountEgp)}</strong><em>{state.winner.maskedName}</em></>
              : <strong>انتهى المزاد دون عطاءات.</strong>}
          </div>
        )}
      </section>

      <section className="auction-grid section-pad">
        <article className="auction-price">
          <span className="eyebrow">السعر</span>
          <p>سعر الافتتاح <strong>{formatEgp(state.openingPriceEgp)}</strong></p>
          <p>أعلى عطاء <strong>{state.highestBidEgp == null ? 'لا يوجد بعد' : formatEgp(state.highestBidEgp)}</strong></p>
          <p>عدد العطاءات <strong>{state.bidCount}</strong></p>
          <p className="auction-fee">تأمين الدخول {formatEgp(state.entryFeeEgp)}. {state.entryFeeNoteAr}</p>
          {state.antiSnipe.enabled && (
            <p className="auction-snipe">عطاء في آخر {state.antiSnipe.windowMinutes} دقائق يمدد الإغلاق {state.antiSnipe.extendMinutes} دقائق.</p>
          )}
          {state.phase === 'live' && state.me?.status === 'approved' && state.nextBidEgp != null && (
            <div className="auction-bid">
              {!confirming ? (
                <button type="button" onClick={() => { setBidError(''); setConfirming(true) }}>
                  زايد بـ +{state.incrementEgp.toLocaleString('en-US')} ج.م
                  <small>ليصبح العطاء {formatEgp(state.nextBidEgp)}</small>
                </button>
              ) : (
                <div className="auction-confirm">
                  <p>تأكيد المزايدة بمبلغ {formatEgp(state.nextBidEgp)}؟</p>
                  <button type="button" onClick={confirmBid} disabled={bidPending}>{bidPending ? 'جارٍ التسجيل' : 'تأكيد العطاء'}</button>
                  <button type="button" className="is-quiet" onClick={() => setConfirming(false)}>إلغاء</button>
                </div>
              )}
              {bidError && <p className="auction-error">{bidError}</p>}
            </div>
          )}
          {state.phase === 'live' && state.me && state.me.status !== 'approved' && (
            <p className="auction-note">المزايدة تُفتح بعد اعتماد تأمين الدخول.</p>
          )}
          {state.phase === 'live' && !state.me && <p className="auction-note">سجّل وسدّد التأمين أولًا. المزايدة لمن اعتُمد طلبه.</p>}
          {state.phase === 'upcoming' && <p className="auction-note">أول عطاء عند الافتتاح يكون {formatEgp(state.openingPriceEgp + state.incrementEgp)}.</p>}
        </article>

        <article className="auction-unit">
          <span className="eyebrow">الوحدة</span>
          <h2>وحدة {unit.number}</h2>
          <dl>
            <div><dt>المشروع</dt><dd>سنترال مول</dd></div>
            <div><dt>الموقع</dt><dd>{location} · شرق القاهرة</dd></div>
            <div><dt>الدور</dt><dd>{unit.floorAr}</dd></div>
            <div><dt>النشاط</dt><dd>{unit.useAr}</dd></div>
            <div><dt>المساحة</dt><dd>{unit.areaM2} م²</dd></div>
          </dl>
          <p>{locationDetail}</p>
          <figure>
            <img src={unit.planImage} alt={`مخطط ${unit.floorAr} لسنترال مول، وموقع الوحدة ${unit.number} ضمن المحلات`} />
            <figcaption>مخطط {unit.floorAr}. لا توجد قصاصة مستقلة للوحدة في ملفات الموقع، والمساحة من {unit.source}.</figcaption>
          </figure>
        </article>
      </section>

      <section className="section-pad">
        <span className="eyebrow">في سنترال مول</span>
        <h2>مميزات المشروع</h2>
        <ul className="auction-features">
          {features.map((feature) => <li key={feature}>{feature}</li>)}
        </ul>
      </section>

      <section className="auction-register section-pad" id="register">
        <div>
          <span className="eyebrow">دخول المزاد</span>
          <h2>التسجيل وسداد التأمين</h2>
          <ol className="auction-steps">
            <li>سجّل الاسم ورقم الهاتف والبريد.</li>
            <li>حوّل {formatEgp(auctionConfig.entryFeeEgp)} عبر إنستاباي أو تحويل بنكي.</li>
            <li>ارفع صورة الإيصال. الاعتماد يدوي من إدارة بروة.</li>
            <li>بعد الاعتماد، زر المزايدة يضيف {formatEgp(auctionConfig.incrementEgp)} على أعلى عطاء.</li>
          </ol>
          <div className="auction-pay">
            <h3>بيانات السداد</h3>
            {paymentReady ? (
              <ul>
                {!isPlaceholder(payments.instapayHandle) && <li>إنستاباي: <b dir="ltr">{payments.instapayHandle}</b></li>}
                {!isPlaceholder(payments.bankName) && <li>البنك: {payments.bankName}</li>}
                {!isPlaceholder(payments.accountName) && <li>اسم الحساب: {payments.accountName}</li>}
                {!isPlaceholder(payments.accountNumber) && <li>رقم الحساب: <b dir="ltr">{payments.accountNumber}</b></li>}
                {!isPlaceholder(payments.iban) && <li>الآيبان: <b dir="ltr">{payments.iban}</b></li>}
              </ul>
            ) : (
              <p>ستُنشر بيانات إنستاباي والحساب البنكي هنا قبل فتح باب السداد. المبلغ المطلوب {formatEgp(auctionConfig.entryFeeEgp)}.</p>
            )}
            <p>{auctionConfig.entryFeeNoteAr}</p>
          </div>
        </div>
        {state.me ? (
          <div className="auction-me">
            <h3>حالة طلبك</h3>
            <p>{state.me.name}</p>
            {state.me.status === 'pending' && <strong>قيد المراجعة. بعد اعتماد الإيصال يمكنك المزايدة من هذه الصفحة.</strong>}
            {state.me.status === 'approved' && <strong>تم الاعتماد. يمكنك المزايدة عندما يكون المزاد مفتوحًا.</strong>}
            {state.me.status === 'rejected' && <strong>لم يُعتمد الطلب. تواصل معنا على {CONTACT.hotline}.</strong>}
          </div>
        ) : (
          <form className="auction-form" onSubmit={submitRegistration}>
            <label>الاسم<input name="name" required autoComplete="name" /></label>
            <label>الهاتف<input name="phone" required inputMode="tel" autoComplete="tel" placeholder="01xxxxxxxxx" dir="ltr" /></label>
            <label>البريد الإلكتروني<input name="email" type="email" required autoComplete="email" dir="ltr" /></label>
            <label>الرقم القومي <span>اختياري</span><input name="nationalId" inputMode="numeric" maxLength={14} dir="ltr" /></label>
            <fieldset>
              <legend>طريقة سداد التأمين</legend>
              <label><input type="radio" name="paymentMethod" value="instapay" required /> إنستاباي</label>
              <label><input type="radio" name="paymentMethod" value="bank" /> تحويل بنكي</label>
            </fieldset>
            <label>صورة الإيصال<input name="receipt" type="file" accept="image/jpeg,image/png,image/webp" required /></label>
            {formError && <p className="auction-error">{formError}</p>}
            <button type="submit" disabled={formPending || state.phase === 'ended'}>{formPending ? 'جارٍ الإرسال' : 'إرسال طلب الدخول'}</button>
          </form>
        )}
      </section>

      <section className="section-pad">
        <span className="eyebrow">سجل العطاءات</span>
        <h2>آخر العطاءات</h2>
        {state.history.length === 0 ? <p>لا عطاءات بعد.</p> : (
          <ol className="auction-history">
            {state.history.map((bid) => (
              <li key={`${bid.createdAt}-${bid.amountEgp}`}>
                <b>{formatEgp(bid.amountEgp)}</b>
                <span>{bid.maskedName}</span>
                <time dateTime={bid.createdAt}>{formatCairo(bid.createdAt)}</time>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="auction-terms section-pad">
        <div>
          <span className="eyebrow">الشروط</span>
          <h2>شروط المزاد</h2>
          <ol>
            <li>المزاد على وحدة {unit.number} فقط، وهي {unit.useAr} بمساحة {unit.areaM2} م² في {unit.floorAr} بسنترال مول في مدينة الشروق بشرق القاهرة.</li>
            <li>سعر الافتتاح {formatEgp(auctionConfig.openingPriceEgp)}، وأول عطاء {formatEgp(auctionConfig.openingPriceEgp + auctionConfig.incrementEgp)}، ثم زيادة ثابتة قدرها {formatEgp(auctionConfig.incrementEgp)} في كل مرة.</li>
            <li>لا يُكتب مبلغ حر. الزر يطرح السعر التالي فقط، والخادم يرفض العطاء إذا سبقه عطاء آخر.</li>
            <li>{auctionConfig.entryFeeNoteAr} لا يزايد إلا من اعتُمد إيصاله.</li>
            <li>المزاد من {formatCairo(auctionConfig.startsAt)} إلى {formatCairo(state.endsAt)} بتوقيت القاهرة.{state.antiSnipe.enabled ? ` عطاء في آخر ${state.antiSnipe.windowMinutes} دقائق يمدد الإغلاق ${state.antiSnipe.extendMinutes} دقائق.` : ''}</li>
            <li>الفائز هو صاحب أعلى عطاء معتمد عند الإغلاق. استكمال التعاقد يتم بالتواصل مع بروة على الخط الساخن {CONTACT.hotline}.</li>
          </ol>
        </div>
        <div>
          <span className="eyebrow">أسئلة</span>
          <h2>أسئلة شائعة</h2>
          <details open><summary>هل أستطيع المزايدة فور التسجيل؟</summary><p>لا. تُراجع الإدارة إيصال التأمين أولًا، ثم تُفتح المزايدة لصاحب الطلب المعتمد.</p></details>
          <details><summary>ماذا لو تغيّر السعر وأنا أؤكد العطاء؟</summary><p>يُرفض العطاء القديم وتظهر القيمة الجديدة. أكّد السعر المحدّث.</p></details>
          <details><summary>هل يُرد التأمين؟</summary><p>{auctionConfig.entryFeeNoteAr}</p></details>
          <details><summary>أين تقع الوحدة؟</summary><p>{locationDetail}</p></details>
        </div>
      </section>

      <section className="auction-contact section-pad">
        <span className="eyebrow">تواصل</span>
        <h2>للاستفسار عن المزاد</h2>
        <a className="auction-hotline" href={CONTACT.phoneHref} dir="ltr">{CONTACT.hotline}</a>
        <div className="auction-contact-links">
          <a href={CONTACT.phoneHref}>اتصال</a>
          <a href={whatsAppHref} target="_blank" rel="noopener noreferrer">واتساب</a>
          <Link href="/projects/central-mall">صفحة سنترال مول</Link>
        </div>
      </section>
    </div>
  )
}
