import type { Metadata } from 'next'
import { NewsListing } from '@/components/news-listing'

export const metadata: Metadata = {
  title: 'الأخبار | بروة للتطوير العقاري',
  description: 'تغطية صحفية منشورة عن تعاقدات بروة وشراكاتها وتعييناتها.',
}

export default function NewsPage() {
  return <NewsListing />
}
