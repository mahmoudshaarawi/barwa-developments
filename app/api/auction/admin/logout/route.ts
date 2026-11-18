import { ADMIN_COOKIE, adminToken, cookieOptions, json } from '@/lib/auction/http'
import { deleteAdminSession } from '@/lib/auction/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST() {
  const token = await adminToken()
  if (token) deleteAdminSession(token)
  const response = json({ ok: true })
  response.cookies.set(ADMIN_COOKIE, '', { ...cookieOptions(0, false), maxAge: 0 })
  return response
}
