import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NewsDetail } from '@/components/news-detail'
import { getNewsStory, newsStories } from '@/data/news'

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
  if (!story) return {}
  return {
    title: `${story.titleAr} | بروة للتطوير العقاري`,
    description: story.summaryAr,
  }
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
