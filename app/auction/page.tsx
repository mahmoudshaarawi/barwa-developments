import type { Metadata } from 'next'
import { AuctionLanding } from '@/components/auction-landing'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { JsonLd } from '@/components/json-ld'
import { auctionConfig } from '@/lib/auction/config'
import { findBidderByToken, getPublicSnapshot } from '@/lib/auction/store'
import { bidderToken } from '@/lib/auction/http'
import { projects } from '@/lib/projects'
import { organizationJsonLd, pageMetadata, staticPage } from '@/lib/seo'
import './auction.css'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const metadata: Metadata = pageMetadata(staticPage('ar', 'auction'))

export default async function AuctionPage() {
  const project = projects.find((item) => item.slug === auctionConfig.projectSlug)
  const snapshot = getPublicSnapshot()
  const bidder = findBidderByToken(await bidderToken())
  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'مزاد وحدة G-21 في سنترال مول',
    description: staticPage('ar', 'auction').description,
    startDate: auctionConfig.startsAt,
    endDate: auctionConfig.endsAt,
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    inLanguage: 'ar',
    image: 'https://barwadevelopments.com/projects/central-mall/hero.jpg',
    location: {
      '@type': 'Place',
      name: 'سنترال مول',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'مدينة الشروق',
        addressRegion: 'شرق القاهرة',
        addressCountry: 'EG',
      },
    },
    organizer: { '@id': organizationJsonLd['@id'] },
    url: 'https://barwadevelopments.com/auction',
  }

  return (
    <main className="site-shell" dir="rtl" lang="ar">
      <JsonLd data={eventJsonLd} />
      <SiteHeader variant="overlay" />
      <AuctionLanding
        initial={{
          ...snapshot,
          me: bidder ? { status: bidder.status, name: bidder.name } : null,
        }}
        features={project?.features.map((feature) => feature.arabic) ?? []}
        location={project?.location ?? 'المنطقة المركزية الثانية · مدينة الشروق'}
        locationDetail={project?.locationContext ?? 'المنطقة المركزية الثانية، مدينة الشروق، شرق القاهرة.'}
        hero={project?.image ?? '/projects/central-mall/hero.jpg'}
      />
      <SiteFooter />
    </main>
  )
}
