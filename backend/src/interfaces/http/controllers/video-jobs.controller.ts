import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { CreateVideoJobRequest, RetryJobRequest, UpdateSegmentPromptRequest } from '@sora/controller-contracts';
import { createVideoJobSchema, retryJobSchema, updateSegmentPromptSchema, videoJobSchema } from '@sora/controller-contracts';
import { CreateVideoJobHandler } from '../../../application/use-cases/create-video-job.handler';
import { GetVideoJobHandler } from '../../../application/use-cases/get-video-job.handler';
import { UpdateSegmentPromptHandler } from '../../../application/use-cases/update-segment-prompt.handler';
import { AttachReferenceImageHandler } from '../../../application/use-cases/attach-reference-image.handler';
import { RetryVideoJobHandler } from '../../../application/use-cases/retry-video-job.handler';
import { ZodValidationPipe } from '../../../shared/pipes/zod-validation.pipe';
import { toVideoJobDTO } from '../../../shared/mappers/video-job.mapper';

@Controller('video-jobs')
export class VideoJobsController {
  constructor(
    private readonly createHandler: CreateVideoJobHandler,
    private readonly getHandler: GetVideoJobHandler,
    private readonly updateSegmentHandler: UpdateSegmentPromptHandler,
    private readonly attachReferenceImageHandler: AttachReferenceImageHandler,
    private readonly retryHandler: RetryVideoJobHandler
  ) {}

  @Post()
  async create(@Body(new ZodValidationPipe(createVideoJobSchema)) body: CreateVideoJobRequest) {
    const job = await this.createHandler.execute(body);
    const dto = toVideoJobDTO(job);
    videoJobSchema.parse(dto);
    return dto;
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const job = await this.getHandler.execute(id);
    const dto = toVideoJobDTO(job);
    videoJobSchema.parse(dto);
    return dto;
  }

  @Patch(':id/segments/:segmentId')
  async updateSegment(
    @Param('id') jobId: string,
    @Param('segmentId') segmentId: string,
    @Body(new ZodValidationPipe(updateSegmentPromptSchema)) body: UpdateSegmentPromptRequest
  ) {
    const job = await this.updateSegmentHandler.execute({
      jobId,
      segmentId,
      prompt: body.prompt,
      referenceImageId: body.referenceImageId ?? undefined
    });
    const dto = toVideoJobDTO(job);
    videoJobSchema.parse(dto);
    return dto;
  }

  @Post(':id/segments/:segmentId/reference-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 }
    })
  )
  async attachReferenceImage(
    @Param('id') jobId: string,
    @Param('segmentId') segmentId: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('Reference image file is required');
    }

    const { job } = await this.attachReferenceImageHandler.execute({
      jobId,
      segmentId,
      file: file.buffer,
      filename: file.originalname,
      mimetype: file.mimetype
    });

    const dto = toVideoJobDTO(job);
    videoJobSchema.parse(dto);
    return dto;
  }

  @Post(':id/retry')
  async retry(
    @Param('id') jobId: string,
    @Body(new ZodValidationPipe(retryJobSchema)) body: RetryJobRequest
  ) {
    const job = await this.retryHandler.execute({ jobId, reason: body.reason });
    const dto = toVideoJobDTO(job);
    videoJobSchema.parse(dto);
    return dto;
  }
}
