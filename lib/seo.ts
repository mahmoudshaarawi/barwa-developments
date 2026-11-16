import type { Metadata } from 'next'
import { newsStories } from '@/data/news'
import { CONTACT } from '@/lib/contact'
import { projects, type Project } from '@/lib/projects'

export const siteUrl = 'https://barwadevelopments.com'

export type Language = 'ar' | 'en'

export type SeoEntry = {
  title: string
  description: string
  path: string
  image?: string
  imageAlt?: string
}

const defaultImage = '/projects/barwa-mall/hero.jpg'
const defaultImageAlt = 'واجهة بروة مول في مدينة الشروق بشرق القاهرة'

const pages: Record<Language, Record<string, SeoEntry>> = {
  ar: {
    home: {
      title: 'بروة للتطوير العقاري | مولات تجارية في الشروق',
      description: 'بروة للتطوير العقاري تطوّر محلات تجارية ومكاتب إدارية وعيادات طبية في مولات بمدينة الشروق، شرق القاهرة: بروة مول وسنترال مول وهاب ٥.',
      path: '/',
      image: defaultImage,
      imageAlt: defaultImageAlt,
    },
    about: {
      title: 'من نحن | بروة للتطوير العقاري في شرق القاهرة',
      description: 'تعرّف على بروة للتطوير العقاري، مطوّر المباني التجارية والإدارية والطبية في مدينة الشروق بشرق القاهرة منذ 2008، وسابقة أعمالها مع الراجحي.',
      path: '/about-us',
      image: defaultImage,
      imageAlt: defaultImageAlt,
    },
    projects: {
      title: 'مشاريعنا | مولات تجارية وإدارية وطبية بالشروق',
      description: 'مشروعات بروة في مدينة الشروق بشرق القاهرة: بروة مول وسنترال مول وهاب ٥. محلات تجارية ومكاتب إدارية وعيادات طبية، مع البروشور ومراحل التنفيذ.',
      path: '/projects',
      image: defaultImage,
      imageAlt: defaultImageAlt,
    },
    installments: {
      title: 'احسب القسط | وحدات بروة التجارية بالشروق',
      description: 'اطلب حسبة قسط وحدة في مشروعات بروة بمدينة الشروق: محل تجاري أو مكتب إداري أو عيادة طبية، حسب المشروع والمساحة المنشورة في البروشور.',
      path: '/installments',
      image: defaultImage,
      imageAlt: defaultImageAlt,
    },
    news: {
      title: 'أخبار بروة للتطوير العقاري | الشروق',
      description: 'أخبار بروة للتطوير العقاري: ظهور الرئيس التنفيذي في برنامج الجدعان، شراكة المصرية للاتصالات، وتعاقد إدارة سنترال مول في مدينة الشروق.',
      path: '/news',
      image: '/news/el-gedaan.jpg',
      imageAlt: 'لقطة من فيديو د. هيثم في برنامج الجدعان',
    },
    contact: {
      title: 'تواصل معنا | بروة للتطوير العقاري بالشروق',
      description: 'تواصل مع بروة للتطوير العقاري للاستفسار عن المحلات التجارية والمكاتب الإدارية والعيادات الطبية في مولات الشروق بشرق القاهرة. الخط الساخن 17582.',
      path: '/contact-us',
      image: '/projects/central-mall/hero.jpg',
      imageAlt: 'واجهة سنترال مول في المنطقة المركزية بمدينة الشروق',
    },
    careers: {
      title: 'التوظيف في بروة للتطوير العقاري',
      description: 'قدّم للانضمام إلى فريق بروة للتطوير العقاري، مطوّر المولات التجارية والإدارية والطبية في مدينة الشروق بشرق القاهرة.',
      path: '/careers',
      image: '/careers/team.png',
      imageAlt: 'فريق بروة في مقر العمل',
    },
    pastWork: {
      title: 'سابقة أعمالنا | مشروعات بروة في مدينة الشروق',
      description: 'أكثر من 150 مشروعًا سكنيًا تم تسليمها في أحياء مدينة الشروق بشرق القاهرة بالشراكة مع الراجحي للمشروعات العمرانية، وأكثر من 1500 عميل.',
      path: '/past-work',
      image: '/past-work/pw01.jpg',
      imageAlt: 'مشروع سكني من سابقة أعمال بروة في مدينة الشروق',
    },
  },
  en: {
    home: {
      title: 'Barwa Developments | Commercial malls in El Shorouk',
      description: 'Barwa Developments builds shops, offices and clinics in malls in El Shorouk, East Cairo: Barwa Mall, Central Mall and HUB 5.',
      path: '/',
      image: defaultImage,
      imageAlt: 'Barwa Mall facade in El Shorouk, East Cairo',
    },
    about: {
      title: 'About | Barwa Developments in East Cairo',
      description: 'Barwa Developments is a developer of commercial, administrative and medical buildings in El Shorouk, East Cairo, established in 2008.',
      path: '/about-us',
      image: defaultImage,
      imageAlt: 'Barwa Mall facade in El Shorouk, East Cairo',
    },
    projects: {
      title: 'Projects | Commercial, office and medical malls',
      description: 'Barwa projects in El Shorouk, East Cairo: Barwa Mall, Central Mall and HUB 5, with shops, offices, clinics, brochures and construction stages.',
      path: '/projects',
      image: defaultImage,
      imageAlt: 'Barwa Mall facade in El Shorouk, East Cairo',
    },
    installments: {
      title: 'Installments | Barwa units in El Shorouk',
      description: 'Request an installment estimate for a Barwa unit in El Shorouk: a shop, office or clinic, based on the project and the area published in the brochure.',
      path: '/installments',
      image: defaultImage,
      imageAlt: 'Barwa Mall facade in El Shorouk, East Cairo',
    },
    news: {
      title: 'News | Barwa Developments',
      description: 'Barwa news: the chief executive on El Geda\'an, a Telecom Egypt partnership, and the contract to operate Central Mall in El Shorouk.',
      path: '/news',
      image: '/news/el-gedaan.jpg',
      imageAlt: 'Still from Dr. Haitham on El Geda\'an',
    },
    contact: {
      title: 'Contact | Barwa Developments',
      description: 'Contact Barwa Developments about shops, offices and clinics in El Shorouk, East Cairo. Hotline 17582.',
      path: '/contact-us',
      image: '/projects/central-mall/hero.jpg',
      imageAlt: 'Central Mall facade in the Second Central Area, El Shorouk',
    },
    careers: {
      title: 'Careers | Barwa Developments',
      description: 'Join Barwa Developments, a developer of commercial, administrative and medical malls in El Shorouk, East Cairo.',
      path: '/careers',
      image: '/careers/team.png',
      imageAlt: 'The Barwa team at the office',
    },
    pastWork: {
      title: 'Previous work | Barwa projects in El Shorouk',
      description: 'More than 150 residential projects delivered in El Shorouk, East Cairo, with Al Rajhi, and more than 1,500 clients.',
      path: '/past-work',
      image: '/past-work/pw01.jpg',
      imageAlt: 'A residential project from Barwa’s work in El Shorouk',
    },
  },
}

