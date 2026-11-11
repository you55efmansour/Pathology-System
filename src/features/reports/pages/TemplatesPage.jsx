import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileText, ArrowRight, Braces, Info } from 'lucide-react';
import { populateNormalTemplate } from '../config/reportTemplates';
import { Button } from '@/components/ui/button';

export default function TemplatesPage() {
  const { t, i18n } = useTranslation();
  const preview = populateNormalTemplate(Object.fromEntries(['patientName', 'patientId', 'specimenType'].map((key) => [key, `[${t(key)}]`])), i18n.language);
  return <div className="page-enter"><div className="page-heading"><div><h1>{t('templates')}</h1><p>{t('templatesDescription')}</p></div></div><div className="template-layout"><section className="template-description"><span className="template-symbol"><FileText size={31} /></span><h2>{t('demoTemplateTitle')}</h2><p>{t('demoTemplateDescription')}</p><div className="template-detail"><Braces size={18} /><span>{t('templateVariables')}</span></div><div className="template-detail"><Info size={18} /><span>{t('templateNote')}</span></div><Button asChild><Link to="/cases/new">{t('useTemplate')}<ArrowRight size={16} /></Link></Button></section><section className="template-preview"><div className="template-preview-title"><h2>{t('templateName')}</h2><span>{t('templatePreview')}</span></div><pre dir={i18n.dir()}>{preview}</pre></section></div></div>;
}
