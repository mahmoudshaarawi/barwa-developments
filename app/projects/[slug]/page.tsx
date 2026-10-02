import { notFound } from 'next/navigation'
import { ProjectDetailsContent } from '@/components/project-details-content'
import { projects } from '@/lib/projects'

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }))
}

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = projects.find((item) => item.slug === slug)

  if (!project) notFound()

  return <ProjectDetailsContent project={project} />
}
