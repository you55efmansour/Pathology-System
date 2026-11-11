import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { HardDrive, Route, FileCheck2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import caseStore from '@/stores/CaseStore';
import { useCaseAction } from '@/features/cases/hooks/useCaseAction';

function WorkspacePage() {
  const { t } = useTranslation();
  const [reset, setReset] = useState(false);
  const action = useCaseAction();
  return <div className="page-enter about-page"><div className="page-heading"><div><h1>{t('workspaceTitle')}</h1><p>{t('workspaceDescription')}</p></div></div><div className="about-content">{[[HardDrive, 'storageTitle', 'storageDescription'], [Route, 'prototypeTitle', 'prototypeDescription'], [FileCheck2, 'specsTitle', 'specsDescription']].map(([Icon, title, description]) => <section className="about-section" key={title}><Icon size={23} /><div><h2>{t(title)}</h2><p>{t(description)}</p></div></section>)}<section className="reset-section"><div><h2>{t('resetTitle')}</h2><p>{t('resetDescription')}</p></div><Button variant="outlined" onClick={() => setReset(true)}><RotateCcw size={16} />{t('reset')}</Button></section></div><ConfirmDialog open={reset} onOpenChange={setReset} title={t('resetConfirm')} description={t('resetDescription')} action={t('reset')} busy={caseStore.busy} destructive onConfirm={async () => { if (await action('resetDemo', [], 'resetDone')) setReset(false); }} /></div>;
}
export default observer(WorkspacePage);
