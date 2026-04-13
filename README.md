# Cardano Go PBL

Learn to build on Cardano using Go. Ten modules covering wallet creation, transaction building, chain indexing, and node communication — with on-chain credentials via Andamio.

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # astro check + tsc
npm run build      # production build
```

Requires `.env` with `ANDAMIO_API_KEY` and `PUBLIC_ANDAMIO_NETWORK` (see `.env.example`).

## Course Content

All content lives in `content/cardano-go-pbl/`. Lessons are the authoring format; `andamio course import-all` pushes compiled content to the Andamio API.

## Stack

- **Astro 6** hybrid app with React 19 islands
- **Mesh SDK** for Cardano wallet integration
- **Andamio API** for course data, credentials, and transactions
- **Tailwind CSS v4** with custom theme tokens

## Three Uses

1. **Deployed web app** — lessons prerendered, assignments on-chain
2. **Agent harness** — `/learn` in Claude Code for AI-guided instruction
3. **Open-source template** — fork it, issue your own credentials

## Credits

Catalyst-funded. Built by Gimbalabs and Blink Labs.
