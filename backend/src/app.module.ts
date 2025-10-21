import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validateEnv } from './config/env.validation';
import { VideoJobsController } from './interfaces/http/controllers/video-jobs.controller';
import { PromptSegmentationService } from './domain/services/segmentation/prompt-segmentation.service';
import { ReferenceImagePolicy } from './domain/services/reference-image.policy';
import { FrameProcessingOrchestrator } from './application/services/frame-processing.orchestrator';
import { FrameGenerationProcessor } from './application/services/frame-generation.processor';
import { CreateVideoJobHandler } from './application/use-cases/create-video-job.handler';
import { GetVideoJobHandler } from './application/use-cases/get-video-job.handler';
import { UpdateSegmentPromptHandler } from './application/use-cases/update-segment-prompt.handler';
import { AttachReferenceImageHandler } from './application/use-cases/attach-reference-image.handler';
import { RetryVideoJobHandler } from './application/use-cases/retry-video-job.handler';
import {
  FRAME_JOB_QUEUE,
  PROGRESS_PUBLISHER,
  REFERENCE_IMAGE_STORAGE,
  SEGMENTATION_STRATEGY,
  SORA_CLIENT,
  VIDEO_ASSEMBLER,
  VIDEO_JOB_REPOSITORY
} from './application/tokens';
import { InMemoryVideoJobRepository } from './infrastructure/persistence/in-memory-video-job.repository';
import { HeuristicSegmentationStrategy } from './infrastructure/segmentation/heuristic-segmentation.strategy';
import { LocalReferenceImageStorage } from './infrastructure/storage/local-reference-image.storage';
import { InMemoryFrameJobQueue } from './infrastructure/queue/in-memory-frame-job.queue';
import { FakeSoraClient } from './infrastructure/ai/fake-sora.client';
import { SimpleVideoAssembler } from './infrastructure/video/simple-video-assembler';
import { ProgressEventEmitter } from './infrastructure/events/progress-event-emitter';
import { ProgressGateway } from './interfaces/websocket/progress.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validateEnv
    })
  ],
  controllers: [VideoJobsController],
  providers: [
    { provide: VIDEO_JOB_REPOSITORY, useClass: InMemoryVideoJobRepository },
    { provide: SEGMENTATION_STRATEGY, useClass: HeuristicSegmentationStrategy },
    { provide: REFERENCE_IMAGE_STORAGE, useClass: LocalReferenceImageStorage },
    { provide: FRAME_JOB_QUEUE, useClass: InMemoryFrameJobQueue },
    { provide: SORA_CLIENT, useClass: FakeSoraClient },
    { provide: VIDEO_ASSEMBLER, useClass: SimpleVideoAssembler },
    { provide: PROGRESS_PUBLISHER, useExisting: ProgressEventEmitter },
    PromptSegmentationService,
    ReferenceImagePolicy,
    FrameProcessingOrchestrator,
    FrameGenerationProcessor,
    CreateVideoJobHandler,
    GetVideoJobHandler,
    UpdateSegmentPromptHandler,
    AttachReferenceImageHandler,
    RetryVideoJobHandler,
    ProgressEventEmitter,
    ProgressGateway
  ]
})
export class AppModule {}
