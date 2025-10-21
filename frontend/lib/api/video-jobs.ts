import type {
  CreateVideoJobRequest,
  RetryJobRequest,
  UpdateSegmentPromptRequest,
  VideoJobDTO
} from "@sora/controller-contracts";
import { apiFetch } from "./client";

export const createVideoJob = (payload: CreateVideoJobRequest) =>
  apiFetch<VideoJobDTO>("video-jobs", {
    method: "POST",
    body: JSON.stringify(payload)
  });

export const getVideoJob = (id: string) => apiFetch<VideoJobDTO>(`video-jobs/${id}`);

export const updateSegmentPrompt = (
  jobId: string,
  segmentId: string,
  payload: UpdateSegmentPromptRequest
) =>
  apiFetch<VideoJobDTO>(`video-jobs/${jobId}/segments/${segmentId}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });

export const uploadReferenceImage = async (
  jobId: string,
  segmentId: string,
  file: File
): Promise<VideoJobDTO> => {
  const formData = new FormData();
  formData.append("file", file);

  return apiFetch<VideoJobDTO>(`video-jobs/${jobId}/segments/${segmentId}/reference-image`, {
    method: "POST",
    body: formData
  });
};

export const retryVideoJob = (jobId: string, payload: RetryJobRequest = {}) =>
  apiFetch<VideoJobDTO>(`video-jobs/${jobId}/retry`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
