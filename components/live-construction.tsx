'use client'

import { constructionStageLabel, type Project } from '@/lib/projects'
import { LiveCamera } from './live-camera'

export function LiveConstruction({
  items,
  isArabic,
}: {
  items: Project[]
  isArabic: boolean
}) {
  return (
    <section className="live-board section-pad" aria-labelledby="live-construction-title">
      <div className="project-section-heading">
        <span className="eyebrow">{isArabic ? 'البث المباشر' : 'LIVE SITE'}</span>
        <h2 id="live-construction-title">{isArabic ? 'مشاهدة الإنشاءات مباشر' : 'Live construction view'}</h2>
      </div>
      <div className="live-board-grid">
        {items.map((project) => {
          const stage = constructionStageLabel(project, isArabic)
          const name = isArabic ? project.arabic : project.displayName
          return (
            <article className="live-card" key={project.slug}>
              <div className="live-card-media">
                {project.liveStreamUrl ? (
                  <LiveCamera src={project.liveStreamUrl} />
                ) : (
                  <>
                    <img src={project.image} alt={isArabic ? `أحدث صورة لموقع ${name}` : `Latest view of ${name}`} style={{ objectPosition: project.imagePosition }} />
                    <div className="live-soon">
                      <strong>{isArabic ? 'البث المباشر قريباً' : 'Live feed coming soon'}</strong>
                      {stage && <span>{stage}</span>}
                    </div>
                  </>
                )}
              </div>
              <div className="live-card-copy">
                <h3>{name}</h3>
                <p>{isArabic ? project.location : project.englishLocation}</p>
                {project.liveStreamUrl && stage && <span className="stage-badge stage-badge-current">{stage}</span>}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
