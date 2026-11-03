'use client'

import { useLanguage } from './language-provider'

const whatsApp = (message: string) => `https://wa.me/201270000101?text=${encodeURIComponent(message)}`

export function LaunchingSoon() {
  const { language } = useLanguage()
  const isArabic = language === 'ar'
  const zahraMessage = isArabic
    ? 'مرحبًا، أرغب في الاستفسار عن زهرة العاصمة.'
    : 'Hello, I would like to enquire about Zahra Capital Mall.'
  const megaMessage = isArabic
    ? 'مرحبًا، أرغب في الاستفسار عن الشروق ميجا بروجيكت.'
    : 'Hello, I would like to enquire about El Shorouk Mega Project.'

  return (
    <section className="launching section-pad" aria-labelledby="launching-title">
      <div className="section-kicker">
        <span>{isArabic ? 'قريبًا' : 'LAUNCHING SOON'}</span>
      </div>
      <div className="launching-heading">
        <h2 id="launching-title">{isArabic ? 'قريبًا' : 'Launching Soon'}</h2>
        <p>{isArabic ? 'مشروعات جديدة تضيف إلى محفظة بروة.' : 'New projects joining the Barwa portfolio.'}</p>
      </div>
      <div className="launching-grid">
        <a className="launching-card" href={whatsApp(zahraMessage)} target="_blank" rel="noopener noreferrer">
          <img className="launching-photo" src="/launching/zahra-night.jpg" alt={isArabic ? 'تصور ليلي لزهرة العاصمة' : 'Night view of Zahra Capital Mall'} />
          <span className="launching-shade" aria-hidden="true" />
          <span className="launching-copy">
            <span className="launching-badge">{isArabic ? 'قريبًا · COMING SOON' : 'COMING SOON'}</span>
            <img className="launching-logo" src="/launching/zahra-capital-mall-logo.png" alt="Zahra Capital Mall" />
            <strong>{isArabic ? 'زهرة العاصمة' : 'Zahra Capital Mall'}</strong>
            <span>
              {isArabic
                ? 'وجهة تجارية ذكية متكاملة بمعايير عصرية'
                : 'An integrated smart commercial destination, built to contemporary standards.'}
            </span>
          </span>
        </a>
        <a
          className="launching-card is-mega"
          href={whatsApp(megaMessage)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={isArabic ? 'الشروق ميجا بروجيكت — قريبًا' : 'El Shorouk Mega Project — coming soon'}
        >
          <img className="launching-poster" src="/launching/shorouk-mega.jpg" alt={isArabic ? 'الشروق ميجا بروجيكت، قريبًا' : 'El Shorouk Mega Project, coming soon'} />
        </a>
      </div>
    </section>
  )
}
