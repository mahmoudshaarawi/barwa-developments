import type { Metadata } from 'next'
import { CareersContent } from '@/components/careers-content'
import { pageMetadata, staticPage } from '@/lib/seo'

export const metadata: Metadata = pageMetadata(staticPage('ar', 'careers'))

export default function CareersPage() {
  return <CareersContent />
}
