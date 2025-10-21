'use client';

import { Fragment } from "react";
import { useJobBuilder } from "../../store/useJobBuilder";

export function ManualSegmentsEditor() {
  const frameCount = useJobBuilder((state) => state.frameCount());
  const manualSegments = useJobBuilder((state) => state.manualSegments);
  const setManualSegmentPrompt = useJobBuilder((state) => state.setManualSegmentPrompt);

  if (frameCount === 0) {
    return null;
  }

  return (
    <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
      <header className="space-y-1">
        <h3 className="text-base font-semibold">Manual Segment Prompts</h3>
        <p className="text-sm text-slate-400">
          Override specific frames. Leave blank to let auto-segmentation fill in.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: frameCount }, (_, index) => (
          <Fragment key={index}>
            <div className="space-y-2 rounded-lg border border-slate-800 bg-slate-950/60 p-3">
              <div className="flex items-center justify-between text-sm font-medium text-slate-300">
                <span>Frame {index + 1}</span>
                <span className="text-xs text-slate-500">{index * 10}s - {(index + 1) * 10}s</span>
              </div>
              <textarea
                value={manualSegments[index] ?? ""}
                onChange={(event) => setManualSegmentPrompt(index, event.target.value)}
                placeholder="Describe this specific beat..."
                rows={3}
                className="w-full rounded-md border border-slate-800 bg-slate-950/80 p-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </Fragment>
        ))}
      </div>
    </section>
  );
}
