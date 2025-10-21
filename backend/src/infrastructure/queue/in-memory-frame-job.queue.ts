import { Injectable } from '@nestjs/common';
import { FrameJobQueue, FrameJobMessage } from '../../application/ports/frame-job-queue.port';

@Injectable()
export class InMemoryFrameJobQueue implements FrameJobQueue {
  private readonly queue: FrameJobMessage[] = [];
  private processor?: (job: FrameJobMessage) => Promise<void>;
  private isProcessing = false;

  registerProcessor(processor: (job: FrameJobMessage) => Promise<void>): void {
    this.processor = processor;
    this.drainQueue();
  }

  async enqueue(job: FrameJobMessage): Promise<void> {
    this.queue.push(job);
    await this.drainQueue();
  }

  private async drainQueue(): Promise<void> {
    if (this.isProcessing) {
      return;
    }

    if (!this.processor) {
      return;
    }

    this.isProcessing = true;
    try {
      while (this.queue.length > 0) {
        const job = this.queue.shift()!;
        await this.processor(job);
      }
    } finally {
      this.isProcessing = false;
    }
  }
}
