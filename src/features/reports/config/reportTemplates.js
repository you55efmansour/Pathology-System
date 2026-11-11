export const normalTemplate = {
  id: 'general-demo',
  nameKey: 'templateName',
  text: 'DEMONSTRATION — NORMAL REPORT WORKFLOW\n\nPatient: {{patientName}} ({{patientId}})\nSpecimen: {{specimenType}}\n\nReport text:\nLaboratory-approved clinical wording has not been supplied. Replace this demonstration text with the appropriate report content.\n\nThis is a nonclinical template for testing the reporting workflow. Selecting Normal does not perform a diagnosis.',
};

const arabicNormalText = 'عرض تجريبي — خطوات إعداد تقرير طبيعي\n\nالمريض: {{patientName}} ({{patientId}})\nالعينة: {{specimenType}}\n\nنص التقرير:\nلم تُقدَّم صياغة سريرية معتمدة من المعمل. استبدل هذا النص التجريبي بمحتوى التقرير المناسب.\n\nهذا قالب غير سريري لاختبار خطوات إعداد التقارير. اختيار القالب الطبيعي لا يُعد تشخيصًا.';

export function getNormalTemplateText(language = 'en') {
  return language.startsWith('ar') ? arabicNormalText : normalTemplate.text;
}

export function populateNormalTemplate(item, language = 'en') {
  return getNormalTemplateText(language).replace(/\{\{(patientName|patientId|specimenType)\}\}/g, (_, key) => item[key] || '—');
}

// Only untouched generated wording follows the interface language. Authored text stays intact.
export function localizeNormalTemplate(text, item, language) {
  return ['en', 'ar'].some((locale) => text === populateNormalTemplate(item, locale))
    ? populateNormalTemplate(item, language)
    : text;
}
