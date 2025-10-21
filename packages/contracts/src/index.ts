import { z } from 'zod';

export const segmentStatusSchema = z.enum([
  'pending',
  'queued',
  'generating',
  'completed',
  'failed'
]);

export type SegmentStatus = z.infer<typeof segmentStatusSchema>;

export const videoJobStatusSchema = z.enum([
  'draft',
  'queued',
  'in_progress',
  'completed',
  'failed',
  'cancelled'
]);

export type VideoJobStatus = z.infer<typeof videoJobStatusSchema>;

export const createVideoJobSchema = z.object({
  prompt: z.string().min(10, 'Prompt must provide enough context'),
  durationSeconds: z.number().min(10).max(600),
  segmentationMode: z.enum(['auto', 'manual']).default('auto'),
  manualSegments: z
    .array(
      z.object({
        order: z.number().int().min(0),
        prompt: z.string().min(3),
        referenceImageId: z.string().uuid().optional()
      })
    )
    .optional(),
  metadata: z.record(z.string(), z.any()).optional()
});

export type CreateVideoJobRequest = z.infer<typeof createVideoJobSchema>;

export const frameDurationSeconds = 10;

export const segmentPromptSchema = z.object({
  id: z.string().uuid(),
  order: z.number().int().nonnegative(),
  prompt: z.string(),
  status: segmentStatusSchema,
  previewUrl: z.string().url().nullable(),
  assetUrl: z.string().url().nullable(),
  referenceImageId: z.string().uuid().nullable(),
  referenceImageUrl: z.string().url().nullable(),
  soraTaskId: z.string().nullable(),
  failureReason: z.string().nullable()
});

export type SegmentPromptDTO = z.infer<typeof segmentPromptSchema>;

export const videoJobSchema = z.object({
  id: z.string().uuid(),
  prompt: z.string(),
  durationSeconds: z.number(),
  frameCount: z.number().int(),
  status: videoJobStatusSchema,
  segmentationMode: z.enum(['auto', 'manual']),
  segments: z.array(segmentPromptSchema),
  finalVideoUrl: z.string().url().nullable(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type VideoJobDTO = z.infer<typeof videoJobSchema>;

export const updateSegmentPromptSchema = z.object({
  prompt: z.string().min(3),
  referenceImageId: z.string().uuid().optional().nullable()
});

export type UpdateSegmentPromptRequest = z.infer<typeof updateSegmentPromptSchema>;

export const uploadReferenceImageResponseSchema = z.object({
  id: z.string().uuid(),
  url: z.string().url(),
  frameOrder: z.number().int().nonnegative(),
  createdAt: z.string()
});

export type ReferenceImageDTO = z.infer<typeof uploadReferenceImageResponseSchema>;

export const progressEventSchema = z.object({
  jobId: z.string().uuid(),
  segmentId: z.string().uuid(),
  status: segmentStatusSchema,
  progress: z.number().min(0).max(1),
  previewUrl: z.string().url().nullable(),
  failureReason: z.string().nullable()
});

export type ProgressEvent = z.infer<typeof progressEventSchema>;

export const assemblyEventSchema = z.object({
  jobId: z.string().uuid(),
  status: videoJobStatusSchema,
  finalVideoUrl: z.string().url().nullable()
});

export type AssemblyEvent = z.infer<typeof assemblyEventSchema>;

export const retryJobSchema = z.object({
  reason: z.string().optional()
});

export type RetryJobRequest = z.infer<typeof retryJobSchema>;
