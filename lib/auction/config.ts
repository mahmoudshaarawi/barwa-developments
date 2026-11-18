/**
 * All auction settings live here. Edit this file to change the unit, dates,
 * prices, increment, anti-sniping, or payment instructions.
 *
 * Dates are Africa/Cairo. On these December dates Cairo is UTC+2 (no DST).
 * Payment lines that still start with "TODO" are placeholders and are not
 * shown to visitors as raw TODO text.
 */
export const auctionConfig = {
  projectSlug: 'central-mall',
  unit: {
    number: 'G-21',
    floorKey: 'ground-floor' as const,
    floorAr: 'الطابق الأرضي',
    useAr: 'محل تجاري',
    areaM2: 16,
    planImage: '/projects/central-mall/ground-floor.jpg',
    /** Brochure page 7 lists G-21 as 16 m². No separate unit crop is in the repo. */
    source: 'جدول الطابق الأرضي في بروشور سنترال مول، الصفحة ٧',
  },
  openingPriceEgp: 900_000,
  /** Fixed step. The first bid is openingPriceEgp + incrementEgp (910,000). */
  incrementEgp: 10_000,
  entryFeeEgp: 25_000,
  entryFeeNoteAr: 'تأمين دخول المزاد يُرد لغير الفائزين، ويُخصم من ثمن الوحدة للفائز.',
  startsAt: '2026-12-01T10:00:00+02:00',
  endsAt: '2026-12-03T23:59:00+02:00',
  timeZone: 'Africa/Cairo',
  antiSnipe: {
    enabled: true,
    windowMinutes: 5,
    extendMinutes: 5,
  },
  payments: {
    instapayHandle: 'TODO: حساب إنستاباي',
    bankName: 'TODO: اسم البنك',
    accountName: 'TODO: اسم صاحب الحساب',
    accountNumber: 'TODO: رقم الحساب',
    iban: 'TODO: رقم الآيبان',
  },
} as const

export type AuctionConfig = typeof auctionConfig

export function isPlaceholder(value: string) {
  return value.trim().startsWith('TODO')
}
