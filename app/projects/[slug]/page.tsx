import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/json-ld'
import { ProjectDetailsContent } from '@/components/project-details-content'
import { projects } from '@/lib/projects'
import { pageMetadata, projectEntry, projectJsonLd } from '@/lib/seo'

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((item) => item.slug === slug)
  if (!project) return {}
  return pageMetadata(projectEntry(project, 'ar'))
}

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = projects.find((item) => item.slug === slug)

  if (!project) notFound()

  return (
    <>
      <JsonLd data={projectJsonLd(project)} />
      <ProjectDetailsContent project={project} />
    </>
  )
}
