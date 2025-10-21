import { frameDurationSeconds } from "@sora/controller-contracts";
import { create } from "zustand";

type SegmentationMode = "auto" | "manual";

type ManualSegments = Record<number, string>;

const ensureFrameRange = (manualSegments: ManualSegments, frameCount: number): ManualSegments => {
  return Object.fromEntries(
    Object.entries(manualSegments)
      .map(([key, value]) => [Number(key), value] as const)
      .filter(([order]) => order < frameCount)
  );
};

interface JobBuilderState {
  prompt: string;
  durationSeconds: number;
  segmentationMode: SegmentationMode;
  manualSegments: ManualSegments;
  setPrompt: (prompt: string) => void;
  setDuration: (seconds: number) => void;
  setSegmentationMode: (mode: SegmentationMode) => void;
  setManualSegmentPrompt: (order: number, prompt: string) => void;
  reset: () => void;
  frameCount: () => number;
  toPayload: () => {
    prompt: string;
    durationSeconds: number;
    segmentationMode: SegmentationMode;
    manualSegments?: { order: number; prompt: string }[];
  };
}

const defaultState: Pick<JobBuilderState, "prompt" | "durationSeconds" | "segmentationMode" | "manualSegments"> = {
  prompt: "",
  durationSeconds: 30,
  segmentationMode: "auto",
  manualSegments: {}
};

export const useJobBuilder = create<JobBuilderState>((set, get) => ({
  ...defaultState,
  setPrompt: (prompt) => set({ prompt }),
  setDuration: (seconds) =>
    set((state) => ({
      durationSeconds: seconds,
      manualSegments: ensureFrameRange(state.manualSegments, Math.ceil(seconds / frameDurationSeconds))
    })),
  setSegmentationMode: (mode) => set({ segmentationMode: mode }),
  setManualSegmentPrompt: (order, prompt) =>
    set((state) => ({
      manualSegments: { ...state.manualSegments, [order]: prompt }
    })),
  reset: () => set({ ...defaultState }),
  frameCount: () => Math.ceil(get().durationSeconds / frameDurationSeconds),
  toPayload: () => {
    const state = get();
    const frameCount = Math.ceil(state.durationSeconds / frameDurationSeconds);
    const manualSegments = Object.entries(state.manualSegments)
      .map(([order, prompt]) => ({ order: Number(order), prompt: prompt.trim() }))
      .filter((segment) => segment.prompt.length > 0 && segment.order < frameCount)
      .sort((a, b) => a.order - b.order);

    return {
      prompt: state.prompt,
      durationSeconds: state.durationSeconds,
      segmentationMode: state.segmentationMode,
      manualSegments: manualSegments.length > 0 ? manualSegments : undefined
    };
  }
}));
