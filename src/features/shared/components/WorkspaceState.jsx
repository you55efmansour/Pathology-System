import { useTranslation } from 'react-i18next';
import { Inbox, AlertCircle, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WorkspaceState({ loading, title, description, action, onAction }) {
  const { t } = useTranslation();
  const Icon = loading ? LoaderCircle : onAction ? AlertCircle : Inbox;
  return <div className="workspace-state" role={loading ? 'status' : undefined}><span className="state-symbol"><Icon size={26} className={loading ? 'spin' : ''} /></span><h2>{loading ? t('loading') : title}</h2>{description && <p>{description}</p>}{onAction && <Button variant="outlined" onClick={onAction}>{action}</Button>}</div>;
}
