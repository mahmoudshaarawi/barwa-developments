import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import Database from 'better-sqlite3'
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

const globalStore = globalThis as { barwaAuctionDb?: Database.Database }

export function auctionDataDir() {
  return process.env.AUCTION_DATA_DIR || path.join(process.cwd(), 'data', 'auction')
}

function database() {
  if (!globalStore.barwaAuctionDb) {
    const dir = auctionDataDir()
    fs.mkdirSync(path.join(dir, 'receipts'), { recursive: true })
    const db = new Database(path.join(dir, 'auction.db'))
    db.pragma('journal_mode = WAL')
    db.exec(`
      CREATE TABLE IF NOT EXISTS bidders (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL,
        national_id TEXT,
        payment_method TEXT NOT NULL,
        receipt_file TEXT NOT NULL,
        status TEXT NOT NULL,
        token TEXT NOT NULL UNIQUE,
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS bids (
        id TEXT PRIMARY KEY,
        bidder_id TEXT NOT NULL,
        amount INTEGER NOT NULL,
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS auction_state (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        ends_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS admin_sessions (
        token TEXT PRIMARY KEY,
        expires_at TEXT NOT NULL
      );
    `)
    globalStore.barwaAuctionDb = db
  }
  return globalStore.barwaAuctionDb
}

function ensureEndsAt(db: Database.Database) {
  const row = db.prepare('SELECT ends_at FROM auction_state WHERE id = 1').get() as { ends_at: string } | undefined
  const bidCount = (db.prepare('SELECT COUNT(*) AS count FROM bids').get() as { count: number }).count
  if (!row) {
    db.prepare('INSERT INTO auction_state (id, ends_at) VALUES (1, ?)').run(auctionConfig.endsAt)
    return auctionConfig.endsAt
  }
  if (bidCount === 0 && row.ends_at !== auctionConfig.endsAt) {
    db.prepare('UPDATE auction_state SET ends_at = ? WHERE id = 1').run(auctionConfig.endsAt)
    return auctionConfig.endsAt
  }
  return row.ends_at
}

function history(db: Database.Database): PublicBid[] {
  const rows = db.prepare(`
    SELECT bids.amount, bids.created_at, bidders.name
    FROM bids JOIN bidders ON bidders.id = bids.bidder_id
    ORDER BY bids.created_at DESC, bids.rowid DESC
    LIMIT 40
  `).all() as Array<{ amount: number; created_at: string; name: string }>
  return rows.map((row) => ({
    amountEgp: row.amount,
    maskedName: maskBidderName(row.name),
    createdAt: row.created_at,
  }))
}

export function getPublicSnapshot(now = new Date()): PublicSnapshot {
  const db = database()
  const endsAt = ensureEndsAt(db)
  const endsMs = parseAuctionInstant(endsAt)
  const phase = phaseAt(now, endsMs)
  const highest = db.prepare('SELECT amount FROM bids ORDER BY amount DESC LIMIT 1').get() as { amount: number } | undefined
  const bidCount = (db.prepare('SELECT COUNT(*) AS count FROM bids').get() as { count: number }).count
  const bids = history(db)
  const highestBidEgp = highest?.amount ?? null
  const nextBidEgp = phase === 'ended' ? null : (highestBidEgp ?? auctionConfig.openingPriceEgp) + auctionConfig.incrementEgp
  const winner = phase === 'ended' && bids[0]
    ? { maskedName: bids[0].maskedName, amountEgp: bids[0].amountEgp }
    : null
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
    nextBidEgp,
    bidCount,
    history: bids,
    winner,
    antiSnipe: auctionConfig.antiSnipe,
  }
}

export function findBidderByToken(token: string) {
  if (!token) return null
  return database().prepare('SELECT * FROM bidders WHERE token = ?').get(token) as BidderRow | undefined ?? null
}

export function findBidderByPhone(phone: string) {
  return database().prepare('SELECT id FROM bidders WHERE phone = ?').get(phone) as { id: string } | undefined
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
  database().prepare(`
    INSERT INTO bidders (id, name, phone, email, national_id, payment_method, receipt_file, status, token, created_at)
    VALUES (@id, @name, @phone, @email, @nationalId, @paymentMethod, @receiptFile, 'pending', @token, @createdAt)
  `).run(input)
}

export type BidResult =
  | { ok: true; snapshot: PublicSnapshot }
  | { ok: false; status: number; error: string; snapshot: PublicSnapshot }