const projectCopy: Record<string, Record<Language, Pick<SeoEntry, 'title' | 'description' | 'imageAlt'>>> = {
  'hub5-mall': {
    ar: {
      title: 'هاب ٥ مول | محلات وعيادات ومكاتب بالشروق',
      description: 'هاب ٥ مول في المنطقة الخامسة بمدينة الشروق، شرق القاهرة: 64 وحدة للمحلات التجارية والمكاتب الإدارية والعيادات الطبية، بمساحات من 12 إلى 50 م².',
      imageAlt: 'واجهة هاب ٥ مول في المنطقة الخامسة بمدينة الشروق',
    },
    en: {
      title: 'HUB 5 Mall | Shops, clinics and offices in El Shorouk',
      description: 'HUB 5 Mall in District 5, El Shorouk, East Cairo: 64 shops, offices and clinics, with areas from 12 to 50 m².',
      imageAlt: 'HUB 5 Mall facade in District 5, El Shorouk',
    },
  },
  'central-mall': {
    ar: {
      title: 'سنترال مول | محلات ومكاتب وعيادات بالشروق',
      description: 'سنترال مول في المنطقة المركزية الثانية بمدينة الشروق، شرق القاهرة: 117 وحدة، محلات تجارية ومكاتب إدارية وعيادات طبية، وبدروم جراج وهايبر ماركت.',
      imageAlt: 'واجهة سنترال مول في المنطقة المركزية الثانية بمدينة الشروق',
    },
    en: {
      title: 'Central Mall | Shops, offices and clinics in El Shorouk',
      description: 'Central Mall in the Second Central Area of El Shorouk, East Cairo: 117 units for shops, offices and clinics, plus basement parking and a hypermarket.',
      imageAlt: 'Central Mall facade in the Second Central Area, El Shorouk',
    },
  },
  'barwa-mall': {
    ar: {
      title: 'بروة مول | محلات ومكاتب وعيادات في الشروق',
      description: 'بروة مول مجمع تجاري وإداري وطبي في مدينة الشروق بشرق القاهرة: 51 وحدة على أربعة أدوار، محلات ومكاتب وعيادات، ومدخلان رئيسيان.',
      imageAlt: 'واجهة بروة مول في مدينة الشروق بشرق القاهرة',
    },
    en: {
      title: 'Barwa Mall | Shops, offices and clinics in El Shorouk',
      description: 'Barwa Mall is a commercial, office and medical complex in El Shorouk, East Cairo: 51 units on four floors, with two main entrances.',
      imageAlt: 'Barwa Mall facade in El Shorouk, East Cairo',
    },
  },
}

