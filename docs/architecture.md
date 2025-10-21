# Sora Controller Architecture

This document summarises the core design of the Sora Controller platform.

## Overview
- **Goal**: orchestrate Sora 2 video generation by splitting prompts into 10-second frames, optionally accepting manual overrides and reference imagery, and providing real-time job feedback.
- **Topology**: modular NestJS backend, React/Next.js frontend, shared TypeScript contracts package, optional PostgreSQL persistence via Prisma, Redis-compatible queue abstraction (currently in-memory).

## Backend
- **Framework**: NestJS 11 with strict dependency injection tokens and SOLID-aligned modules.
- **Domain Model**:
  - `VideoJob`, `FrameSegment`, `ReferenceImage` entities capture core state.
  - Segmentation strategy interface allows swapping heuristic/LLM implementations.
- **Application Layer**:
  - Use cases (`CreateVideoJobHandler`, `AttachReferenceImageHandler`, etc.) orchestrate domain logic.
  - `FrameProcessingOrchestrator` queues segments; `FrameGenerationProcessor` simulates Sora integration and assembles clips.
- **Infrastructure**:
  - `FakeSoraClient` + `SimpleVideoAssembler` mock Sora 2; drop-in replacement with real API client later.
  - `InMemoryFrameJobQueue` and `InMemoryVideoJobRepository` simplify local dev; Prisma schema prepared for PostgreSQL adoption.
  - `ProgressEventEmitter` backs REST+WebSocket progress broadcasting.
- **HTTP Interface**: `/api/video-jobs` endpoints for job creation, segment updates, reference image upload, and retries. `ProgressGateway` offers Socket.IO updates (`frame-progress`, `job-assembly`).

## Frontend
- **Framework**: Next.js 15 (App Router) + React Query + Zustand.
- **Features**:
  - Prompt workspace with auto/manual segmentation toggle.
  - Duration slider tied to frame count (10s per frame).
  - Manual segment editor for per-frame prompts.
  - Reference image uploader and final video preview.
  - Real-time timeline updates via Socket.IO.
- **State Management**: `useJobBuilder` store handles draft configuration; React Query caches API responses and merges WebSocket updates.

## Shared Contracts
- Located under `packages/contracts`, providing Zod schemas/types for DTOs, statuses, and events. Both backend and frontend rely on the same build artefacts (`tsup`).

## Persistence Plan
- Prisma schema (`backend/prisma/schema.prisma`) models `VideoJob`, `Segment`, `ReferenceImage` tables.
- Swap `InMemoryVideoJobRepository` for a `PrismaVideoJobRepository` implementation to enable PostgreSQL storage.

## Real Sora Integration
1. Implement `SoraClient` adapter invoking OpenAI's Sora 2 API with prompt/reference payloads.
2. Replace `InMemoryFrameJobQueue` with BullMQ + Redis (already dependency ready) for distributed workers.
3. Expand `FrameGenerationProcessor` to poll Sora task status and download rendered assets before FFmpeg assembly.

## Deployment Notes
- `.env` variables: `PORT`, `FRONTEND_ORIGIN`, `DATABASE_URL`, `SORA_API_KEY`, `SORA_BASE_URL`.
- Docker composition should include backend, frontend, PostgreSQL, Redis, and shared volume for asset storage.
- CI steps: build contracts → lint/test backend/frontend → package Docker images.
