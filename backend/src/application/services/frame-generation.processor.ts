import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import type { FrameJobQueue, FrameJobMessage } from '../ports/frame-job-queue.port';
import type { VideoJobRepository } from '../../domain/repositories/video-job.repository';
import type { ProgressPublisher } from '../ports/progress-publisher.port';
import type { SoraClient } from '../ports/sora-client.port';
import type { VideoAssembler } from '../ports/video-assembler.port';
import type { VideoJob } from '../../domain/entities/video-job.entity';
import { FRAME_JOB_QUEUE, PROGRESS_PUBLISHER, SORA_CLIENT, VIDEO_ASSEMBLER, VIDEO_JOB_REPOSITORY } from '../tokens';

@Injectable()
export class FrameGenerationProcessor implements OnModuleInit {
  private readonly logger = new Logger(FrameGenerationProcessor.name);

  constructor(
    @Inject(FRAME_JOB_QUEUE) private readonly queue: FrameJobQueue,
    @Inject(VIDEO_JOB_REPOSITORY) private readonly repository: VideoJobRepository,
    @Inject(PROGRESS_PUBLISHER) private readonly progressPublisher: ProgressPublisher,
    @Inject(SORA_CLIENT) private readonly soraClient: SoraClient,
    @Inject(VIDEO_ASSEMBLER) private readonly videoAssembler: VideoAssembler
  ) {}

  onModuleInit(): void {
    this.queue.registerProcessor((message) => this.handleMessage(message));
  }

  private async handleMessage(message: FrameJobMessage): Promise<void> {
    const job = await this.repository.findById(message.jobId);

    if (!job) {
      this.logger.warn(`Received frame job for unknown video job ${message.jobId}`);
      return;
    }

    try {
      if (job.status === 'draft') {
        job.markInProgress();
      }

      job.markSegmentGenerating(message.segmentId, 'pending');
      await this.repository.update(job);
      await this.progressPublisher.publishProgress({
        jobId: job.id,
        segmentId: message.segmentId,
        status: 'generating',
        progress: 0.05,
        previewUrl: null,
        failureReason: null
      });

      const segment = job.segments.find((item) => item.id === message.segmentId);

      if (!segment) {
        throw new Error(`Segment ${message.segmentId} not found in job ${job.id}`);
      }

      const result = await this.soraClient.generateSegment({
        jobId: job.id,
        segmentId: segment.id,
        prompt: segment.prompt,
        referenceImageUrl: segment.referenceImage?.url,
        durationSeconds: job.durationSeconds,
        frameOrder: segment.order
      });

      job.markSegmentGenerating(segment.id, result.taskId);
      job.markSegmentCompleted(segment.id, result.previewUrl, result.videoAssetUrl);
      await this.repository.update(job);

      await this.progressPublisher.publishProgress({
        jobId: job.id,
        segmentId: segment.id,
        status: 'completed',
        progress: 1,
        previewUrl: result.previewUrl,
        failureReason: null
      });

      await this.checkForAssembly(job);
    } catch (error) {
      this.logger.error(`Failed to process segment ${message.segmentId}: ${error}`);
      job.markSegmentFailed(message.segmentId, error instanceof Error ? error.message : 'Unknown error');
      job.markFailed();
      await this.repository.update(job);
      await this.progressPublisher.publishProgress({
        jobId: job.id,
        segmentId: message.segmentId,
        status: 'failed',
        progress: 1,
        previewUrl: null,
        failureReason: error instanceof Error ? error.message : 'Unknown error'
      });
      await this.progressPublisher.publishAssembly({
        jobId: job.id,
        status: job.status,
        finalVideoUrl: null
      });
    }
  }

  private async checkForAssembly(job: VideoJob): Promise<void> {
    if (!job.allSegmentsCompleted()) {
      return;
    }

    this.logger.debug(`All segments completed for job ${job.id}, assembling video`);
    const segmentAssets = job.segments
      .map((segment) => segment.assetUrl)
      .filter((url): url is string => Boolean(url));

    const finalVideoUrl = await this.videoAssembler.assemble({ jobId: job.id, segmentAssets });
    job.markCompleted(finalVideoUrl);
    await this.repository.update(job);
    await this.progressPublisher.publishAssembly({
      jobId: job.id,
      status: job.status,
      finalVideoUrl
    });
  }
}
