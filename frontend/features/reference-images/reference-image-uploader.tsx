'use client';

import Image from "next/image";
import { useRef } from "react";
import type { VideoJobDTO } from "@sora/controller-contracts";
import { Button } from "../../components/ui/button";

interface ReferenceImageUploaderProps {
  job?: VideoJobDTO | null;
  onUpload: (segmentId: string, file: File) => void;
  uploadingSegmentId?: string | null;
}

export function ReferenceImageUploader({ job, onUpload, uploadingSegmentId }: ReferenceImageUploaderProps) {
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  if (!job) {
    return null;
  }

  return (
    <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <header>
        <h3 className="text-base font-semibold">Reference Images</h3>
        <p className="text-sm text-slate-400">Upload guiding imagery per frame. Supports PNG, JPG, WEBP up to 5 MB.</p>
      </header>
      <ul className="space-y-2">
        {job.segments.map((segment) => (
          <li
            key={segment.id}
            className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/60 p-3"
          >
            <div>
              <p className="text-sm font-medium text-slate-200">Frame {segment.order + 1}</p>
              <p className="text-xs text-slate-500">
                {segment.referenceImageUrl ? "Reference attached" : "No reference image"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {segment.referenceImageUrl && (
                <Image
                  src={segment.referenceImageUrl}
                  alt={`Reference frame ${segment.order + 1}`}
                  width={64}
                  height={64}
                  className="h-12 w-12 rounded-md object-cover"
                />
              )}
              <Button
                type="button"
                variant="secondary"
                onClick={() => inputRefs.current[segment.id]?.click()}
                disabled={uploadingSegmentId === segment.id}
              >
                {uploadingSegmentId === segment.id
                  ? "Uploading..."
                  : segment.referenceImageUrl
                    ? "Replace"
                    : "Upload"}
              </Button>
              <input
                ref={(element) => {
                  inputRefs.current[segment.id] = element;
                }}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(event) => {
                  const [file] = Array.from(event.target.files ?? []);
                  if (file) {
                    onUpload(segment.id, file);
                    event.target.value = "";
                  }
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
