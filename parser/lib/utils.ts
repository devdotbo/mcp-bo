import crypto from "node:crypto";

export function computeSha256(content: string): string {
  const hash = crypto.createHash("sha256");
  hash.update(content);
  return `sha256:${hash.digest("hex")}`;
}

export function toKebabCase(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

export function ensureHttps(url: string): string {
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
}

export function isRepoHost(url: string): boolean {
  try {
    const u = new URL(url);
    return /^(github\.com|gitlab\.com|bitbucket\.org)$/i.test(u.hostname);
  } catch {
    return false;
  }
}

export function nowIso(): string {
  return new Date().toISOString();
}


