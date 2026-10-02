export type ProjectFeature = {
  icon: 'trees' | 'parking' | 'entrances' | 'elevators' | 'stairs' | 'plaza' | 'fountain' | 'escalator' | 'emergency' | 'wc' | 'terraces' | 'access' | 'accessibility' | 'fire' | 'prayer' | 'screens' | 'facade'
  arabic: string
  english: string
}

export type ProjectFloor = {
  key: 'ground-floor' | 'first-floor' | 'second-floor' | 'third-floor'
  arabic: string
  english: string
}

export type UnitStatus = 'available' | 'reserved' | 'sold'

export type ProjectUnit = {
  id: string
  floorKey: ProjectFloor['key']
  status: UnitStatus
  unitNumber?: string
  type?: string
  englishType?: string
  area?: number
  price?: number
  currency?: string
  rooms?: number
  bathrooms?: number
  hotspot?: {
    x: number
    y: number
    width: number
    height: number
  } | {
    polygon: Array<{ x: number; y: number }>
  }
}

export type ConstructionStageStatus = 'completed' | 'current' | 'upcoming'

export type ConstructionStage = {
  id: string
  titleAr: string
  titleEn: string
  status: ConstructionStageStatus | null
  date?: string
  descriptionAr?: string
  descriptionEn?: string
  image?: string
}

export type ConstructionUpdate = {
  id: string
  date: string
  image: string
  captionAr?: string
  captionEn?: string
}

export type ProjectOperations = {
  units: ProjectUnit[]
  constructionStages: ConstructionStage[]
  currentConstructionStage: string | null
  constructionProgress: number | null
  constructionUpdates: ConstructionUpdate[]
}

export type ProjectFloorPlan = {
  floorKey: ProjectFloor['key']
  image: string
}

export type Project = {
  slug: string
  name: string
  displayName: string
  arabic: string
  location: string
  englishLocation: string
  type: string
  englishType: string
  description: string
  englishDescription: string
  detailDescription?: string
  englishDetailDescription?: string
  tagline: string
  englishTagline: string
  image: string
  listingImage: string
  imagePosition: string
  number: string
  assetDirectory: string
  locationMap?: string
  galleryImages: string[]
  locationContext?: string
  englishLocationContext?: string
  projectComposition?: string
  englishProjectComposition?: string
  floors: ProjectFloor[]
  floorPlans: ProjectFloorPlan[]
  operations: ProjectOperations
  features: ProjectFeature[]
  facts: Array<{ label: string; value: string; englishLabel: string; englishValue: string }>
}

const constructionStageTemplates: ConstructionStage[] = [
  { id: 'excavation', titleAr: 'أعمال الحفر', titleEn: 'Excavation', status: null },
  { id: 'foundations', titleAr: 'الأساسات', titleEn: 'Foundations', status: null },
  { id: 'structure', titleAr: 'الهيكل الإنشائي', titleEn: 'Structural Works', status: null },
  { id: 'facade', titleAr: 'الواجهات', titleEn: 'Facade Works', status: null },
  { id: 'interior', titleAr: 'الأعمال الداخلية', titleEn: 'Interior Works', status: null },
  { id: 'finishing', titleAr: 'التشطيبات', titleEn: 'Finishing', status: null },
  { id: 'handover', titleAr: 'التسليم', titleEn: 'Handover', status: null },
]

function emptyProjectOperations(): ProjectOperations {
  return {
    units: [],
    constructionStages: constructionStageTemplates.map((stage) => ({ ...stage })),
    currentConstructionStage: null,
    constructionProgress: null,
    constructionUpdates: [],
  }
}

