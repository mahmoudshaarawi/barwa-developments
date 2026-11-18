import type { Metadata } from 'next'
import { pageMetadata, staticPage } from '@/lib/seo'

export const metadata: Metadata = pageMetadata(staticPage('ar', 'projects'))

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children
}