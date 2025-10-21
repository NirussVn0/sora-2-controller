"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  assemblyEventSchema: () => assemblyEventSchema,
  createVideoJobSchema: () => createVideoJobSchema,
  frameDurationSeconds: () => frameDurationSeconds,
  progressEventSchema: () => progressEventSchema,
  retryJobSchema: () => retryJobSchema,
  segmentPromptSchema: () => segmentPromptSchema,
  segmentStatusSchema: () => segmentStatusSchema,
  updateSegmentPromptSchema: () => updateSegmentPromptSchema,
  uploadReferenceImageResponseSchema: () => uploadReferenceImageResponseSchema,
  videoJobSchema: () => videoJobSchema,
  videoJobStatusSchema: () => videoJobStatusSchema
});
module.exports = __toCommonJS(index_exports);
var import_zod = require("zod");
var segmentStatusSchema = import_zod.z.enum([
  "pending",
  "queued",
  "generating",
  "completed",
  "failed"
]);
var videoJobStatusSchema = import_zod.z.enum([
  "draft",
  "queued",
  "in_progress",
  "completed",
  "failed",
  "cancelled"
]);
var createVideoJobSchema = import_zod.z.object({
  prompt: import_zod.z.string().min(10, "Prompt must provide enough context"),
  durationSeconds: import_zod.z.number().min(10).max(600),
  segmentationMode: import_zod.z.enum(["auto", "manual"]).default("auto"),
  manualSegments: import_zod.z.array(
    import_zod.z.object({
      order: import_zod.z.number().int().min(0),
      prompt: import_zod.z.string().min(3),
      referenceImageId: import_zod.z.string().uuid().optional()
    })
  ).optional(),
  metadata: import_zod.z.record(import_zod.z.string(), import_zod.z.any()).optional()
});
var frameDurationSeconds = 10;
var segmentPromptSchema = import_zod.z.object({
  id: import_zod.z.string().uuid(),
  order: import_zod.z.number().int().nonnegative(),
  prompt: import_zod.z.string(),
  status: segmentStatusSchema,
  previewUrl: import_zod.z.string().url().nullable(),
  assetUrl: import_zod.z.string().url().nullable(),
  referenceImageId: import_zod.z.string().uuid().nullable(),
  referenceImageUrl: import_zod.z.string().url().nullable(),
  soraTaskId: import_zod.z.string().nullable(),
  failureReason: import_zod.z.string().nullable()
});
var videoJobSchema = import_zod.z.object({
  id: import_zod.z.string().uuid(),
  prompt: import_zod.z.string(),
  durationSeconds: import_zod.z.number(),
  frameCount: import_zod.z.number().int(),
  status: videoJobStatusSchema,
  segmentationMode: import_zod.z.enum(["auto", "manual"]),
  segments: import_zod.z.array(segmentPromptSchema),
  finalVideoUrl: import_zod.z.string().url().nullable(),
  createdAt: import_zod.z.string(),
  updatedAt: import_zod.z.string()
});
var updateSegmentPromptSchema = import_zod.z.object({
  prompt: import_zod.z.string().min(3),
  referenceImageId: import_zod.z.string().uuid().optional().nullable()
});
var uploadReferenceImageResponseSchema = import_zod.z.object({
  id: import_zod.z.string().uuid(),
  url: import_zod.z.string().url(),
  frameOrder: import_zod.z.number().int().nonnegative(),
  createdAt: import_zod.z.string()
});
var progressEventSchema = import_zod.z.object({
  jobId: import_zod.z.string().uuid(),
  segmentId: import_zod.z.string().uuid(),
  status: segmentStatusSchema,
  progress: import_zod.z.number().min(0).max(1),
  previewUrl: import_zod.z.string().url().nullable(),
  failureReason: import_zod.z.string().nullable()
});
var assemblyEventSchema = import_zod.z.object({
  jobId: import_zod.z.string().uuid(),
  status: videoJobStatusSchema,
  finalVideoUrl: import_zod.z.string().url().nullable()
});
var retryJobSchema = import_zod.z.object({
  reason: import_zod.z.string().optional()
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
