export interface AttachReferenceImageCommand {
  jobId: string;
  segmentId: string;
  file: Buffer;
  filename: string;
  mimetype: string;
}