export function placeBid(token: string, amount: number, now = new Date()): BidResult {
  const db = database()
  db.exec('BEGIN IMMEDIATE')
  try {
    const result = placeBidLocked(db, token, amount, now)
    db.exec('COMMIT')
    return result
  } catch (error) {
    db.exec('ROLLBACK')
    throw error
  }
}

function placeBidLocked(db: Database.Database, token: string, amount: number, now: Date): BidResult {
    const bidder = db.prepare('SELECT * FROM bidders WHERE token = ?').get(token) as BidderRow | undefined
    const endsAt = ensureEndsAt(db)
    const endsMs = parseAuctionInstant(endsAt)
    const phase = phaseAt(now, endsMs)
    const snapshot = () => getPublicSnapshot(now)
    if (!bidder) return { ok: false as const, status: 401, error: 'سجّل دخولك من نفس المتصفح الذي أتمّ التسجيل.', snapshot: snapshot() }
    if (bidder.status !== 'approved') return { ok: false as const, status: 403, error: 'المزايدة متاحة بعد اعتماد تأمين الدخول.', snapshot: snapshot() }
    if (phase !== 'live') return { ok: false as const, status: 403, error: phase === 'upcoming' ? 'لم يبدأ المزاد بعد.' : 'انتهى المزاد.', snapshot: snapshot() }
    const highest = db.prepare('SELECT amount FROM bids ORDER BY amount DESC LIMIT 1').get() as { amount: number } | undefined
    const expected = (highest?.amount ?? auctionConfig.openingPriceEgp) + auctionConfig.incrementEgp
    if (amount !== expected) {
      return { ok: false as const, status: 409, error: 'تغيّر أعلى عطاء. حدّث السعر ثم أكّد المزايدة.', snapshot: snapshot() }
    }
    let nextEnds = endsAt
    if (auctionConfig.antiSnipe.enabled) {
      const windowMs = auctionConfig.antiSnipe.windowMinutes * 60_000
      const extendMs = auctionConfig.antiSnipe.extendMinutes * 60_000
      if (endsMs - now.getTime() <= windowMs) {
        nextEnds = new Date(endsMs + extendMs).toISOString()
        db.prepare('UPDATE auction_state SET ends_at = ? WHERE id = 1').run(nextEnds)
      }
    }
    db.prepare('INSERT INTO bids (id, bidder_id, amount, created_at) VALUES (?, ?, ?, ?)').run(
      crypto.randomUUID(),
      bidder.id,
      amount,
      now.toISOString(),
    )
    return { ok: true as const, snapshot: getPublicSnapshot(now) }
}

export function createAdminSession() {
  const token = crypto.randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString()
  database().prepare('INSERT INTO admin_sessions (token, expires_at) VALUES (?, ?)').run(token, expires)
  return token
}

export function adminSessionValid(token: string | undefined) {
  if (!token) return false
  const row = database().prepare('SELECT expires_at FROM admin_sessions WHERE token = ?').get(token) as { expires_at: string } | undefined
  return Boolean(row && Date.parse(row.expires_at) > Date.now())
}

export function deleteAdminSession(token: string) {
  database().prepare('DELETE FROM admin_sessions WHERE token = ?').run(token)
}

export function listBidders() {
  return database().prepare('SELECT * FROM bidders ORDER BY created_at DESC').all() as BidderRow[]
}

export function listBidsDetailed() {
  return database().prepare(`
    SELECT bids.id, bids.amount, bids.created_at, bids.bidder_id, bidders.name, bidders.phone, bidders.email
    FROM bids JOIN bidders ON bidders.id = bids.bidder_id
    ORDER BY bids.created_at DESC
  `).all() as BidJoin[]
}

export function setBidderStatus(id: string, status: BidderStatus) {
  const result = database().prepare('UPDATE bidders SET status = ? WHERE id = ?').run(status, id)
  return result.changes > 0
}

export function bidderReceiptPath(id: string) {
  const row = database().prepare('SELECT receipt_file FROM bidders WHERE id = ?').get(id) as { receipt_file: string } | undefined
  if (!row?.receipt_file) return null
  const file = path.basename(row.receipt_file)
  const receiptsDir = path.resolve(auctionDataDir(), 'receipts')
  const full = path.resolve(receiptsDir, file)
  if (!full.startsWith(receiptsDir + path.sep)) return null
  return fs.existsSync(full) ? full : null
}

export function saveReceipt(id: string, extension: string, bytes: Buffer) {
  const file = `${id}${extension}`
  const full = path.join(auctionDataDir(), 'receipts', file)
  fs.writeFileSync(full, bytes)
  return file
}
