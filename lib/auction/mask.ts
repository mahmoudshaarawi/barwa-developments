export function maskBidderName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '***'
  if (parts.length === 1) return `${parts[0].slice(0, 1)}***`
  return `${parts[0]} ${parts[1].slice(0, 1)}***`
}
