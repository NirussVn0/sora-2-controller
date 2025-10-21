'use client';

import { frameDurationSeconds } from "@sora/controller-contracts";
import { clsx } from "clsx";
import { useJobBuilder } from "../../store/useJobBuilder";

const MIN_DURATION = frameDurationSeconds;
const MAX_DURATION = 600;

export function DurationControl() {
  const durationSeconds = useJobBuilder((state) => state.durationSeconds);
  const setDuration = useJobBuilder((state) => state.setDuration);
  const frameCount = useJobBuilder((state) => state.frameCount());

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold">Video Duration</h3>
          <p className="text-sm text-slate-400">Control total length and frame segments.</p>
        </div>
        <span className="rounded-md border border-slate-700 bg-slate-800 px-3 py-1 text-sm font-medium text-slate-100">
          {frameCount} frames
        </span>
      </header>
      <div className="flex flex-col gap-3">
        <input
          type="range"
          min={MIN_DURATION}
          max={MAX_DURATION}
          step={frameDurationSeconds}
          value={durationSeconds}
          onChange={(event) => setDuration(Number(event.target.value))}
          className={clsx(
            "h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-700",
            "[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500",
            "[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-indigo-500"
          )}
        />
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={MIN_DURATION}
            max={MAX_DURATION}
            step={frameDurationSeconds}
            value={durationSeconds}
            onChange={(event) => setDuration(Number(event.target.value))}
            className="w-24 rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <span className="text-sm text-slate-400">seconds</span>
        </div>
      </div>
    </section>
  );
}
