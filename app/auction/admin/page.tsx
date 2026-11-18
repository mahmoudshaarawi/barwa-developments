import type { Metadata } from 'next'
import { AuctionAdmin } from '@/components/auction-admin'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import '../auction.css'

export const metadata: Metadata = {
  title: 'إدارة المزاد | بروة للتطوير العقاري',
  description: 'مراجعة طلبات دخول مزاد سنترال مول واعتمادها.',
  robots: { index: false, follow: false },
}

export default function AuctionAdminPage() {
  return (
    <main className="site-shell" dir="rtl" lang="ar">
      <SiteHeader variant="solid" />
      <AuctionAdmin />
      <SiteFooter />
    </main>
  )
}
