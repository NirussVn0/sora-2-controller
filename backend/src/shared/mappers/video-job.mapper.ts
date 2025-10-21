import type { VideoJobDTO } from '@sora/controller-contracts';
import type { VideoJob } from '../../domain/entities/video-job.entity';

export const toVideoJobDTO = (job: VideoJob): VideoJobDTO => ({
  id: job.id,
  prompt: job.prompt,
  durationSeconds: job.durationSeconds,
  frameCount: job.frameCount,
  status: job.status,
  segmentationMode: job.segmentationMode,
  segments: job.segments.map((segment) => ({
    id: segment.id,
    order: segment.order,
    prompt: segment.prompt,
    status: segment.status,
    previewUrl: segment.previewUrl,
    assetUrl: segment.assetUrl,
    referenceImageId: segment.referenceImage?.id ?? null,
    referenceImageUrl: segment.referenceImage?.url ?? null,
    soraTaskId: segment.soraTaskId,
    failureReason: segment.failureReason
  })),
  finalVideoUrl: job.finalVideoUrl,
  createdAt: job.createdAt.toISOString(),
  updatedAt: job.updatedAt.toISOString()
});
