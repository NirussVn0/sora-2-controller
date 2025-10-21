import { Inject, Injectable } from '@nestjs/common';
import { frameDurationSeconds } from '@sora/controller-contracts';
import type { SegmentationStrategy } from './segmentation-strategy';
import { SEGMENTATION_STRATEGY } from '../../../application/tokens';

export interface ManualSegmentInput {
  order: number;
  prompt: string;
  referenceImageId?: string;
}

export interface SegmentDraft {
  order: number;
  prompt: string;
  referenceImageId?: string;
}

@Injectable()
export class PromptSegmentationService {
  constructor(@Inject(SEGMENTATION_STRATEGY) private readonly strategy: SegmentationStrategy) {}

  async buildSegments(input: {
    prompt: string;
    durationSeconds: number;
    segmentationMode: 'auto' | 'manual';
    manualSegments?: ManualSegmentInput[];
  }): Promise<SegmentDraft[]> {
    const frameCount = Math.ceil(input.durationSeconds / frameDurationSeconds);
    const basePrompts = await this.strategy.generateSegments({
      prompt: input.prompt,
      frameCount
    });

    const manualIndex = new Map<number, ManualSegmentInput>();
    (input.manualSegments ?? []).forEach((segment) => manualIndex.set(segment.order, segment));

    return Array.from({ length: frameCount }, (_, index) => {
      const manualSegment = manualIndex.get(index);
      const fallbackPrompt = basePrompts[index] ?? basePrompts[basePrompts.length - 1] ?? input.prompt;

      return {
        order: index,
        prompt: manualSegment?.prompt ?? fallbackPrompt,
        referenceImageId: manualSegment?.referenceImageId
      } satisfies SegmentDraft;
    });
  }
}