const newsCopy: Record<string, Record<Language, Pick<SeoEntry, 'title' | 'description'>>> = {
  'dr-haitham-el-gedaan': {
    ar: {
      title: 'د. هيثم مع برنامج الجدعان | بروة للتطوير العقاري',
      description: 'د. هيثم، الرئيس التنفيذي لبروة للتطوير العقاري، في برنامج الجدعان. بروة تطوّر مولات تجمع محلات تجارية ومكاتب إدارية وعيادات طبية.',
    },
    en: {
      title: 'Dr. Haitham on El Geda\'an | Barwa Developments',
      description: 'Dr. Haitham, chief executive of Barwa Developments, on El Geda\'an. Barwa develops malls that combine shops, offices and clinics.',
    },
  },
  'telecom-egypt-we-mou': {
    ar: {
      title: 'مذكرة تفاهم مع المصرية للاتصالات WE | بروة',
      description: 'بروة للتطوير العقاري توقّع مذكرة تفاهم مع المصرية للاتصالات WE لتوفير حلول اتصالات وخدمات تكنولوجيا في مشروعاتها.',
    },
    en: {
      title: 'Memorandum with Telecom Egypt WE | Barwa',
      description: 'Barwa Developments signed a memorandum with Telecom Egypt WE to provide communication and technology services in its projects.',
    },
  },
  'mrb-central-mall-el-shorouk': {
    ar: {
      title: 'تعاقد إدارة سنترال مول مع MRB | بروة',
      description: 'بروة تتعاقد مع MRB لإدارة وتشغيل سنترال مول في مدينة الشروق بشرق القاهرة، ضمن مشروعاتها التجارية والإدارية.',
    },
    en: {
      title: 'MRB to operate Central Mall | Barwa Developments',
      description: 'Barwa contracted MRB to manage and operate Central Mall in El Shorouk, East Cairo.',
    },
  },
  'amr-attia-commercial-director': {
    ar: {
      title: 'تعيين عمرو عطية رئيسًا للقطاع التجاري | بروة',
      description: 'بروة للتطوير العقاري تعيّن عمرو عطية رئيسًا للقطاع التجاري، ضمن خطة للاستعانة بخبرات السوق العقاري.',
    },
    en: {
      title: 'Amr Attia appointed commercial director | Barwa',
      description: 'Barwa Developments appointed Amr Attia as head of the commercial sector.',
    },
  },
}

export function absoluteUrl(path: string) {
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}

