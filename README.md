# FiroBlocks UI

React frontend for [FiroBlocks](https://firoblocks.app) — a block explorer for the [Firo](https://firo.org) network. Built with Vite and TypeScript.

The public API is available at api.firoblocks.app/v1 — as seen in `.env.example` no local node required.

- [Swagger Docs](https://api.firoblocks.app/v1/docs)

## Requirements

- Node.js 24
- pnpm

## Setup

```bash
cp .env.example .env
pnpm install --frozen-lockfile
pnpm dev
```

## Environment Variables

| Variable                   | Description                    |
| -------------------------- | ------------------------------ |
| `VITE_API_URL`             | FiroBlocks API base URL        |
| `VITE_MAINTENANCE_PLANNED` | Enable maintenance mode banner |
| `VITE_LOCAL_API`           | Use local API for development  |

## Community

- Chat: [#general:nexusocean.org](https://matrix.to/#/#general:nexusocean.org)
- Matrix client: [element.nexusocean.org](https://element.nexusocean.org)

## License

[Mozilla Public License 2.0](./LICENSE)
