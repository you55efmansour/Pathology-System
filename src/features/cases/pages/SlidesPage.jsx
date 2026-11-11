import { useRef, useState } from 'react';
import { Link, Navigate, useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UploadCloud, ArrowRight, ArrowLeft, Trash2, Expand, Images, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { SlideImage } from '../components/SlideImage';
import { casePath } from '../config/caseConfig';
import { useCaseAction } from '../hooks/useCaseAction';
import { formatSize } from '@/lib/format';

export default function SlidesPage() {
  const { item, busy } = useOutletContext();
  if (['in_review', 'approved', 'finalized'].includes(item.status)) return <Navigate to={casePath(item)} replace />;
  if (!item.intakeComplete) return <Navigate to={`/cases/${item.id}/intake`} replace />;
  return <SlideManager item={item} busy={busy} />;
}
function SlideManager({ item, busy }) {
  const { t, i18n } = useTranslation();
  const input = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [remove, setRemove] = useState(null);
  const [preview, setPreview] = useState(null);
  const action = useCaseAction();
  const upload = async (files) => { if (files.length && !busy) await action('addImages', [item.id, Array.from(files)], 'imagesAdded'); if (input.current) input.current.value = ''; };
  return <section className="editor-surface">
    <div className="surface-heading"><h2>{t('upload')}</h2><p>{t('slideDescription')}</p></div>
    <div className={`upload-zone${dragging ? ' dragging' : ''}`} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); upload(event.dataTransfer.files); }}>
      <span className="upload-symbol">{busy ? <LoaderCircle size={28} className="spin" /> : <UploadCloud size={28} />}</span><h3>{t(busy ? 'uploading' : 'dropImages')}</h3><p>{t('imageHelp')}</p><input ref={input} type="file" multiple accept="image/png,image/jpeg,image/webp" className="sr-only" tabIndex={-1} aria-label={t('chooseImages')} onChange={(event) => upload(event.target.files)} disabled={busy} /><Button type="button" variant="outlined" disabled={busy} onClick={() => input.current?.click()}>{t('browseFiles')}</Button>
    </div>
    {item.images.some((image) => !image.persistent) && <p className="notice notice-warning" role="status">{t('sessionImages')}</p>}
    {item.images.length ? <><div className="image-selection-heading"><h3>{t('attached', { count: item.images.filter((image) => image.selected).length, total: item.images.length })}</h3></div><div className="slide-grid">{item.images.map((image) => <div className={`slide-tile${image.selected ? ' selected' : ''}`} key={image.id}><button className="slide-preview" aria-label={t('previewImage', { name: image.name })} onClick={() => setPreview(image)}><SlideImage image={image} /><span className="expand-image"><Expand size={16} /></span></button><div className="slide-info"><span title={image.name} dir="auto">{image.name}</span><small>{formatSize(image.size, i18n.language)}</small></div><div className="slide-tile-actions"><label><input type="checkbox" checked={image.selected} disabled={busy} aria-label={t('includeImage', { name: image.name })} onChange={(event) => action('selectImage', [item.id, image.id, event.target.checked])} />{t(image.selected ? 'selected' : 'notSelected')}</label><button className="icon-button danger-icon" aria-label={`${t('removeImage')} ${image.name}`} disabled={busy} onClick={() => setRemove(image)}><Trash2 size={16} /></button></div></div>)}</div></> : <div className="images-empty"><Images size={21} /><div><h3>{t('noImages')}</h3><p>{t('noImagesHint')}</p></div></div>}
    <div className="form-actions"><Button asChild variant="ghost"><Link to={`/cases/${item.id}/intake`}><ArrowLeft size={16} />{t('backIntake')}</Link></Button><Button asChild><Link to={`/cases/${item.id}/report`}>{t('continueReport')}<ArrowRight size={16} /></Link></Button></div>
    <ConfirmDialog open={!!remove} onOpenChange={(open) => { if (!open) setRemove(null); }} title={t('removeImageTitle')} description={t('removeImageDescription')} action={t('removeImage')} destructive busy={busy} onConfirm={async () => { const result = await action('removeImage', [item.id, remove.id], 'removed'); if (result) setRemove(null); }} />
    <Dialog open={!!preview} onOpenChange={(open) => { if (!open) setPreview(null); }} title={preview?.name || t('upload')} className="image-dialog">{preview && <SlideImage image={preview} className="large-slide-preview" />}</Dialog>
  </section>;
}
