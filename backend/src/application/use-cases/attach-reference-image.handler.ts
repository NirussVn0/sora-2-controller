import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AttachReferenceImageCommand } from '../dto/attach-reference-image.command';
import type { VideoJobRepository } from '../../domain/repositories/video-job.repository';
import { ReferenceImagePolicy } from '../../domain/services/reference-image.policy';
import type { ReferenceImageStorage } from '../ports/reference-image-storage.port';
import { ReferenceImage } from '../../domain/entities/reference-image.entity';
import { REFERENCE_IMAGE_STORAGE, VIDEO_JOB_REPOSITORY } from '../tokens';

@Injectable()
export class AttachReferenceImageHandler {
  constructor(
    @Inject(VIDEO_JOB_REPOSITORY) private readonly repository: VideoJobRepository,
    private readonly policy: ReferenceImagePolicy,
    @Inject(REFERENCE_IMAGE_STORAGE) private readonly storage: ReferenceImageStorage
  ) {}

  async execute(command: AttachReferenceImageCommand) {
    const job = await this.repository.findById(command.jobId);
    if (!job) {
      throw new NotFoundException(`Video job ${command.jobId} not found`);
    }

    const segment = job.segments.find((item) => item.id === command.segmentId);

    if (!segment) {
      throw new NotFoundException(`Segment ${command.segmentId} not found in job ${command.jobId}`);
    }

    this.policy.ensureWithinBounds({ frameOrder: segment.order, frameCount: job.frameCount });

    const stored = await this.storage.store({
      jobId: job.id,
      segmentId: segment.id,
      frameOrder: segment.order,
      buffer: command.file,
      filename: command.filename,
      mimetype: command.mimetype
    });

    const referenceImage = ReferenceImage.create({
      id: stored.id,
      url: stored.url,
      frameOrder: stored.frameOrder,
      storedAt: stored.createdAt
    });

    job.attachReferenceImage(segment.id, referenceImage);
    await this.repository.update(job);

    return { job, referenceImage };
  }
}
