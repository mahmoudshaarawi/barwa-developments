import { adminToken } from '@/lib/auction/http'
import { adminSessionValid, listBidders, listBidsDetailed } from '@/lib/auction/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function csvCell(value: string | number | null) {
  const text = value == null ? '' : String(value)
  return `"${text.replace(/"/g, '""')}"`
}

export async function GET(request: Request) {
  if (!adminSessionValid(await adminToken())) {
    return new Response('غير مصرح.', { status: 401 })
  }
  const kind = new URL(request.url).searchParams.get('kind')
  const lines: string[] = []
  if (kind === 'bids') {
    lines.push(['amount_egp', 'name', 'phone', 'email', 'created_at'].join(','))
    for (const bid of listBidsDetailed()) {
      lines.push([bid.amount, bid.name, bid.phone, bid.email, bid.created_at].map(csvCell).join(','))
    }
  } else {
    lines.push(['name', 'phone', 'email', 'national_id', 'payment_method', 'status', 'created_at'].join(','))
    for (const bidder of listBidders()) {
      lines.push([
        bidder.name,
        bidder.phone,
        bidder.email,
        bidder.national_id,
        bidder.payment_method,
        bidder.status,
        bidder.created_at,
      ].map(csvCell).join(','))
    }
  }
  const filename = kind === 'bids' ? 'auction-bids.csv' : 'auction-bidders.csv'
  return new Response(`\uFEFF${lines.join('\n')}\n`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
