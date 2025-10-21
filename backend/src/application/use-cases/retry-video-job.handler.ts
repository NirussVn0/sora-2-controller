import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RetryVideoJobCommand } from '../dto/retry-video-job.command';
import type { VideoJobRepository } from '../../domain/repositories/video-job.repository';
import { FrameProcessingOrchestrator } from '../services/frame-processing.orchestrator';
import { VIDEO_JOB_REPOSITORY } from '../tokens';

@Injectable()
export class RetryVideoJobHandler {
  constructor(
    @Inject(VIDEO_JOB_REPOSITORY) private readonly repository: VideoJobRepository,
    private readonly orchestrator: FrameProcessingOrchestrator
  ) {}

  async execute(command: RetryVideoJobCommand) {
    const job = await this.repository.findById(command.jobId);
    if (!job) {
      throw new NotFoundException(`Video job ${command.jobId} not found`);
    }

    await this.orchestrator.retryFailed(job);
    return job;
  }
}
