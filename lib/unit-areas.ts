export type UnitUse = 'retail' | 'office' | 'medical'

export type UnitUseOption = {
  id: UnitUse
  arabic: string
  english: string
}

/** Uses published in the 2026 brochures. Office and medical share the upper-floor units. */
export const unitUses: UnitUseOption[] = [
  { id: 'retail', arabic: 'تجاري', english: 'Commercial' },
  { id: 'office', arabic: 'إداري', english: 'Offices' },
  { id: 'medical', arabic: 'طبي', english: 'Medical' },
]

/**
 * Distinct unit areas in m², taken from the floor schedules in the 2026 brochures.
 * Office and medical are the same units (the brochures list those floors as offices & clinics).
 * Ranges that were not broken into units are intentionally omitted.
 */
export const unitAreasByProject: Record<string, Record<UnitUse, number[]>> = {
  'barwa-mall': {
    retail: [12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 31, 32, 34, 45, 51],
    office: [49, 52, 53, 62, 63, 72],
    medical: [49, 52, 53, 62, 63, 72],
  },
  'central-mall': {
    retail: [16, 18, 19, 23, 24, 27, 28, 29, 30, 31, 33, 34, 35, 36, 39, 40, 41, 45, 50, 58, 64, 68, 73.5, 75, 81],
    office: [22, 25, 27, 29, 30, 34, 35, 36, 39, 45, 56, 57, 64, 68],
    medical: [22, 25, 27, 29, 30, 34, 35, 36, 39, 45, 56, 57, 64, 68],
  },
  'hub5-mall': {
    retail: [12, 14, 15, 18, 19, 20, 21, 22, 25, 26, 28, 29, 30, 31, 34, 39, 43, 44, 48, 50],
    office: [42, 49, 51, 60, 61, 71, 75, 78, 86],
    medical: [42, 49, 51, 60, 61, 71, 75, 78, 86],
  },
}

export function usesForProject(slug: string) {
  const areas = unitAreasByProject[slug]
  if (!areas) return []
  return unitUses.filter((use) => areas[use.id].length > 0)
}

export function areasForSelection(slug: string, use: UnitUse | '') {
  if (!use) return []
  return unitAreasByProject[slug]?.[use] ?? []
}

export function formatArea(area: number, language: 'ar' | 'en' = 'ar') {
  const unit = language === 'ar' ? 'م²' : 'm²'
  return `${Number.isInteger(area) ? area : area} ${unit}`
}
