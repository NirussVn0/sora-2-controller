import { Inject, Injectable } from '@nestjs/common';
import { CreateVideoJobCommand } from '../dto/create-video-job.command';
import { PromptSegmentationService } from '../../domain/services/segmentation/prompt-segmentation.service';
import { FrameSegment } from '../../domain/entities/frame-segment.entity';
import { VideoJob } from '../../domain/entities/video-job.entity';
import type { VideoJobRepository } from '../../domain/repositories/video-job.repository';
import { FrameProcessingOrchestrator } from '../services/frame-processing.orchestrator';
import { VIDEO_JOB_REPOSITORY } from '../tokens';

@Injectable()
export class CreateVideoJobHandler {
  constructor(
    private readonly segmentationService: PromptSegmentationService,
    @Inject(VIDEO_JOB_REPOSITORY) private readonly repository: VideoJobRepository,
    private readonly orchestrator: FrameProcessingOrchestrator
  ) {}

  async execute(command: CreateVideoJobCommand): Promise<VideoJob> {
    const drafts = await this.segmentationService.buildSegments({
      prompt: command.prompt,
      durationSeconds: command.durationSeconds,
      segmentationMode: command.segmentationMode,
      manualSegments: command.manualSegments?.map((segment) => ({
        order: segment.order,
        prompt: segment.prompt,
        referenceImageId: segment.referenceImageId
      }))
    });

    const segments = drafts.map((draft) => FrameSegment.create({
      order: draft.order,
      prompt: draft.prompt
    }));

    const job = VideoJob.create({
      prompt: command.prompt,
      durationSeconds: command.durationSeconds,
      segmentationMode: command.segmentationMode,
      segments
    });

    await this.repository.save(job);
    await this.orchestrator.queueJob(job);
    return job;
  }
}
