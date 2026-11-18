import { ADMIN_COOKIE, clientIp, cookieOptions, json, passwordsMatch, rateLimit, requestIsSecure } from '@/lib/auction/http'
import { createAdminSession } from '@/lib/auction/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  if (!rateLimit(`admin:${clientIp(request)}`, 8, 15 * 60 * 1000)) {
    return json({ error: 'محاولات كثيرة. حاول بعد قليل.' }, 429)
  }
  const expected = process.env.AUCTION_ADMIN_PASSWORD ?? ''
  if (!expected) return json({ error: 'عيّن AUCTION_ADMIN_PASSWORD على الخادم.' }, 503)
  let body: { password?: unknown }
  try {
    body = await request.json()
  } catch {
    return json({ error: 'تعذر قراءة الطلب.' }, 400)
  }
  if (typeof body.password !== 'string' || !passwordsMatch(body.password, expected)) {
    return json({ error: 'كلمة المرور غير صحيحة.' }, 401)
  }
  const token = createAdminSession()
  const response = json({ ok: true })
  response.cookies.set(ADMIN_COOKIE, token, cookieOptions(60 * 60 * 12, requestIsSecure(request)))
  return response
}
