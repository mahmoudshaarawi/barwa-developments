import type { Metadata } from 'next'
import { PastWorkContent } from '@/components/past-work-content'

export const metadata: Metadata = {
  title: 'سابقة أعمالنا | بروة للتطوير العقاري',
  description: 'أعمال سكنية في أحياء مدينة الشروق، نُفّذت بالشراكة مع الراجحي للمشروعات العمرانية: أكثر من 150 مشروعًا وأكثر من 1500 عميل.',
}

export default function PastWorkPage() {
  return <PastWorkContent />
}
