import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';
import { ProgressPublisher } from '../../application/ports/progress-publisher.port';
import type { AssemblyEvent, ProgressEvent } from '@sora/controller-contracts';

export const PROGRESS_EVENT = 'progress';
export const ASSEMBLY_EVENT = 'assembly';

@Injectable()
export class ProgressEventEmitter extends EventEmitter implements ProgressPublisher {
  async publishProgress(event: ProgressEvent): Promise<void> {
    this.emit(PROGRESS_EVENT, event);
  }

  async publishAssembly(event: AssemblyEvent): Promise<void> {
    this.emit(ASSEMBLY_EVENT, event);
  }
}
