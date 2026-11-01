export function BrandLockup({ compact = false, pill = false }: { compact?: boolean; pill?: boolean }) {
  return (
    <span className={`brand-lockup${compact ? ' is-compact' : ''}${pill ? ' is-pill' : ''}`}>
      <img src="/brand/barwa%20logo-01.svg" alt="Barwa Developments" />
      <span aria-hidden="true">×</span>
      <img src="/partners/alrajhi.png" alt="الراجحي للمشروعات العمرانية" />
    </span>
  )
}
