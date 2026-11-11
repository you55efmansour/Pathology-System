import { useRef, useState } from 'react';
import { Navigate, useNavigate, useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'sonner';
import { Check, LockKeyhole, Printer, PencilLine, Save, ShieldCheck, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useCaseAction } from '@/features/cases/hooks/useCaseAction';
import { casePath } from '@/features/cases/config/caseConfig';
import caseService from '@/features/cases/services/caseService';
import { imageRepository } from '@/services/imageRepository';
import { ReportDocument } from '../components/ReportDocument';

export default function ReviewPage({ finalized = false }) {
  const { item, busy } = useOutletContext();
  if (finalized && item.status !== 'finalized') return <Navigate to={casePath(item)} replace />;
  if (!finalized && item.status === 'finalized') return <Navigate to={casePath(item)} replace />;
  if (!['in_review', 'approved', 'finalized'].includes(item.status)) return <Navigate to={casePath(item)} replace />;
  return <ReviewReport item={item} busy={busy} />;
}
function ReviewReport({ item, busy }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const action = useCaseAction();
  const [confirm, setConfirm] = useState('');
  const [printing, setPrinting] = useState(false);
  const contentRef = useRef(null);
  const final = item.status === 'finalized';
  const print = useReactToPrint({
    contentRef, documentTitle: `${t('appName')}-${item.accession}-${t('demoShort')}`, preserveAfterPrint: true, bodyClass: i18n.dir() === 'rtl' ? 'print-rtl' : 'print-ltr',
    onBeforePrint: async () => {
      await caseService.canExport(item.id);
      await Promise.all(item.images.filter((image) => image.selected).map(async (image) => { const preload = new Image(); preload.src = await imageRepository.url(image.id); await preload.decode(); }));
      await new Promise(requestAnimationFrame);
      await Promise.all(Array.from(contentRef.current.querySelectorAll('img')).map((image) => image.decode()));
    },
    onAfterPrint: () => setPrinting(false),
    onPrintError: () => { setPrinting(false); toast.error(t('errors.print')); },
    pageStyle: '@page { size: A4; margin: 16mm 14mm; } @media print { html,body { background: white !important; } }',
  });
  const exportReport = async () => {
    setPrinting(true);
    try { await caseService.canExport(item.id); print(); }
    catch (error) { setPrinting(false); toast.error(t(`errors.${error.message}`, { defaultValue: t('errors.print') })); }
  };
  const returnDraft = async (edit) => { const result = await action('returnToDraft', [item.id], 'returned'); if (result) navigate(edit ? `/cases/${item.id}/report` : '/cases'); };
  const decide = async () => {
    const result = await action(confirm === 'approve' ? 'approve' : 'finalize', [item.id], confirm === 'approve' ? 'approved' : 'finalized');
    if (result) { setConfirm(''); if (result.status === 'finalized') navigate(`/cases/${item.id}/final`); }
  };
  return <div className="review-workspace">
    <div className="review-heading"><div><h2>{t(final ? 'locked' : 'review')}</h2><p>{t(final ? 'finalDescription' : 'reviewDescriptionCase')}</p></div>{final && <LockKeyhole size={22} />}</div>
    {!final && <div className="notice notice-simulation"><Info size={18} /><div><strong>{t('simulatedApproval')}</strong><p>{t('approvalNote')}</p></div></div>}
    {item.status === 'approved' && <div className="notice notice-success"><ShieldCheck size={23} /><div><strong>{t('approvedReady')}</strong><p>{t('approvedHint')}</p></div></div>}
    <div ref={contentRef}><ReportDocument item={item} /></div>
    <div className="review-actions">{final ? <><p><LockKeyhole size={15} />{t('printHint')}</p><Button disabled={printing} onClick={exportReport}><Printer size={17} />{t(printing ? 'printing' : 'exportPdf')}</Button></> : <><Button variant="outlined" disabled={busy} onClick={() => returnDraft(true)}><PencilLine size={16} />{t('returnEdits')}</Button><div><Button variant="ghost" disabled={busy} onClick={() => returnDraft(false)}><Save size={16} />{t('saveDraft')}</Button><Button disabled={busy} onClick={() => setConfirm(item.status === 'approved' ? 'finalize' : 'approve')}>{item.status === 'approved' ? <LockKeyhole size={16} /> : <Check size={17} />}{t(item.status === 'approved' ? 'finalize' : 'approve')}</Button></div></>}</div>
    <ConfirmDialog open={!!confirm} onOpenChange={(open) => { if (!open) setConfirm(''); }} title={t(confirm === 'approve' ? 'approveTitle' : 'finalizeTitle')} description={t(confirm === 'approve' ? 'approveDescription' : 'finalizeDescription')} action={t(confirm === 'approve' ? 'confirmApprove' : 'confirmFinalize')} busy={busy} onConfirm={decide} />
  </div>;
}
