export interface FrameJobMessage {
  jobId: string;
  segmentId: string;
}

export interface FrameJobQueue {
  enqueue(job: FrameJobMessage): Promise<void>;
  registerProcessor(processor: (job: FrameJobMessage) => Promise<void>): void;
}
