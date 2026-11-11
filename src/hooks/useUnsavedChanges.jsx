import { useEffect, useRef } from 'react';
import { useBlocker } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

export function useUnsavedChanges(dirty) {
  const { t } = useTranslation();
  const allowed = useRef(false);
  const blocker = useBlocker(({ currentLocation, nextLocation }) => dirty && !allowed.current && currentLocation.pathname !== nextLocation.pathname);
  useEffect(() => {
    const prevent = (event) => { if (dirty && !allowed.current) { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('beforeunload', prevent);
    return () => window.removeEventListener('beforeunload', prevent);
  }, [dirty]);
  return { allowNavigation: () => { allowed.current = true; }, guard: <ConfirmDialog open={blocker.state === 'blocked'} onOpenChange={(open) => { if (!open && blocker.state === 'blocked') blocker.reset(); }} title={t('unsavedTitle')} description={t('unsavedDescription')} action={t('leave')} cancel={t('stay')} onConfirm={() => blocker.proceed()} destructive /> };
}
