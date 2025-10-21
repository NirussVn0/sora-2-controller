import { ProgressEvent, AssemblyEvent } from '@sora/controller-contracts';

export interface ProgressPublisher {
  publishProgress(event: ProgressEvent): Promise<void>;
  publishAssembly(event: AssemblyEvent): Promise<void>;
}
