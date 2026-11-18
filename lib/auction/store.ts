import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { auctionConfig } from './config'
import { maskBidderName } from './mask'
import { parseAuctionInstant, phaseAt, type AuctionPhase } from './time'

export type BidderStatus = 'pending' | 'approved' | 'rejected'
export type PaymentMethod = 'instapay' | 'bank'

export type BidderRow = {
  id: string
  name: string
  phone: string
  email: string
  national_id: string | null
  payment_method: PaymentMethod
  receipt_file: string
  status: BidderStatus
  token: string
  created_at: string
}

type BidRow = {
  id: string
  bidder_id: string
  amount: number
  created_at: string
}

type AdminSession = {
  token: string
  expires_at: string
}

type StoreData = {
  bidders: BidderRow[]
  bids: BidRow[]
  endsAt: string | null
  adminSessions: AdminSession[]
}

export type PublicBid = {
  amountEgp: number
  maskedName: string
  createdAt: string
}

export type PublicSnapshot = {
  phase: AuctionPhase
  serverNow: string
  startsAt: string
  endsAt: string
  openingPriceEgp: number
  incrementEgp: number
  entryFeeEgp: number
  entryFeeNoteAr: string
  highestBidEgp: number | null
  nextBidEgp: number | null
  bidCount: number
  history: PublicBid[]
  winner: { maskedName: string; amountEgp: number } | null
  antiSnipe: { enabled: boolean; windowMinutes: number; extendMinutes: number }
}

type BidJoin = {
  id: string
  amount: number
  created_at: string
  name: string
  bidder_id: string
  phone: string
  email: string
}

const emptyStore = (): StoreData => ({ bidders: [], bids: [], endsAt: null, adminSessions: [] })

export function auctionDataDir() {
  return process.env.AUCTION_DATA_DIR || path.join(process.cwd(), 'data', 'auction')
}

function storePath() {
  return path.join(auctionDataDir(), 'store.json')
}

function lockPath() {
  return path.join(auctionDataDir(), 'store.lock')
}

function sleep(ms: number) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms)
}

