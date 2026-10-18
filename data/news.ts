export type NewsCategory = 'partnerships' | 'contracts' | 'appointments'

export type NewsSource = {
  name: string
  href: string
}

export type NewsStory = {
  slug: string
  date: string
  category: NewsCategory
  categoryAr: string
  categoryEn: string
  titleAr: string
  titleEn: string
  summaryAr: string
  summaryEn: string
  image: string
  imageAltAr: string
  imageAltEn: string
  sources: NewsSource[]
}

export const newsStories: NewsStory[] = [
  {
    slug: 'telecom-egypt-we-mou',
    date: '2025-08-19',
    category: 'partnerships',
    categoryAr: 'شراكات',
    categoryEn: 'Partnerships',
    titleAr: 'بروة توقع مذكرة تفاهم مع المصرية للاتصالات WE',
    titleEn: 'Barwa signs a memorandum with Telecom Egypt WE',
    summaryAr: 'أعلنت بروة للتنمية العمرانية توقيع مذكرة تفاهم مع الشركة المصرية للاتصالات WE لتوفير حلول اتصالات متكاملة وخدمات تكنولوجيا ذكية في مشروعاتها. وقّع الاتفاقية أحمد السكوت عن المصرية للاتصالات وأحمد راجح، رئيس مجلس إدارة بروة. وتهدف الشراكة إلى إتاحة بنية تحتية رقمية في مشروعات الشركة.',
    summaryEn: 'Barwa Developments signed a memorandum of understanding with Telecom Egypt (WE) to provide integrated communication solutions and smart technology services across its projects. Ahmed Alsakoot of Telecom Egypt and Ahmed Rageh, chairman of Barwa Developments, signed the agreement. The partnership is meant to make digital infrastructure available in the company’s developments.',
    image: '/news/telecom-egypt-we.jpg',
    imageAltAr: 'صورة منشورة مع خبر توقيع مذكرة التفاهم مع المصرية للاتصالات',
    imageAltEn: 'Photograph published with the Telecom Egypt memorandum coverage',
    sources: [
      { name: 'مجلة أرقام', href: 'https://arqam.news/478827/' },
      { name: 'النافذة', href: 'https://alnafezah.com/115578/' },
      { name: 'أسواق نيوز', href: 'https://www.aswaqnewseg.com/51386' },
      { name: 'The Icon News', href: 'https://theicon.news/8944/' },
      { name: 'بروفايلى', href: 'https://profayly.com/بروة-للتنمية-توقع-اتفاقية-شراكة-مع-الم/' },
      { name: 'تداول نيوز', href: 'https://tadawulnews.net/archives/29382' },
      { name: 'Egy Economy', href: 'https://egyeconomy.com/en/19/08/2025/64412/' },
      { name: 'المفتاح الاقتصادي', href: 'https://economickey.com/2025/08/19/بروة-للتنمية-العمرانية/' },
      { name: 'تواصل 24', href: 'https://tawasul24.com/68271/' },
      { name: 'عقار جيت', href: 'https://www.aqar-gate.com/شركات/شراكة-استراتيجية-بين-بروة-للتنمية-و/' },
      { name: 'سيتي توداي', href: 'https://citytodayeg.com/بروة-للتنمية-توقع-اتفاقية-شراكة-استرا/' },
      { name: 'الملخص الاقتصادي', href: 'https://almolakhasalektesady.com/barwa-developments-collaborates-with-telecom-egypt-we-to-deliver-smart-technology/' },
    ],
  },
  {
    slug: 'mrb-central-mall-el-shorouk',
    date: '2025-07-21',
    category: 'contracts',
    categoryAr: 'تعاقدات',
    categoryEn: 'Contracts',
    titleAr: 'بروة تتعاقد مع MRB لإدارة وتشغيل سنترال مول',
    titleEn: 'Barwa contracts MRB to operate Central Mall',
    summaryAr: 'أعلنت بروة للتطوير العقاري تعاقدها مع شركة MRB لإدارة وتشغيل سنترال مول في مدينة الشروق، ضمن خطة لدعم المزايا التنافسية للمشروع. وقال أحمد راجح، رئيس مجلس الإدارة، إن المشروع يقع على مساحة 3 آلاف متر ويجمع بين النشاط التجاري والإداري والترفيهي. ويأتي التعاقد للتعاون مع جهة متخصصة في إدارة هذا النوع من المشروعات.',
    summaryEn: 'Barwa Developments announced a contract with MRB to manage and operate Central Mall in El Shorouk, as part of its plan to support the project’s competitive position. Chairman Ahmed Rageh said the project covers 3,000 square meters and combines commercial, administrative and entertainment uses. The contract brings in a specialist to manage this type of development.',
    image: '/news/mrb-central-mall.jpg',
    imageAltAr: 'صورة منشورة مع خبر التعاقد مع MRB على سنترال مول',
    imageAltEn: 'Photograph published with the MRB contract coverage',
    sources: [
      { name: 'إنفست جيت', href: 'https://invest-gate.me/ar/%D8%A7%D8%AE%D8%A8%D8%A7%D8%B1/%d8%a8%d8%b1%d9%88%d8%a9-%d9%84%d9%84%d8%aa%d8%b7%d9%88%d9%8a%d8%b1-%d8%aa%d8%aa%d8%b9%d8%a7%d9%82%d8%af-%d9%85%d8%b9-mrb-%d9%84%d8%a5%d8%af%d8%a7%d8%b1%d8%a9-%d9%88%d8%aa/' },
      { name: 'Invest-Gate', href: 'https://invest-gate.me/news/barwa-developments-contracts-mrb-to-operate-central-mall-el-shorouk/' },
      { name: 'القرار المصري', href: 'https://alqararalmasry.com/2025/07/21/%D8%B9%D9%82%D8%A7%D8%B1%D8%A7%D8%AA/%D8%A8%D8%B1%D9%88%D8%A9-%D9%84%D9%84%D8%AA%D8%B7%D9%88%D9%8A%D8%B1-%D8%AA%D8%AA%D8%B9%D8%A7%D9%88%D9%86-%D9%85%D8%B9-mrb-%D9%84%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9-%D9%88%D8%AA%D8%B4%D8%BA%D9%8A/203110/' },
      { name: 'مجلة أرقام', href: 'https://arqam.news/469254/' },
      { name: 'مجلة أرقام', href: 'https://arqam.news/469259/' },
      { name: 'أسواق نيوز', href: 'https://www.aswaqnewseg.com/51021' },
      { name: 'راسمال نيوز', href: 'https://rasmalnews.com/1285/' },
      { name: 'راسمال نيوز', href: 'https://rasmalnews.com/1290/' },
      { name: 'EGY GATE NEWS', href: 'https://www.egygatenews.com/2025/07/barwa-developments-contracts-with-mrb.html' },
      { name: 'المفتاح الاقتصادي', href: 'https://economickey.com/?p=25791' },
      { name: 'العقارات اليوم', href: 'https://www.alaqaratalyoum.com/2025/07/Egypt-real-estate_01337599022.html' },
      { name: 'إيجي إيكونومي', href: 'https://egyeconomy.com/21/07/2025/63406/' },
      { name: 'Egy Economy', href: 'https://egyeconomy.com/en/21/07/2025/63410/' },
      { name: 'نبض', href: 'http://nabd.cc/t/158272007' },
      { name: 'The Icon News', href: 'https://theicon.news/8480/' },
      { name: 'The Editor News', href: 'https://www.theeditor.news/بروة-للتطوير-تتعاقد-مع-mrb-لإدارة-وت/' },
      { name: 'أرباح نيوز', href: 'https://arba7news.com/بروة-للتطوير-تتعاقد-مع-mrb-لإدارة-وتش/' },
      { name: 'النافذة', href: 'https://alnafezah.com/111077/' },
      { name: 'هير نيوز', href: 'https://www.her-news.com/117558' },
      { name: 'تداول نيوز', href: 'https://tadawulnews.net/archives/28750' },
      { name: 'REALTY CATALOGUE', href: 'https://realty-eg.net/central-mall-el-shorouk-barwa-mrb-deal/' },
      { name: 'REALTY CATALOGUE', href: 'https://realty-eg.net/borowa-mrb-central-mall-el-shorouk/' },
      { name: 'عالم المال', href: 'https://alamalmal.net/907711/real-estate/' },
      { name: 'عقار جيت', href: 'https://www.aqar-gate.com/english/barwa-developments-contracts-with-mrb-to-manage-and-operate-central-mall-el-shorouk/' },
      { name: 'عقار جيت', href: 'https://www.aqar-gate.com/شركات/بروة-للتطوير-تتعاقد-مع-mrb-لإدارة-وت/' },
      { name: 'LinkedIn', href: 'https://www.linkedin.com/feed/update/urn:li:activity:7353042902073114624' },
      { name: 'LinkedIn', href: 'https://www.linkedin.com/posts/barwadevelopments_بروة-للتطوير-تتعاقد-مع-mrb-لإدارة-وتشغيل-activity-7353356911401959425-GTz1' },
    ],
  },
  {
    slug: 'amr-attia-commercial-director',
    date: '2025-02-23',
    category: 'appointments',
    categoryAr: 'تعيينات',
    categoryEn: 'Appointments',
    titleAr: 'تعيين عمرو عطية رئيسًا للقطاع التجاري',
    titleEn: 'Amr Attia appointed head of the commercial sector',
    summaryAr: 'أعلنت بروة للتنمية العمرانية تعيين عمرو عطية في منصب رئيس القطاع التجاري، ضمن خطة للاستعانة بخبرات في السوق العقاري. وتناولت التغطية خبرته السابقة في شركات تطوير داخل مصر وخارجها، من بينها داماك وبيتا إيجيبت والمطورين المصريين.',
    summaryEn: 'Barwa Developments announced the appointment of Amr Attia as head of the commercial sector, as part of a plan to bring in experienced real-estate professionals. The coverage noted his previous work at development companies in Egypt and abroad, including Damac, Beta Egypt and المطورين المصريين.',
    image: '/news/amr-attia.jpg',
    imageAltAr: 'صورة منشورة مع خبر تعيين عمرو عطية',
    imageAltEn: 'Photograph published with the Amr Attia appointment coverage',
    sources: [
      { name: 'تواصل 24', href: 'https://tawasul24.com/63457/' },
      { name: 'REALTY CATALOGUE', href: 'https://realty-eg.net/بروة-للتنمية-تعين-عمرو-عطية-في-منصب-ر/' },
      { name: 'جريدة إسكان مصر', href: 'https://www.iskanmisr.com/81311/بروة-للتنمية-تعين-عمرو-عطية-في-منصب-رئيس-القطاع-التجاري' },
      { name: 'النافذة', href: 'https://alnafezah.com/82282/' },
      { name: 'مجلة أرقام', href: 'https://arqam.news/427922/' },
      { name: 'سيتي توداي', href: 'https://citytodayeg.com/عمرو-عطية-رئيسا-للقطاع-التجاري-بشركة-ب/' },
      { name: 'بيزنس مصر', href: 'https://businessmaser.com/بروة-للتنمية-تعين-عمرو-عطية-في-منصب-ر/' },
      { name: 'الملخص الاقتصادي', href: 'https://almolakhasalektesady.com/بروة-للتنمية-تعين-عمرو-عطية-في-منصب-ر/' },
    ],
  },
]

export function getNewsStory(slug: string) {
  return newsStories.find((story) => story.slug === slug)
}
