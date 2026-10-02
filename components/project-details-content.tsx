'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import {
  Accessibility,
  ArrowUpLeft,
  ArrowUpRight,
  Building2,
  Car,
  Check,
  Circle,
  DoorOpen,
  Flame,
  Layers,
  Mail,
  MapPin,
  Monitor,
  Moon,
  MoveVertical,
  PanelsTopLeft,
  Phone,
  Shield,
  Trees,
  Waves,
  X,
  ZoomIn,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SiteFooter } from './site-footer'
import { SiteHeader } from './site-header'
import { useLanguage } from './language-provider'
import { CONTACT } from '@/lib/contact'
import {
  projects,
  type ConstructionStageStatus,
  type Project,
  type ProjectFeature,
  type ProjectUnit,
} from '@/lib/projects'

type LightboxImage = {
  src: string
  alt: string
  kind: 'image' | 'plan'
}

const featureIcons: Record<ProjectFeature['icon'], LucideIcon> = {
  trees: Trees,
  parking: Car,
  entrances: DoorOpen,
  elevators: MoveVertical,
  stairs: PanelsTopLeft,
  plaza: Layers,
  fountain: Waves,
  escalator: MoveVertical,
  emergency: Shield,
  wc: Building2,
  terraces: PanelsTopLeft,
  access: Shield,
  accessibility: Accessibility,
  fire: Flame,
  prayer: Moon,
  screens: Monitor,
  facade: Accessibility,
}

