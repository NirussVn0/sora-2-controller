import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateSegmentPromptCommand } from '../dto/update-segment-prompt.command';
import type { VideoJobRepository } from '../../domain/repositories/video-job.repository';
import { FrameProcessingOrchestrator } from '../services/frame-processing.orchestrator';
import { VIDEO_JOB_REPOSITORY } from '../tokens';

@Injectable()
export class UpdateSegmentPromptHandler {
  constructor(
    @Inject(VIDEO_JOB_REPOSITORY) private readonly repository: VideoJobRepository,
    private readonly orchestrator: FrameProcessingOrchestrator
  ) {}

  async execute(command: UpdateSegmentPromptCommand) {
    const job = await this.repository.findById(command.jobId);
    if (!job) {
      throw new NotFoundException(`Video job ${command.jobId} not found`);
    }

    const segment = job.updateSegmentPrompt(command.segmentId, command.prompt);
    segment.resetForRetry();
    await this.repository.update(job);

    await this.orchestrator.requeueSegments(job, [segment.id]);

    return job;
  }
}
