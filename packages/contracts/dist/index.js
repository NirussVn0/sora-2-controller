// src/index.ts
import { z } from "zod";
var segmentStatusSchema = z.enum([
  "pending",
  "queued",
  "generating",
  "completed",
  "failed"
]);
var videoJobStatusSchema = z.enum([
  "draft",
  "queued",
  "in_progress",
  "completed",
  "failed",
  "cancelled"
]);
var createVideoJobSchema = z.object({
  prompt: z.string().min(10, "Prompt must provide enough context"),
  durationSeconds: z.number().min(10).max(600),
  segmentationMode: z.enum(["auto", "manual"]).default("auto"),
  manualSegments: z.array(
    z.object({
      order: z.number().int().min(0),
      prompt: z.string().min(3),
      referenceImageId: z.string().uuid().optional()
    })
  ).optional(),
  metadata: z.record(z.string(), z.any()).optional()
});
var frameDurationSeconds = 10;
var segmentPromptSchema = z.object({
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
var videoJobSchema = z.object({
  id: z.string().uuid(),
  prompt: z.string(),
  durationSeconds: z.number(),
  frameCount: z.number().int(),
  status: videoJobStatusSchema,
  segmentationMode: z.enum(["auto", "manual"]),
  segments: z.array(segmentPromptSchema),
  finalVideoUrl: z.string().url().nullable(),
  createdAt: z.string(),
  updatedAt: z.string()
});
var updateSegmentPromptSchema = z.object({
  prompt: z.string().min(3),
  referenceImageId: z.string().uuid().optional().nullable()
});
var uploadReferenceImageResponseSchema = z.object({
  id: z.string().uuid(),
  url: z.string().url(),
  frameOrder: z.number().int().nonnegative(),
  createdAt: z.string()
});
var progressEventSchema = z.object({
  jobId: z.string().uuid(),
  segmentId: z.string().uuid(),
  status: segmentStatusSchema,
  progress: z.number().min(0).max(1),
  previewUrl: z.string().url().nullable(),
  failureReason: z.string().nullable()
});
var assemblyEventSchema = z.object({
  jobId: z.string().uuid(),
  status: videoJobStatusSchema,
  finalVideoUrl: z.string().url().nullable()
});
var retryJobSchema = z.object({
  reason: z.string().optional()
});
export {
  assemblyEventSchema,
  createVideoJobSchema,
  frameDurationSeconds,
  progressEventSchema,
  retryJobSchema,
  segmentPromptSchema,
  segmentStatusSchema,
  updateSegmentPromptSchema,
  uploadReferenceImageResponseSchema,
  videoJobSchema,
  videoJobStatusSchema
};