export function ProjectDetailsContent({ project }: { project: Project }) {
  const { language } = useLanguage()
  const isArabic = language === 'ar'
  const [selectedFloor, setSelectedFloor] = useState(project.floors[0]?.key ?? '')
  const [lightbox, setLightbox] = useState<LightboxImage | null>(null)
  const [selectedUnit, setSelectedUnit] = useState<ProjectUnit | null>(null)
  const [showReservationForm, setShowReservationForm] = useState(false)
  const [reservationStatus, setReservationStatus] = useState<'idle' | 'email-opened'>('idle')
  const floor = project.floors.find((item) => item.key === selectedFloor) ?? project.floors[0]
  const asset = (file: string) => `${project.assetDirectory}/${file}`
  const locationMap = project.locationMap
  const projectName = isArabic ? project.arabic : project.displayName
  const projectDescription = isArabic
    ? project.detailDescription ?? project.description
    : project.englishDetailDescription ?? project.englishDescription
  const otherProjects = projects.filter((item) => item.slug !== project.slug)
  const floorPlanFile = (floorKey: string) => project.floorPlans.find((plan) => plan.floorKey === floorKey)?.image ?? `${floorKey}.jpg`
  const currentConstructionStage = project.operations.constructionStages.find(
    (stage) => stage.id === project.operations.currentConstructionStage,
  )

  useEffect(() => {
    setSelectedFloor(project.floors[0]?.key ?? '')
    setLightbox(null)
  }, [project])

  useEffect(() => {
    if (!lightbox && !selectedUnit) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLightbox(null)
        setSelectedUnit(null)
        setShowReservationForm(false)
      }
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [lightbox, selectedUnit])

  const visibleUnits = project.operations.units.filter((unit) => unit.floorKey === selectedFloor)
  const constructionProgress = project.operations.constructionProgress

  return (
    <main className="site-shell project-detail-page" dir={isArabic ? 'rtl' : 'ltr'}>
      <SiteHeader variant="overlay" />

      <section className="project-detail-hero" aria-label={projectName}>
        <img className="project-detail-hero-image" src={asset('hero.jpg')} alt="" fetchPriority="high" />
        <div className="project-detail-hero-overlay" />
        <div className="project-detail-hero-copy">
          <Link href="/projects" className="project-detail-back">
            {isArabic ? 'مشاريعنا' : 'All projects'}
            {isArabic ? <ArrowUpRight aria-hidden="true" /> : <ArrowUpLeft aria-hidden="true" />}
          </Link>
          <span className="project-detail-location"><MapPin aria-hidden="true" />{isArabic ? project.location : project.englishLocation}</span>
          <h1 dir="auto">{projectName}</h1>
          <span className="project-detail-type">{isArabic ? project.type : project.englishType}</span>
          <h2>{isArabic ? project.tagline : project.englishTagline}</h2>
          <p>{isArabic ? project.description : project.englishDescription}</p>
          <Link href={`/contact-us?project=${project.slug}`} className="button-link">
            {isArabic ? 'استفسر عن المشروع' : 'Enquire about this project'}
            {isArabic ? <ArrowUpLeft aria-hidden="true" /> : <ArrowUpRight aria-hidden="true" />}
          </Link>
        </div>
        <span className="project-detail-hero-number">{project.number} / 03</span>
      </section>

      <section className="project-facts" aria-label={isArabic ? 'معلومات المشروع' : 'Project information'}>
        {project.facts.map((fact) => (
          <div className="project-fact" key={fact.englishLabel}>
            <span>{isArabic ? fact.label : fact.englishLabel}</span>
            <strong>{isArabic ? fact.value : fact.englishValue}</strong>
          </div>
        ))}
      </section>

      <section className="project-overview section-pad">
        <div className="project-section-heading">
          <span className="eyebrow">{isArabic ? '01 / نبذة' : '01 / OVERVIEW'}</span>
          <h2>{isArabic ? 'عن المشروع' : 'About the Project'}</h2>
        </div>
        <div className="project-overview-copy">
          <div>
            <p>{projectDescription}</p>
            {project.projectComposition && (
              <p>{isArabic ? project.projectComposition : project.englishProjectComposition}</p>
            )}
            <span className="project-overview-type">
              {isArabic ? project.type : project.englishType}
            </span>
          </div>
          <button
            className="project-overview-image"
            type="button"
            onClick={() => setLightbox({
              src: asset('gallery-01.jpg'),
              alt: isArabic ? `صورة معمارية لمشروع ${projectName}` : `Architecture image for ${projectName}`,
              kind: 'image',
            })}
            aria-label={isArabic ? 'تكبير صورة المشروع' : 'Enlarge project image'}
          >
            <img src={asset('gallery-01.jpg')} alt="" loading="lazy" />
            <span><ZoomIn aria-hidden="true" />{isArabic ? 'عرض الصورة' : 'View image'}</span>
          </button>
        </div>
      </section>

      <section className="project-location section-pad">
        <div className="project-section-heading">
          <span className="eyebrow">{isArabic ? '02 / الموقع' : '02 / LOCATION'}</span>
          <h2>{isArabic ? 'موقع المشروع' : 'Project Location'}</h2>
        </div>
        <div className={`project-location-content ${!project.locationContext ? 'is-compact' : ''}`}>
          {project.locationContext && (
            <div className="project-location-copy">
              <MapPin aria-hidden="true" />
              <h3>{isArabic ? project.location : project.englishLocation}</h3>
              <p>{isArabic ? project.locationContext : project.englishLocationContext}</p>
            </div>
          )}
          {locationMap && (
            <button
              type="button"
              className="project-map"
              onClick={() => setLightbox({
                src: asset(locationMap),
                alt: isArabic ? `خريطة موقع مشروع ${projectName}` : `Location map for ${projectName}`,
                kind: 'image',
              })}
              aria-label={isArabic ? 'تكبير خريطة الموقع' : 'Enlarge location map'}
            >
              <img src={asset(locationMap)} alt="" loading="lazy" />
              <span><ZoomIn aria-hidden="true" />{isArabic ? 'تكبير الخريطة' : 'Enlarge map'}</span>
            </button>
          )}
        </div>
      </section>

      <section className="project-gallery section-pad">
        <div className="project-section-heading">
          <span className="eyebrow">{isArabic ? '03 / صور' : '03 / IMAGERY'}</span>
          <h2>{isArabic ? 'معرض المشروع' : 'Project Gallery'}</h2>
        </div>
        <div className="project-gallery-grid">
          {project.galleryImages.map((image) => (
            <button
              type="button"
              className="project-gallery-item"
              key={image}
              onClick={() => setLightbox({
                src: asset(image),
                alt: isArabic ? `صورة من مشروع ${projectName}` : `${projectName} project image`,
                kind: 'image',
              })}
              aria-label={isArabic ? 'تكبير صورة المشروع' : 'Enlarge project image'}
            >
              <img src={asset(image)} alt="" loading="lazy" />
              <span><ZoomIn aria-hidden="true" /></span>
            </button>
          ))}
        </div>
      </section>

      <section className="project-floor-plans section-pad">
        <div className="project-section-heading">
          <span className="eyebrow">{isArabic ? '04 / المخططات' : '04 / PLANS'}</span>
          <h2>{isArabic ? 'مخططات المشروع' : 'Floor Plans'}</h2>
        </div>
        <div className="project-floor-tabs" role="tablist" aria-label={isArabic ? 'طوابق المشروع' : 'Project floors'}>
          {project.floors.map((item) => (
            <button
              key={item.key}
              type="button"
              id={`floor-tab-${item.key}`}
              role="tab"
              aria-selected={selectedFloor === item.key}
              aria-controls="project-floor-panel"
              className={selectedFloor === item.key ? 'is-selected' : ''}
              onClick={() => setSelectedFloor(item.key)}
            >
              {isArabic ? item.arabic : item.english}
            </button>
          ))}
        </div>
        {floor && (
          <div
            className="project-floor-panel"
            id="project-floor-panel"
            role="tabpanel"
            aria-labelledby={`floor-tab-${floor.key}`}
          >
            <button
              type="button"
              className="project-floor-image"
              onClick={() => setLightbox({
                src: asset(floorPlanFile(floor.key)),
                alt: `${projectName} — ${isArabic ? floor.arabic : floor.english}`,
                kind: 'plan',
              })}
              aria-label={isArabic ? 'تكبير المخطط' : 'Enlarge plan'}
            >
              <img src={asset(floorPlanFile(floor.key))} alt={`${projectName} — ${isArabic ? floor.arabic : floor.english}`} loading="lazy" />
            </button>
            <button
              type="button"
              className="project-plan-enlarge"
              onClick={() => setLightbox({
                src: asset(floorPlanFile(floor.key)),
                alt: `${projectName} — ${isArabic ? floor.arabic : floor.english}`,
                kind: 'plan',
              })}
            >
              <ZoomIn aria-hidden="true" />
              {isArabic ? 'تكبير المخطط' : 'Enlarge Plan'}
            </button>
          </div>
        )}
      </section>

      <section className="project-units section-pad">
        <div className="project-section-heading">
          <span className="eyebrow">{isArabic ? '05 / الوحدات' : '05 / UNITS'}</span>
          <h2>{isArabic ? 'الوحدات المتاحة' : 'Available Units'}</h2>
          <p>{isArabic
            ? 'استكشف مخططات الطوابق والوحدات المنشورة. تُعرض بيانات التوفر عند تأكيدها.'
            : 'Explore floor plans and published units. Availability details are shown when verified.'}</p>
        </div>
        <div className="project-floor-tabs" role="tablist" aria-label={isArabic ? 'طوابق الوحدات' : 'Unit floors'}>
          {project.floors.map((item) => (
            <button
              key={item.key}
              type="button"
              id={`unit-floor-tab-${item.key}`}
              role="tab"
              aria-selected={selectedFloor === item.key}
              aria-controls="project-units-panel"
              className={selectedFloor === item.key ? 'is-selected' : ''}
              onClick={() => setSelectedFloor(item.key)}
            >
              {isArabic ? item.arabic : item.english}
            </button>
          ))}
        </div>
        {floor && (
          <div
            className="project-units-panel"
            id="project-units-panel"
            role="tabpanel"
            aria-labelledby={`unit-floor-tab-${floor.key}`}
          >
            <button
              className="project-units-plan"
              type="button"
              onClick={() => setLightbox({
                src: asset(floorPlanFile(floor.key)),
                alt: `${projectName} — ${isArabic ? floor.arabic : floor.english}`,
                kind: 'plan',
              })}
              aria-label={isArabic ? `تكبير مخطط ${floor.arabic}` : `Enlarge ${floor.english} plan`}
            >
              <img src={asset(floorPlanFile(floor.key))} alt={`${projectName} — ${isArabic ? floor.arabic : floor.english}`} loading="lazy" />
              <span><ZoomIn aria-hidden="true" />{isArabic ? 'تكبير المخطط' : 'Enlarge floor plan'}</span>
            </button>
            <div className="project-units-list">
              <div className="project-units-list-heading">
                <h3>{isArabic ? 'الوحدات في هذا الطابق' : 'Units on this floor'}</h3>
                {visibleUnits.length > 0 && <span>{visibleUnits.length}</span>}
              </div>
              {visibleUnits.length > 0 ? (
                <div className="project-units-cards">
                  {visibleUnits.map((unit) => (
                    <button
                      key={unit.id}
                      type="button"
                      className="project-unit-card"
                      onClick={() => {
                        setSelectedUnit(unit)
                        setShowReservationForm(false)
                        setReservationStatus('idle')
                      }}
                    >
                      <span className={`project-unit-status is-${unit.status}`}>
                        {isArabic ? unitStatusArabic[unit.status] : unitStatusEnglish[unit.status]}
                      </span>
                      {unit.unitNumber && <strong>{isArabic ? `وحدة ${unit.unitNumber}` : `Unit ${unit.unitNumber}`}</strong>}
                      <span>{isArabic ? floor.arabic : floor.english}</span>
                      {(unit.type || unit.englishType) && <span>{isArabic ? unit.type ?? unit.englishType : unit.englishType ?? unit.type}</span>}
                      {unit.area != null && <span>{formatUnitArea(unit.area, isArabic)}</span>}
                      {unit.price != null && <span>{formatUnitPrice(unit.price, unit.currency, isArabic)}</span>}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="project-units-empty">
                  {isArabic
                    ? 'لا توجد بيانات وحدات منشورة لهذا الطابق حاليًا.'
                    : 'No unit information has been published for this floor yet.'}
                </p>
              )}
            </div>
          </div>
        )}
      </section>

      {project.features.length > 0 && (
        <section className="project-features section-pad">
          <div className="project-section-heading">
            <span className="eyebrow">{isArabic ? '06 / التفاصيل' : '06 / DETAILS'}</span>
            <h2>{isArabic ? 'مميزات المشروع' : 'Project Features'}</h2>
          </div>
          <ul className="project-features-grid">
            {project.features.map((feature) => {
              const Icon = featureIcons[feature.icon]
              return (
                <li key={feature.english} className="project-feature">
                  <Icon aria-hidden="true" />
                  <span>{isArabic ? feature.arabic : feature.english}</span>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      <section className="project-construction section-pad">
        <div className="project-section-heading">
          <span className="eyebrow">{isArabic ? '07 / مراحل التطوير' : '07 / DEVELOPMENT JOURNEY'}</span>
          <h2>{isArabic ? 'مراحل الإنشاء' : 'Construction Progress'}</h2>
          <p>{isArabic
            ? 'تُحدّث حالة المراحل عند توفر معلومات موثقة.'
            : 'Stage status is updated when verified information is available.'}</p>
        </div>
        {currentConstructionStage && (
          <div className="project-current-stage">
            <span>{isArabic ? 'المرحلة الحالية' : 'Current Stage'}</span>
            <strong>{isArabic ? currentConstructionStage.titleAr : currentConstructionStage.titleEn}</strong>
          </div>
        )}
        {constructionProgress != null && constructionProgress >= 0 && constructionProgress <= 100 && (
          <div className="project-progress">
            <span>{isArabic ? 'نسبة الإنجاز' : 'Construction Progress'}</span>
            <strong>{constructionProgress}%</strong>
          </div>
        )}
        {project.operations.constructionStages.length > 0 ? (
          <>
            {!project.operations.constructionStages.some((stage) =>
              stage.status !== null || stage.id === project.operations.currentConstructionStage
            ) && (
              <p className="project-construction-unreported">
                {isArabic ? 'لم تُنشر بعد حالة موثقة لمراحل الإنشاء.' : 'Verified construction stage updates have not been published yet.'}
              </p>
            )}
            <ol className="project-construction-timeline">
              {project.operations.constructionStages.map((stage, index) => {
                const stageStatus = project.operations.currentConstructionStage === stage.id
                  ? 'current'
                  : stage.status
                return (
                  <li className={`project-construction-stage ${stageStatus ? `is-${stageStatus}` : 'is-unreported'}`} key={stage.id}>
                    <span className="project-stage-marker" aria-hidden="true">
                      {stageStatus === 'completed' ? <Check /> : stageStatus === 'current' ? <i /> : <Circle />}
                    </span>
                    <span className="project-stage-number" dir="ltr">0{index + 1}</span>
                    <div className="project-stage-copy">
                      <h3>{isArabic ? stage.titleAr : stage.titleEn}</h3>
                      {stage.date && <span>{stage.date}</span>}
                      {(isArabic ? stage.descriptionAr ?? stage.descriptionEn : stage.descriptionEn ?? stage.descriptionAr) && (
                        <p>{isArabic ? stage.descriptionAr ?? stage.descriptionEn : stage.descriptionEn ?? stage.descriptionAr}</p>
                      )}
                      {stageStatus && (
                        <span className="project-stage-status">
                          {isArabic ? stageStatusArabic[stageStatus] : stageStatusEnglish[stageStatus]}
                        </span>
                      )}
                    </div>
                    {stage.image && (
                      <img className="project-stage-image" src={asset(stage.image)} alt="" loading="lazy" />
                    )}
                  </li>
                )
              })}
            </ol>
          </>
        ) : (
          <p className="project-construction-unreported">
            {isArabic ? 'سيتم نشر مراحل الإنشاء عند توفر تحديثات موثقة.' : 'Construction stages will be published when verified updates are available.'}
          </p>
        )}
      </section>

      <section className="project-construction-updates section-pad">
        <div className="project-section-heading">
          <span className="eyebrow">{isArabic ? '08 / تحديثات الموقع' : '08 / SITE UPDATES'}</span>
          <h2>{isArabic ? 'آخر تحديثات المشروع' : 'Latest Construction Updates'}</h2>
        </div>
        {project.operations.constructionUpdates.length > 0 ? (
          <div className="project-updates-grid">
            {project.operations.constructionUpdates.map((update) => (
              <figure className="project-update" key={update.id}>
                <img src={asset(update.image)} alt={isArabic ? update.captionAr ?? '' : update.captionEn ?? ''} loading="lazy" />
                <figcaption>
                  <time>{update.date}</time>
                  {(isArabic ? update.captionAr : update.captionEn) && <span>{isArabic ? update.captionAr : update.captionEn}</span>}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <p className="project-construction-unreported">
            {isArabic ? 'لا توجد تحديثات مصوّرة منشورة حاليًا.' : 'No construction photo updates have been published yet.'}
          </p>
        )}
      </section>

      <section className="project-contact section-pad">
        <span className="eyebrow light">BARWA DEVELOPMENTS</span>
        <h2>{isArabic ? 'مهتم بالمشروع؟' : 'Interested in this project?'}</h2>
        <p>{isArabic ? 'تواصل معنا لمعرفة المزيد' : 'Contact us to learn more.'}</p>
        <div className="project-contact-actions">
          <Link href={`/contact-us?project=${project.slug}`} className="button-link">
            <Mail aria-hidden="true" />
            {isArabic ? 'أرسل استفسارك' : 'Send an enquiry'}
          </Link>
          <a href={CONTACT.phoneHref} className="project-call-link">
            <Phone aria-hidden="true" />
            {isArabic ? 'اتصل بنا' : 'Call'} · {CONTACT.hotline}
          </a>
        </div>
      </section>

      {otherProjects.length > 0 && (
        <section className="project-other section-pad">
          <div className="project-section-heading">
            <span className="eyebrow">{isArabic ? '06 / اكتشف المزيد' : '06 / EXPLORE MORE'}</span>
            <h2>{isArabic ? 'مشاريع أخرى' : 'Other Projects'}</h2>
          </div>
          <div className="project-other-grid">
            {otherProjects.map((otherProject) => (
              <Link href={`/projects/${otherProject.slug}`} className="project-other-card" key={otherProject.slug}>
                <span className="project-other-image">
                  <img src={assetFor(otherProject.assetDirectory, 'hero.jpg')} alt="" loading="lazy" />
                </span>
                <span className="project-other-info">
                  <span>{isArabic ? otherProject.location : otherProject.englishLocation}</span>
                  <strong dir="auto">{isArabic ? otherProject.arabic : otherProject.displayName}</strong>
                  <span className="project-other-arrow">{isArabic ? 'اكتشف المشروع' : 'Explore project'} <ArrowUpRight aria-hidden="true" /></span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <SiteFooter />

      {lightbox && (
        <div
          className={`project-lightbox ${lightbox.kind === 'plan' ? 'is-plan' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt}
          onClick={(event) => {
            if (event.target === event.currentTarget) setLightbox(null)
          }}
        >
          <button
            className="project-lightbox-close"
            type="button"
            onClick={() => setLightbox(null)}
            aria-label={isArabic ? 'إغلاق' : 'Close'}
          >
            <X aria-hidden="true" />
          </button>
          <img src={lightbox.src} alt={lightbox.alt} />
        </div>
      )}

      {selectedUnit && (
        <div
          className="project-unit-modal-backdrop"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedUnit(null)
              setShowReservationForm(false)
            }
          }}
        >
          <section
            className="project-unit-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-unit-modal-title"
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            <button
              className="project-unit-modal-close"
              type="button"
              onClick={() => {
                setSelectedUnit(null)
                setShowReservationForm(false)
              }}
              aria-label={isArabic ? 'إغلاق' : 'Close'}
            >
              <X aria-hidden="true" />
            </button>
            {showReservationForm ? (
              <ReservationRequestForm
                project={project}
                unit={selectedUnit}
                floorLabel={isArabic ? floorForUnit(project, selectedUnit)?.arabic ?? '' : floorForUnit(project, selectedUnit)?.english ?? ''}
                isArabic={isArabic}
                status={reservationStatus}
                onSubmit={(event) => {
                  event.preventDefault()
                  const formData = new FormData(event.currentTarget)
                  const subject = encodeURIComponent(isArabic ? `طلب حجز وحدة ${selectedUnit.unitNumber ?? ''} — ${project.displayName}` : `Reservation request: ${selectedUnit.unitNumber ?? selectedUnit.id} — ${project.displayName}`)
                  const body = encodeURIComponent([
                    `${isArabic ? 'الاسم' : 'Name'}: ${formData.get('name')}`,
                    `${isArabic ? 'رقم الهاتف' : 'Phone'}: ${formData.get('phone')}`,
                    `${isArabic ? 'البريد الإلكتروني' : 'Email'}: ${formData.get('email')}`,
                    `${isArabic ? 'المشروع' : 'Project'}: ${project.displayName}`,
                    `${isArabic ? 'الطابق' : 'Floor'}: ${floorForUnit(project, selectedUnit)?.english ?? ''}`,
                    `${isArabic ? 'الوحدة' : 'Unit'}: ${selectedUnit.unitNumber ?? selectedUnit.id}`,
                    `${isArabic ? 'ملاحظات' : 'Message / Notes'}: ${formData.get('message')}`,
                    isArabic
                      ? 'هذا طلب استفسار عن الحجز، ولا يُعد تأكيدًا أو حجزًا رسميًا للوحدة.'
                      : 'This is a reservation request only and does not confirm or reserve the unit.',
                  ].join('\n'))
                  setReservationStatus('email-opened')
                  window.location.href = `${CONTACT.emailHref}?subject=${subject}&body=${body}`
                }}
              />
            ) : (
              <UnitDetails
                project={project}
                unit={selectedUnit}
                isArabic={isArabic}
                onReserve={() => {
                  setReservationStatus('idle')
                  setShowReservationForm(true)
                }}
              />
            )}
          </section>
        </div>
      )}
    </main>
  )
}

const unitStatusArabic = {
  available: 'متاحة',
  reserved: 'محجوزة',
  sold: 'مباعة',
} as const

const unitStatusEnglish = {
  available: 'Available',
  reserved: 'Reserved',
  sold: 'Sold',
} as const

const stageStatusArabic: Record<ConstructionStageStatus, string> = {
  completed: 'مكتملة',
  current: 'المرحلة الحالية',
  upcoming: 'قادمة',
}

const stageStatusEnglish: Record<ConstructionStageStatus, string> = {
  completed: 'Completed',
  current: 'Current Stage',
  upcoming: 'Upcoming',
}

function floorForUnit(project: Project, unit: ProjectUnit) {
  return project.floors.find((floor) => floor.key === unit.floorKey)
}

function formatUnitArea(area: number, isArabic: boolean) {
  return `${new Intl.NumberFormat(isArabic ? 'ar' : 'en').format(area)} ${isArabic ? 'م²' : 'm²'}`
}

function formatUnitPrice(price: number, currency: string | undefined, isArabic: boolean) {
  const amount = new Intl.NumberFormat(isArabic ? 'ar' : 'en').format(price)
  return currency ? `${amount} ${currency}` : amount
}

function UnitDetails({ project, unit, isArabic, onReserve }: {
  project: Project
  unit: ProjectUnit
  isArabic: boolean
  onReserve: () => void
}) {
  const floor = floorForUnit(project, unit)

  return (
    <>
      <span className="eyebrow">{isArabic ? 'تفاصيل الوحدة' : 'UNIT DETAILS'}</span>
      <h2 id="project-unit-modal-title">
        {unit.unitNumber
          ? isArabic ? `وحدة ${unit.unitNumber}` : `Unit ${unit.unitNumber}`
          : isArabic ? 'تفاصيل الوحدة' : 'Unit Details'}
      </h2>
      <dl className="project-unit-details">
        <div><dt>{isArabic ? 'المشروع' : 'Project'}</dt><dd>{isArabic ? project.arabic : project.displayName}</dd></div>
        {floor && <div><dt>{isArabic ? 'الدور' : 'Floor'}</dt><dd>{isArabic ? floor.arabic : floor.english}</dd></div>}
        {unit.unitNumber && <div><dt>{isArabic ? 'رقم الوحدة' : 'Unit Number'}</dt><dd>{unit.unitNumber}</dd></div>}
        {(unit.type || unit.englishType) && <div><dt>{isArabic ? 'نوع الوحدة' : 'Unit Type'}</dt><dd>{isArabic ? unit.type ?? unit.englishType : unit.englishType ?? unit.type}</dd></div>}
        {unit.area != null && <div><dt>{isArabic ? 'المساحة' : 'Area'}</dt><dd>{formatUnitArea(unit.area, isArabic)}</dd></div>}
        {unit.price != null && <div><dt>{isArabic ? 'السعر' : 'Price'}</dt><dd>{formatUnitPrice(unit.price, unit.currency, isArabic)}</dd></div>}
        {unit.rooms != null && <div><dt>{isArabic ? 'الغرف' : 'Rooms'}</dt><dd>{unit.rooms}</dd></div>}
        {unit.bathrooms != null && <div><dt>{isArabic ? 'الحمامات' : 'Bathrooms'}</dt><dd>{unit.bathrooms}</dd></div>}
        <div>
          <dt>{isArabic ? 'الحالة' : 'Status'}</dt>
          <dd><span className={`project-unit-status is-${unit.status}`}>{isArabic ? unitStatusArabic[unit.status] : unitStatusEnglish[unit.status]}</span></dd>
        </div>
      </dl>
      <div className="project-unit-modal-actions">
        {unit.status === 'available' && (
          <button type="button" className="project-unit-reserve" onClick={onReserve}>
            {isArabic ? 'طلب حجز هذه الوحدة' : 'Request to Reserve This Unit'}
          </button>
        )}
        <a href={CONTACT.phoneHref} className="project-call-link">
          <Phone aria-hidden="true" />{isArabic ? 'اتصل بنا' : 'Call Us'} · {CONTACT.hotline}
        </a>
      </div>
    </>
  )
}

function ReservationRequestForm({ project, unit, floorLabel, isArabic, status, onSubmit }: {
  project: Project
  unit: ProjectUnit
  floorLabel: string
  isArabic: boolean
  status: 'idle' | 'email-opened'
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  return (
    <>
      <span className="eyebrow">{isArabic ? 'طلب حجز الوحدة' : 'UNIT RESERVATION REQUEST'}</span>
      <h2 id="project-unit-modal-title">{isArabic ? 'أرسل طلب الحجز' : 'Submit a Reservation Request'}</h2>
      <p className="project-reservation-disclaimer">
        {isArabic
          ? 'هذا طلب حجز فقط. لا تُعد الوحدة محجوزة حتى يؤكد فريق بروة التفاصيل معك.'
          : 'This is a reservation request only. The unit is not reserved unless Barwa’s team confirms the details with you.'}
      </p>
      <form className="project-reservation-form" onSubmit={onSubmit}>
        <label>
          <span>{isArabic ? 'الاسم' : 'Name'}</span>
          <input name="name" autoComplete="name" required />
        </label>
        <label>
          <span>{isArabic ? 'رقم الهاتف' : 'Phone'}</span>
          <input name="phone" type="tel" autoComplete="tel" required />
        </label>
        <label>
          <span>{isArabic ? 'البريد الإلكتروني' : 'Email'}</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          <span>{isArabic ? 'المشروع' : 'Project'}</span>
          <input name="project" value={isArabic ? project.arabic : project.displayName} readOnly />
        </label>
        <label>
          <span>{isArabic ? 'الطابق' : 'Floor'}</span>
          <input name="floor" value={floorLabel} readOnly />
        </label>
        <label>
          <span>{isArabic ? 'الوحدة' : 'Unit'}</span>
          <input name="unit" value={unit.unitNumber ?? unit.id} readOnly />
        </label>
        <label className="project-reservation-notes">
          <span>{isArabic ? 'رسالة / ملاحظات' : 'Message / Notes'}</span>
          <textarea name="message" rows={3} />
        </label>
        <button type="submit" className="project-unit-reserve">
          {isArabic ? 'إرسال طلب الحجز' : 'Submit Reservation Request'}
        </button>
        {status === 'email-opened' && (
          <p className="project-reservation-status" role="status">
            {isArabic
              ? 'تم فتح تطبيق البريد لإرسال طلبك. لا يُعد ذلك تأكيدًا للحجز؛ سيتواصل معك فريق بروة لتأكيد التفاصيل.'
              : 'Your email application was opened to send this request. This does not confirm a reservation; Barwa’s team will contact you to confirm the details.'}
          </p>
        )}
      </form>
      <a href={CONTACT.phoneHref} className="project-call-link project-reservation-call">
        <Phone aria-hidden="true" />{isArabic ? 'اتصل بنا' : 'Call Us'} · {CONTACT.hotline}
      </a>
    </>
  )
}

function assetFor(directory: string, file: string) {
  return `${directory}/${file}`
}
