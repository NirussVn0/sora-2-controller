import { Injectable } from '@nestjs/common';
import { VideoAssembler } from '../../application/ports/video-assembler.port';
import type { SoraClient } from '../../application/ports/sora-client.port';

@Injectable()
export class SimpleVideoAssembler implements VideoAssembler {
  constructor(private readonly soraClient: SoraClient) {}

  async assemble(input: { jobId: string; segmentAssets: string[] }): Promise<string> {
    if ('assembleVideo' in this.soraClient && typeof this.soraClient.assembleVideo === 'function') {
      return this.soraClient.assembleVideo({ jobId: input.jobId, segmentAssets: input.segmentAssets });
    }

    const label = encodeURIComponent(`Job ${input.jobId}`);
    return `https://placehold.co/1280x720?text=${label}+Final`;
  }
}
