type UsePillsProps = {
  arabic: string
  english: string
  isArabic?: boolean
}

export function UsePills({ arabic, english, isArabic = true }: UsePillsProps) {
  const arabicLabels = arabic.split('·').map((item) => item.trim()).filter(Boolean)
  const englishLabels = english.split('·').map((item) => item.trim()).filter(Boolean)

  return (
    <div className="use-pills">
      {arabicLabels.map((label, index) => {
        const englishLabel = englishLabels[index]
        const primary = isArabic ? label : englishLabel ?? label
        const secondary = isArabic ? englishLabel : label
        return (
          <span className="use-pill" key={`${label}-${englishLabel ?? index}`}>
            <b>{primary}</b>
            {secondary && (
              <small lang={isArabic ? 'en' : 'ar'} dir={isArabic ? 'ltr' : 'rtl'}>{secondary}</small>
            )}
          </span>
        )
      })}
    </div>
  )
}
