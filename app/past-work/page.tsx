import type { Metadata } from 'next'
import { PastWorkContent } from '@/components/past-work-content'
import { pageMetadata, staticPage } from '@/lib/seo'

export const metadata: Metadata = pageMetadata(staticPage('ar', 'pastWork'))

export default function PastWorkPage() {
  return <PastWorkContent />
}
