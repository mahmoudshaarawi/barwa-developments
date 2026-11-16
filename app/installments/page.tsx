import type { Metadata } from 'next'
import { InstallmentsContent } from '@/components/installments-content'
import { pageMetadata, staticPage } from '@/lib/seo'

export const metadata: Metadata = pageMetadata(staticPage('ar', 'installments'))

export default function InstallmentsPage() {
  return <InstallmentsContent />
}