function readStore(): StoreData {
  try {
    const parsed = JSON.parse(fs.readFileSync(storePath(), 'utf8')) as Partial<StoreData>
    return {
      bidders: Array.isArray(parsed.bidders) ? parsed.bidders : [],
      bids: Array.isArray(parsed.bids) ? parsed.bids : [],
      endsAt: typeof parsed.endsAt === 'string' ? parsed.endsAt : null,
      adminSessions: Array.isArray(parsed.adminSessions) ? parsed.adminSessions : [],
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return emptyStore()
    throw error
  }
}

function writeStore(store: StoreData) {
  const file = storePath()
  const temporary = `${file}.${process.pid}.tmp`
  fs.writeFileSync(temporary, JSON.stringify(store))
  fs.renameSync(temporary, file)
}

function withStore<T>(fn: (store: StoreData) => T): T {
  const dir = auctionDataDir()
  fs.mkdirSync(path.join(dir, 'receipts'), { recursive: true })
  const lock = lockPath()
  const started = Date.now()
  let handle: number | null = null
  while (handle == null) {
    try {
      handle = fs.openSync(lock, 'wx')
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error
      try {
        if (Date.now() - fs.statSync(lock).mtimeMs > 10_000) fs.unlinkSync(lock)
      } catch {
        // another process removed the lock
      }
      if (Date.now() - started > 8_000) throw new Error('Auction store is busy.')
      sleep(20)
    }
  }
  try {
    const store = readStore()
    const before = JSON.stringify(store)
    const result = fn(store)
    if (JSON.stringify(store) !== before) writeStore(store)
    return result
  } finally {
    fs.closeSync(handle)
    try { fs.unlinkSync(lock) } catch { /* already removed */ }
  }
}

function bidderName(store: StoreData, bidderId: string) {
  return store.bidders.find((bidder) => bidder.id === bidderId)?.name ?? ''
}

function highestAmount(store: StoreData) {
  return store.bids.reduce<number | null>((highest, bid) => (
    highest == null || bid.amount > highest ? bid.amount : highest
  ), null)
}

function ensureEndsAt(store: StoreData) {
  if (store.bids.length === 0) {
    store.endsAt = auctionConfig.endsAt
    return auctionConfig.endsAt
  }
  if (!store.endsAt) store.endsAt = auctionConfig.endsAt
  return store.endsAt
}

function publicHistory(store: StoreData): PublicBid[] {
  return [...store.bids]
    .sort((left, right) => right.created_at.localeCompare(left.created_at) || right.id.localeCompare(left.id))
    .slice(0, 40)
    .map((bid) => ({
      amountEgp: bid.amount,
      maskedName: maskBidderName(bidderName(store, bid.bidder_id)),
      createdAt: bid.created_at,
    }))
}

function snapshotFrom(store: StoreData, now: Date): PublicSnapshot {
  const endsAt = ensureEndsAt(store)
  const phase = phaseAt(now, parseAuctionInstant(endsAt))
  const history = publicHistory(store)
  const highestBidEgp = highestAmount(store)
  const winningBid = [...store.bids].sort((left, right) => right.amount - left.amount || right.created_at.localeCompare(left.created_at))[0]
  return {
    phase,
    serverNow: now.toISOString(),
    startsAt: auctionConfig.startsAt,
    endsAt,
    openingPriceEgp: auctionConfig.openingPriceEgp,
    incrementEgp: auctionConfig.incrementEgp,
    entryFeeEgp: auctionConfig.entryFeeEgp,
    entryFeeNoteAr: auctionConfig.entryFeeNoteAr,
    highestBidEgp,
    nextBidEgp: phase === 'ended' ? null : (highestBidEgp ?? auctionConfig.openingPriceEgp) + auctionConfig.incrementEgp,
    bidCount: store.bids.length,
    history,
    winner: phase === 'ended' && winningBid
      ? { maskedName: maskBidderName(bidderName(store, winningBid.bidder_id)), amountEgp: winningBid.amount }
      : null,
    antiSnipe: auctionConfig.antiSnipe,
  }
}

export function getPublicSnapshot(now = new Date()) {
  return withStore((store) => snapshotFrom(store, now))
}

export function findBidderByToken(token: string) {
  if (!token) return null
  return withStore((store) => store.bidders.find((bidder) => bidder.token === token) ?? null)
}

export function findBidderByPhone(phone: string) {
  return withStore((store) => {
    const bidder = store.bidders.find((item) => item.phone === phone)
    return bidder ? { id: bidder.id } : undefined
  })
}

export function insertBidder(input: {
  id: string
  name: string
  phone: string
  email: string
  nationalId: string | null
  paymentMethod: PaymentMethod
  receiptFile: string
  token: string
  createdAt: string
}) {
  withStore((store) => {
    if (store.bidders.some((bidder) => bidder.phone === input.phone)) {
      throw new Error('PHONE_TAKEN')
    }
    store.bidders.push({
      id: input.id,
      name: input.name,
      phone: input.phone,
      email: input.email,
      national_id: input.nationalId,
      payment_method: input.paymentMethod,
      receipt_file: input.receiptFile,
      status: 'pending',
      token: input.token,
      created_at: input.createdAt,
    })
  })
}

export type BidResult =
  | { ok: true; snapshot: PublicSnapshot }
  | { ok: false; status: number; error: string; snapshot: PublicSnapshot }

export function placeBid(token: string, amount: number, now = new Date()): BidResult {
  return withStore((store) => {
    const bidder = store.bidders.find((item) => item.token === token)
    const endsAt = ensureEndsAt(store)
    const endsMs = parseAuctionInstant(endsAt)
    const phase = phaseAt(now, endsMs)
    const fail = (status: number, error: string): BidResult => ({ ok: false, status, error, snapshot: snapshotFrom(store, now) })
    if (!bidder) return fail(401, 'سجّل دخولك من نفس المتصفح الذي أتمّ التسجيل.')
    if (bidder.status !== 'approved') return fail(403, 'المزايدة متاحة بعد اعتماد تأمين الدخول.')
    if (phase !== 'live') return fail(403, phase === 'upcoming' ? 'لم يبدأ المزاد بعد.' : 'انتهى المزاد.')
    const expected = (highestAmount(store) ?? auctionConfig.openingPriceEgp) + auctionConfig.incrementEgp
    if (amount !== expected) return fail(409, 'تغيّر أعلى عطاء. حدّث السعر ثم أكّد المزايدة.')
    if (auctionConfig.antiSnipe.enabled && endsMs - now.getTime() <= auctionConfig.antiSnipe.windowMinutes * 60_000) {
      store.endsAt = new Date(endsMs + auctionConfig.antiSnipe.extendMinutes * 60_000).toISOString()
    }
    store.bids.push({
      id: crypto.randomUUID(),
      bidder_id: bidder.id,
      amount,
      created_at: now.toISOString(),
    })
    return { ok: true, snapshot: snapshotFrom(store, now) }
  })
}

export function createAdminSession() {
  const token = crypto.randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString()
  withStore((store) => {
    store.adminSessions.push({ token, expires_at: expires })
  })
  return token
}

export function adminSessionValid(token: string | undefined) {
  if (!token) return false
  return withStore((store) => {
    const session = store.adminSessions.find((item) => item.token === token)
    return Boolean(session && Date.parse(session.expires_at) > Date.now())
  })
}

export function deleteAdminSession(token: string) {
  withStore((store) => {
    store.adminSessions = store.adminSessions.filter((session) => session.token !== token)
  })
}

export function listBidders() {
  return withStore((store) => [...store.bidders].sort((left, right) => right.created_at.localeCompare(left.created_at)))
}

export function listBidsDetailed() {
  return withStore((store) => [...store.bids]
    .sort((left, right) => right.created_at.localeCompare(left.created_at))
    .map((bid) => {
      const bidder = store.bidders.find((item) => item.id === bid.bidder_id)
      return {
        id: bid.id,
        amount: bid.amount,
        created_at: bid.created_at,
        bidder_id: bid.bidder_id,
        name: bidder?.name ?? '',
        phone: bidder?.phone ?? '',
        email: bidder?.email ?? '',
      } satisfies BidJoin
    }))
}

export function setBidderStatus(id: string, status: BidderStatus) {
  return withStore((store) => {
    const bidder = store.bidders.find((item) => item.id === id)
    if (!bidder) return false
    bidder.status = status
    return true
  })
}

export function bidderReceiptPath(id: string) {
  const fileName = withStore((store) => store.bidders.find((bidder) => bidder.id === id)?.receipt_file)
  if (!fileName) return null
  const file = path.basename(fileName)
  const receiptsDir = path.resolve(auctionDataDir(), 'receipts')
  const full = path.resolve(receiptsDir, file)
  if (!full.startsWith(receiptsDir + path.sep)) return null
  return fs.existsSync(full) ? full : null
}

export function saveReceipt(id: string, extension: string, bytes: Buffer) {
  const file = `${id}${extension}`
  const receiptsDir = path.join(auctionDataDir(), 'receipts')
  fs.mkdirSync(receiptsDir, { recursive: true })
  fs.writeFileSync(path.join(receiptsDir, file), bytes)
  return file
}
