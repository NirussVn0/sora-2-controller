import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { GenerateSegmentPayload, GenerateSegmentResult, SoraClient } from '../../application/ports/sora-client.port';

@Injectable()
export class FakeSoraClient implements SoraClient {
  async generateSegment(payload: GenerateSegmentPayload): Promise<GenerateSegmentResult> {
    await this.delay(100 + Math.random() * 200);

    const taskId = `fake-${randomUUID()}`;
    const label = encodeURIComponent(`Frame ${payload.frameOrder + 1}`);

    return {
      taskId,
      previewUrl: `https://placehold.co/1280x720?text=${label}`,
      videoAssetUrl: `https://placehold.co/1280x720?text=${label}+Video`
    } satisfies GenerateSegmentResult;
  }

  async assembleVideo(input: { jobId: string; segmentAssets: string[] }): Promise<string> {
    await this.delay(150);
    return `https://placehold.co/1280x720?text=Job+${input.jobId}`;
  }

  private async delay(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}
