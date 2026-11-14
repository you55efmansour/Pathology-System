import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import caseService from '@/features/cases/services/caseService';
import { imageRepository } from '@/services/imageRepository';

const PX_PER_MM = 96 / 25.4;
const CONTENT_WIDTH = Math.floor(182 * PX_PER_MM);
const CONTENT_HEIGHT = Math.floor(265 * PX_PER_MM);

// Avoid cutting text lines, metadata, headings or slide figures at a page edge.
function pageRanges(element) {
  const top = element.getBoundingClientRect().top;
  const intervals = [];
  const add = (rect) => {
    if (rect.height) intervals.push([Math.floor(rect.top - top), Math.ceil(rect.bottom - top)]);
  };
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  while (walker.nextNode()) {
    if (!walker.currentNode.textContent.trim()) continue;
    range.selectNodeContents(walker.currentNode);
    Array.from(range.getClientRects()).forEach(add);
  }
  element.querySelectorAll('.document-demo, .document-header, .document-status-row, .document-metadata, figure, .document-footer').forEach((node) => add(node.getBoundingClientRect()));
  element.querySelectorAll('h3').forEach((node) => {
    const rect = node.getBoundingClientRect();
    intervals.push([Math.floor(rect.top - top), Math.ceil(rect.bottom - top + 32)]);
  });
  const height = Math.ceil(element.getBoundingClientRect().height);
  const pages = [];
  for (let start = 0; start < height;) {
    let end = Math.min(start + CONTENT_HEIGHT, height);
    if (end < height) {
      let previous;
      do {
        previous = end;
        for (const [from, to] of intervals) {
          if (from < end && to > end && from > start) end = Math.min(end, from);
        }
      } while (end !== previous);
    }
    pages.push({ start, height: end - start });
    start = end;
  }
  return pages;
}

export async function createReportPdf({ item, source, title, signal }) {
  await caseService.canExport(item.id);
  signal.throwIfAborted();
  const images = await Promise.all(item.images.filter((image) => image.selected).map(async (image) => ({ ...image, url: await imageRepository.url(image.id) })));
  await document.fonts.ready;
  signal.throwIfAborted();

  // Use a desktop print layout independently of the user's viewport or zoom.
  const host = document.createElement('div');
  host.className = 'pdf-capture-source';
  host.setAttribute('aria-hidden', 'true');
  host.inert = true;
  const documentElement = source.querySelector('.report-document').cloneNode(true);
  host.append(documentElement);
  document.body.append(host);
  try {
    const figures = documentElement.querySelectorAll('.document-image-grid figure');
    await Promise.all(images.map(async (image, index) => {
      const img = new Image();
      img.src = image.url;
      img.alt = image.name;
      figures[index].firstElementChild.replaceWith(img);
      await img.decode();
    }));
    signal.throwIfAborted();
    const pdf = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
    pdf.setProperties({ title, subject: 'Demonstration pathology report', creator: 'Histora' });
    const pages = pageRanges(documentElement);
    for (let index = 0; index < pages.length; index++) {
      signal.throwIfAborted();
      const { start, height } = pages[index];
      // Capture one page at a time to bound canvas memory for long reports.
      const canvas = await html2canvas(documentElement, {
        width: CONTENT_WIDTH, height, y: start, scale: 2,
        windowWidth: 1440, windowHeight: 1000, scrollX: 0, scrollY: 0,
        backgroundColor: '#ffffff', logging: false,
      });
      signal.throwIfAborted();
      if (index) pdf.addPage();
      pdf.addImage(canvas, 'PNG', 14, 16, 182, height * 182 / CONTENT_WIDTH, undefined, 'FAST');
      canvas.width = canvas.height = 0;
    }
    await caseService.canExport(item.id);
    signal.throwIfAborted();
    return pdf.output('arraybuffer');
  } finally {
    host.remove();
  }
}
