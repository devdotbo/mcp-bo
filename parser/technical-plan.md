### MCP Servers README → Convex Catalog: Technical Plan

This plan describes how to parse the attached README (`parser/input/modelcontextprotocol-servers-README.md`) starting at the header line `## 🤝 Third-Party Servers`, transform all subsequent sections into a normalized dataset, and import that dataset into Convex for use in the interactive front‑end.

---

### 1) Goals and non‑goals
- **Goals**:
  - Parse everything after `## 🤝 Third-Party Servers` into a structured dataset.
  - Create a canonical, stable item shape suitable for Convex and future enrichment.
  - Output as JSON Lines (JSONL) to enable safe, large, and incremental imports into Convex.
  - Provide a repeatable CLI pipeline with validation, logging, and idempotent keys.
- **Non‑goals (initial phase)**:
  - Live crawling of external URLs (stars, last commit). This can be added later as enrichment.
  - Fuzzy merging across multiple sources. For now the README is the only source of truth.

---

### 2) Source of truth and scope
- **Input file**: `parser/input/modelcontextprotocol-servers-README.md`
- **Start anchor**: First line matching `## 🤝 Third-Party Servers`
- **Scope**: All content from that header to end of file, including:
  - `### 🎖️ Official Integrations` (kind = server, official)
  - `### 🌎 Community Servers` (kind = server, community)
  - `## 📚 Frameworks` with subgroups (For servers / For clients) (kind = framework)
  - `## 📚 Resources` (kind = resource)
- Ignore any content before `## 🤝 Third-Party Servers`.

---

### 3) Output format: JSON Lines (JSONL)
- Each line is one item (server/framework/resource).
- Advantages vs CSV/JSON array:
  - Handles nested optional fields gracefully (links, icons, tags).
  - Avoids array size limits (8 MiB) for Convex JSON import.
  - Streamable and supports partial diffs.
- File path (proposed): `parser/out/catalogItems.jsonl`

---

### 4) Canonical item schema (one JSON object per line)
- Mandatory fields:
  - `idempotentKey` (string): Stable identifier (see §7). Suggested: `${category}:${slug}`.
  - `name` (string): Display name from bolded link text.
  - `slug` (string): Kebab‑case unique slug derived from `name` (deduped if necessary).
  - `kind` ("server" | "framework" | "resource"): High‑level type.
  - `category` ("official_integrations" | "community_servers" | "frameworks" | "resources"): Top‑level grouping.
  - `isOfficial` (boolean): True only for Official Integrations.
  - `primaryUrl` (string | null): URL from the bold title link.
  - `description` (string): Full textual description for the item.
  - `orderInSection` (number): 1‑based order preserving README list order within its subsection.
  - `source` (object): `{ origin: "mcp-servers-readme", path: string, snapshotHash: string }`
  - `rawMd` (string): Original markdown block for audit/repro.
  - `lastSeenAt` (string, ISO datetime): Snapshot time.
- Optional/enrichment fields:
  - `subgroup` (string | null): For Frameworks: "server" | "client"; else null.
  - `repoUrl` (string | null): If `primaryUrl` is a repo, or first repo‑like link within the item.
  - `iconUrl` (string | null): First `<img ... src>` if present.
  - `icons` (array<string>): All icon URLs found.
  - `tags` (array<string>): Lightweight keywords, optional.
  - `transports` (array<string>): e.g., ["STDIO", "SSE", "Streamable HTTP"], best‑effort.
  - `language` (string | null): e.g., "TypeScript", "Python", best‑effort.

Example (illustrative only):
```json
{
  "idempotentKey": "official_integrations:kagi-search",
  "name": "Kagi Search",
  "slug": "kagi-search",
  "kind": "server",
  "category": "official_integrations",
  "subgroup": null,
  "isOfficial": true,
  "primaryUrl": "https://github.com/kagisearch/kagimcp",
  "repoUrl": "https://github.com/kagisearch/kagimcp",
  "iconUrl": "https://kagi.com/favicon.ico",
  "icons": ["https://kagi.com/favicon.ico"],
  "description": "Search the web using Kagi's search API",
  "tags": ["search", "web"],
  "transports": ["STDIO"],
  "language": "TypeScript",
  "orderInSection": 42,
  "source": {
    "origin": "mcp-servers-readme",
    "path": "parser/input/modelcontextprotocol-servers-README.md",
    "snapshotHash": "sha256:..."
  },
  "rawMd": "- <img ...> **[Kagi Search](https://github.com/kagisearch/kagimcp)** - Search the web ...",
  "lastSeenAt": "2025-09-13T12:00:00.000Z"
}
```

