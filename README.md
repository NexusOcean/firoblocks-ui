# FiroBlocks UI

React frontend for [FiroBlocks](https://firoblocks.app) — a block explorer for the [Firo](https://firo.org) network. Built with Vite and TypeScript.

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
- Matrix client: [elements.nexusocean.org](https://elements.nexusocean.org)

## License

[Mozilla Public License 2.0](./LICENSE)
