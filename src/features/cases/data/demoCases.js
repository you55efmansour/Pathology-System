import { populateNormalTemplate } from '@/features/reports/config/reportTemplates';

const definitions = [
  [['Amelia Hart', 'أميليا هارت'], ['Tissue specimen', 'عينة نسيج'], 'in_review', 'normal'],
  [['Noah Ellis', 'نواه إليس'], ['Biopsy specimen', 'عينة خزعة'], 'preparation', ''],
  [['Olivia Reed', 'أوليفيا ريد'], ['Tissue specimen', 'عينة نسيج'], 'draft', 'custom'],
  [['Liam Brooks', 'ليام بروكس'], ['Cytology specimen', 'عينة فحص خلوي'], 'in_review', 'custom'],
  [['Sophia Lane', 'صوفيا لين'], ['Biopsy specimen', 'عينة خزعة'], 'intake', ''],
  [['Ethan Cole', 'إيثان كول'], ['Tissue specimen', 'عينة نسيج'], 'approved', 'normal'],
  [['Mia Parker', 'ميا باركر'], ['Cytology specimen', 'عينة فحص خلوي'], 'finalized', 'custom'],
  [['Lucas Gray', 'لوكاس غراي'], ['Biopsy specimen', 'عينة خزعة'], 'finalized', 'normal'],
];
const customDemoText = {
  en: 'DEMONSTRATION REPORT\n\nThis sample illustrates the custom-report workflow. No clinical findings are represented. Laboratory-approved content must be supplied before any real use.',
  ar: 'تقرير تجريبي\n\nيوضح هذا المثال خطوات إعداد تقرير مخصص، ولا يتضمن أي نتائج سريرية. يجب توفير محتوى معتمد من المعمل قبل أي استخدام فعلي.',
};

// Localize only known, unchanged example values; never rewrite user-entered data or storage.
export function localizeDemoCase(item, language = 'en') {
  const definition = definitions.find((_, index) => item.id === `demo-${248 - index}`);
  if (!definition) return item;
  const [names, specimens] = definition;
  const locale = language.startsWith('ar') ? 1 : 0;
  const localized = { ...item,
    patientName: names.includes(item.patientName) ? names[locale] : item.patientName,
    specimenType: specimens.includes(item.specimenType) ? specimens[locale] : item.specimenType,
  };
  let text = item.report.text;
  if (item.report.type === 'normal') {
    const generated = names.flatMap((patientName) => specimens.flatMap((specimenType) => ['en', 'ar'].map((lang) => populateNormalTemplate({ ...item, patientName, specimenType }, lang))));
    if (generated.includes(text)) text = populateNormalTemplate(localized, language);
  } else if (Object.values(customDemoText).includes(text)) text = customDemoText[locale ? 'ar' : 'en'];
  return { ...localized, report: { ...item.report, text } };
}

export function createDemoCases(now = new Date(), language = 'en') {
  return definitions.map(([names, specimens, status, type], index) => {
    const createdAt = new Date(now.getTime() - (index + 1) * 3600000 * 4).toISOString();
    const item = {
      id: `demo-${248 - index}`, accession: `PA-${now.getFullYear()}-${String(248 - index).padStart(5, '0')}`,
      patientName: names[0], patientId: `DEMO-${String(index + 1).padStart(4, '0')}`, specimenType: specimens[0],
      specimenId: `SP-DEMO-${index + 1}`, status, intakeComplete: status !== 'intake',
      createdAt, updatedAt: createdAt, images: [], report: { type, text: '' },
      approvedAt: ['approved', 'finalized'].includes(status) ? createdAt : null,
      finalizedAt: status === 'finalized' ? createdAt : null,
      activity: [{ event: 'created', at: createdAt }],
    };
    if (type) item.report.text = type === 'normal' ? populateNormalTemplate(item) : customDemoText.en;
    return localizeDemoCase(item, language);
  });
}
