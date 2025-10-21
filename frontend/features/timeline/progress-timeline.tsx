'use client';

import type { VideoJobDTO } from "@sora/controller-contracts";
import Image from "next/image";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PhotoIcon,
  PlayCircleIcon
} from "@heroicons/react/24/outline";

interface ProgressTimelineProps {
  job?: VideoJobDTO | null;
}

const statusConfig = {
  pending: { label: "Pending", icon: PlayCircleIcon, className: "text-slate-500" },
  queued: { label: "Queued", icon: PlayCircleIcon, className: "text-slate-400" },
  generating: { label: "Generating", icon: PhotoIcon, className: "text-indigo-400" },
  completed: { label: "Completed", icon: CheckCircleIcon, className: "text-emerald-400" },
  failed: { label: "Failed", icon: ExclamationTriangleIcon, className: "text-rose-400" }
} as const;

export function ProgressTimeline({ job }: ProgressTimelineProps) {
  if (!job) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-center text-slate-500">
        Frames will appear here once you start a generation job.
      </div>
    );
  }

  return (
    <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <header className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold">Generation Timeline</h3>
          <p className="text-sm text-slate-400">Live frame status as Sora processes your segments.</p>
        </div>
        <span className="text-sm text-slate-500">Job status: {job.status.replace(/_/g, " ")}</span>
      </header>
      <ul className="grid gap-3 md:grid-cols-2">
        {job.segments.map((segment) => {
          const status = statusConfig[segment.status];
          const Icon = status.icon;
          return (
            <li
              key={segment.id}
              className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-950/60 p-3"
            >
              <Icon className={`h-6 w-6 flex-shrink-0 ${status.className}`} />
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-200">Frame {segment.order + 1}</span>
                  <span className={`text-xs ${status.className}`}>{status.label}</span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-3">{segment.prompt}</p>
                {segment.failureReason && (
                  <p className="text-xs text-rose-400">{segment.failureReason}</p>
                )}
                {segment.previewUrl && (
                  <figure className="mt-2 overflow-hidden rounded-md border border-slate-800">
                    <Image
                      src={segment.previewUrl}
                      alt={`Frame ${segment.order + 1} preview`}
                      width={640}
                      height={360}
                      className="h-32 w-full object-cover"
                    />
                  </figure>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
