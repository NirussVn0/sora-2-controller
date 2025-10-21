export interface UpdateSegmentPromptCommand {
  jobId: string;
  segmentId: string;
  prompt: string;
  referenceImageId?: string | null;
}
