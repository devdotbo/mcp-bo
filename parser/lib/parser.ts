import fs from "node:fs";
import path from "node:path";
import { computeSha256, ensureHttps, isRepoHost, nowIso, toKebabCase } from "./utils";
import { CatalogItem, CatalogCategory, CatalogCategoryEnum } from "./schema";

export type ParseOptions = {
  inputPath: string;
  startAnchor?: string;
};

type Section = {
  category: CatalogCategory;
  isOfficial: boolean;
  title: string;
  rawItems: string[]; // one bullet block each
};

const DEFAULT_START_ANCHOR = "## 🤝 Third-Party Servers";

export function parseReadmeToItems(opts: ParseOptions): { items: CatalogItem[]; snapshotHash: string } {
  const startAnchor = opts.startAnchor ?? DEFAULT_START_ANCHOR;
  const content = fs.readFileSync(opts.inputPath, "utf8");
  const snapshotHash = computeSha256(content);

  const sliced = sliceForScope(content, startAnchor);
  const sections = extractSections(sliced);
  const lastSeenAt = nowIso();

  const items: CatalogItem[] = [];
  const slugCounters = new Map<string, number>(); // per category

  for (const section of sections) {
    let order = 0;
    for (const raw of section.rawItems) {
      order += 1;
      const extracted = extractFields(raw);
      const slugBase = toKebabCase(extracted.name || raw.slice(0, 60));
      const slugKey = `${section.category}:${slugBase}`;
      const nextCount = (slugCounters.get(slugKey) ?? 0) + 1;
      slugCounters.set(slugKey, nextCount);
      const slug = nextCount === 1 ? slugBase : `${slugBase}-${nextCount}`;

      const primaryUrl = extracted.primaryUrl ? ensureHttps(extracted.primaryUrl) : null;
      const repoUrl = extracted.repoUrl ? ensureHttps(extracted.repoUrl) : (primaryUrl && isRepoHost(primaryUrl) ? primaryUrl : null);

      const item: CatalogItem = {
        idempotentKey: `${section.category}:${slug}`,
        name: extracted.name || slug,
        slug,
        kind: "server",
        category: section.category,
        isOfficial: section.isOfficial,
        primaryUrl,
        repoUrl,
        iconUrl: extracted.icons.length > 0 ? ensureHttps(extracted.icons[0]) : null,
        icons: extracted.icons.map(ensureHttps),
        description: extracted.description || extracted.rawMd.replace(/\s+/g, " ").trim(),
        tags: extracted.tags,
        transports: extracted.transports,
        language: extracted.language,
        orderInSection: order,
        source: {
          origin: "mcp-servers-readme",
          path: opts.inputPath,
          snapshotHash,
        },
        rawMd: extracted.rawMd,
        lastSeenAt,
      };

      items.push(item);
    }
  }

  return { items, snapshotHash };
}

function sliceForScope(content: string, startAnchor: string): string {
  const startIdx = content.indexOf(startAnchor);
  if (startIdx === -1) return "";
  const afterStart = content.slice(startIdx);

  // Stop at the next top-level ## after Community Servers section.
  const stopMatch = afterStart.match(/\n##\s+/);
  if (!stopMatch) return afterStart;
  // We need to ensure we include the community section and stop at the NEXT ## beyond it. Simpler: return until the next top-level ## after our first one.
  // afterStart begins with our ## already, so find the second occurrence.
  const indices: number[] = [];
  let regex = /\n##\s+/g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(afterStart)) !== null) {
    indices.push(m.index);
    if (indices.length >= 2) break;
  }
  if (indices.length < 2) {
    return afterStart;
  }
  return afterStart.slice(0, indices[1]);
}

