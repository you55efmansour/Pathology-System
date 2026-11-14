import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Download, FileWarning, LoaderCircle, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import workerUrl from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { formatNumber } from '@/lib/format';
import caseService from '@/features/cases/services/caseService';
import { createReportPdf } from '../services/reportPdf';

GlobalWorkerOptions.workerSrc = workerUrl;

export default function FinalReportViewer({ item, sourceRef }) {
  const { t, i18n } = useTranslation();
  const [attempt, setAttempt] = useState(0);
  const [documentState, setDocumentState] = useState(null);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [width, setWidth] = useState(0);
  const [rendered, setRendered] = useState('');
  const [renderError, setRenderError] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const viewportRef = useRef(null);
  const canvasRef = useRef(null);
  const language = i18n.resolvedLanguage;
  const title = `${t('appName')}-${item.accession}-${t('demoShort')}`;

  useEffect(() => {
    const controller = new AbortController();
    let loadingTask;
    let url;
    async function load() {
      try {
        const data = await createReportPdf({ item, source: sourceRef.current, title, signal: controller.signal });
        controller.signal.throwIfAborted();
        url = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
        loadingTask = getDocument({ data });
        const pdf = await loadingTask.promise;
        if (!controller.signal.aborted) setDocumentState({ pdf, url });
      } catch (cause) {
        if (!controller.signal.aborted) setError(cause.message);
      }
    }
    load();
    return () => {
      controller.abort();
      loadingTask?.destroy();
      if (url) URL.revokeObjectURL(url);
    };
  }, [item, language, title, sourceRef, attempt]);

  useEffect(() => {
    const element = viewportRef.current;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(1, entry.contentRect.width - 32)));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const renderKey = `${page}-${zoom}-${width}`;
  useEffect(() => {
    if (!documentState || !width) return;
    let cancelled = false;
    let renderTask;
    async function render() {
      try {
        const pdfPage = await documentState.pdf.getPage(page);
        if (cancelled) return;
        const natural = pdfPage.getViewport({ scale: 1 });
        const viewport = pdfPage.getViewport({ scale: Math.min(width / natural.width, 1.5) * zoom });
        // Render offscreen so quick page/zoom changes never reuse an active canvas.
        const buffer = document.createElement('canvas');
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        buffer.width = Math.ceil(viewport.width * ratio);
        buffer.height = Math.ceil(viewport.height * ratio);
        renderTask = pdfPage.render({ canvasContext: buffer.getContext('2d'), viewport, transform: [ratio, 0, 0, ratio, 0, 0] });
        await renderTask.promise;
        if (cancelled) return;
        const canvas = canvasRef.current;
        canvas.width = buffer.width;
        canvas.height = buffer.height;
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;
        canvas.getContext('2d').drawImage(buffer, 0, 0);
        setRendered(renderKey);
      } catch (cause) {
        if (!cancelled && cause.name !== 'RenderingCancelledException') setRenderError(true);
      }
    }
    render();
    return () => { cancelled = true; renderTask?.cancel(); };
  }, [documentState, page, zoom, width, renderKey]);

  const retry = () => {
    setError(''); setRenderError(false); setDocumentState(null); setRendered(''); setPage(1); setZoom(1);
    setAttempt((value) => value + 1);
  };
  const download = async () => {
    setDownloading(true);
    try {
      await caseService.canExport(item.id);
      const anchor = document.createElement('a');
      anchor.href = documentState.url;
      anchor.download = `${title}.pdf`;
      anchor.click();
    } catch (cause) {
      toast.error(t(`errors.${cause.message}`, { defaultValue: t('pdfError') }));
    } finally { setDownloading(false); }
  };
  const failed = !!error || renderError;
  const ready = !!documentState && !failed;
  const pending = !ready || rendered !== renderKey;
  const pageLabel = t('page', { current: formatNumber(page, language), total: formatNumber(documentState?.pdf.numPages || 1, language) });

  return <section className="pdf-viewer" aria-label={t('pdfPreview')}>
    <div className="pdf-toolbar">
      <div className="pdf-controls" aria-label={t('pdfPages')} role="group">
        <Button size="icon" variant="ghost" aria-label={t('previous')} title={t('previous')} disabled={!ready || page === 1} onClick={() => setPage((value) => value - 1)}><ChevronLeft /></Button>
        <span className="pdf-page-count" aria-live="polite">{ready ? pageLabel : t('pdfPreview')}</span>
        <Button size="icon" variant="ghost" aria-label={t('next')} title={t('next')} disabled={!ready || page === documentState.pdf.numPages} onClick={() => setPage((value) => value + 1)}><ChevronRight /></Button>
      </div>
      <div className="pdf-controls" aria-label={t('pdfZoom')} role="group">
        <Button size="icon" variant="ghost" aria-label={t('zoomOut')} title={t('zoomOut')} disabled={!ready || zoom <= 0.5} onClick={() => setZoom((value) => Math.max(0.5, value - 0.25))}><ZoomOut /></Button>
        <span className="pdf-zoom-value">{new Intl.NumberFormat(language, { style: 'percent' }).format(zoom)}</span>
        <Button size="icon" variant="ghost" aria-label={t('zoomIn')} title={t('zoomIn')} disabled={!ready || zoom >= 2} onClick={() => setZoom((value) => Math.min(2, value + 0.25))}><ZoomIn /></Button>
        <Button size="sm" variant="ghost" disabled={!ready} onClick={() => setZoom(1)}><Maximize2 />{t('fitWidth')}</Button>
      </div>
      <Button size="sm" variant="outlined" className="pdf-download" disabled={!ready || downloading} onClick={download}><Download />{t('downloadPdf')}</Button>
    </div>
    <div className="pdf-viewport" ref={viewportRef} tabIndex={0} role="region" aria-label={t('pdfPageRegion')} aria-busy={!failed && pending}>
      {failed ? <div className="pdf-message" role="alert"><FileWarning size={28} /><strong>{t('pdfError')}</strong><p>{t(`errors.${error}`, { defaultValue: t('pdfErrorHint') })}</p><Button variant="outlined" size="sm" onClick={retry}>{t('retryPdf')}</Button></div> : <>
        {!rendered && <div className="pdf-message" role="status"><LoaderCircle size={24} className="pdf-spinner" /><p>{t('preparingPdf')}</p></div>}
        <canvas ref={canvasRef} className="pdf-page" hidden={!rendered} role="img" aria-label={`${t('pdfPreview')} — ${pageLabel}`} />
      </>}
    </div>
  </section>;
}
