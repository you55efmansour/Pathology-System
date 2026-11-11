import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useImageUrl } from '../hooks/useImageUrl';

export function SlideImage({ image, className = '' }) {
  const { t } = useTranslation();
  const { url, error } = useImageUrl(image.id);
  const [failed, setFailed] = useState(false);
  if (error || failed) return <div className={`image-fallback ${className}`}><ImageOff size={22} /><span>{t('imageUnavailable')}</span><small>{t('imageUnavailableHint')}</small></div>;
  if (!url) return <div className={`image-placeholder ${className}`} aria-label={t('loading')} />;
  return <img className={className} src={url} alt={image.name} onError={() => setFailed(true)} />;
}
