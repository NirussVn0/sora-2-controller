export interface VideoAssembler {
  assemble(input: { jobId: string; segmentAssets: string[] }): Promise<string>;
}
