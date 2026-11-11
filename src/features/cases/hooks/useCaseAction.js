import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import caseStore from '@/stores/CaseStore';

export function useCaseAction() {
  const { t } = useTranslation();
  return async (method, args = [], success) => {
    try { const result = await caseStore.execute(method, ...args); if (success) toast.success(t(success)); return result; }
    catch (error) { toast.error(t(`errors.${error.message}`, { defaultValue: t('errors.unexpected') })); return null; }
  };
}
