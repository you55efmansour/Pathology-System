import * as Alert from '@radix-ui/react-alert-dialog';
import { useTranslation } from 'react-i18next';
import { Button } from './button';

export function ConfirmDialog({ open, onOpenChange, title, description, action, onConfirm, busy = false, destructive = false, cancel }) {
  const { t, i18n } = useTranslation();
  return <Alert.Root open={open} onOpenChange={busy ? undefined : onOpenChange}>
    <Alert.Portal><Alert.Overlay className="dialog-overlay" />
      <Alert.Content className="dialog-content" dir={i18n.dir()}>
        <Alert.Title className="dialog-title">{title}</Alert.Title>
        <Alert.Description className="dialog-description">{description}</Alert.Description>
        <div className="dialog-actions">
          <Alert.Cancel asChild><Button variant="outlined" disabled={busy}>{cancel || t('cancel')}</Button></Alert.Cancel>
          <Button variant={destructive ? 'destructive' : 'default'} disabled={busy} onClick={onConfirm}>{busy ? t('saving') : action}</Button>
        </div>
      </Alert.Content>
    </Alert.Portal>
  </Alert.Root>;
}
