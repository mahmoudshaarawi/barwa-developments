import type { Metadata } from 'next'
import { AboutUsContent } from '@/components/about-us-content'
import { pageMetadata, staticPage } from '@/lib/seo'

export const metadata: Metadata = pageMetadata(staticPage('ar', 'about'))

export default function AboutUsPage() {
  return <AboutUsContent />
}