---

### 5) Taxonomy mapping
- `Official Integrations` → `kind=server`, `category=official_integrations`, `isOfficial=true`
- `Community Servers` → `kind=server`, `category=community_servers`, `isOfficial=false`
- `Frameworks` → `kind=framework`, `category=frameworks`, `subgroup` from subheading ("For servers" | "For clients") if present
- `Resources` → `kind=resource`, `category=resources`, `isOfficial=false`

---

### 6) Parsing approach (one pass, resilient)
1) **Load** the input file and compute a `snapshotHash` (sha256) and `lastSeenAt` (now).
2) **Slice** content starting at the first `## 🤝 Third-Party Servers` header through end‑of‑file.
3) **Sectioning**:
   - Split into blocks by top‑level `##` headers within the sliced area to detect `Frameworks` and `Resources`.
   - Within each block, detect `###` (and if used, `####`) subheadings for categories and subgroups.
4) **List extraction**:
   - Treat each top‑level `- ` bullet as an item; include wrapped lines until the next bullet or header at the same or higher level.
   - Preserve original `rawMd` for each item.
5) **Field extraction heuristics**:
   - `name` and `primaryUrl`: First bold link `**[Name](url)**` within the item.
   - `iconUrl`/`icons`: All `<img ... src="...">` tags; `iconUrl` = first entry.
   - `description`: Text following the first ` - ` (dash‑space) separator after the name/link; include subsequent wrapped lines (trim leading `-` continuation markers if present). Normalize multiple spaces and unicode dashes.
   - `repoUrl`: If `primaryUrl` host matches a code host (github/gitlab/bitbucket), set as repo; else scan remaining links for a repo‑like URL.
   - `transports` & `language`: Case‑insensitive keyword scan within `rawMd` and `description` (e.g., "STDIO", "SSE", "Streamable HTTP", "TypeScript", "Python", "Go"). Best‑effort only.
6) **Categorization**: Apply mapping from §5 based on the current section/subsection context.
7) **Normalization**:
   - `slug`: Kebab‑case of `name` (strip accents/punctuation). If collision within same `category`, suffix `-2`, `-3`, ...
   - `idempotentKey`: `${category}:${slug}`.
   - Trim URLs, ensure `https://` scheme where missing, leave as‑is if non‑HTTP.
8) **Ordering**: Maintain `orderInSection` as encountered per subsection list order, restarting count within each subsection.
9) **Validation**: Validate each item against a local schema (see §8) before writing.
10) **Write output**: Stream items to `parser/out/catalogItems.jsonl` (one line per item).

---

### 7) Idempotency, updates, and deprecations
- `slug` must remain stable across runs to avoid UI churn.
- `idempotentKey = category:slug` ensures uniqueness across categories in case of duplicate names.
- **Refresh policy**:
  - Default approach: `--replace` the entire `catalogItems` table during import to keep data fully in sync.
  - Optionally, for future partial updates, support `--append` with conflict checks, but initial implementation favors atomic replace.
- **Disappearing items**: With `--replace`, removed items vanish automatically. If soft deletion is preferred, write `deprecated: true` tags (not required in v1).

---

### 8) Validation strategy
- Use a JSON schema or Zod schema that mirrors §4 (types and required fields).
- **Strictness**:
  - Required: `name`, `slug`, `kind`, `category`, `isOfficial`, `description`, `orderInSection`, `source`, `rawMd`, `lastSeenAt`.
  - Optional: `primaryUrl`, `repoUrl`, `iconUrl`, `icons`, `tags`, `transports`, `language`, `subgroup`.
- On validation failure:
  - Log the failure with item context and continue.
  - Emit a minimal placeholder item with `name` set to the first 60 chars of `rawMd` if extraction of `name` failed (rare), mark a `tags` entry `parse_error` for visibility.

---

### 9) CLI interface and files
- **Command (proposed)**:
  - `pnpm tsx parser/run.ts --input parser/input/modelcontextprotocol-servers-README.md --output parser/out/catalogItems.jsonl --format jsonl`
- **Options**:
  - `--start-anchor "## 🤝 Third-Party Servers"` (default set to this value)
  - `--strict` (fail on first validation error)
  - `--log parser/out/parse.log`
- **Outputs**:
  - `parser/out/catalogItems.jsonl` (main dataset)
  - `parser/out/parse.log` (human‑readable logs: counts, warnings, parse errors)

---

### 10) Convex data model (high‑level)
- Single table `catalogItems` with a discriminated union:
  - Discriminator: `kind` ("server" | "framework" | "resource")
  - Common fields include those in §4 (Convex validators mirror types; `lastSeenAt` as `v.string()`)
