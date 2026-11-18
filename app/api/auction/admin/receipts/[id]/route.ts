import fs from 'fs'
import { adminToken } from '@/lib/auction/http'
import { adminSessionValid, bidderReceiptPath } from '@/lib/auction/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const types: Record<string, string> = { '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' }

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!adminSessionValid(await adminToken())) {
    return new Response('غير مصرح.', { status: 401 })
  }
  const { id } = await context.params
  const full = bidderReceiptPath(id)
  if (!full) return new Response('الإيصال غير موجود.', { status: 404 })
  const extension = full.slice(full.lastIndexOf('.'))
  const body = fs.readFileSync(full)
  return new Response(body, {
    headers: {
      'Content-Type': types[extension] ?? 'application/octet-stream',
      'Cache-Control': 'private, no-store',
      'Content-Disposition': 'inline',
    },
  })
}
