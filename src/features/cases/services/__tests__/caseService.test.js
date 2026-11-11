import { randomUUID } from 'node:crypto';
import { createCaseService, STORAGE_KEY } from '../caseService';
import { populateNormalTemplate } from '@/features/reports/config/reportTemplates';

const intake = { patientName: 'Workflow Test Patient', patientId: 'DEMO-TEST', specimenType: 'Demonstration specimen', specimenId: 'TEST-SP' };
let service, storage, blobs;
beforeEach(() => {
  const values = new Map();
  storage = { getItem: (key) => values.has(key) ? values.get(key) : null, setItem: (key, value) => values.set(key, value) };
  blobs = new Map();
  const images = { put: async (id, file) => { blobs.set(id, file); return true; }, get: async (id) => blobs.get(id), remove: async (id) => blobs.delete(id) };
  service = createCaseService({ storage, images, clock: () => new Date('2026-11-11T09:00:00Z') });
  Object.defineProperty(crypto, 'randomUUID', { configurable: true, value: randomUUID });
  global.createImageBitmap = jest.fn(async () => ({ close() {} }));
});

test.each(['normal', 'custom'])('%s supports intake, draft persistence, returned edits, approval, locking, and export', async (type) => {
  const item = await service.saveIntake(null, intake, true);
  const image = new File(['demo bytes'], 'test.png', { type: 'image/png' });
  const withImage = await service.addImages(item.id, [image]);
  const initialText = type === 'normal' ? populateNormalTemplate(item) : 'Custom demonstration report.';
  await service.saveReport(item.id, { type, text: initialText });
  const restored = await createCaseService({ storage }).list();
  expect(restored.find((record) => record.id === item.id).report.text).toBe(initialText);
  await expect(service.canExport(item.id)).rejects.toThrow('exportLocked');
  await service.saveReport(item.id, { type, text: initialText }, true);
  await expect(service.saveIntake(item.id, intake, true)).rejects.toThrow('returnFirst');
  const returned = await service.returnToDraft(item.id);
  expect(returned.report.text).toBe(initialText);
  expect(returned.images).toEqual(withImage.images);
  const revised = `${initialText}\nRevised workflow demonstration.`;
  await service.saveReport(item.id, { type, text: revised }, true);
  const approved = await service.approve(item.id);
  expect(approved.approvedAt).toBeTruthy();
  const final = await service.finalize(item.id);
  expect(final.status).toBe('finalized');
  expect(await service.canExport(item.id)).toBe(true);
  await expect(service.saveReport(item.id, { type, text: 'Changed' })).rejects.toThrow('finalizedLocked');
  await expect(service.saveIntake(item.id, intake)).rejects.toThrow('finalizedLocked');
  await expect(service.removeImage(item.id, final.images[0].id)).rejects.toThrow('finalizedLocked');
  await expect(service.selectImage(item.id, final.images[0].id, false)).rejects.toThrow('finalizedLocked');
  await expect(service.returnToDraft(item.id)).rejects.toThrow('invalidTransition');
  expect((await service.list()).find((record) => record.id === item.id).report.text).toBe(revised);
});
test('incomplete intake and report drafts save, but cannot advance without required fields', async () => {
  const draft = await service.saveIntake(null, { patientName: '', patientId: '', specimenType: '', specimenId: '' });
  expect(draft.status).toBe('intake');
  await expect(service.saveIntake(draft.id, {}, true)).rejects.toThrow('intakeRequired');
  await service.saveIntake(draft.id, intake, true);
  await service.saveReport(draft.id, { type: 'custom', text: '' });
  await expect(service.saveReport(draft.id, { type: 'custom', text: ' ' }, true)).rejects.toThrow('reportRequired');
  await expect(service.approve(draft.id)).rejects.toThrow('invalidTransition');
  await expect(service.finalize(draft.id)).rejects.toThrow('invalidTransition');
});
test('missing selected images block finalization; selection and removal survive reload', async () => {
  const item = await service.saveIntake(null, intake, true);
  const result = await service.addImages(item.id, [new File(['x'], 'demo.png', { type: 'image/png' })]);
  const imageId = result.images[0].id;
  await service.saveReport(item.id, { type: 'custom', text: 'Demonstration report' }, true);
  await service.approve(item.id);
  blobs.clear();
  await expect(service.finalize(item.id)).rejects.toThrow('imageMissing');
  await service.returnToDraft(item.id);
  await service.selectImage(item.id, imageId, false);
  expect((await service.list()).find((record) => record.id === item.id).images[0].selected).toBe(false);
  await service.removeImage(item.id, imageId);
  expect((await service.list()).find((record) => record.id === item.id).images).toHaveLength(0);
});
test('invalid image formats, oversized uploads and unreadable files are rejected without state changes', async () => {
  const item = await service.saveIntake(null, intake, true);
  await expect(service.addImages(item.id, [new File(['x'], 'note.txt', { type: 'text/plain' })])).rejects.toThrow('imageType');
  await expect(service.addImages(item.id, [new File([], 'empty.png', { type: 'image/png' })])).rejects.toThrow('imageSize');
  createImageBitmap.mockRejectedValueOnce(new Error('bad image'));
  await expect(service.addImages(item.id, [new File(['x'], 'bad.png', { type: 'image/png' })])).rejects.toThrow('imageInvalid');
  expect((await service.list()).find((record) => record.id === item.id).images).toHaveLength(0);
});
test('corrupt data is not overwritten silently and explicit reset recovers it', async () => {
  storage.setItem(STORAGE_KEY, '{broken');
  await expect(service.list()).rejects.toThrow('storageCorrupt');
  expect(storage.getItem(STORAGE_KEY)).toBe('{broken');
  expect(await service.resetDemo()).toHaveLength(8);
  expect(await service.list()).toHaveLength(8);
});
test('storage quota failures are reported without claiming a successful save', async () => {
  await service.list();
  const previous = storage.getItem(STORAGE_KEY);
  storage.setItem = () => { throw new Error('quota'); };
  await expect(service.saveIntake(null, intake, true)).rejects.toThrow('storageWrite');
  expect(storage.getItem(STORAGE_KEY)).toBe(previous);
});
test('normal template substitutes case values without inventing clinical findings', async () => {
  const item = await service.saveIntake(null, intake, true);
  const template = populateNormalTemplate(item);
  expect(template).toContain(intake.patientName);
  expect(template).toContain(intake.specimenType);
  expect(template).not.toContain('{{');
  expect(template).toContain('does not perform a diagnosis');
});
