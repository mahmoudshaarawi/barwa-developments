import type { Metadata } from 'next'
import { ContactUsContent } from '@/components/contact-us-content'
import { pageMetadata, staticPage } from '@/lib/seo'

export const metadata: Metadata = pageMetadata(staticPage('ar', 'contact'))

export default function ContactUsPage() {
  return <ContactUsContent />
}