export function pageMetadata(entry: SeoEntry, options?: { publishedTime?: string }): Metadata {
  const image = absoluteUrl(entry.image ?? defaultImage)
  const url = absoluteUrl(entry.path)
  const imageAlt = entry.imageAlt ?? entry.title
  return {
    title: entry.title,
    description: entry.description,
    alternates: { canonical: url },
    openGraph: {
      type: options?.publishedTime ? 'article' : 'website',
      locale: 'ar_EG',
      url,
      siteName: 'بروة للتطوير العقاري',
      title: entry.title,
      description: entry.description,
      images: [{ url: image, alt: imageAlt }],
      ...(options?.publishedTime ? { publishedTime: options.publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: entry.title,
      description: entry.description,
      images: [image],
    },
  }
}

export function staticPage(language: Language, key: keyof typeof pages.ar) {
  return pages[language][key]
}

export function projectEntry(project: Project, language: Language): SeoEntry {
  const copy = projectCopy[project.slug][language]
  return {
    ...copy,
    path: `/projects/${project.slug}`,
    image: project.image,
  }
}

export function newsEntry(slug: string, language: Language): SeoEntry | null {
  const story = newsStories.find((item) => item.slug === slug)
  const copy = newsCopy[slug]?.[language]
  if (!story || !copy) return null
  return {
    ...copy,
    path: `/news/${slug}`,
    image: story.image,
    imageAlt: language === 'ar' ? story.imageAltAr : story.imageAltEn,
  }
}

export function documentCopy(pathname: string, language: Language): Pick<SeoEntry, 'title' | 'description'> {
  const newsSlug = pathname.match(/^\/news\/([^/]+)/)?.[1]
  if (newsSlug) {
    const entry = newsEntry(newsSlug, language)
    if (entry) return entry
  }
  const projectSlug = pathname.match(/^\/projects\/([^/]+)/)?.[1]
  if (projectSlug) {
    const project = projects.find((item) => item.slug === projectSlug)
    if (project && projectCopy[project.slug]) return projectEntry(project, language)
  }
  const pack = pages[language]
  if (pathname.startsWith('/about-us')) return pack.about
  if (pathname.startsWith('/projects')) return pack.projects
  if (pathname.startsWith('/installments')) return pack.installments
  if (pathname.startsWith('/news')) return pack.news
  if (pathname.startsWith('/contact-us')) return pack.contact
  if (pathname.startsWith('/careers')) return pack.careers
  if (pathname.startsWith('/past-work')) return pack.pastWork
  return pack.home
}

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': ['RealEstateAgent', 'Organization'],
  '@id': `${siteUrl}/#organization`,
  name: 'بروة للتطوير العقاري',
  alternateName: 'Barwa Developments',
  url: siteUrl,
  logo: `${siteUrl}/icon-512.png`,
  image: absoluteUrl(defaultImage),
  telephone: CONTACT.hotline,
  email: CONTACT.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '١٢ شارع المشير أحمد إسماعيل',
    addressLocality: 'شيراتون',
    addressRegion: 'القاهرة',
    addressCountry: 'EG',
  },
  areaServed: {
    '@type': 'Place',
    name: 'شرق القاهرة',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: CONTACT.hotline,
    email: CONTACT.email,
    contactType: 'customer service',
    availableLanguage: ['Arabic', 'English'],
  },
  sameAs: [
    'https://www.facebook.com/BarwaDevelopments/',
    'https://www.instagram.com/barwadevelopments/',
    'https://www.linkedin.com/company/barwadevelopments',
    'https://www.youtube.com/@BarwaDevelopments',
    'https://www.tiktok.com/@barwadevelopments',
  ],
}

export function projectJsonLd(project: Project) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: project.arabic,
    alternateName: project.displayName,
    description: project.detailDescription ?? project.description,
    url: `${siteUrl}/projects/${project.slug}`,
    image: absoluteUrl(project.image),
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'مدينة الشروق',
      addressRegion: 'القاهرة',
      addressCountry: 'EG',
    },
    containedInPlace: {
      '@type': 'Place',
      name: 'شرق القاهرة',
    },
  }
}
