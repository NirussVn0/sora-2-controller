import { randomUUID } from 'crypto';
import { frameDurationSeconds } from '@sora/controller-contracts';
import type { VideoJobStatus } from '@sora/controller-contracts';
import { FrameSegment, FrameSegmentSnapshot } from './frame-segment.entity';
import type { ReferenceImage } from './reference-image.entity';

export interface VideoJobState {
  id: string;
  prompt: string;
  durationSeconds: number;
  frameCount: number;
  status: VideoJobStatus;
  segmentationMode: 'auto' | 'manual';
  segments: FrameSegment[];
  finalVideoUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface VideoJobSnapshot {
  id: string;
  prompt: string;
  durationSeconds: number;
  frameCount: number;
  status: VideoJobStatus;
  segmentationMode: 'auto' | 'manual';
  segments: FrameSegmentSnapshot[];
  finalVideoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export class VideoJob {
  private props: VideoJobState;

  private constructor(props: VideoJobState) {
    this.props = props;
  }

  static create(input: {
    prompt: string;
    durationSeconds: number;
    segmentationMode: 'auto' | 'manual';
    segments: FrameSegment[];
  }): VideoJob {
    const frameCount = Math.ceil(input.durationSeconds / frameDurationSeconds);

    if (input.segments.length !== frameCount) {
      throw new Error('Segment count does not match expected frame count');
    }

    return new VideoJob({
      id: randomUUID(),
      prompt: input.prompt,
      durationSeconds: input.durationSeconds,
      frameCount,
      status: 'draft',
      segmentationMode: input.segmentationMode,
      segments: [...input.segments].sort((a, b) => a.order - b.order),
      finalVideoUrl: null,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  static restore(snapshot: VideoJobSnapshot): VideoJob {
    return new VideoJob({
      ...snapshot,
      segments: snapshot.segments
        .map((segment) => FrameSegment.restore(segment))
        .sort((a, b) => a.order - b.order),
      createdAt: new Date(snapshot.createdAt),
      updatedAt: new Date(snapshot.updatedAt)
    });
  }

  get id(): string {
    return this.props.id;
  }

  get prompt(): string {
    return this.props.prompt;
  }

  get durationSeconds(): number {
    return this.props.durationSeconds;
  }

  get frameCount(): number {
    return this.props.frameCount;
  }

  get status(): VideoJobStatus {
    return this.props.status;
  }

  get segmentationMode(): 'auto' | 'manual' {
    return this.props.segmentationMode;
  }

  get segments(): FrameSegment[] {
    return this.props.segments;
  }

  get finalVideoUrl(): string | null {
    return this.props.finalVideoUrl;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  markQueued(): void {
    this.props.status = 'queued';
    this.touch();
  }

  markInProgress(): void {
    this.props.status = 'in_progress';
    this.touch();
  }

  markCompleted(finalVideoUrl: string): void {
    this.props.status = 'completed';
    this.props.finalVideoUrl = finalVideoUrl;
    this.touch();
  }

  markFailed(): void {
    this.props.status = 'failed';
    this.touch();
  }

  markCancelled(): void {
    this.props.status = 'cancelled';
    this.touch();
  }

  updateSegmentPrompt(segmentId: string, prompt: string): FrameSegment {
    const segment = this.findSegment(segmentId);
    segment.updatePrompt(prompt);
    this.touch();
    return segment;
  }

  attachReferenceImage(segmentId: string, image: ReferenceImage): FrameSegment {
    const segment = this.findSegment(segmentId);
    segment.attachReferenceImage(image);
    this.touch();
    return segment;
  }

  detachReferenceImage(segmentId: string): FrameSegment {
    const segment = this.findSegment(segmentId);
    segment.clearReferenceImage();
    this.touch();
    return segment;
  }

  markSegmentQueued(segmentId: string): FrameSegment {
    const segment = this.findSegment(segmentId);
    segment.markQueued();
    this.touch();
    return segment;
  }

  markSegmentGenerating(segmentId: string, taskId: string): FrameSegment {
    const segment = this.findSegment(segmentId);
    segment.markGenerating(taskId);
    this.touch();
    return segment;
  }

  markSegmentCompleted(segmentId: string, previewUrl: string, assetUrl: string): FrameSegment {
    const segment = this.findSegment(segmentId);
    segment.markCompleted(previewUrl, assetUrl);
    this.touch();
    return segment;
  }

  markSegmentFailed(segmentId: string, reason: string): FrameSegment {
    const segment = this.findSegment(segmentId);
    segment.markFailed(reason);
    this.touch();
    return segment;
  }

  resetFailedSegments(): FrameSegment[] {
    const resetSegments: FrameSegment[] = [];

    for (const segment of this.props.segments) {
      if (segment.status === 'failed') {
        segment.resetForRetry();
        resetSegments.push(segment);
      }
    }

    this.touch();
    return resetSegments;
  }

  allSegmentsCompleted(): boolean {
    return this.props.segments.every((segment) => segment.status === 'completed');
  }

  private findSegment(segmentId: string): FrameSegment {
    const segment = this.props.segments.find((item) => item.id === segmentId);

    if (!segment) {
      throw new Error(`Segment ${segmentId} not found for job ${this.id}`);
    }

    return segment;
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  toJSON(): VideoJobSnapshot {
    return {
      ...this.props,
      segments: this.props.segments.map((segment) => segment.toJSON()),
      createdAt: this.props.createdAt.toISOString(),
      updatedAt: this.props.updatedAt.toISOString()
    };
  }
}
