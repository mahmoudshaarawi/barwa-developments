import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NewsDetail } from '@/components/news-detail'
import { getNewsStory, newsStories } from '@/data/news'
import { newsEntry, pageMetadata } from '@/lib/seo'

export function generateStaticParams() {
  return newsStories.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const story = getNewsStory(slug)
  const entry = newsEntry(slug, 'ar')
  if (!story || !entry) return {}
  return pageMetadata(entry, { publishedTime: story.date })
}

export default async function NewsStoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const story = getNewsStory(slug)
  if (!story) notFound()
  return <NewsDetail story={story} />
}
