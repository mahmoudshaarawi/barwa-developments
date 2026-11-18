export const BARWA_FORM_ENDPOINT = 'https://formsubmit.co/ajax/Barwadevelopments.eg@gmail.com'

export const egyptianPhonePattern = /^01\d{9}$/

export function egyptianPhoneError(value: string, isArabic: boolean) {
  if (!egyptianPhonePattern.test(value)) {
    return isArabic ? 'أدخل رقم هاتف من ١١ رقمًا يبدأ بـ 01' : 'Enter an 11-digit phone number starting with 01'
  }
  return ''
}

export async function submitBarwaForm(fields: Record<string, string>) {
  const response = await fetch(BARWA_FORM_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      _template: 'table',
      _captcha: 'false',
      ...fields,
    }),
  })
  const data = await response.json().catch(() => null) as { success?: boolean | string } | null
  return response.ok && String(data?.success) === 'true'
}
