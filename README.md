# MCP.BO — MCP Servers Directory

The definitive hub for Model Context Protocol servers in the battle for AI sovereignty.

MCP.BO is a polished, modern directory for exploring Model Context Protocol (MCP) servers. It ships with a real backend powered by Convex, elegant UI components, search and pagination, and a tiny data ingestion pipeline you can rerun to keep the catalog fresh.


## Features

- Modern Next.js app with App Router and React 19
- Tailwind CSS + shadcn/ui component system and dark mode
- Convex backend with typed schema, queries, mutations
- Infinite scroll pagination and instant search
- "Humanity vs AI" live voting widget (session-scoped)
- Newsletter subscribe mutation with Zod validation
- Parser pipeline to build the MCP catalog into JSONL and import to Convex


## Tech Stack

- Next.js 15, React 19, TypeScript 5
- Tailwind CSS, shadcn/ui, Lucide icons
- Convex for database, real-time queries, and mutations
- convex-helpers for simple session handling
- Bun-powered parser for catalog generation (JSONL)


## Quickstart

1) Install dependencies

```bash
pnpm install
```

2) Start Convex (prints your dev URL)

```bash
pnpm dev:convex
```

3) In another terminal, start the web app

```bash
pnpm dev:web
```

4) Configure Convex URL for the web app (if not auto-injected)

Create `.env.local` and set the value printed by the previous `convex dev` run:

```bash
echo "NEXT_PUBLIC_CONVEX_URL=<your-convex-dev-url>" >> .env.local
```


## Data: Build and Import the Catalog

This repo includes a tiny parser that converts a source list of MCP servers into `JSONL`, plus an optional icon fetcher.

Prereqs: install Bun (`brew install oven-sh/bun/bun` or see bun.sh) and ensure Convex is running (`pnpm dev:convex`).

From `parser/`:

```bash
cd parser
# Generate JSONL (input path can be swapped as needed)
bun run.ts --input input/modelcontextprotocol-servers-README.md --output output/catalogItems.jsonl

# Optionally fetch icons (writes to parser/output/icons)
bun fetch-icons.ts --input output/catalogItems.jsonl --outDir output/icons
```

Back at the project root, import into Convex:

```bash
npx convex import --table catalogItems --replace parser/output/catalogItems.jsonl
```

Tip: Re-run the parser and import any time the source list changes.


## Scripts

Root package:

- dev:web — Next.js dev server (Turbopack)
- dev:convex — Convex dev server
- build — Next.js production build
- start — Next.js start
- lint — Lint the app

Parser package (`parser/`):

- start — run the parser to produce `output/catalogItems.jsonl`
- icons — fetch icons into `output/icons`
- lint, lint:fix — lint the parser


## App Structure (selected)

- `app/`
  - `page.tsx`: Landing (hero, featured, analytics, Humanity vs AI widget)
  - `servers/page.tsx`: Convex-backed catalog with search + infinite scroll
  - `models/`: legacy/demo UI using mock data and per-item detail pages
- `components/`
  - `catalog-item-card.tsx`, `search-filters.tsx`, `server-card.tsx`, `human-ai-battle.tsx`, `ui/*`
  - `convex-client-provider.tsx`: wires `ConvexProvider` and session support
- `convex/`
  - `schema.ts`: tables for `catalogItems`, `newsletterSignups`, `battles`, `sessionVotes`
  - `catalog.ts`: list/search/stats queries with indexes and search index
  - `battle.ts`: session-scoped voting and aggregate tracking
  - `newsletter.ts`: newsletter subscribe mutation with validation
- `parser/`
  - `run.ts`, `lib/`: parse sources into JSONL; `fetch-icons.ts` for icons


## Data Model (Convex)

- `catalogItems`: name, category (`official_integrations` | `community_servers`), orderInSection, description, homepage, icons[]
  - Indexes: by_category_and_order, by_name, by_name_and_order
  - Search index: `search_name` (filterable by category)
- `newsletterSignups`: email, source (index by_email)
- `battles`: slug, humanityPercent (index by_slug)
- `sessionVotes`: sessionId, slug, lastChoice (index by_session_and_slug)


## Environment

- `NEXT_PUBLIC_CONVEX_URL`: Convex deployment URL (printed by `pnpm dev:convex`). Add to `.env.local` if not auto-injected.


## Development Notes

- The landing page highlights featured items and displays a floating "Humanity vs AI" widget that persists votes per session.
- The `/servers` page uses Convex `usePaginatedQuery` for infinite scroll and `useQuery` against a search index for instant results.
- A legacy `/models` section demonstrates UI patterns with a static dataset; the Convex-backed `/servers` page is the primary directory.


## Roadmap

- Server detail pages backed by Convex
- Full-text search across descriptions
- Icon surfacing in cards
- Deploy guides (Vercel + Convex Cloud)


## Contributing

PRs welcome. Please run `pnpm lint` and ensure the app builds locally (`pnpm build`).


## License

MIT License. See `LICENSE` for details.
