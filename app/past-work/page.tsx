import type { Metadata } from 'next'
import { PastWorkContent } from '@/components/past-work-content'

export const metadata: Metadata = {
  title: 'سابقة أعمالنا | بروة للتطوير العقاري',
  description: 'أكثر من 150 مشروعًا تم تسليمها لعملائنا في مدينة الشروق.',
}

export default function PastWorkPage() {
  return <PastWorkContent />
}
