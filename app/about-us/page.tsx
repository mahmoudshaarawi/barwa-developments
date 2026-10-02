import type { Metadata } from 'next'
import { AboutUsContent } from '@/components/about-us-content'

export const metadata: Metadata = {
  title: 'من نحن | بروة للتطوير العقاري',
  description: 'تعرف على بروة للتطوير العقاري ونهجها في تطوير وجهات عقارية تجمع بين المواقع المميزة والجودة والقيمة.',
}

export default function AboutUsPage() {
  return <AboutUsContent />
}
