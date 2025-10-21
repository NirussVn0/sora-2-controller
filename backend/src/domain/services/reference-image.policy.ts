import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ReferenceImagePolicy {
  ensureWithinBounds(input: { frameOrder: number; frameCount: number }): void {
    const { frameOrder, frameCount } = input;

    if (frameOrder < 0 || frameOrder >= frameCount) {
      throw new BadRequestException(`Frame order ${frameOrder} is out of bounds for ${frameCount} frames`);
    }
  }
}
