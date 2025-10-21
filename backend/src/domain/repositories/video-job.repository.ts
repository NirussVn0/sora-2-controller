import { VideoJob } from '../entities/video-job.entity';

export interface VideoJobRepository {
  save(job: VideoJob): Promise<void>;
  update(job: VideoJob): Promise<void>;
  findById(id: string): Promise<VideoJob | null>;
}
