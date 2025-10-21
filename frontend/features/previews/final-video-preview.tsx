'use client';

import type { VideoJobDTO } from "@sora/controller-contracts";

interface FinalVideoPreviewProps {
  job?: VideoJobDTO | null;
}

export function FinalVideoPreview({ job }: FinalVideoPreviewProps) {
  if (!job) {
    return (
      <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-6 text-center text-sm text-slate-500">
        Final video preview will appear here once rendering completes.
      </div>
    );
  }

  if (!job.finalVideoUrl) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-center text-sm text-slate-400">
        Awaiting video assembly...
      </div>
    );
  }

  return (
    <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <header>
        <h3 className="text-base font-semibold text-slate-100">Final Video</h3>
      </header>
      <video
        src={job.finalVideoUrl}
        controls
        className="w-full rounded-lg border border-slate-800 bg-black"
      />
    </section>
  );
}
