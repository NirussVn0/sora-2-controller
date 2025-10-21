export interface StoredReferenceImage {
  id: string;
  url: string;
  frameOrder: number;
  createdAt: Date;
}

export interface ReferenceImageStorage {
  store(input: { jobId: string; segmentId: string; frameOrder: number; buffer: Buffer; filename: string; mimetype: string }): Promise<StoredReferenceImage>;
}
