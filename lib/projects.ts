export type ProjectFeature = {
  icon: 'trees' | 'parking' | 'entrances' | 'elevators' | 'stairs' | 'plaza' | 'fountain' | 'escalator' | 'emergency' | 'wc' | 'terraces' | 'access' | 'accessibility' | 'fire' | 'prayer' | 'screens' | 'facade'
  arabic: string
  english: string
}

export type ProjectFloor = {
  key: 'ground-floor' | 'first-floor' | 'second-floor' | 'third-floor'
  arabic: string
  english: string
  activityAr?: string
  activityEn?: string
}

export type ProjectHighlight = {
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
  highlights?: ProjectHighlight[]
  floorPlans: ProjectFloorPlan[]
  operations: ProjectOperations
  features: ProjectFeature[]
  facts: Array<{ label: string; value: string; englishLabel: string; englishValue: string }>
  brochure: string
  liveStreamUrl?: string
}

const constructionSteps: Array<Pick<ConstructionStage, 'id' | 'titleAr' | 'titleEn'>> = [
  { id: 'permits', titleAr: 'الترخيص / الحفر', titleEn: 'Permits / excavation' },
  { id: 'foundations', titleAr: 'الأساسات', titleEn: 'Foundations' },
  { id: 'structure', titleAr: 'الهيكل الخرساني', titleEn: 'Concrete structure' },
  { id: 'facades', titleAr: 'الواجهات', titleEn: 'Facades' },
  { id: 'finishes', titleAr: 'التشطيبات', titleEn: 'Finishes' },
  { id: 'handover', titleAr: 'التسليم', titleEn: 'Handover' },
]

export function constructionStageLabel(project: Pick<Project, 'operations'>, isArabic: boolean) {
  const stage = project.operations.constructionStages.find((item) => item.id === project.operations.currentConstructionStage)
  if (!stage) return ''
  return isArabic ? `مرحلة ${stage.titleAr}` : stage.titleEn
}

