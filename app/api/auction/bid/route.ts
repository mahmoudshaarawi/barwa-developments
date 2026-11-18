import { bidderToken, clientIp, json, rateLimit } from '@/lib/auction/http'
import { getPublicSnapshot, placeBid } from '@/lib/auction/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  if (!rateLimit(`bid:${clientIp(request)}`, 30, 60 * 1000)) {
    return json({ error: 'محاولات كثيرة. انتظر قليلًا ثم حدّث الصفحة.', snapshot: getPublicSnapshot() }, 429)
  }
  let body: { amount?: unknown }
  try {
    body = await request.json()
  } catch {
    return json({ error: 'تعذر قراءة العطاء.' }, 400)
  }
  const amount = body.amount
  if (typeof amount !== 'number' || !Number.isInteger(amount)) {
    return json({ error: 'قيمة العطاء غير صالحة.', snapshot: getPublicSnapshot() }, 400)
  }
  const result = placeBid(await bidderToken(), amount)
  if (!result.ok) return json({ error: result.error, snapshot: result.snapshot }, result.status)
  return json({ ok: true, snapshot: result.snapshot })
}
