export interface GenerateSegmentPayload {
  jobId: string;
  segmentId: string;
  prompt: string;
  referenceImageUrl?: string | null;
  durationSeconds: number;
  frameOrder: number;
}

export interface GenerateSegmentResult {
  previewUrl: string;
  videoAssetUrl: string;
  taskId: string;
}

export interface SoraClient {
  generateSegment(payload: GenerateSegmentPayload): Promise<GenerateSegmentResult>;
  assembleVideo?(input: { jobId: string; segmentAssets: string[] }): Promise<string>;
}