function projectOperations(currentStageId: string): ProjectOperations {
  const currentIndex = constructionSteps.findIndex((stage) => stage.id === currentStageId)
  return {
    units: [],
    constructionStages: constructionSteps.map((stage, index) => ({
      ...stage,
      status: index < currentIndex ? 'completed' : index === currentIndex ? 'current' : 'upcoming',
    })),
    currentConstructionStage: currentStageId,
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
    location: 'المنطقة الخامسة · مدينة الشروق',
    englishLocation: 'District 5 · El Shorouk City',
    type: 'تجاري · إداري · طبي',
    englishType: 'Retail · Offices · Medical',
    description: 'حيث تلتقي مسارات الحياة في مركز متعدد الاستخدامات صُمم ليصنع فرصاً استثنائية.',
    englishDescription: 'A mixed-use destination bringing life together in a center designed to create exceptional opportunities.',
    detailDescription: 'تم تصميم هاب ٥ ليكون مركزًا متعدد الأغراض يلبي احتياجات الأنشطة التجارية والإدارية والطبية: الطابقان الأرضي والأول لمساحات البيع بالتجزئة بأحجام مختلفة، والطابقان الثاني والثالث للمكاتب الإدارية والعيادات الطبية.',
    englishDetailDescription: 'HUB 5 is a multi-purpose centre for retail, office and medical use — ground and first floors offer retail spaces of different sizes, while the second and third floors are dedicated to administrative offices and medical clinics, designed for maximum comfort and efficiency.',
    tagline: 'حيث تلتقي مسارات الحياة',
    englishTagline: "Where Life's Paths Meet",
    image: '/projects/hub5-mall/hero.jpg',
    listingImage: '/projects/hub5-mall/hero.jpg',
    imagePosition: 'center 48%',
    number: '01',
    assetDirectory: '/projects/hub5-mall',
    brochure: '/brochures/hub5.pdf',
    galleryImages: ['gallery-01.jpg', 'gallery-02.jpg', 'gallery-03.jpg'],
    locationContext: 'المنطقة الخامسة – مجاورة ٢. على بُعد دقائق من طريق الحرية وطريق جمال عبد الناصر وطريق السويس، ويخدم المناطق الخامسة والرابعة والثامنة. أكثر من ٩٬٠٠٠ وحدة سكنية حول المشروع، منها إسكان المستقبل.',
    englishLocationContext: 'District 5 – Neighbourhood 2. Minutes from Al-Horreya Road, Gamal Abdel Nasser Road and Suez Road — serving Districts 5, 4 and 8. More than 9,000 residential units around the project, including Mostakbal Housing.',
    projectComposition: 'أربعة أدوار و٤٨ وحدة ومدخلان. الأرضي والأول تجاري، والثاني والثالث مكاتب إدارية وعيادات طبية. مساحات الوحدات من ١٢ إلى ٨٦ م².',
    englishProjectComposition: 'Four floors, 48 units and two entrances. Ground and first floors are retail; second and third floors are administrative offices and medical clinics. Unit areas range from 12 to 86 m².',
    floors: [
      { key: 'ground-floor', arabic: 'الطابق الأرضي', english: 'Ground Floor', activityAr: 'تجاري · مطاعم وكافيهات — ١٨ محلًا · ١٢–٥٠ م²، ومساحات خارجية ١١–٩٦ م²', activityEn: 'Retail & F&B — 18 shops · 12–50 m², outdoor areas 11–96 m²' },
      { key: 'first-floor', arabic: 'الطابق الأول', english: 'First Floor', activityAr: 'تجاري — ١٦ محلًا · ١٥–٤٨ م²', activityEn: 'Retail — 16 shops · 15–48 m²' },
      { key: 'second-floor', arabic: 'الطابق الثاني', english: 'Second Floor', activityAr: 'إداري · طبي — ٧ وحدات · ٤٢–٧٨ م²', activityEn: 'Offices & clinics — 7 units · 42–78 m²' },
      { key: 'third-floor', arabic: 'الطابق الثالث', english: 'Third Floor', activityAr: 'إداري · طبي — ٧ وحدات · ٤٢–٨٦ م²', activityEn: 'Offices & clinics — 7 units · 42–86 m²' },
    ],
    highlights: [
      { arabic: 'سابقة أعمال أكثر من ١٥٠ مشروعًا', english: '150+ projects track record' },
      { arabic: 'في قلب ٩٬٠٠٠ وحدة سكنية', english: 'Heart of a 9,000-unit catchment' },
      { arabic: 'دقائق من طريق الحرية', english: 'Minutes from Al-Horreya Road' },
      { arabic: 'تجاري + مكاتب + طبي', english: 'Retail + offices + medical' },
      { arabic: 'مساحات مرنة ١٢–٨٦ م²', english: 'Flexible areas 12–86 m²' },
      { arabic: 'عائد مرتفع وتصميم عصري', english: 'High ROI · modern design' },
    ],
    operations: projectOperations('facades'),
    features: [
      { icon: 'trees', arabic: 'مساحات خارجية', english: 'Outdoor areas' },
      { icon: 'access', arabic: 'تحكم في الدخول', english: 'Access control' },
      { icon: 'emergency', arabic: 'مخارج طوارئ', english: 'Emergency exits' },
      { icon: 'plaza', arabic: 'بلازا', english: 'Plaza' },
      { icon: 'wc', arabic: 'دورات مياه', english: 'WCs' },
      { icon: 'accessibility', arabic: 'دعم لذوي الاحتياجات الخاصة', english: 'Accessibility support' },
      { icon: 'elevators', arabic: 'مصاعد', english: 'Elevators' },
      { icon: 'facade', arabic: 'واجهة عصرية', english: 'Modern façade' },
      { icon: 'entrances', arabic: 'مدخلان', english: 'Two entrances' },
      { icon: 'fire', arabic: 'نظام مكافحة الحريق', english: 'Fire-fighting system' },
      { icon: 'prayer', arabic: 'منطقة صلاة', english: 'Prayer area' },
      { icon: 'screens', arabic: 'شاشات رقمية', english: 'Digital screens' },
      { icon: 'parking', arabic: 'مواقف سيارات', english: 'Parking' },
    ],
    facts: [
      { label: 'الموقع', value: 'المنطقة الخامسة · الشروق', englishLabel: 'Location', englishValue: 'District 5 · El Shorouk' },
      { label: 'الاستخدام', value: 'تجاري · إداري · طبي', englishLabel: 'Uses', englishValue: 'Retail · Offices · Medical' },
      { label: 'الأدوار', value: 'أرضي + ٣', englishLabel: 'Floors', englishValue: 'Ground + 3' },
      { label: 'الوحدات', value: '٤٨', englishLabel: 'Units', englishValue: '48' },
      { label: 'المساحات', value: '١٢–٨٦ م²', englishLabel: 'Areas', englishValue: '12–86 m²' },
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
    englishType: 'Retail · Offices · Medical',
    description: 'تنبض التجارة بالحياة في قلب المنطقة المركزية الثانية، حيث يلتقي التصميم العصري بالحضور اليومي.',
    englishDescription: 'Commerce comes to life in the heart of the Second Central Area, where contemporary design meets everyday presence.',
    detailDescription: 'يتألف سنترال مول من بدرومين، أحدهما جراج للسيارات والآخر هايبر ماركت، وطابق أرضي وثلاثة طوابق علوية: الأرضي والأول للمحال التجارية، والثاني والثالث للمكاتب الإدارية والعيادات الطبية.',
    englishDetailDescription: 'Central Mall comprises two basements (one parking garage, one hypermarket), a ground floor and three upper floors — shops on the ground and first floors, administrative offices and medical clinics on the second and third.',
    tagline: 'حيث تنبض التجارة بالحياة',
    englishTagline: 'Where Commerce Comes Alive',
    image: '/projects/central-mall/hero.jpg',
    listingImage: '/projects/central-mall/hero.jpg',
    imagePosition: 'center 42%',
    number: '02',
    assetDirectory: '/projects/central-mall',
    brochure: '/brochures/central-mall.pdf',
    locationMap: 'location-map.jpg',
    galleryImages: ['gallery-01.jpg', 'gallery-02.jpg', 'gallery-03.jpg'],
    locationContext: 'المنطقة المركزية الثانية – مدينة الشروق. على طريق النصر مباشرة أمام الحي الثالث، بجوار دار مصر وجنة مصر، وموازٍ لمحور الحرية الرئيسي، وعلى بُعد نحو ثلاث دقائق من طريق السويس.',
    englishLocationContext: 'Second Central Area – El Shorouk City. On Al-Nasr Road, directly in front of the Third District — beside Dar Misr and Jannat Misr. Parallel to the main Horreya Axis, about three minutes from Suez Road.',
    projectComposition: 'ستة مستويات و١١٧ وحدة: بدرومان (جراج وهايبر ماركت)، وطابق أرضي، وثلاثة طوابق علوية. الأرضي والأول تجاري، والثاني والثالث مكاتب وعيادات.',
    englishProjectComposition: 'Six levels and 117 units: two basements (parking and a hypermarket), a ground floor and three upper floors. Shops on the ground and first floors; offices and clinics on the second and third.',
    floors: [
      { key: 'ground-floor', arabic: 'الطابق الأرضي', english: 'Ground Floor', activityAr: 'تجاري · مساحات خارجية — ٤٣ محلًا · ١٦–٧٥ م²', activityEn: 'Retail & outdoor — 43 shops · 16–75 m²' },
      { key: 'first-floor', arabic: 'الطابق الأول', english: 'First Floor', activityAr: 'تجاري · تراسات — ٢٦ محلًا · ٢٧–٦٨ م² وتراسان', activityEn: 'Retail & terraces — 26 shops · 27–68 m² + 2 terraces' },
      { key: 'second-floor', arabic: 'الطابق الثاني', english: 'Second Floor', activityAr: 'إداري · طبي — ٢٤ وحدة · ٢٢–٦٨ م²', activityEn: 'Offices & clinics — 24 units · 22–68 m²' },
      { key: 'third-floor', arabic: 'الطابق الثالث', english: 'Third Floor', activityAr: 'إداري · طبي — ٢٤ وحدة · ٢٢–٦٨ م²', activityEn: 'Offices & clinics — 24 units · 22–68 m²' },
    ],
    highlights: [
      { arabic: 'سابقة أعمال أكثر من ١٥٠ مشروعًا', english: '150+ projects track record' },
      { arabic: 'أكبر منطقة خدمات في المدينة', english: 'The largest services area in Shorouk' },
      { arabic: 'يخدم أكثر من ٧٬٠٠٠ وحدة سكنية', english: 'Serving 7,000+ residential units' },
      { arabic: 'بدرومان: جراج وهايبر ماركت', english: 'Two basements: parking + hypermarket' },
      { arabic: 'بلازا مركزية وسلم كهربائي', english: 'Central plaza & escalator' },
      { arabic: 'تجاري + مكاتب + طبي', english: 'Retail + offices + medical' },
    ],
    operations: projectOperations('foundations'),
    features: [
      { icon: 'parking', arabic: 'جراج بالبدروم', english: 'Basement parking' },
      { icon: 'plaza', arabic: 'هايبر ماركت بالبدروم', english: 'Basement hypermarket' },
      { icon: 'plaza', arabic: 'بلازا مركزية', english: 'Central plaza' },
      { icon: 'escalator', arabic: 'سلم كهربائي', english: 'Escalator' },
      { icon: 'elevators', arabic: 'مصعدان', english: 'Two elevators' },
      { icon: 'stairs', arabic: 'سلالم', english: 'Stairs' },
      { icon: 'entrances', arabic: 'مداخل متعددة', english: 'Multiple entrances' },
      { icon: 'terraces', arabic: 'تراسات ومساحات خارجية', english: 'Terraces & outdoor areas' },
      { icon: 'emergency', arabic: 'مخارج طوارئ', english: 'Emergency exits' },
      { icon: 'wc', arabic: 'دورات مياه', english: 'WCs' },
      { icon: 'facade', arabic: 'واجهة عصرية', english: 'Modern façade' },
      { icon: 'trees', arabic: 'لاندسكيب', english: 'Landscaping' },
    ],
    facts: [
      { label: 'الموقع', value: 'المنطقة المركزية الثانية', englishLabel: 'Location', englishValue: 'Second Central Area' },
      { label: 'الاستخدام', value: 'تجاري · إداري · طبي', englishLabel: 'Uses', englishValue: 'Retail · Offices · Medical' },
      { label: 'المستويات', value: 'بدرومان + أرضي + ٣', englishLabel: 'Levels', englishValue: '2 basements + ground + 3' },
      { label: 'الوحدات', value: '١١٧', englishLabel: 'Units', englishValue: '117' },
      { label: 'البدروم', value: 'جراج وهايبر ماركت', englishLabel: 'Basements', englishValue: 'Parking & hypermarket' },
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
    englishType: 'Retail · Offices · Medical',
    description: 'مساحات مدروسة تمنح الأعمال عنواناً يواكب تطلعات المستقبل.',
    englishDescription: 'Considered spaces giving businesses an address in step with the aspirations of the future.',
    detailDescription: 'بروة مول مجمع تجاري متكامل يقع في أكثر المواقع تميزًا في مدينة الشروق، يطل على حديقة ومصمم بمعمار عصري لتعظيم العائد الاستثماري وتجربة المستخدم.',
    englishDetailDescription: 'Barwa Mall is an integrated retail, office and medical complex in one of El Shorouk City’s most distinguished locations — overlooking a landscaped garden and designed with contemporary architecture to maximise investment return and user experience.',
    tagline: 'حيث يلتقي الموقع بالفرصة',
    englishTagline: 'Where Location Meets Opportunity',
    image: '/projects/barwa-mall/hero.jpg',
    listingImage: '/projects/barwa-mall/hero.jpg',
    imagePosition: 'center 46%',
    number: '03',
    assetDirectory: '/projects/barwa-mall',
    brochure: '/brochures/barwa-mall.pdf',
    locationMap: 'location-map.jpg',
    galleryImages: ['gallery-01.jpg', 'gallery-02.jpg', 'gallery-03.jpg'],
    locationContext: 'منطقة خدمات الحي المتميز، بالقرب من الحي الثامن والحي التاسع وحي الوزراء وطريق الشباب — مدينة الشروق، القاهرة.',
    englishLocationContext: 'Services zone of the Distinguished District, near District 8, District 9, the Ministers’ District and El Shabab Road — El Shorouk City, Cairo.',
    projectComposition: 'أربعة أدوار و٥١ وحدة ومدخلان رئيسيان. الأرضي والأول تجاري، والثاني والثالث مكاتب إدارية وعيادات طبية.',
    englishProjectComposition: 'Four floors, 51 units and two main entrances. Ground and first floors are retail; second and third floors are offices and clinics.',
    floors: [
      { key: 'ground-floor', arabic: 'الطابق الأرضي', english: 'Ground Floor', activityAr: 'تجاري · مطاعم وكافيهات — ١٨ محلًا · ١٧–٥١ م²، ومناطق جلوس خارجية ٥–٥٥ م²', activityEn: 'Retail & F&B — 18 shops · 17–51 m², outdoor seating 5–55 m²' },
      { key: 'first-floor', arabic: 'الطابق الأول', english: 'First Floor', activityAr: 'تجاري — ١٩ محلًا · ١٢–٣٢ م² وتراسان', activityEn: 'Retail — 19 shops · 12–32 m² + 2 terraces' },
      { key: 'second-floor', arabic: 'الطابق الثاني', english: 'Second Floor', activityAr: 'إداري · طبي — ٧ وحدات · ٤٩–٧٢ م²', activityEn: 'Offices & clinics — 7 units · 49–72 m²' },
      { key: 'third-floor', arabic: 'الطابق الثالث', english: 'Third Floor', activityAr: 'إداري · طبي — ٧ وحدات · ٤٩–٧٢ م²', activityEn: 'Offices & clinics — 7 units · 49–72 m²' },
    ],
    highlights: [
      { arabic: 'مطور بسابقة أعمال موثوقة · أكثر من ١٥٠ مشروعًا', english: 'Trusted developer · 150+ delivered' },
      { arabic: 'محفظة استثمارية بقيمة ٣٫٢ مليار جنيه', english: 'EGP 3.2 bn portfolio' },
      { arabic: 'عائد استثماري مرتفع في الشروق', english: 'High returns in El Shorouk' },
      { arabic: 'طلب متنامٍ على المنطقة', english: 'Growing demand in the area' },
      { arabic: 'خطط سداد مرنة', english: 'Flexible payment plans' },
      { arabic: 'دعم ما بعد البيع', english: 'After-sales support' },
    ],
    operations: projectOperations('facades'),
    features: [
      { icon: 'facade', arabic: 'واجهة عصرية', english: 'Modern façade' },
      { icon: 'entrances', arabic: 'مدخلان رئيسيان', english: 'Two entrances' },
      { icon: 'trees', arabic: 'حديقة على أحد الجوانب', english: 'Garden on one side' },
      { icon: 'stairs', arabic: 'كور سلالم ومصاعد', english: 'Stair & elevator core' },
      { icon: 'elevators', arabic: 'مصاعد', english: 'Elevators' },
      { icon: 'parking', arabic: 'مناطق انتظار سيارات', english: 'Parking areas' },
      { icon: 'trees', arabic: 'لاندسكيب متكامل', english: 'Landscaping' },
      { icon: 'plaza', arabic: 'بلازا', english: 'Plaza' },
      { icon: 'prayer', arabic: 'منطقة صلاة', english: 'Prayer area' },
      { icon: 'screens', arabic: 'شاشات رقمية', english: 'Digital screens' },
      { icon: 'access', arabic: 'التحكم في الوصول', english: 'Access control' },
      { icon: 'fire', arabic: 'نظام مكافحة الحرائق', english: 'Fire-fighting system' },
      { icon: 'emergency', arabic: 'مخارج الطوارئ', english: 'Emergency exits' },
      { icon: 'wc', arabic: 'دورات مياه', english: 'Restrooms' },
      { icon: 'accessibility', arabic: 'دعم ذوي الإعاقة', english: 'Accessibility' },
    ],
    facts: [
      { label: 'الموقع', value: 'مدينة الشروق', englishLabel: 'Location', englishValue: 'El Shorouk City' },
      { label: 'الاستخدام', value: 'تجاري · إداري · طبي', englishLabel: 'Uses', englishValue: 'Retail · Offices · Medical' },
      { label: 'الأدوار', value: 'أرضي + ٣', englishLabel: 'Floors', englishValue: 'Ground + 3' },
      { label: 'الوحدات', value: '٥١', englishLabel: 'Units', englishValue: '51' },
      { label: 'المداخل', value: 'مدخلان رئيسيان', englishLabel: 'Entrances', englishValue: 'Two main entrances' },
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
