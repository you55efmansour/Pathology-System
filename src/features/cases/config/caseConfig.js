import { z } from 'zod';

export const STATUSES = ['intake', 'preparation', 'draft', 'in_review', 'approved', 'finalized'];
export const WORKFLOW = ['intake', 'slides', 'report', 'review'];
export const MAX_IMAGES = 12;
export const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const intakeSchema = z.object({
  patientName: z.string().trim().min(1, 'required').max(120, 'tooLong'),
  patientId: z.string().trim().min(1, 'required').max(60, 'tooLong'),
  specimenType: z.string().trim().min(1, 'required').max(120, 'tooLong'),
  specimenId: z.string().trim().max(80, 'tooLong'),
});
export const reportSchema = z.object({ type: z.enum(['normal', 'custom']), text: z.string().trim().min(1, 'reportRequired').max(40000, 'reportTooLong') });
const imageSchema = z.object({ id: z.string(), name: z.string(), size: z.number(), mime: z.string(), selected: z.boolean(), persistent: z.boolean() });
export const recordSchema = z.object({
  id: z.string(), accession: z.string(), status: z.enum(STATUSES),
  patientName: z.string(), patientId: z.string(), specimenType: z.string(), specimenId: z.string(),
  intakeComplete: z.boolean(), createdAt: z.string(), updatedAt: z.string(),
  images: z.array(imageSchema), report: z.object({ type: z.union([z.literal(''), z.literal('normal'), z.literal('custom')]), text: z.string() }),
  approvedAt: z.string().nullable(), finalizedAt: z.string().nullable(),
  activity: z.array(z.object({ event: z.string(), at: z.string() })),
});
export function casePath(item) {
  const step = { intake: 'intake', preparation: 'slides', draft: 'report', in_review: 'review', approved: 'review', finalized: 'final' }[item.status];
  return `/cases/${item.id}/${step}`;
}
