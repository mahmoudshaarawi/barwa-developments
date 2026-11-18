import { bidderToken, json } from '@/lib/auction/http'
import { findBidderByToken, getPublicSnapshot } from '@/lib/auction/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const snapshot = getPublicSnapshot()
  const bidder = findBidderByToken(await bidderToken())
  return json({
    ...snapshot,
    me: bidder
      ? { status: bidder.status, name: bidder.name }
      : null,
  })
}