const projectRecords: Omit<Project, 'floorPlans'>[] = [
  {
    slug: 'hub5-mall',
    name: 'HUB 5',
    displayName: 'HUB 5 MALL',
    arabic: 'هاب ٥',
    location: 'مدينة الشروق',
    englishLocation: 'El Shorouk City',
    type: 'تجاري · إداري · طبي',
    englishType: 'Commercial · Administrative · Medical',
    description: 'حيث تلتقي مسارات الحياة في مركز متعدد الاستخدامات صُمم ليصنع فرصاً استثنائية.',
    englishDescription: 'A mixed-use destination bringing life together in a center designed to create exceptional opportunities.',
    tagline: 'حيث تلتقي مسارات الحياة',
    englishTagline: "Where Life's Paths Meet",
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=85',
    listingImage: '/banners/hub5-mall.jpg',
    imagePosition: 'center 58%',
    number: '01',
    assetDirectory: '/projects/hub5-mall',
    galleryImages: ['gallery-01.jpg'],
    locationContext: 'موقع استراتيجي في مدينة الشروق، محاط بكثافة سكانية تضم أكثر من ٩٬٠٠٠ وحدة سكنية، بما في ذلك إسكان المستقبل والأحياء الرابع والخامس والثامن.',
    englishLocationContext: 'A strategic location in El Shorouk City, surrounded by a residential catchment of more than 9,000 housing units, including Mostakbal Housing and Districts 4, 5 and 8.',
    projectComposition: 'الطابقان الأرضي والأول للمساحات التجارية، والطابقان الثاني والثالث للمكاتب الإدارية والعيادات الطبية.',
    englishProjectComposition: 'Ground and first floors are for retail spaces; second and third floors are for administrative offices and medical clinics.',
    floors: [
      { key: 'ground-floor', arabic: 'الطابق الأرضي', english: 'Ground Floor' },
      { key: 'first-floor', arabic: 'الطابق الأول', english: 'First Floor' },
      { key: 'second-floor', arabic: 'الطابق الثاني', english: 'Second Floor' },
      { key: 'third-floor', arabic: 'الطابق الثالث', english: 'Third Floor' },
    ],
    operations: emptyProjectOperations(),
    features: [
      { icon: 'trees', arabic: 'مساحات خارجية', english: 'Outdoor areas' },
      { icon: 'access', arabic: 'تحكم في الدخول', english: 'Access control' },
      { icon: 'emergency', arabic: 'مخارج طوارئ', english: 'Emergency exits' },
      { icon: 'plaza', arabic: 'بلازا', english: 'Plaza' },
      { icon: 'wc', arabic: 'دورات مياه', english: 'WCs' },
      { icon: 'accessibility', arabic: 'دعم لذوي الاحتياجات الخاصة', english: 'Accessibility support' },
      { icon: 'elevators', arabic: 'مصاعد', english: 'Elevators' },
      { icon: 'entrances', arabic: 'مداخل متعددة', english: 'Multiple entrances' },
      { icon: 'fire', arabic: 'نظام مكافحة الحريق', english: 'Fire-fighting system' },
      { icon: 'prayer', arabic: 'منطقة صلاة', english: 'Prayer area' },
      { icon: 'screens', arabic: 'شاشات رقمية', english: 'Digital screens' },
      { icon: 'parking', arabic: 'مواقف سيارات', english: 'Parking' },
    ],
    facts: [
      { label: 'الموقع', value: 'مدينة الشروق', englishLabel: 'Location', englishValue: 'El Shorouk City' },
      { label: 'الاستخدام', value: 'تجاري · إداري · طبي', englishLabel: 'Uses', englishValue: 'Commercial · Administrative · Medical' },
      { label: 'نطاق سكني محيط', value: 'أكثر من ٩٬٠٠٠ وحدة', englishLabel: 'Residential catchment', englishValue: 'More than 9,000 housing units' },
    ],
  },
  {
    slug: 'central-mall',
    name: 'CENTRAL MALL',
    displayName: 'CENTRAL MALL',
    arabic: 'سنترال مول',
    location: 'المنطقة المركزية الثانية · مدينة الشروق',
    englishLocation: 'Second Central Area · El Shorouk City',
    type: 'تجاري · إداري · طبي',
    englishType: 'Commercial · Administrative · Medical',
    description: 'تنبض التجارة بالحياة في قلب المنطقة المركزية الثانية، حيث يلتقي التصميم العصري بالحضور اليومي.',
    englishDescription: 'Commerce comes to life in the heart of the Second Central Area, where contemporary design meets everyday presence.',
    tagline: 'حيث تنبض التجارة بالحياة',
    englishTagline: 'Where Commerce Comes Alive',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1800&q=85',
    listingImage: '/banners/central-mall.jpg',
    imagePosition: 'center 52%',
    number: '02',
    assetDirectory: '/projects/central-mall',
    locationMap: 'location-map.jpg',
    galleryImages: ['gallery-01.jpg'],
    locationContext: 'بالقرب من دار مصر وجنة مصر، مباشرة على طريق النصر مقابل الحي الثالث، وبموازاة محور الحرية الرئيسي، وعلى بُعد نحو ثلاث دقائق من طريق السويس.',
    englishLocationContext: 'Near Dar Misr and Janna Misr, directly on Al Nasr Road opposite the Third District, parallel to the main Al Horreya axis and approximately three minutes from Suez Road.',
    projectComposition: 'بدروم بمساحة تقارب ٣٬٠٠٠ م²، وطابق أرضي، وثلاثة طوابق علوية.',
    englishProjectComposition: 'An approximately 3,000 m² basement, a ground floor and three upper floors.',
    floors: [
      { key: 'ground-floor', arabic: 'الطابق الأرضي', english: 'Ground Floor' },
      { key: 'first-floor', arabic: 'الطابق الأول', english: 'First Floor' },
      { key: 'second-floor', arabic: 'الطابق الثاني', english: 'Second Floor' },
      { key: 'third-floor', arabic: 'الطابق الثالث', english: 'Third Floor' },
    ],
    operations: emptyProjectOperations(),
    features: [
      { icon: 'parking', arabic: 'مواقف سيارات · بدروم ٣٬٠٠٠ م²', english: 'Parking · 3,000 m² basement' },
      { icon: 'plaza', arabic: 'بلازا', english: 'Plaza' },
      { icon: 'fountain', arabic: 'نافورة', english: 'Fountain' },
      { icon: 'escalator', arabic: 'سلم كهربائي', english: 'Escalator' },
      { icon: 'elevators', arabic: 'مصعدان', english: 'Two elevators' },
      { icon: 'stairs', arabic: 'سلالم', english: 'Stairs' },
      { icon: 'emergency', arabic: 'مخارج طوارئ', english: 'Emergency exits' },
      { icon: 'entrances', arabic: 'مداخل متعددة', english: 'Multiple entrances' },
      { icon: 'wc', arabic: 'دورات مياه', english: 'WCs' },
      { icon: 'terraces', arabic: 'تراسات', english: 'Terraces' },
      { icon: 'trees', arabic: 'تنسيق المساحات الخضراء', english: 'Landscaping' },
    ],
    facts: [
      { label: 'الموقع', value: 'المنطقة المركزية الثانية · الشروق', englishLabel: 'Location', englishValue: 'Second Central Area · El Shorouk City' },
      { label: 'الاستخدام', value: 'تجاري · إداري · طبي', englishLabel: 'Uses', englishValue: 'Commercial · Administrative · Medical' },
      { label: 'التكوين', value: 'بدروم + أرضي + ٣ طوابق علوية', englishLabel: 'Composition', englishValue: 'Basement + Ground + 3 upper floors' },
    ],
  },
  {
    slug: 'barwa-mall',
    name: 'BARWA MALL',
    displayName: 'BARWA MALL',
    arabic: 'بروة مول',
    location: 'مدينة الشروق',
    englishLocation: 'El Shorouk City',
    type: 'تجاري · إداري · طبي',
    englishType: 'Commercial · Administrative · Medical',
    description: 'مساحات مدروسة تمنح الأعمال عنواناً يواكب تطلعات المستقبل.',
    englishDescription: 'Considered spaces giving businesses an address in step with the aspirations of the future.',
    detailDescription: 'بروة مول مجمع تجاري متعدد الاستخدامات (تجاري · إداري · طبي) في موقع مميز بمدينة الشروق تحيط به الحدائق.',
    englishDetailDescription: 'Barwa Mall is a mixed-use commercial complex for commercial, administrative and medical activities, in a prime Shorouk City location surrounded by gardens.',
    tagline: 'حيث يلتقي الموقع بالفرصة',
    englishTagline: 'Where Location Meets Opportunity',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=85',
    listingImage: '/banners/barwa-mall.jpg',
    imagePosition: 'center 55%',
    number: '03',
    assetDirectory: '/projects/barwa-mall',
    locationMap: 'location-map.jpg',
    galleryImages: ['gallery-01.jpg'],
    locationContext: 'يقع بروة مول في مدينة الشروق، وتحيط به الحدائق من جميع الجهات.',
    englishLocationContext: 'Barwa Mall is located in El Shorouk City and is surrounded by gardens on all sides.',
    projectComposition: 'يضم الطابق الأرضي محلات تجارية ومساحات خارجية، بينما تضم الطوابق العلوية عيادات ومكاتب.',
    englishProjectComposition: 'The ground floor includes retail shops and outdoor areas, while the upper floors include clinics and offices.',
    floors: [
      { key: 'ground-floor', arabic: 'الطابق الأرضي', english: 'Ground Floor' },
      { key: 'first-floor', arabic: 'الطابق الأول', english: 'First Floor' },
      { key: 'second-floor', arabic: 'الطابق الثاني', english: 'Second Floor' },
      { key: 'third-floor', arabic: 'الطابق الثالث', english: 'Third Floor' },
    ],
    operations: emptyProjectOperations(),
    features: [
      { icon: 'trees', arabic: 'مساحات خارجية وحدائق', english: 'Outdoor areas and gardens' },
      { icon: 'entrances', arabic: '٣ مداخل', english: '3 entrances' },
      { icon: 'elevators', arabic: 'مصاعد', english: 'Elevators' },
      { icon: 'stairs', arabic: 'سلالم', english: 'Stairs' },
      { icon: 'parking', arabic: 'مواقف سيارات', english: 'Parking areas' },
    ],
    facts: [
      { label: 'الموقع', value: 'مدينة الشروق', englishLabel: 'Location', englishValue: 'El Shorouk City' },
      { label: 'الاستخدام', value: 'تجاري · إداري · طبي', englishLabel: 'Uses', englishValue: 'Commercial · Administrative · Medical' },
    ],
  },
]

export const projects: Project[] = projectRecords.map((project) => ({
  ...project,
  floorPlans: project.floors.map((floor) => ({
    floorKey: floor.key,
    image: `${floor.key}.jpg`,
  })),
}))
