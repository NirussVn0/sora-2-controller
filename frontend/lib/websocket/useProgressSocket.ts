'use client';

import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import type { AssemblyEvent, ProgressEvent } from "@sora/controller-contracts";
import { WS_BASE_URL } from "../config";

type ProgressHandlers = {
  jobId?: string;
  onProgress?: (event: ProgressEvent) => void;
  onAssembly?: (event: AssemblyEvent) => void;
};

export function useProgressSocket({ jobId, onProgress, onAssembly }: ProgressHandlers) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!jobId) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      return;
    }

    const socket = io(`${WS_BASE_URL}/ws/progress`, {
      transports: ["websocket"],
      reconnectionAttempts: 5
    });

    const handleProgress = (event: ProgressEvent) => {
      if (event.jobId !== jobId) return;
      onProgress?.(event);
    };

    const handleAssembly = (event: AssemblyEvent) => {
      if (event.jobId !== jobId) return;
      onAssembly?.(event);
    };

    socket.on("frame-progress", handleProgress);
    socket.on("job-assembly", handleAssembly);
    socketRef.current = socket;

    return () => {
      socket.off("frame-progress", handleProgress);
      socket.off("job-assembly", handleAssembly);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [jobId, onProgress, onAssembly]);
}
