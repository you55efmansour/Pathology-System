import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useTranslation } from 'react-i18next';
import routes from './routes';

export default function App() {
  const { t, i18n } = useTranslation();
  const rtl = i18n.dir() === 'rtl';
  return <><RouterProvider router={routes} /><Toaster dir={i18n.dir()} position={rtl ? 'bottom-left' : 'bottom-right'} containerAriaLabel={t('notifications')} richColors closeButton toastOptions={{ closeButtonAriaLabel: t('close') }} /></>;
}
