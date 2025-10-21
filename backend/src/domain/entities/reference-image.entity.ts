import { randomUUID } from 'crypto';

export interface ReferenceImageProps {
  id: string;
  url: string;
  storedAt: Date;
  frameOrder: number;
}

export class ReferenceImage {
  private readonly props: ReferenceImageProps;

  private constructor(props: ReferenceImageProps) {
    this.props = props;
  }

  static create(input: { url: string; frameOrder: number; id?: string; storedAt?: Date }): ReferenceImage {
    return new ReferenceImage({
      id: input.id ?? randomUUID(),
      url: input.url,
      frameOrder: input.frameOrder,
      storedAt: input.storedAt ?? new Date()
    });
  }

  static restore(props: ReferenceImageProps): ReferenceImage {
    return new ReferenceImage(props);
  }

  get id(): string {
    return this.props.id;
  }

  get url(): string {
    return this.props.url;
  }

  get storedAt(): Date {
    return this.props.storedAt;
  }

  get frameOrder(): number {
    return this.props.frameOrder;
  }

  toJSON(): ReferenceImageProps {
    return { ...this.props };
  }
}
