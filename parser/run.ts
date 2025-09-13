#!/usr/bin/env -S node --enable-source-maps
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { parseReadmeToItems } from "./lib/parser";
import { CatalogItemSchema } from "./lib/schema";

type CliArgs = {
  input: string;
  output: string;
  startAnchor?: string;
  strict?: boolean;
  log?: string;
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
  const input = (args.input as string) ?? "parser/input/modelcontextprotocol-servers-README.md";
  const output = (args.output as string) ?? "parser/output/catalogItems.jsonl";
  const startAnchor = (args["start-anchor"] as string) ?? undefined;
  const strict = Boolean(args.strict);
  const log = (args.log as string) ?? "parser/output/parse.log";
  return { input, output, startAnchor, strict, log };
}

function ensureDirForFile(filePath: string) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
}

function main() {
  const { input, output, startAnchor, strict, log } = parseArgs(process.argv);
  ensureDirForFile(output);
  ensureDirForFile(log);

  const logs: string[] = [];
  const { items } = parseReadmeToItems({ inputPath: input, startAnchor });

  const out = fs.createWriteStream(output, { encoding: "utf8" });
  let ok = 0;
  let failed = 0;
  for (const item of items) {
    try {
      const valid = CatalogItemSchema.parse(item);
      out.write(JSON.stringify(valid) + "\n");
      ok += 1;
    } catch (err) {
      failed += 1;
      logs.push(`[VALIDATION] Failed for ${item.idempotentKey}: ${(err as Error).message}`);
      if (strict) {
        throw err;
      }
    }
  }
  out.end();
  logs.push(`[STATS] wrote=${ok} failed=${failed}`);
  fs.writeFileSync(log, logs.join("\n") + "\n", "utf8");
  console.log(`Done. wrote=${ok} failed=${failed}. Output: ${output}`);
}

main();



