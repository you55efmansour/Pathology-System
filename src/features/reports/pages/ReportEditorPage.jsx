import { useState } from 'react';
import { Link, Navigate, useNavigate, useOutletContext } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Save, FileText, FilePenLine, Check, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { reportSchema, casePath } from '@/features/cases/config/caseConfig';
import { populateNormalTemplate, localizeNormalTemplate } from '../config/reportTemplates';
import { formatNumber } from '@/lib/format';
import { localizeDemoCase } from '@/features/cases/data/demoCases';
import { useCaseAction } from '@/features/cases/hooks/useCaseAction';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import { SlideImage } from '@/features/cases/components/SlideImage';

export default function ReportEditorPage() {
  const { item, busy } = useOutletContext();
  if (['in_review', 'approved', 'finalized'].includes(item.status)) return <Navigate to={casePath(item)} replace />;
  if (!item.intakeComplete) return <Navigate to={`/cases/${item.id}/intake`} replace />;
  return <ReportEditor item={item} busy={busy} />;
}
function ReportEditor({ item, busy }) {
  const { t, i18n } = useTranslation();
  const action = useCaseAction();
  const navigate = useNavigate();
  const [replacement, setReplacement] = useState('');
  const form = useForm({ resolver: zodResolver(reportSchema), defaultValues: { ...item.report } });
  const type = useWatch({ control: form.control, name: 'type' });
  const text = useWatch({ control: form.control, name: 'text' });
  const localizedText = localizeDemoCase({ ...item, report: { type, text } }, i18n.language).report.text;
  const displayText = type === 'normal' ? localizeNormalTemplate(localizedText, item, i18n.language) : localizedText;
  const { guard, allowNavigation } = useUnsavedChanges(form.formState.isDirty);
  const changeType = (value) => { form.setValue('type', value, { shouldDirty: true }); form.setValue('text', value === 'normal' ? populateNormalTemplate(item, i18n.language) : '', { shouldDirty: true }); form.clearErrors(); setReplacement(''); };
  const choose = (value) => { if (type === value) return; if (text.trim()) setReplacement(value); else changeType(value); };
  const save = async (values, review) => {
    if (!values.type) { form.setError('type', { message: 'typeRequired' }); return; }
    const localized = localizeDemoCase({ ...item, report: values }, i18n.language).report;
    const report = { ...localized, text: values.type === 'normal' ? localizeNormalTemplate(localized.text, item, i18n.language) : localized.text };
    const result = await action('saveReport', [item.id, report, review], review ? 'submitted' : 'reportSaved');
    if (result) { form.reset({ ...result.report }); if (review) { allowNavigation(); navigate(`/cases/${item.id}/review`); } }
  };
  const selected = item.images.filter((image) => image.selected);
  return <form className="editor-surface" noValidate onSubmit={form.handleSubmit((values) => save(values, true))}>
    <div className="surface-heading"><h2>{t('report')}</h2><p>{t('reportDescription')}</p></div>
    <fieldset className="report-type-field"><legend>{t('selectReportType')}</legend><div className="report-type-options">{[['normal', FileText, 'normalHint'], ['custom', FilePenLine, 'customHint']].map(([value, Icon, hint]) => <label key={value} className={`report-type-option${type === value ? ' selected' : ''}`}><input type="radio" name="reportType" value={value} checked={type === value} onChange={() => choose(value)} /><Icon size={22} /><span><strong>{t(value)}</strong><small>{t(hint)}</small></span><span className="radio-indicator">{type === value && <Check size={13} />}</span></label>)}</div>{form.formState.errors.type && <p className="field-error" role="alert">{t('typeRequired')}</p>}</fieldset>
    {type === 'normal' && <div className="notice notice-template"><Info size={17} /><div><strong>{t('templateName')}</strong><p>{t('templateNote')}</p></div></div>}
    <div className="report-text-field"><label htmlFor="reportText">{t('reportText')} <span className="required-mark">*</span></label><Textarea id="reportText" {...form.register('text')} value={displayText} dir={i18n.dir()} className="report-textarea" placeholder={t('reportPlaceholder')} maxLength={40000} disabled={!type || busy} aria-required="true" aria-invalid={!!form.formState.errors.text} aria-describedby={form.formState.errors.text ? 'reportText-error' : 'character-count'} />{form.formState.errors.text && <p id="reportText-error" role="alert" className="field-error">{t(form.formState.errors.text.message)}</p>}<span id="character-count" className="character-count">{t('characters', { count: displayText.length })}</span></div>
    <div className="report-attachments"><div className="section-heading-row"><h3>{t('selectedImages')} <span>{formatNumber(selected.length, i18n.language)}</span></h3><Link to={`/cases/${item.id}/slides`}>{t('manageSlides')}<ArrowRight size={14} /></Link></div>{selected.length ? <div className="attachment-strip">{selected.map((image) => <figure key={image.id}><SlideImage image={image} /><figcaption dir="auto">{image.name}</figcaption></figure>)}</div> : <p className="muted-text">{t('noAttachments')}</p>}</div>
    <div className="form-actions"><Button asChild variant="ghost"><Link to={`/cases/${item.id}/slides`}><ArrowLeft size={16} />{t('upload')}</Link></Button><div><Button type="button" variant="outlined" disabled={busy} onClick={() => save(form.getValues(), false)}><Save size={16} />{t('saveDraft')}</Button><Button type="submit" disabled={busy}>{t(busy ? 'saving' : 'continueReview')}<ArrowRight size={16} /></Button></div></div>{guard}
    <ConfirmDialog open={!!replacement} onOpenChange={(open) => { if (!open) setReplacement(''); }} title={t('replaceTitle')} description={t('replaceDescription')} action={t('replace')} onConfirm={() => changeType(replacement)} />
  </form>;
}
