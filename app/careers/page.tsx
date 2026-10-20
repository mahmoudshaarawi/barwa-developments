import type { Metadata } from 'next'
import { CareersContent } from '@/components/careers-content'

export const metadata: Metadata = {
  title: 'التوظيف | بروة للتطوير العقاري',
  description: 'انضم إلى فريق بروة للتطوير العقاري وأرسل طلب التوظيف.',
}

export default function CareersPage() {
  return <CareersContent />
}
