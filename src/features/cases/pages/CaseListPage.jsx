import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { Plus, Search, SlidersHorizontal, ClipboardList, Images, FilePenLine, ClipboardCheck, ArrowRight, X } from 'lucide-react';
import caseStore from '@/stores/CaseStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WorkspaceState } from '@/features/shared/components/WorkspaceState';
import { STATUSES } from '../config/caseConfig';
import { CaseTable } from '../components/CaseTable';
import { localizeDemoCase } from '../data/demoCases';
import { formatNumber } from '@/lib/format';

function CaseListPage({ mode = 'all' }) {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const title = mode === 'review' ? 'reviewQueue' : mode === 'finalized' ? 'finalizedReports' : 'worklist';
  const base = caseStore.cases.filter((item) => mode === 'review' ? ['in_review', 'approved'].includes(item.status) : mode === 'finalized' ? item.status === 'finalized' : true).map((item) => localizeDemoCase(item, i18n.language));
  const matches = (item, key) => key === 'all' || (key === 'progress' ? ['intake', 'preparation', 'draft'].includes(item.status) : item.status === key);
  const query = search.trim().toLocaleLowerCase();
  const cases = base.filter((item) => matches(item, filter) && [item.accession, item.patientName, item.patientId, item.specimenType, item.specimenId].some((value) => value.toLocaleLowerCase().includes(query)));
  const tabs = mode === 'all' ? [['all', 'allCases'], ['progress', 'inProgress'], ['in_review', 'awaitingReview'], ['approved', 'statuses.approved'], ['finalized', 'statuses.finalized']] : mode === 'review' ? [['all', 'allCases'], ['in_review', 'awaitingReview'], ['approved', 'statuses.approved']] : [['all', 'allCases']];
  return <div className="page-enter">
    <div className="page-heading"><div><div className="title-with-count"><h1>{t(title)}</h1><span className="heading-count">{formatNumber(base.length, i18n.language)}</span></div><p>{t(mode === 'review' ? 'reviewDescription' : mode === 'finalized' ? 'finalizedDescription' : 'worklistDescription')}</p></div><Button asChild><Link to="/cases/new"><Plus size={17} />{t('newCase')}</Link></Button></div>
    <section className="worklist-surface" aria-label={t(title)}>
      <div className="worklist-tabs" role="group" aria-label={t('status')}>{tabs.map(([key, label]) => <button key={key} aria-pressed={filter === key} className={filter === key ? 'active' : ''} onClick={() => setFilter(key)}>{t(label)}<span>{formatNumber(base.filter((item) => matches(item, key)).length, i18n.language)}</span></button>)}</div>
      <div className="worklist-toolbar"><div className="search-field"><Search size={17} aria-hidden="true" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('searchPlaceholder')} aria-label={t('searchCases')} />{search && <button className="search-clear" onClick={() => setSearch('')} aria-label={t('clearFilters')}><X size={14} /></button>}</div>{mode !== 'finalized' && <div className="status-filter"><SlidersHorizontal size={15} aria-hidden="true" /><select aria-label={t('status')} value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">{t('allStatuses')}</option>{mode === 'all' && <option value="progress">{t('inProgress')}</option>}{STATUSES.filter((status) => mode === 'review' ? ['in_review', 'approved'].includes(status) : true).map((status) => <option key={status} value={status}>{t(`statuses.${status}`)}</option>)}</select></div>}</div>
      {caseStore.loading ? <WorkspaceState loading /> : caseStore.error ? <WorkspaceState title={t('loadError')} description={t(`errors.${caseStore.error}`)} action={t('retry')} onAction={caseStore.load} /> : cases.length ? <CaseTable key={mode} cases={cases} /> : <WorkspaceState title={t(!base.length && mode === 'review' ? 'noQueue' : !base.length && mode === 'finalized' ? 'noReports' : 'noCases')} description={t(!base.length && mode === 'review' ? 'noQueueDescription' : !base.length && mode === 'finalized' ? 'noReportsDescription' : 'noCasesDescription')} action={t('clearFilters')} onAction={base.length ? () => { setSearch(''); setFilter('all'); } : undefined} />}
    </section>
    {mode === 'all' && <section className="workflow-overview"><div className="workflow-overview-heading"><h2>{t('workflowTitle')}</h2><p>{t('workflowDescription')}</p></div><div className="workflow-overview-steps">{[[ClipboardList, 'intake', 'intakeHint'], [Images, 'upload', 'slidesHint'], [FilePenLine, 'report', 'reportHint'], [ClipboardCheck, 'review', 'reviewHint']].map(([Icon, key, hint], index) => <div className="overview-step" key={key}><span className="overview-icon"><Icon size={20} /></span><div><h3>{t(key)}</h3><p>{t(hint)}</p></div>{index < 3 && <ArrowRight className="overview-arrow" size={15} aria-hidden="true" />}</div>)}</div></section>}
  </div>;
}
export default observer(CaseListPage);
