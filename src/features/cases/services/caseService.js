import { STATUSES, intakeSchema, reportSchema, recordSchema, MAX_IMAGES, MAX_IMAGE_SIZE, IMAGE_TYPES } from '../config/caseConfig';
import { createDemoCases } from '../data/demoCases';
import { imageRepository } from '@/services/imageRepository';
import i18n from '@/features/shared/i18n';

export const STORAGE_KEY = 'histora:cases:v1';
export class CaseError extends Error {
  constructor(code) { super(code); this.name = 'CaseError'; }
}

export function createCaseService({ storage, images = imageRepository, clock = () => new Date(), language = () => i18n.resolvedLanguage || 'en' } = {}) {
  const getStorage = () => storage || globalThis.localStorage;
  const write = (records) => {
    try { getStorage().setItem(STORAGE_KEY, JSON.stringify({ version: 1, records })); }
    catch { throw new CaseError('storageWrite'); }
  };
  const read = () => {
    let saved;
    try { saved = getStorage().getItem(STORAGE_KEY); } catch { throw new CaseError('storageRead'); }
    if (saved === null) { const seed = createDemoCases(clock(), language()); write(seed); return seed; }
    try {
      const data = JSON.parse(saved);
      if (data.version !== 1 || !Array.isArray(data.records)) throw new Error();
      return data.records.map((record) => recordSchema.parse(record));
    } catch { throw new CaseError('storageCorrupt'); }
  };
  const find = (records, id) => {
    const item = records.find((record) => record.id === id);
    if (!item) throw new CaseError('caseMissing');
    return item;
  };
  const editable = (item) => {
    if (item.status === 'finalized') throw new CaseError('finalizedLocked');
    if (['in_review', 'approved'].includes(item.status)) throw new CaseError('returnFirst');
  };
  const change = (id, event, action) => {
    const records = read();
    const item = find(records, id);
    action(item);
    item.updatedAt = clock().toISOString();
    item.activity.push({ event, at: item.updatedAt });
    write(records);
    return item;
  };
  return {
    async list() { return read().sort((a, b) => b.createdAt.localeCompare(a.createdAt)); },
    async saveIntake(id, fields, complete = false) {
      if (complete && !intakeSchema.safeParse(fields).success) throw new CaseError('intakeRequired');
      const clean = Object.fromEntries(['patientName', 'patientId', 'specimenType', 'specimenId'].map((key) => [key, String(fields[key] || '').trim().slice(0, key === 'patientName' || key === 'specimenType' ? 120 : key === 'patientId' ? 60 : 80)]));
      if (id) return change(id, 'intakeSaved', (item) => {
        editable(item);
        Object.assign(item, clean);
        item.intakeComplete = intakeSchema.safeParse(clean).success;
        if (complete && item.status === 'intake') item.status = 'preparation';
      });
      const records = read();
      const next = Math.max(0, ...records.map((item) => Number(item.accession.split('-').at(-1)))) + 1;
      const at = clock().toISOString();
      const item = { ...clean, id: crypto.randomUUID(), accession: `PA-${clock().getFullYear()}-${String(next).padStart(5, '0')}`, createdAt: at, updatedAt: at, intakeComplete: complete, status: complete ? 'preparation' : 'intake', images: [], report: { type: '', text: '' }, approvedAt: null, finalizedAt: null, activity: [{ event: 'created', at }] };
      write([item, ...records]);
      return item;
    },
    async addImages(id, files) {
      const item = find(read(), id);
      editable(item);
      if (item.images.length + files.length > MAX_IMAGES) throw new CaseError('imageLimit');
      for (const file of files) {
        if (!IMAGE_TYPES.includes(file.type)) throw new CaseError('imageType');
        if (!file.size || file.size > MAX_IMAGE_SIZE) throw new CaseError('imageSize');
        try { const bitmap = await createImageBitmap(file); bitmap.close(); }
        catch { throw new CaseError('imageInvalid'); }
      }
      const added = [];
      try {
        for (const file of files) {
          const imageId = crypto.randomUUID();
          const persistent = await images.put(imageId, file);
          added.push({ id: imageId, name: file.name, size: file.size, mime: file.type, selected: true, persistent });
        }
        return change(id, 'imagesAdded', (record) => {
          editable(record);
          if (record.images.length + added.length > MAX_IMAGES) throw new CaseError('imageLimit');
          record.images.push(...added);
        });
      } catch (error) { await Promise.allSettled(added.map((image) => images.remove(image.id))); throw error; }
    },
    async removeImage(id, imageId) {
      const result = change(id, 'imageRemoved', (item) => { editable(item); item.images = item.images.filter((image) => image.id !== imageId); });
      await images.remove(imageId);
      return result;
    },
    async selectImage(id, imageId, selected) {
      return change(id, 'attachmentsSaved', (item) => { editable(item); const image = item.images.find((value) => value.id === imageId); if (!image) throw new CaseError('imageMissing'); image.selected = selected; });
    },
    async saveReport(id, report, review = false) {
      const valid = reportSchema.safeParse(report);
      if (review && !valid.success) throw new CaseError('reportRequired');
      if (!['normal', 'custom'].includes(report.type)) throw new CaseError('typeRequired');
      if (report.text.length > 40000) throw new CaseError('reportTooLong');
      return change(id, review ? 'submitted' : 'reportSaved', (item) => {
        editable(item);
        if (!item.intakeComplete || !intakeSchema.safeParse(item).success) throw new CaseError('intakeRequired');
        item.report = { type: report.type, text: report.text };
        item.status = review ? 'in_review' : 'draft';
        item.approvedAt = null;
      });
    },
    async returnToDraft(id) {
      return change(id, 'returned', (item) => {
        if (!['in_review', 'approved'].includes(item.status)) throw new CaseError('invalidTransition');
        item.status = 'draft'; item.approvedAt = null;
      });
    },
    async approve(id) {
      return change(id, 'approved', (item) => {
        if (item.status !== 'in_review') throw new CaseError('invalidTransition');
        item.status = 'approved'; item.approvedAt = clock().toISOString();
      });
    },
    async finalize(id) {
      const snapshot = find(read(), id);
      for (const image of snapshot.images.filter((image) => image.selected)) {
        try { if (!await images.get(image.id)) throw new Error(); } catch { throw new CaseError('imageMissing'); }
      }
      return change(id, 'finalized', (item) => {
        if (item.status !== 'approved') throw new CaseError('invalidTransition');
        item.status = 'finalized'; item.finalizedAt = clock().toISOString();
      });
    },
    async canExport(id) {
      const item = find(read(), id);
      if (item.status !== 'finalized') throw new CaseError('exportLocked');
      for (const image of item.images.filter((image) => image.selected)) {
        try { if (!await images.get(image.id)) throw new Error(); } catch { throw new CaseError('imageMissing'); }
      }
      return true;
    },
    async resetDemo() {
      let existing = [];
      try { existing = read(); } catch { /* Explicit reset is also the recovery path for a corrupt store. */ }
      const seed = createDemoCases(clock(), language());
      write(seed);
      await Promise.allSettled(existing.flatMap((item) => item.images.map((image) => images.remove(image.id))));
      return seed;
    },
    statuses: STATUSES,
  };
}

export default createCaseService();
