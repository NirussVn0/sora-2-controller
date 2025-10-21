'use client';

import { useJobBuilder } from "../../store/useJobBuilder";
import { Button } from "../../components/ui/button";

export function PromptWorkspace() {
  const prompt = useJobBuilder((state) => state.prompt);
  const setPrompt = useJobBuilder((state) => state.setPrompt);
  const segmentationMode = useJobBuilder((state) => state.segmentationMode);
  const setSegmentationMode = useJobBuilder((state) => state.setSegmentationMode);

  return (
    <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <header>
        <h2 className="text-lg font-semibold">Main Prompt</h2>
        <p className="text-sm text-slate-400">Describe the story arc. Auto-segmentation splits this into 10-second segments.</p>
      </header>
      <textarea
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        placeholder="A cinematic journey through a neon-lit metropolis, drones weaving between skyscrapers..."
        rows={6}
        className="w-full rounded-lg border border-slate-700 bg-slate-950/80 p-3 text-sm text-slate-100 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            type="button"
            variant={segmentationMode === "auto" ? "primary" : "secondary"}
            onClick={() => setSegmentationMode("auto")}
          >
            Auto Segmentation
          </Button>
          <Button
            type="button"
            variant={segmentationMode === "manual" ? "primary" : "secondary"}
            onClick={() => setSegmentationMode("manual")}
          >
            Manual Prompts
          </Button>
        </div>
        <span className="text-xs text-slate-500">{prompt.length} characters</span>
      </div>
    </section>
  );
}