- **Indexes**:
  - `by_slug` → ["slug"] (unique)
  - `by_kind` → ["kind"]
  - `by_category_and_subgroup` → ["category", "subgroup"]
  - `by_is_official` → ["isOfficial"]
  - `by_lastSeenAt` → ["lastSeenAt"] (optional for auditing)
- **Search index** (optional but recommended): over `name` and `description` for free‑text UI search.
- Optional tables:
  - `sources` (store snapshot content, hash, time)
  - `imports` (log each import run: counts, duration, replace/append), both optional in v1.

---

### 11) Import procedure (per Convex docs)
- Initial seed (dev):
  - `npx convex import --table catalogItems --replace /abs/path/to/parser/out/catalogItems.jsonl`
- Production or preview:
  - Add `--prod` or `--preview-name <branch>` as needed.
- Reference: `https://docs.convex.dev/database/import-export/import`

---

### 12) Testing & QA plan
- **Unit tests** (parser):
  - Items with: icon + bold link + description (most common case).
  - Items with multiple icons, multiple links; ensure `iconUrl` selection and link extraction.
  - Items whose `primaryUrl` is not a repo; ensure `repoUrl` fallback detection.
  - Wrapped descriptions spanning multiple lines.
  - Unicode/em dashes; normalization.
  - Duplicated names in same category; `slug` de‑duplication.
- **Integration tests**:
  - Run parser against the real input file and assert non‑empty output, stable counts by subsection, and required fields present.
- **Snapshot**:
  - Keep a small golden JSONL fixture for selected categories to detect regressions (schema/format consistency).

---

### 13) Performance & reliability
- The parser is I/O bound; single‑threaded pass is sufficient.
- Stream writing to JSONL to avoid buffering the entire dataset.
- Use robust Markdown tokenization or fallback regex with safeguards.
- Time budget: should complete within seconds locally.

---

### 14) Observability & logging
- Emit counts per category/subgroup and total items.
- Log number of parse warnings (missing icons, ambiguous links, etc.).
- On errors, include the first line of `rawMd` for quick triage.

---

### 15) Risks & mitigations
- **Markdown format drift**: Store `rawMd`; keep heuristics tolerant; add targeted unit tests for new patterns.
- **Duplicate names**: Namespace idempotency by `category`; de‑dupe slugs; emit warnings.
- **8 MiB JSON limit**: Avoided via JSONL.
- **Import safety**: Prefer `--replace` for atomic swaps; `--append` only with caution.

---

### 16) Roadmap (implementation steps)
1) Scaffold parser CLI (no runtime changes to app yet). Output to JSONL.
2) Implement section slicing and bullet aggregation.
3) Implement field extraction heuristics (name/url/icon/desc/repo).
4) Add normalization (slug/idempotentKey) and ordering.
5) Add validation (Zod) and logging.
6) Run end‑to‑end on input file; inspect JSONL; iterate heuristics.
7) Define Convex `catalogItems` schema and indexes; deploy.
8) Import dataset into dev; verify UI filters/search (stub queries if needed).
9) Wire refresh job (manual step initially) and document import commands.

---

### 17) Acceptance criteria
- JSONL produced at `parser/out/catalogItems.jsonl` with >0 items and required fields.
- No validation errors at default strictness; warnings acceptable for optional fields.
- Convex table `catalogItems` created with specified indexes; import `--replace` succeeds.
- Front‑end can query by `category`, `subgroup`, `isOfficial`, and search by name/description.

---

### 18) Future enhancements
- Enrich items with GitHub stars, last commit date, license, primary language.
- Add deduplication across homonymous items (cross‑source merges).
- Add incremental diffing to avoid full replace when unnecessary.
- Add lightweight full‑text search index if not using Convex search.

---

### 19) Operational runbook (v1)
- To (re)generate dataset:
  - `pnpm tsx parser/run.ts --input parser/input/modelcontextprotocol-servers-README.md --output parser/out/catalogItems.jsonl`
- To import into Convex dev:
  - `npx convex import --table catalogItems --replace /abs/path/to/parser/out/catalogItems.jsonl`
- To import into production:
  - `npx convex import --prod --table catalogItems --replace /abs/path/to/parser/out/catalogItems.jsonl`

---

### 20) Notes on data quality
- Keep `rawMd` to unblock future re‑parsing without re‑downloading the README.
- Preserve `orderInSection` to allow UI to offer an "as‑curated" sort.
- Keep `source.snapshotHash` to tie UI builds to specific content versions.
