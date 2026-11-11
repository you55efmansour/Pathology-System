import { Navigate, Link, useNavigate, useOutletContext } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Save, UserRound, TestTubeDiagonal } from 'lucide-react';
import { intakeSchema, casePath } from '../config/caseConfig';
import { useCaseAction } from '../hooks/useCaseAction';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field } from '@/components/ui/field';

export default function IntakePage() {
  const { item, busy } = useOutletContext();
  if (item && ['in_review', 'approved', 'finalized'].includes(item.status)) return <Navigate to={casePath(item)} replace />;
  return <IntakeForm item={item} busy={busy} />;
}
function IntakeForm({ item, busy }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const action = useCaseAction();
  const form = useForm({ resolver: zodResolver(intakeSchema), resetOptions: { keepDirtyValues: true }, values: { patientName: item?.patientName || '', patientId: item?.patientId || '', specimenType: item?.specimenType || '', specimenId: item?.specimenId || '' } });
  const { allowNavigation, guard } = useUnsavedChanges(form.formState.isDirty);
  const save = async (values, complete) => {
    const result = await action('saveIntake', [item?.id, values, complete], complete ? 'saved' : 'draftSaved');
    if (result) {
      form.reset({ patientName: result.patientName, patientId: result.patientId, specimenType: result.specimenType, specimenId: result.specimenId });
      if (complete) { allowNavigation(); navigate(`/cases/${result.id}/slides`); }
      else if (!item) { allowNavigation(); navigate(`/cases/${result.id}/intake`, { replace: true }); }
    }
  };
  const field = (key, required, max) => <Field key={key} id={key} label={t(key)} required={required} error={form.formState.errors[key]}><Input id={key} {...form.register(key)} maxLength={max} autoComplete="off" placeholder={t(`${key}Placeholder`)} aria-invalid={!!form.formState.errors[key]} aria-describedby={form.formState.errors[key] ? `${key}-error` : undefined} aria-required={required} /></Field>;
  return <form className="editor-surface" onSubmit={form.handleSubmit((values) => save(values, true))} noValidate>
    <div className="surface-heading"><h2>{t('intake')}</h2><p>{t(item ? 'intakeExisting' : 'intakeDescription')}</p></div>
    <div className="form-section"><h3><UserRound size={18} />{t('patientDetails')}</h3><div className="form-grid">{field('patientName', true, 120)}{field('patientId', true, 60)}</div></div>
    <div className="form-section"><h3><TestTubeDiagonal size={18} />{t('specimenDetails')}</h3><div className="form-grid">{field('specimenType', true, 120)}{field('specimenId', false, 80)}</div></div>
    <p className="form-note">{t('requiredNote')}</p><p className="schema-note">{t('schemaNote')}</p>
    <div className="form-actions"><Button asChild variant="ghost"><Link to="/cases">{t('cancel')}</Link></Button><div><Button type="button" variant="outlined" disabled={busy} onClick={() => save(form.getValues(), false)}><Save size={16} />{t('saveDraft')}</Button><Button type="submit" disabled={busy}>{t(busy ? 'saving' : 'continueSlides')}<ArrowRight size={16} /></Button></div></div>{guard}
  </form>;
}
