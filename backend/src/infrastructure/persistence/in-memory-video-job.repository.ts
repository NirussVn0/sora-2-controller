import { Injectable } from '@nestjs/common';
import { VideoJobRepository } from '../../domain/repositories/video-job.repository';
import { VideoJob } from '../../domain/entities/video-job.entity';

@Injectable()
export class InMemoryVideoJobRepository implements VideoJobRepository {
  private readonly store = new Map<string, ReturnType<VideoJob['toJSON']>>();

  async save(job: VideoJob): Promise<void> {
    this.store.set(job.id, structuredClone(job.toJSON()));
  }

  async update(job: VideoJob): Promise<void> {
    this.store.set(job.id, structuredClone(job.toJSON()));
  }

  async findById(id: string): Promise<VideoJob | null> {
    const snapshot = this.store.get(id);
    if (!snapshot) {
      return null;
    }

    return VideoJob.restore(structuredClone(snapshot));
  }
}
