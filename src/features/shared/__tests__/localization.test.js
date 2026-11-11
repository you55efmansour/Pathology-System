import i18n from '../i18n';
import { formatNumber, formatSize } from '@/lib/format';
import { getNormalTemplateText, populateNormalTemplate, localizeNormalTemplate } from '@/features/reports/config/reportTemplates';
import { createDemoCases, localizeDemoCase } from '@/features/cases/data/demoCases';
import { createCaseService, STORAGE_KEY } from '@/features/cases/services/caseService';

const patient = { patientName: 'مريض تجريبي', patientId: 'DEMO-AR', specimenType: 'عينة نسيج' };
const keys = (value, prefix = '') => Object.entries(value).flatMap(([key, entry]) => typeof entry === 'object' ? keys(entry, `${prefix}${key}.`) : [`${prefix}${key}`]).sort();

test('Arabic covers every English translation key without a fallback', () => {
  const english = i18n.getResourceBundle('en', 'translation');
  const arabic = i18n.getResourceBundle('ar', 'translation');
  expect(keys(arabic)).toEqual(keys(english));
  expect(i18n.getFixedT('ar')('normal')).toBe('طبيعي');
  expect(i18n.getFixedT('en')('normal')).toBe('Normal');
  expect(i18n.getFixedT('ar')('characters', { count: 1250 })).toBe('١٬٢٥٠ / ٤٠٬٠٠٠ حرف');
  expect(i18n.getFixedT('en')('reportTooLong')).toContain('40,000');
});

test('Arabic generated content substitutes entered values and leaves no English scaffold', () => {
  const text = populateNormalTemplate(patient, 'ar');
  expect(text).toContain('المريض: مريض تجريبي (DEMO-AR)');
  expect(text).toContain('العينة: عينة نسيج');
  expect(text).not.toMatch(/DEMONSTRATION|Patient:|Specimen:|\{\{/);
  expect(getNormalTemplateText('ar-EG')).toContain('تقرير طبيعي');
  expect(localizeNormalTemplate(populateNormalTemplate(patient), patient, 'ar')).toBe(text);
  expect(localizeNormalTemplate(text, patient, 'en')).toBe(populateNormalTemplate(patient));
});

test.each(['normal', 'custom'])('authored %s text stays unchanged when the language switches', (type) => {
  const item = createDemoCases().find((record) => record.report.type === type);
  const text = `${item.report.text}\nكتابة المستخدم — User edits`;
  expect(localizeNormalTemplate(text, item, 'ar')).toBe(text);
  expect(localizeDemoCase({ ...item, report: { type, text } }, 'ar').report.text).toBe(text);
});

test('example values follow the language without mutating saved records or user-entered fields', () => {
  const item = createDemoCases()[0];
  const before = JSON.stringify(item);
  const arabic = localizeDemoCase(item, 'ar');
  expect(arabic.patientName).toBe('أميليا هارت');
  expect(arabic.specimenType).toBe('عينة نسيج');
  expect(arabic.report.text).toContain('المريض: أميليا هارت');
  expect(arabic.accession).toBe(item.accession);
  expect(JSON.stringify(item)).toBe(before);
  expect(localizeDemoCase(arabic, 'en')).toEqual(item);
  const edited = { ...item, patientName: 'اسم أدخله المستخدم', specimenType: 'User specimen' };
  expect(localizeDemoCase(edited, 'ar')).toMatchObject({ patientName: edited.patientName, specimenType: edited.specimenType });
  const custom = createDemoCases().find((record) => record.report.type === 'custom');
  expect(localizeDemoCase(custom, 'ar').report.text).toContain('تقرير تجريبي');
});

test('fresh examples and explicit reset use the selected language', async () => {
  const values = new Map();
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  const service = createCaseService({ storage, language: () => 'ar' });
  await service.list();
  let records = JSON.parse(storage.getItem(STORAGE_KEY)).records;
  expect(records[0].report.text).toContain('عرض تجريبي');
  await service.resetDemo();
  records = JSON.parse(storage.getItem(STORAGE_KEY)).records;
  expect(records[2].report.text).toContain('تقرير تجريبي');
});

test('numbers and attachment sizes use the selected locale', () => {
  expect(formatNumber(12, 'ar')).toBe('١٢');
  expect(formatSize(2048, 'ar')).toBe('٢ كيلوبايت');
  expect(formatSize(1572864, 'ar')).toBe('١٫٥ ميجابايت');
  expect(formatSize(2048, 'en')).toBe('2 KB');
  expect(formatSize(1572864, 'en')).toBe('1.5 MB');
});
