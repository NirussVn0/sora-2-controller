import { Inject, Injectable, Logger } from '@nestjs/common';
import type { VideoJob } from '../../domain/entities/video-job.entity';
import type { VideoJobRepository } from '../../domain/repositories/video-job.repository';
import type { FrameJobQueue } from '../ports/frame-job-queue.port';
import { FRAME_JOB_QUEUE, VIDEO_JOB_REPOSITORY } from '../tokens';

@Injectable()
export class FrameProcessingOrchestrator {
  private readonly logger = new Logger(FrameProcessingOrchestrator.name);

  constructor(
    @Inject(FRAME_JOB_QUEUE) private readonly queue: FrameJobQueue,
    @Inject(VIDEO_JOB_REPOSITORY) private readonly repository: VideoJobRepository
  ) {}

  async queueJob(job: VideoJob): Promise<void> {
    job.markQueued();
    for (const segment of job.segments) {
      segment.markQueued();
    }
    await this.repository.update(job);

    for (const segment of job.segments) {
      this.logger.debug(`Queueing segment ${segment.id} for job ${job.id}`);
      await this.queue.enqueue({ jobId: job.id, segmentId: segment.id });
    }
  }

  async requeueSegments(job: VideoJob, segmentIds: string[]): Promise<void> {
    for (const segmentId of segmentIds) {
      job.markSegmentQueued(segmentId);
      await this.queue.enqueue({ jobId: job.id, segmentId });
    }
    await this.repository.update(job);
  }

  async retryFailed(job: VideoJob): Promise<void> {
    const segments = job.resetFailedSegments();
    job.markQueued();
    for (const segment of segments) {
      segment.markQueued();
      await this.queue.enqueue({ jobId: job.id, segmentId: segment.id });
    }
    await this.repository.update(job);
  }
}
