import { Link, NavLink, Outlet, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { ArrowLeft, Check, UserRound, TestTubeDiagonal, Clock3, FlaskConical } from 'lucide-react';
import caseStore from '@/stores/CaseStore';
import { WORKFLOW } from '../config/caseConfig';
import { StatusBadge } from '../components/StatusBadge';
import { formatDate, formatNumber } from '@/lib/format';
import { localizeDemoCase } from '../data/demoCases';
import { WorkspaceState } from '@/features/shared/components/WorkspaceState';

function CaseWorkspace() {
  const { t, i18n } = useTranslation();
  const { caseId } = useParams();
  const { pathname } = useLocation();
  const record = caseId ? caseStore.getCase(caseId) : null;
  const item = record ? localizeDemoCase(record, i18n.language) : null;
  if (caseStore.loading) return <WorkspaceState loading />;
  if (caseStore.error) return <WorkspaceState title={t('loadError')} description={t(`errors.${caseStore.error}`)} action={t('retry')} onAction={caseStore.load} />;
  if (caseId && !item) return <WorkspaceState title={t('notFound')} description={t('notFoundHint')} />;
  const step = pathname.split('/').at(-1);
  const activeIndex = step === 'final' ? 4 : Math.max(0, WORKFLOW.indexOf(step));
  return <div className="page-enter">
    <Link className="back-link" to="/cases"><ArrowLeft size={15} />{t('backCases')}</Link>
    <div className="page-heading case-page-heading"><div><h1><bdi>{item?.accession || t('newCase')}</bdi></h1><p>{item ? <><bdi>{item.patientName || t('untitled')}</bdi> · <bdi>{item.specimenType || t('unspecified')}</bdi></> : t('intakeDescription')}</p></div>{item && <StatusBadge status={item.status} />}</div>
    <nav className="workflow-rail" aria-label={t('workflowTitle')}>{WORKFLOW.map((key, index) => {
      const content = <><span className={`step-number${index < activeIndex ? ' complete' : ''}`}>{index < activeIndex ? <Check size={15} /> : formatNumber(index + 1, i18n.language)}</span><span>{t(key === 'slides' ? 'upload' : key)}</span></>;
      return !item || (!item.intakeComplete && index > 0) || item.status === 'finalized' ? <span key={key} className={`workflow-step${index === activeIndex ? ' active' : ''}`} aria-current={index === activeIndex ? 'step' : undefined}>{content}</span> : <NavLink key={key} to={`/cases/${item.id}/${key}`} className={({ isActive }) => `workflow-step${isActive ? ' active' : ''}`} aria-current={index === activeIndex ? 'step' : undefined}>{content}</NavLink>;
    })}</nav>
    <div className="case-layout"><div className="case-main"><Outlet key={`${caseId || 'new'}-${step}`} context={{ item, busy: caseStore.busy }} /></div><aside className="case-summary">
      <h2>{t('caseDetails')}</h2>
      {item ? <><div className="summary-group"><UserRound size={17} /><div><span>{t('patient')}</span><strong><bdi>{item.patientName || t('unspecified')}</bdi></strong><small><bdi>{item.patientId || '—'}</bdi></small></div></div><div className="summary-group"><TestTubeDiagonal size={17} /><div><span>{t('specimen')}</span><strong><bdi>{item.specimenType || t('unspecified')}</bdi></strong><small><bdi>{item.specimenId || '—'}</bdi></small></div></div><div className="summary-group"><Clock3 size={17} /><div><span>{t('createdAt')}</span><strong>{formatDate(item.createdAt, i18n.language)}</strong></div></div><div className="summary-activity"><h3>{t('activity')}</h3><ol>{item.activity.slice(-4).reverse().map((event, index) => <li key={`${event.at}-${index}`}><span className="activity-dot" /><div><span>{t(`events.${event.event}`)}</span><time>{formatDate(event.at, i18n.language, true)}</time></div></li>)}</ol></div></> : <p className="summary-empty">{t('requiredNote')}</p>}
      <div className="summary-demo"><FlaskConical size={17} /><p>{t('demoNote')}</p></div>
    </aside></div>
  </div>;
}
export default observer(CaseWorkspace);
