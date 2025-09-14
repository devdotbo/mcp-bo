#!/usr/bin/env -S node --enable-source-maps
import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import readline from "node:readline";
import { CatalogItemSchema } from "./lib/schema";

type CliArgs = {
  input: string;
  outDir: string;
  limit?: number;
  overwrite?: boolean;
};

function parseArgs(argv: string[]): CliArgs {
  const args: Record<string, string | boolean> = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        args[key] = next;
        i += 1;
      } else {
        args[key] = true;
      }
    }
  }
  const input = (args.input as string) ?? "output/catalogItems.jsonl";
  const outDir = (args.outDir as string) ?? "output/icons";
  const limit = args.limit ? Number(args.limit) : undefined;
  const overwrite = Boolean(args.overwrite);
  return { input, outDir, limit, overwrite };
}

function ensureDir(dirPath: string) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function guessExtensionFromUrl(urlStr: string): string | undefined {
  try {
    const u = new URL(urlStr);
    const ext = path.extname(u.pathname);
    if (ext) return ext;
    return undefined;
  } catch {
    return undefined;
  }
}

function mapContentTypeToExt(contentType?: string): string | undefined {
  if (!contentType) return undefined;
  const type = contentType.split(";")[0].trim().toLowerCase();
  switch (type) {
    case "image/png":
      return ".png";
    case "image/jpeg":
    case "image/jpg":
      return ".jpg";
    case "image/gif":
      return ".gif";
    case "image/svg+xml":
      return ".svg";
    case "image/webp":
      return ".webp";
    case "image/x-icon":
    case "image/vnd.microsoft.icon":
      return ".ico";
    case "image/avif":
      return ".avif";
    default:
      return undefined;
  }
}

function toRawGitHubUrlIfNeeded(urlStr: string): string {
  try {
    const u = new URL(urlStr);
    if (u.hostname === "github.com") {
      const parts = u.pathname.split("/").filter(Boolean);
      const blobIndex = parts.indexOf("blob");
      if (blobIndex !== -1 && parts.length >= blobIndex + 2) {
        const [owner, repo] = parts;
        const branch = parts[blobIndex + 1];
        const filePath = parts.slice(blobIndex + 2).join("/");
        return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
      }
    }
  } catch (err) {
    console.error("Failed to convert GitHub URL to raw", err)
  }
  return urlStr;
}

async function fetchAndSave(urlStr: string, destPath: string): Promise<{ savedPath: string; contentType?: string }> {
  const res = await fetch(urlStr);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }
  const contentType = res.headers.get("content-type") ?? undefined;
  const buf = Buffer.from(await res.arrayBuffer());
  await fsPromises.writeFile(destPath, buf);
  return { savedPath: destPath, contentType };
}

async function main() {
  const { input, outDir, limit, overwrite } = parseArgs(process.argv);
  ensureDir(outDir);

  const stream = fs.createReadStream(input, { encoding: "utf8" });
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  let processed = 0;
  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const parsed = JSON.parse(line);
      const item = CatalogItemSchema.parse(parsed);
      const iconUrlRaw = item.icons?.[0];
      if (!iconUrlRaw) {
        continue;
      }
      const iconUrl = toRawGitHubUrlIfNeeded(iconUrlRaw);
      let ext = guessExtensionFromUrl(iconUrl);
      const filenameBase = String(item.orderInSection);
      const destBasePathNoExt = path.join(outDir, filenameBase);
      let destPath = ext ? destBasePathNoExt + ext : destBasePathNoExt;

      if (fs.existsSync(destPath) && !overwrite) {
        console.log(`Skip exists: ${path.basename(destPath)}`);
        processed += 1;
        if (limit && processed >= limit) break;
        continue;
      }

      if (ext) {
        await fetchAndSave(iconUrl, destPath);
      } else {
        const tmpPath = destBasePathNoExt + ".download";
        const { contentType } = await fetchAndSave(iconUrl, tmpPath);
        ext = mapContentTypeToExt(contentType) ?? ".bin";
        const finalPath = destBasePathNoExt + ext;
        await fsPromises.rename(tmpPath, finalPath);
        destPath = finalPath;
      }
      console.log(`Saved ${path.basename(destPath)} from ${iconUrlRaw}`);
      processed += 1;
      if (limit && processed >= limit) break;
    } catch (err) {
      console.error("Line skipped during icon fetch", err);
      continue;
    }
  }
  rl.close();
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});


