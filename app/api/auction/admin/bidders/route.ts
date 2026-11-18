import { adminToken, json } from '@/lib/auction/http'
import { adminSessionValid, setBidderStatus, type BidderStatus } from '@/lib/auction/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  if (!adminSessionValid(await adminToken())) return json({ error: 'غير مصرح.' }, 401)
  let body: { id?: unknown; status?: unknown }
  try {
    body = await request.json()
  } catch {
    return json({ error: 'تعذر قراءة الطلب.' }, 400)
  }
  const status = body.status
  if (typeof body.id !== 'string' || (status !== 'approved' && status !== 'rejected' && status !== 'pending')) {
    return json({ error: 'بيانات غير صالحة.' }, 400)
  }
  if (!setBidderStatus(body.id, status as BidderStatus)) return json({ error: 'المسجّل غير موجود.' }, 404)
  return json({ ok: true })
}
