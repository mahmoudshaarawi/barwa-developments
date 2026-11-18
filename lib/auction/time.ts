import { auctionConfig } from './config'

export type AuctionPhase = 'upcoming' | 'live' | 'ended'

export function parseAuctionInstant(value: string) {
  const time = Date.parse(value)
  if (Number.isNaN(time)) throw new Error(`Invalid auction date: ${value}`)
  return time
}

export function phaseAt(now: Date, endsAtMs: number): AuctionPhase {
  const start = parseAuctionInstant(auctionConfig.startsAt)
  if (now.getTime() < start) return 'upcoming'
  if (now.getTime() > endsAtMs) return 'ended'
  return 'live'
}

export function formatCairo(value: string | number | Date) {
  const date = value instanceof Date ? value : new Date(value)
  return new Intl.DateTimeFormat('ar-EG', {
    timeZone: auctionConfig.timeZone,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
