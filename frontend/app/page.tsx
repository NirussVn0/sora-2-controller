'use client';

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ProgressEvent, AssemblyEvent, VideoJobDTO } from "@sora/controller-contracts";
import { PromptWorkspace } from "../features/prompt-workspace/prompt-workspace";
import { ManualSegmentsEditor } from "../features/prompt-workspace/manual-segments";
import { DurationControl } from "../features/duration/duration-control";
import { ProgressTimeline } from "../features/timeline/progress-timeline";
import { ReferenceImageUploader } from "../features/reference-images/reference-image-uploader";
import { FinalVideoPreview } from "../features/previews/final-video-preview";
import { useJobBuilder } from "../store/useJobBuilder";
import { Button } from "../components/ui/button";
import { createVideoJob, getVideoJob, retryVideoJob, uploadReferenceImage } from "../lib/api/video-jobs";
import { useProgressSocket } from "../lib/websocket/useProgressSocket";
import { frameDurationSeconds } from "@sora/controller-contracts";

const jobKey = (jobId: string | null) => ["video-job", jobId];

export default function Home() {
  const queryClient = useQueryClient();
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const builder = useJobBuilder();
  const [error, setError] = useState<string | null>(null);
  const [uploadingSegmentId, setUploadingSegmentId] = useState<string | null>(null);

  const jobQuery = useQuery({
    queryKey: jobKey(activeJobId),
    queryFn: () => getVideoJob(activeJobId ?? ""),
    enabled: Boolean(activeJobId)
  });

  useEffect(() => {
    if (jobQuery.error) {
      setError((jobQuery.error as Error).message);
    }
  }, [jobQuery.error]);

  const createJobMutation = useMutation({
    mutationFn: createVideoJob,
    onSuccess: (job) => {
      setActiveJobId(job.id);
      queryClient.setQueryData(jobKey(job.id), job);
      builder.reset();
    },
    onError: (cause: Error) => setError(cause.message)
  });

  const retryMutation = useMutation({
    mutationFn: (jobId: string) => retryVideoJob(jobId, {}),
    onSuccess: (job) => queryClient.setQueryData(jobKey(job.id), job),
    onError: (cause: Error) => setError(cause.message)
  });

  const uploadMutation = useMutation({
    mutationFn: ({ jobId, segmentId, file }: { jobId: string; segmentId: string; file: File }) =>
      uploadReferenceImage(jobId, segmentId, file),
    onSuccess: (job) => queryClient.setQueryData(jobKey(job.id), job),
    onError: (cause: Error) => setError(cause.message)
  });

  const job = jobQuery.data;

  useProgressSocket({
    jobId: activeJobId ?? undefined,
    onProgress: (event: ProgressEvent) => {
      queryClient.setQueryData<VideoJobDTO | undefined>(jobKey(event.jobId), (current) => {
        if (!current) return current;
        return {
          ...current,
          status: event.status === "failed" ? "failed" : current.status === "draft" ? "in_progress" : current.status,
          segments: current.segments.map((segment) =>
            segment.id === event.segmentId
              ? {
                  ...segment,
                  status: event.status,
                  previewUrl: event.previewUrl ?? segment.previewUrl,
                  failureReason: event.failureReason ?? segment.failureReason
                }
              : segment
          )
        };
      });
    },
    onAssembly: (event: AssemblyEvent) => {
      queryClient.setQueryData<VideoJobDTO | undefined>(jobKey(event.jobId), (current) => {
        if (!current) return current;
        return { ...current, status: event.status, finalVideoUrl: event.finalVideoUrl };
      });
    }
  });

  const handleGenerate = () => {
    setError(null);
    const payload = builder.toPayload();
    if (!payload.prompt || payload.prompt.length < 10) {
      setError("Prompt must be at least 10 characters long.");
      return;
    }
    createJobMutation.mutate(payload);
  };

  const handleRetryFailed = () => {
    if (!job?.id) return;
    retryMutation.mutate(job.id);
  };

  const handleUpload = (segmentId: string, file: File) => {
    if (!job?.id) return;
    setUploadingSegmentId(segmentId);
    uploadMutation.mutate(
      { jobId: job.id, segmentId, file },
      {
        onSettled: () => setUploadingSegmentId(null)
      }
    );
  };

  const frameCount = useMemo(() => Math.ceil(builder.durationSeconds / frameDurationSeconds), [builder.durationSeconds]);

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-100">Sora Video Orchestrator</h1>
        <p className="max-w-2xl text-sm text-slate-400">
          Configure long-form Sora 2 jobs, split prompts into directed segments, attach guiding reference imagery, and monitor frame-by-frame generation in real time.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          <PromptWorkspace />
          <DurationControl />
          {builder.segmentationMode === "manual" && frameCount > 0 && <ManualSegmentsEditor />}
          <div className="flex items-center gap-3">
            <Button onClick={handleGenerate} disabled={createJobMutation.isPending}>
              {createJobMutation.isPending ? "Creating..." : "Generate with Sora"}
            </Button>
            {job && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleRetryFailed}
                disabled={retryMutation.isPending}
              >
                {retryMutation.isPending ? "Retrying..." : "Retry Failed Frames"}
              </Button>
            )}
            {error && <span className="text-sm text-rose-400">{error}</span>}
          </div>
        </div>

        <aside className="space-y-4">
          <ReferenceImageUploader
            job={job}
            onUpload={handleUpload}
            uploadingSegmentId={uploadingSegmentId}
          />
          <FinalVideoPreview job={job} />
        </aside>
      </section>

      <ProgressTimeline job={job} />
    </main>
  );
}
