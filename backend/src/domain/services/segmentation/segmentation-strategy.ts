export interface SegmentationStrategy {
  generateSegments(input: { prompt: string; frameCount: number }): Promise<string[]>;
}
