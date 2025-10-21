import { randomUUID } from 'crypto';
import type { SegmentStatus } from '@sora/controller-contracts';
import { ReferenceImage, ReferenceImageProps } from './reference-image.entity';

export interface FrameSegmentState {
  id: string;
  order: number;
  prompt: string;
  status: SegmentStatus;
  previewUrl: string | null;
  assetUrl: string | null;
  referenceImage: ReferenceImage | null;
  soraTaskId: string | null;
  failureReason: string | null;
}

export interface FrameSegmentSnapshot {
  id: string;
  order: number;
  prompt: string;
  status: SegmentStatus;
  previewUrl: string | null;
  assetUrl: string | null;
  referenceImage: ReferenceImageProps | null;
  soraTaskId: string | null;
  failureReason: string | null;
}

export class FrameSegment {
  private props: FrameSegmentState;

  private constructor(props: FrameSegmentState) {
    this.props = props;
  }

  static create(input: { order: number; prompt: string; referenceImage?: ReferenceImage | null }): FrameSegment {
    return new FrameSegment({
      id: randomUUID(),
      order: input.order,
      prompt: input.prompt,
      status: 'pending',
      previewUrl: null,
      assetUrl: null,
      referenceImage: input.referenceImage ?? null,
      soraTaskId: null,
      failureReason: null
    });
  }

  static restore(snapshot: FrameSegmentSnapshot): FrameSegment {
    return new FrameSegment({
      ...snapshot,
      referenceImage: snapshot.referenceImage ? ReferenceImage.restore(snapshot.referenceImage) : null
    });
  }

  get id(): string {
    return this.props.id;
  }

  get order(): number {
    return this.props.order;
  }

  get prompt(): string {
    return this.props.prompt;
  }

  get status(): SegmentStatus {
    return this.props.status;
  }

  get previewUrl(): string | null {
    return this.props.previewUrl;
  }

  get referenceImage(): ReferenceImage | null {
    return this.props.referenceImage;
  }

  get assetUrl(): string | null {
    return this.props.assetUrl;
  }

  get soraTaskId(): string | null {
    return this.props.soraTaskId;
  }

  get failureReason(): string | null {
    return this.props.failureReason;
  }

  updatePrompt(prompt: string): void {
    this.props.prompt = prompt;
  }

  attachReferenceImage(image: ReferenceImage): void {
    this.props.referenceImage = image;
  }

  clearReferenceImage(): void {
    this.props.referenceImage = null;
  }

  markQueued(): void {
    this.props.status = 'queued';
  }

  markGenerating(taskId: string): void {
    this.props.status = 'generating';
    this.props.soraTaskId = taskId;
    this.props.failureReason = null;
  }

  markCompleted(previewUrl: string, assetUrl: string): void {
    this.props.status = 'completed';
    this.props.previewUrl = previewUrl;
    this.props.assetUrl = assetUrl;
    this.props.failureReason = null;
  }

  markFailed(reason: string): void {
    this.props.status = 'failed';
    this.props.failureReason = reason;
  }

  resetForRetry(): void {
    this.props.status = 'pending';
    this.props.previewUrl = null;
    this.props.assetUrl = null;
    this.props.soraTaskId = null;
    this.props.failureReason = null;
  }

  toJSON(): FrameSegmentSnapshot {
    return {
      id: this.props.id,
      order: this.props.order,
      prompt: this.props.prompt,
      status: this.props.status,
      previewUrl: this.props.previewUrl,
      assetUrl: this.props.assetUrl,
      referenceImage: this.props.referenceImage ? this.props.referenceImage.toJSON() : null,
      soraTaskId: this.props.soraTaskId,
      failureReason: this.props.failureReason
    };
  }
}
