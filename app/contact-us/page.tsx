import type { Metadata } from 'next'
import { ContactUsContent } from '@/components/contact-us-content'

export const metadata: Metadata = {
  title: 'تواصل معنا | بروة للتطوير العقاري',
  description: 'تواصل مع بروة للتطوير العقاري عبر الرقم الموحد 17582 أو أرسل استفسارك عن مشروعاتنا.',
}

export default function ContactUsPage() {
  return <ContactUsContent />
}
