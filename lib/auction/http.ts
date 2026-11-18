import crypto from 'crypto'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const BIDDER_COOKIE = 'barwa_auction_bidder'
export const ADMIN_COOKIE = 'barwa_auction_admin'

const hits = new Map<string, number[]>()

export function clientIp(request: Request) {
  const real = request.headers.get('x-real-ip')
  if (real) return real.trim()
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'
  return 'unknown'
}

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs)
  if (recent.length >= limit) {
    hits.set(key, recent)
    return false
  }
  recent.push(now)
  hits.set(key, recent)
  return true
}

export function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  })
}

export function passwordsMatch(input: string, expected: string) {
  if (!expected) return false
  const left = crypto.createHash('sha256').update(input).digest()
  const right = crypto.createHash('sha256').update(expected).digest()
  return crypto.timingSafeEqual(left, right)
}

export async function bidderToken() {
  const jar = await cookies()
  return jar.get(BIDDER_COOKIE)?.value ?? ''
}

export async function adminToken() {
  const jar = await cookies()
  return jar.get(ADMIN_COOKIE)?.value ?? ''
}

export function requestIsSecure(request: Request) {
  const forwarded = request.headers.get('x-forwarded-proto')
  if (forwarded) return forwarded.split(',')[0]?.trim() === 'https'
  return new URL(request.url).protocol === 'https:'
}

export function cookieOptions(maxAge: number, secure: boolean) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure,
    path: '/',
    maxAge,
  }
}

const imageTypes: Record<string, { extension: string; magic: (bytes: Buffer) => boolean }> = {
  'image/jpeg': { extension: '.jpg', magic: (bytes) => bytes[0] === 0xff && bytes[1] === 0xd8 },
  'image/png': { extension: '.png', magic: (bytes) => bytes.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47])) },
  'image/webp': {
    extension: '.webp',
    magic: (bytes) => bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP',
  },
}

export function readReceipt(file: File, bytes: Buffer) {
  const kind = imageTypes[file.type]
  if (!kind || bytes.length < 12 || bytes.length > 5 * 1024 * 1024 || !kind.magic(bytes)) {
    return { ok: false as const, error: 'أرفق صورة الإيصال بصيغة JPG أو PNG أو WEBP، بحد أقصى ٥ ميغابايت.' }
  }
  return { ok: true as const, extension: kind.extension }
}
