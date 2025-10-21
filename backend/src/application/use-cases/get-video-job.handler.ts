import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { VideoJobRepository } from '../../domain/repositories/video-job.repository';
import type { VideoJob } from '../../domain/entities/video-job.entity';
import { VIDEO_JOB_REPOSITORY } from '../tokens';

@Injectable()
export class GetVideoJobHandler {
  constructor(@Inject(VIDEO_JOB_REPOSITORY) private readonly repository: VideoJobRepository) {}

  async execute(id: string): Promise<VideoJob> {
    const job = await this.repository.findById(id);
    if (!job) {
      throw new NotFoundException(`Video job ${id} not found`);
    }
    return job;
  }
}
