import type { Metadata } from 'next'
import { InstallmentsContent } from '@/components/installments-content'

export const metadata: Metadata = {
  title: 'احسب القسط | بروة للتطوير العقاري',
  description: 'اختر مشروع بروة والنوع والمساحة، ثم أرسل اسمك ورقم هاتفك لنرسل حسبة القسط.',
}

export default function InstallmentsPage() {
  return <InstallmentsContent />
}
