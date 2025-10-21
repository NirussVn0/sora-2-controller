import { z } from 'zod';

declare const segmentStatusSchema: z.ZodEnum<["pending", "queued", "generating", "completed", "failed"]>;
type SegmentStatus = z.infer<typeof segmentStatusSchema>;
declare const videoJobStatusSchema: z.ZodEnum<["draft", "queued", "in_progress", "completed", "failed", "cancelled"]>;
type VideoJobStatus = z.infer<typeof videoJobStatusSchema>;
declare const createVideoJobSchema: z.ZodObject<{
    prompt: z.ZodString;
    durationSeconds: z.ZodNumber;
    segmentationMode: z.ZodDefault<z.ZodEnum<["auto", "manual"]>>;
    manualSegments: z.ZodOptional<z.ZodArray<z.ZodObject<{
        order: z.ZodNumber;
        prompt: z.ZodString;
        referenceImageId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        prompt: string;
        order: number;
        referenceImageId?: string | undefined;
    }, {
        prompt: string;
        order: number;
        referenceImageId?: string | undefined;
    }>, "many">>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    prompt: string;
    durationSeconds: number;
    segmentationMode: "auto" | "manual";
    manualSegments?: {
        prompt: string;
        order: number;
        referenceImageId?: string | undefined;
    }[] | undefined;
    metadata?: Record<string, any> | undefined;
}, {
    prompt: string;
    durationSeconds: number;
    segmentationMode?: "auto" | "manual" | undefined;
    manualSegments?: {
        prompt: string;
        order: number;
        referenceImageId?: string | undefined;
    }[] | undefined;
    metadata?: Record<string, any> | undefined;
}>;
type CreateVideoJobRequest = z.infer<typeof createVideoJobSchema>;
declare const frameDurationSeconds = 10;
declare const segmentPromptSchema: z.ZodObject<{
    id: z.ZodString;
    order: z.ZodNumber;
    prompt: z.ZodString;
    status: z.ZodEnum<["pending", "queued", "generating", "completed", "failed"]>;
    previewUrl: z.ZodNullable<z.ZodString>;
    assetUrl: z.ZodNullable<z.ZodString>;
    referenceImageId: z.ZodNullable<z.ZodString>;
    referenceImageUrl: z.ZodNullable<z.ZodString>;
    soraTaskId: z.ZodNullable<z.ZodString>;
    failureReason: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "queued" | "generating" | "completed" | "failed";
    prompt: string;
    order: number;
    referenceImageId: string | null;
    id: string;
    previewUrl: string | null;
    assetUrl: string | null;
    referenceImageUrl: string | null;
    soraTaskId: string | null;
    failureReason: string | null;
}, {
    status: "pending" | "queued" | "generating" | "completed" | "failed";
    prompt: string;
    order: number;
    referenceImageId: string | null;
    id: string;
    previewUrl: string | null;
    assetUrl: string | null;
    referenceImageUrl: string | null;
    soraTaskId: string | null;
    failureReason: string | null;
}>;
type SegmentPromptDTO = z.infer<typeof segmentPromptSchema>;
declare const videoJobSchema: z.ZodObject<{
    id: z.ZodString;
    prompt: z.ZodString;
    durationSeconds: z.ZodNumber;
    frameCount: z.ZodNumber;
    status: z.ZodEnum<["draft", "queued", "in_progress", "completed", "failed", "cancelled"]>;
    segmentationMode: z.ZodEnum<["auto", "manual"]>;
    segments: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        order: z.ZodNumber;
        prompt: z.ZodString;
        status: z.ZodEnum<["pending", "queued", "generating", "completed", "failed"]>;
        previewUrl: z.ZodNullable<z.ZodString>;
        assetUrl: z.ZodNullable<z.ZodString>;
        referenceImageId: z.ZodNullable<z.ZodString>;
        referenceImageUrl: z.ZodNullable<z.ZodString>;
        soraTaskId: z.ZodNullable<z.ZodString>;
        failureReason: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: "pending" | "queued" | "generating" | "completed" | "failed";
        prompt: string;
        order: number;
        referenceImageId: string | null;
        id: string;
        previewUrl: string | null;
        assetUrl: string | null;
        referenceImageUrl: string | null;
        soraTaskId: string | null;
        failureReason: string | null;
    }, {
        status: "pending" | "queued" | "generating" | "completed" | "failed";
        prompt: string;
        order: number;
        referenceImageId: string | null;
        id: string;
        previewUrl: string | null;
        assetUrl: string | null;
        referenceImageUrl: string | null;
        soraTaskId: string | null;
        failureReason: string | null;
    }>, "many">;
    finalVideoUrl: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "queued" | "completed" | "failed" | "draft" | "in_progress" | "cancelled";
    prompt: string;
    durationSeconds: number;
    segmentationMode: "auto" | "manual";
    id: string;
    frameCount: number;
    segments: {
        status: "pending" | "queued" | "generating" | "completed" | "failed";
        prompt: string;
        order: number;
        referenceImageId: string | null;
        id: string;
        previewUrl: string | null;
        assetUrl: string | null;
        referenceImageUrl: string | null;
        soraTaskId: string | null;
        failureReason: string | null;
    }[];
    finalVideoUrl: string | null;
    createdAt: string;
    updatedAt: string;
}, {
    status: "queued" | "completed" | "failed" | "draft" | "in_progress" | "cancelled";
    prompt: string;
    durationSeconds: number;
    segmentationMode: "auto" | "manual";
    id: string;
    frameCount: number;
    segments: {
        status: "pending" | "queued" | "generating" | "completed" | "failed";
        prompt: string;
        order: number;
        referenceImageId: string | null;
        id: string;
        previewUrl: string | null;
        assetUrl: string | null;
        referenceImageUrl: string | null;
        soraTaskId: string | null;
        failureReason: string | null;
    }[];
    finalVideoUrl: string | null;
    createdAt: string;
    updatedAt: string;
}>;
type VideoJobDTO = z.infer<typeof videoJobSchema>;
declare const updateSegmentPromptSchema: z.ZodObject<{
    prompt: z.ZodString;
    referenceImageId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    prompt: string;
    referenceImageId?: string | null | undefined;
}, {
    prompt: string;
    referenceImageId?: string | null | undefined;
}>;
type UpdateSegmentPromptRequest = z.infer<typeof updateSegmentPromptSchema>;
declare const uploadReferenceImageResponseSchema: z.ZodObject<{
    id: z.ZodString;
    url: z.ZodString;
    frameOrder: z.ZodNumber;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: string;
    url: string;
    frameOrder: number;
}, {
    id: string;
    createdAt: string;
    url: string;
    frameOrder: number;
}>;
type ReferenceImageDTO = z.infer<typeof uploadReferenceImageResponseSchema>;
declare const progressEventSchema: z.ZodObject<{
    jobId: z.ZodString;
    segmentId: z.ZodString;
    status: z.ZodEnum<["pending", "queued", "generating", "completed", "failed"]>;
    progress: z.ZodNumber;
    previewUrl: z.ZodNullable<z.ZodString>;
    failureReason: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "queued" | "generating" | "completed" | "failed";
    previewUrl: string | null;
    failureReason: string | null;
    jobId: string;
    segmentId: string;
    progress: number;
}, {
    status: "pending" | "queued" | "generating" | "completed" | "failed";
    previewUrl: string | null;
    failureReason: string | null;
    jobId: string;
    segmentId: string;
    progress: number;
}>;
type ProgressEvent = z.infer<typeof progressEventSchema>;
declare const assemblyEventSchema: z.ZodObject<{
    jobId: z.ZodString;
    status: z.ZodEnum<["draft", "queued", "in_progress", "completed", "failed", "cancelled"]>;
    finalVideoUrl: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "queued" | "completed" | "failed" | "draft" | "in_progress" | "cancelled";
    finalVideoUrl: string | null;
    jobId: string;
}, {
    status: "queued" | "completed" | "failed" | "draft" | "in_progress" | "cancelled";
    finalVideoUrl: string | null;
    jobId: string;
}>;
type AssemblyEvent = z.infer<typeof assemblyEventSchema>;
declare const retryJobSchema: z.ZodObject<{
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    reason?: string | undefined;
}, {
    reason?: string | undefined;
}>;
type RetryJobRequest = z.infer<typeof retryJobSchema>;

export { type AssemblyEvent, type CreateVideoJobRequest, type ProgressEvent, type ReferenceImageDTO, type RetryJobRequest, type SegmentPromptDTO, type SegmentStatus, type UpdateSegmentPromptRequest, type VideoJobDTO, type VideoJobStatus, assemblyEventSchema, createVideoJobSchema, frameDurationSeconds, progressEventSchema, retryJobSchema, segmentPromptSchema, segmentStatusSchema, updateSegmentPromptSchema, uploadReferenceImageResponseSchema, videoJobSchema, videoJobStatusSchema };
