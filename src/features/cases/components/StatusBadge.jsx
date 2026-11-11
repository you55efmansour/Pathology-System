import { useTranslation } from 'react-i18next';
import { LockKeyhole, Check, Clock3 } from 'lucide-react';

export function StatusBadge({ status }) {
  const { t } = useTranslation();
  const Icon = status === 'finalized' ? LockKeyhole : status === 'approved' ? Check : Clock3;
  return <span className={`status-badge status-${status}`}><Icon size={12} aria-hidden="true" />{t(`statuses.${status}`)}</span>;
}
