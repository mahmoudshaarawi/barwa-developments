'use client'

import { useLanguage } from './language-provider'

const arabicMessage = 'مرحبًا، أرغب في الاستفسار عن مشاريع بروة'
const englishMessage = "Hello, I would like to enquire about Barwa's projects."

export function WhatsAppFloat() {
  const { language } = useLanguage()
  const isArabic = language === 'ar'
  const label = isArabic ? 'تواصل معنا واتساب' : 'Chat on WhatsApp'
  const message = isArabic ? arabicMessage : englishMessage
  const href = `https://wa.me/201270000101?text=${encodeURIComponent(message)}`

  return (
    <a
      className="whatsapp-float"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
    >
      <span className="whatsapp-float-pulse" aria-hidden="true" />
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M20.52 3.48A11.8 11.8 0 0 0 12.06 0C5.5 0 .16 5.33.16 11.89c0 2.1.55 4.14 1.59 5.95L0 24l6.34-1.66a11.9 11.9 0 0 0 5.72 1.46h.01c6.56 0 11.9-5.33 11.9-11.89 0-3.18-1.24-6.16-3.45-8.43ZM12.07 21.3h-.01a9.9 9.9 0 0 1-5.03-1.38l-.36-.21-3.76.99 1-3.66-.24-.38a9.86 9.86 0 0 1-1.51-5.27c0-5.46 4.45-9.9 9.92-9.9 2.65 0 5.14 1.03 7.01 2.9a9.85 9.85 0 0 1 2.9 7.01c0 5.46-4.45 9.9-9.92 9.9Zm5.44-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z"
        />
      </svg>
      <span className="whatsapp-float-label" aria-hidden="true">{label}</span>
    </a>
  )
}
