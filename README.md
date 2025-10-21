# Sora 2 Controller

Sora 2 Controller is a full-stack platform that automates long-form Sora 2 video generation by splitting prompts into 10-second segments, attaching reference imagery, and streaming frame-by-frame progress to operators.


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

### Backend
```bash
# development
pnpm --filter backend start:dev

# run tests
pnpm --filter backend test
```

Environment variables:
```
PORT=4000
FRONTEND_ORIGIN=http://localhost:3000
DATABASE_URL=postgresql://user:pass@localhost:5432/sora
SORA_API_KEY=... # when integrating with the real API
SORA_BASE_URL=https://api.openai.com/v1
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

### Testing & Quality
- Backend unit tests: `pnpm --filter backend test`
- Frontend lint/type check: `pnpm --filter frontend lint`

## Next Steps
- Replace in-memory repositories/queues with Prisma + BullMQ + Redis.
- Implement real Sora 2 API adapter and credential management.
- Harden job cancellation/retry flows and add auditing.

## Logging
[Check out our logging guidelines](docs/CHANGELOG.md)
## Contributing
We welcome contributions from the community! Please see our [contributing guidelines](docs/CONTRIBUTING.md) for more details.
## License
Sora Controller is licensed under the [MIT License](LICENSE).