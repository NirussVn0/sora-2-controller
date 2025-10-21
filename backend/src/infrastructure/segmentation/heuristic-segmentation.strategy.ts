import { Injectable } from '@nestjs/common';
import { SegmentationStrategy } from '../../domain/services/segmentation/segmentation-strategy';

@Injectable()
export class HeuristicSegmentationStrategy implements SegmentationStrategy {
  async generateSegments(input: { prompt: string; frameCount: number }): Promise<string[]> {
    const sentences = this.splitIntoSentences(input.prompt);
    if (sentences.length === 0) {
      return Array.from({ length: input.frameCount }, () => input.prompt);
    }

    const segments: string[] = [];

    for (let index = 0; index < input.frameCount; index += 1) {
      const sentence = sentences[index % sentences.length];
      segments.push(`${sentence.trim()} (Segment ${index + 1})`);
    }

    return segments;
  }

  private splitIntoSentences(prompt: string): string[] {
    return prompt
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.trim())
      .filter(Boolean);
  }
}
