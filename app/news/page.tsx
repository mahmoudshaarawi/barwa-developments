import type { Metadata } from 'next'
import { NewsListing } from '@/components/news-listing'
import { pageMetadata, staticPage } from '@/lib/seo'

export const metadata: Metadata = pageMetadata(staticPage('ar', 'news'))

export default function NewsPage() {
  return <NewsListing />
}