function extractSections(sliced: string): Section[] {
  const lines = sliced.split(/\r?\n/);
  const sections: Section[] = [];
  let current: Section | null = null;

  const isOfficialHeader = (line: string) => /^###\s+.*Official Integrations/i.test(line);
  const isCommunityHeader = (line: string) => /^###\s+.*Community Servers/i.test(line);

  let buffer: string[] = [];
  function flushBuffer() {
    if (!current) return;
    const text = buffer.join("\n").trim();
    if (!text) return;
    const items = collectTopLevelBullets(text);
    current.rawItems.push(...items);
    buffer = [];
  }

  for (const line of lines) {
    if (isOfficialHeader(line)) {
      flushBuffer();
      if (current) sections.push(current);
      current = { category: CatalogCategoryEnum.enum.official_integrations, isOfficial: true, title: line, rawItems: [] };
      continue;
    }
    if (isCommunityHeader(line)) {
      flushBuffer();
      if (current) sections.push(current);
      current = { category: CatalogCategoryEnum.enum.community_servers, isOfficial: false, title: line, rawItems: [] };
      continue;
    }
    if (current) {
      buffer.push(line);
    }
  }
  flushBuffer();
  if (current) sections.push(current);
  return sections;
}

function collectTopLevelBullets(text: string): string[] {
  const lines = text.split(/\r?\n/);
  const blocks: string[] = [];
  let current: string[] = [];
  const bulletRe = /^-\s+/;
  for (const line of lines) {
    if (bulletRe.test(line)) {
      if (current.length) {
        blocks.push(current.join("\n").trim());
        current = [];
      }
      current.push(line);
    } else if (/^#{2,3}\s+/.test(line)) {
      // new header ends collection
      break;
    } else {
      if (current.length) current.push(line);
    }
  }
  if (current.length) blocks.push(current.join("\n").trim());
  return blocks;
}

type Extracted = {
  name: string;
  primaryUrl: string | null;
  description: string;
  icons: string[];
  repoUrl: string | null;
  transports?: string[];
  language?: string | null;
  rawMd: string;
  tags?: string[];
};

function extractFields(rawBlock: string): Extracted {
  const rawMd = rawBlock.trim();
  // Name and primary URL from first bold link **[Name](url)**
  const boldLinkRe = /\*\*\s*\[([^\]]+)\]\(([^\)]+)\)\s*\*\*/;
  const mBold = rawMd.match(boldLinkRe);
  const name = mBold?.[1]?.trim() ?? "";
  const primaryUrl = mBold?.[2]?.trim() ?? null;

  // Icons
  const icons: string[] = [];
  const imgRe = /<img[^>]*src=["']([^"']+)["'][^>]*>/gi;
  let mImg: RegExpExecArray | null;
  while ((mImg = imgRe.exec(rawMd)) !== null) {
    icons.push(mImg[1]);
  }

  // Description: after first ' - ' following the name link line
  let description = "";
  const dashIdx = rawMd.indexOf(" - ");
  if (dashIdx !== -1) {
    description = rawMd.slice(dashIdx + 3).replace(/\n+/g, " ").replace(/\s+/g, " ").trim();
  } else {
    // fallback: remove bullet and link; take remainder
    description = rawMd.replace(/^-[\s\S]*?\*\*[\s\S]*?\*\*/, "").replace(/\s+/g, " ").trim();
  }

  // Repo URL: if primary is repo, use it, else first repo-looking link in text
  let repoUrl: string | null = null;
  if (primaryUrl && isRepoHost(primaryUrl)) repoUrl = primaryUrl;
  if (!repoUrl) {
    const linkRe = /\[([^\]]+)\]\(([^\)]+)\)/g;
    let m: RegExpExecArray | null;
    while ((m = linkRe.exec(rawMd)) !== null) {
      const url = m[2];
      if (isRepoHost(url)) {
        repoUrl = url;
        break;
      }
    }
  }

  // Best-effort transports & language
  const surface = `${rawMd} ${description}`.toLowerCase();
  const transports: string[] = [];
  ["stdio", "sse", "streamable http"].forEach((t) => {
    if (surface.includes(t)) transports.push(t.toUpperCase());
  });
  let language: string | null = null;
  if (surface.includes("typescript")) language = "TypeScript";
  else if (surface.includes("python")) language = "Python";
  else if (surface.includes("go ") || surface.includes(" golang") || surface.includes(" in go")) language = "Go";

  return { name, primaryUrl, description, icons, repoUrl, transports: transports.length ? transports : undefined, language, rawMd };
}



