'use client'

import { useCallback, useEffect, useState } from 'react'
import type { BidderRow } from '@/lib/auction/store'
import { formatEgp } from '@/lib/auction/money'
import { formatCairo } from '@/lib/auction/time'

type BidRow = {
  id: string
  amount: number
  created_at: string
  name: string
  phone: string
  email: string
}

type AdminData = {
  snapshot: { phase: string; highestBidEgp: number | null; bidCount: number; endsAt: string }
  bidders: BidderRow[]
  bids: BidRow[]
}

const statusLabel = { pending: 'قيد المراجعة', approved: 'معتمد', rejected: 'مرفوض' }

export function AuctionAdmin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [data, setData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const response = await fetch('/api/auction/admin', { cache: 'no-store' })
    if (response.status === 401) {
      setData(null)
      setLoading(false)
      return
    }
    if (response.ok) setData(await response.json())
    setLoading(false)
  }, [])

  useEffect(() => { void load() }, [load])

  async function login(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    const response = await fetch('/api/auction/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    const body = await response.json().catch(() => null) as { error?: string } | null
    if (!response.ok) {
      setError(body?.error || 'تعذر الدخول.')
      return
    }
    setPassword('')
    await load()
  }

  async function decide(id: string, status: 'approved' | 'rejected') {
    const response = await fetch('/api/auction/admin/bidders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    if (response.ok) await load()
  }

  async function logout() {
    await fetch('/api/auction/admin/logout', { method: 'POST' })
    setData(null)
  }

  if (loading) return <p className="auction-admin-note">جارٍ التحقق…</p>
  if (!data) {
    return (
      <form className="auction-form auction-admin-login" onSubmit={login}>
        <h1>إدارة المزاد</h1>
        <label>كلمة المرور<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
        {error && <p className="auction-error">{error}</p>}
        <button type="submit">دخول</button>
      </form>
    )
  }

  return (
    <div className="auction-admin">
      <header>
        <div>
          <span className="eyebrow">إدارة</span>
          <h1>مزاد وحدة G-21</h1>
          <p>الحالة: {data.snapshot.phase === 'live' ? 'جارٍ' : data.snapshot.phase === 'ended' ? 'انتهى' : 'قبل الافتتاح'} · العطاءات: {data.snapshot.bidCount} · الأعلى: {data.snapshot.highestBidEgp == null ? '—' : formatEgp(data.snapshot.highestBidEgp)}</p>
          <p>الإغلاق: {formatCairo(data.snapshot.endsAt)}</p>
        </div>
        <div className="auction-admin-actions">
          <a href="/api/auction/admin/export">تصدير المسجّلين</a>
          <a href="/api/auction/admin/export?kind=bids">تصدير العطاءات</a>
          <button type="button" onClick={logout}>خروج</button>
        </div>
      </header>

      <h2>طلبات الدخول</h2>
      <div className="auction-table-wrap">
        <table>
          <thead>
            <tr><th>الاسم</th><th>الهاتف</th><th>البريد</th><th>الرقم القومي</th><th>السداد</th><th>الحالة</th><th>الإيصال</th><th></th></tr>
          </thead>
          <tbody>
            {data.bidders.map((bidder) => (
              <tr key={bidder.id}>
                <td>{bidder.name}</td>
                <td dir="ltr">{bidder.phone}</td>
                <td dir="ltr">{bidder.email}</td>
                <td dir="ltr">{bidder.national_id || '—'}</td>
                <td>{bidder.payment_method === 'instapay' ? 'إنستاباي' : 'تحويل بنكي'}</td>
                <td>{statusLabel[bidder.status]}</td>
                <td><a href={`/api/auction/admin/receipts/${bidder.id}`} target="_blank" rel="noopener noreferrer">عرض</a></td>
                <td className="auction-admin-decide">
                  <button type="button" onClick={() => decide(bidder.id, 'approved')}>اعتماد</button>
                  <button type="button" onClick={() => decide(bidder.id, 'rejected')}>رفض</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>كل العطاءات</h2>
      <div className="auction-table-wrap">
        <table>
          <thead><tr><th>المبلغ</th><th>الاسم</th><th>الهاتف</th><th>الوقت</th></tr></thead>
          <tbody>
            {data.bids.map((bid) => (
              <tr key={bid.id}>
                <td>{formatEgp(bid.amount)}</td>
                <td>{bid.name}</td>
                <td dir="ltr">{bid.phone}</td>
                <td>{formatCairo(bid.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
