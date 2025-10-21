This is a [Next.js](https://nextjs.org)

# Sora 2 Controller

Sora 2 Controller is a full-stack platform that automates long-form Sora 2 video generation by splitting prompts into 10-second segments, attaching reference imagery, and streaming frame-by-frame progress to operators.

## [main project](https://github.com/NirussVn0/sora-2-controller)

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm 9+

### Install dependencies
```bash
pnpm install
```

### Build shared contracts
```bash
pnpm --filter @sora/controller-contracts build
```
### Frontend
```bash
# dev server
pnpm --filter frontend dev

# environment
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
NEXT_PUBLIC_WS_BASE_URL=http://localhost:4000
```

### Production Build
```bash
pnpm build
```

This runs:
- `pnpm --filter @sora/controller-contracts build`
- `pnpm --filter backend build`
- `pnpm --filter frontend build`
# sora-2-controller-page
# sora-2-controller-page
