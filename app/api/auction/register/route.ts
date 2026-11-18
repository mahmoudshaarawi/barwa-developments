import crypto from 'crypto'
import { egyptianPhonePattern } from '@/lib/forms'
import { auctionConfig } from '@/lib/auction/config'
import { BIDDER_COOKIE, clientIp, cookieOptions, json, rateLimit, readReceipt, requestIsSecure } from '@/lib/auction/http'
import { phaseAt, parseAuctionInstant } from '@/lib/auction/time'
import { findBidderByPhone, getPublicSnapshot, insertBidder, saveReceipt } from '@/lib/auction/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  if (!rateLimit(`register:${clientIp(request)}`, 5, 60 * 60 * 1000)) {
    return json({ error: 'محاولات كثيرة. حاول مرة أخرى بعد قليل.' }, 429)
  }
  const snapshot = getPublicSnapshot()
  const endsMs = parseAuctionInstant(snapshot.endsAt)
  if (phaseAt(new Date(), endsMs) === 'ended') {
    return json({ error: 'انتهى المزاد ولم يعد التسجيل متاحًا.' }, 403)
  }

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return json({ error: 'تعذر قراءة الطلب.' }, 400)
  }

  const name = String(form.get('name') ?? '').trim().replace(/\s+/g, ' ')
  const phone = String(form.get('phone') ?? '').trim().replace(/\s+/g, '')
  const email = String(form.get('email') ?? '').trim().toLowerCase()
  const nationalIdRaw = String(form.get('nationalId') ?? '').trim()
  const paymentMethod = String(form.get('paymentMethod') ?? '')
  const receipt = form.get('receipt')

  if (name.length < 3 || name.length > 80) return json({ error: 'اكتب الاسم الثلاثي.' }, 400)
  if (!egyptianPhonePattern.test(phone)) return json({ error: 'أدخل رقم هاتف من ١١ رقمًا يبدأ بـ 01.' }, 400)
  if (!emailPattern.test(email) || email.length > 120) return json({ error: 'أدخل بريدًا إلكترونيًا صحيحًا.' }, 400)
  if (nationalIdRaw && !/^\d{14}$/.test(nationalIdRaw)) return json({ error: 'الرقم القومي ١٤ رقمًا، أو اتركه فارغًا.' }, 400)
  if (paymentMethod !== 'instapay' && paymentMethod !== 'bank') return json({ error: 'اختر إنستاباي أو التحويل البنكي.' }, 400)
  if (!(receipt instanceof File) || receipt.size === 0) return json({ error: 'أرفق صورة إيصال سداد التأمين.' }, 400)

  const bytes = Buffer.from(await receipt.arrayBuffer())
  const fileCheck = readReceipt(receipt, bytes)
  if (!fileCheck.ok) return json({ error: fileCheck.error }, 400)
  if (findBidderByPhone(phone)) return json({ error: 'هذا الرقم مسجّل بالفعل. استخدم المتصفح الذي أتمّ التسجيل.' }, 409)

  const id = crypto.randomUUID()
  const token = crypto.randomBytes(32).toString('hex')
  const receiptFile = saveReceipt(id, fileCheck.extension, bytes)
  try {
    insertBidder({
      id,
      name,
      phone,
      email,
      nationalId: nationalIdRaw || null,
      paymentMethod,
      receiptFile,
      token,
      createdAt: new Date().toISOString(),
    })
  } catch {
    return json({ error: 'هذا الرقم مسجّل بالفعل. استخدم المتصفح الذي أتمّ التسجيل.' }, 409)
  }

  const response = json({
    ok: true,
    status: 'pending',
    entryFeeNoteAr: auctionConfig.entryFeeNoteAr,
  })
  response.cookies.set(BIDDER_COOKIE, token, cookieOptions(60 * 60 * 24 * 30, requestIsSecure(request)))
  return response
}
