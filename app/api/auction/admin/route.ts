import { adminToken, json } from '@/lib/auction/http'
import { adminSessionValid, getPublicSnapshot, listBidders, listBidsDetailed } from '@/lib/auction/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  if (!adminSessionValid(await adminToken())) return json({ error: 'غير مصرح.' }, 401)
  return json({
    snapshot: getPublicSnapshot(),
    bidders: listBidders(),
    bids: listBidsDetailed(),
  })
}
