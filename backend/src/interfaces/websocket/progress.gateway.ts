import { OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ProgressEventEmitter, PROGRESS_EVENT, ASSEMBLY_EVENT } from '../../infrastructure/events/progress-event-emitter';
import type { AssemblyEvent, ProgressEvent } from '@sora/controller-contracts';

@WebSocketGateway({ namespace: '/ws/progress', cors: { origin: '*' } })
@Injectable()
export class ProgressGateway implements OnGatewayInit, OnModuleDestroy {
  @WebSocketServer()
  private server!: Server;

  private progressListener = (event: ProgressEvent) => this.server.emit('frame-progress', event);
  private assemblyListener = (event: AssemblyEvent) => this.server.emit('job-assembly', event);

  constructor(private readonly emitter: ProgressEventEmitter) {}

  afterInit(): void {
    this.emitter.on(PROGRESS_EVENT, this.progressListener);
    this.emitter.on(ASSEMBLY_EVENT, this.assemblyListener);
  }

  onModuleDestroy(): void {
    this.emitter.off(PROGRESS_EVENT, this.progressListener);
    this.emitter.off(ASSEMBLY_EVENT, this.assemblyListener);
  }
}
