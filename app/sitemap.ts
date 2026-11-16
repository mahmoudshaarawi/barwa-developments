import type { MetadataRoute } from 'next'
import { newsStories } from '@/data/news'
import { projects } from '@/lib/projects'
import { siteUrl, staticPage } from '@/lib/seo'

const updated = new Date('2026-11-16')

export default function sitemap(): MetadataRoute.Sitemap {
  const staticKeys = ['home', 'about', 'projects', 'installments', 'pastWork', 'news', 'contact', 'careers'] as const
  return [
    ...staticKeys.map((key) => {
      const path = staticPage('ar', key).path
      return {
        url: path === '/' ? siteUrl : `${siteUrl}${path}`,
        lastModified: updated,
      }
    }),
    ...projects.map((project) => ({
      url: `${siteUrl}/projects/${project.slug}`,
      lastModified: updated,
    })),
    ...newsStories.map((story) => ({
      url: `${siteUrl}/news/${story.slug}`,
      lastModified: new Date(story.date),
    })),
  ]
}
