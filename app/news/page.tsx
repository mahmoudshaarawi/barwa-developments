import type { Metadata } from 'next'
import { NewsListing } from '@/components/news-listing'

export const metadata: Metadata = {
  title: 'الأخبار | بروة للتطوير العقاري',
  description: 'فيديو وأخبار منشورة عن بروة: التعاقدات والشراكات والتعيينات.',
}

export default function NewsPage() {
  return <NewsListing />
}
