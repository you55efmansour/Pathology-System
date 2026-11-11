import { useTranslation } from 'react-i18next';
import { BrandMark } from '@/components/ui/brand';
import { StatusBadge } from '@/features/cases/components/StatusBadge';
import { SlideImage } from '@/features/cases/components/SlideImage';
import { formatDate } from '@/lib/format';
import { localizeNormalTemplate } from '../config/reportTemplates';

export function ReportDocument({ item }) {
  const { t, i18n } = useTranslation();
  const selected = item.images.filter((image) => image.selected);
  const text = item.report.type === 'normal' ? localizeNormalTemplate(item.report.text, item, i18n.language) : item.report.text;
  return <article className="report-document" data-finalized={item.status === 'finalized'} dir={i18n.dir()} lang={i18n.resolvedLanguage}>
    <div className="document-demo">{t('demoDocument')}</div>
    <header className="document-header"><div className="document-brand"><BrandMark /><span>{t('appName')}<small>{t('appTagline')}</small></span></div><div className="document-identity"><h2>{t('documentTitle')}</h2><bdi>{item.accession}</bdi></div></header>
    <div className="document-status-row"><StatusBadge status={item.status} /><span>{t('reportType')}: <strong>{t(item.report.type)}</strong></span></div>
    <dl className="document-metadata">{[['patientName', item.patientName], ['patientId', item.patientId], ['specimenType', item.specimenType], ['specimenId', item.specimenId || '—'], ['createdAt', formatDate(item.createdAt, i18n.language)], ['caseId', item.accession]].map(([key, value]) => <div key={key}><dt>{t(key)}</dt><dd><bdi>{value}</bdi></dd></div>)}</dl>
    <section className="document-body"><h3>{t('reportText')}</h3><div className="document-report-text" dir="auto">{text}</div></section>
    {selected.length > 0 && <section className="document-attachments"><h3>{t('attachments')}</h3><div className="document-image-grid">{selected.map((image) => <figure key={image.id}><SlideImage image={image} /><figcaption dir="auto">{image.name}</figcaption></figure>)}</div></section>}
    <footer className="document-footer"><dl>{item.approvedAt && <div><dt>{t('approvedAt')}</dt><dd>{formatDate(item.approvedAt, i18n.language, true)}</dd></div>}{item.finalizedAt && <div><dt>{t('finalizedAt')}</dt><dd>{formatDate(item.finalizedAt, i18n.language, true)}</dd></div>}</dl><p>{t('noSignature')}</p><bdi>{item.accession}</bdi></footer>
  </article>;
}
