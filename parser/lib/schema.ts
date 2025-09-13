import { z } from "zod";

export const CatalogCategoryEnum = z.enum([
  "official_integrations",
  "community_servers",
]);

export type CatalogCategory = z.infer<typeof CatalogCategoryEnum>;

export const CatalogItemSchema = z.object({
  idempotentKey: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  kind: z.literal("server"),
  category: CatalogCategoryEnum,
  isOfficial: z.boolean(),
  primaryUrl: z.string().url().nullable(),
  repoUrl: z.string().url().nullable().optional(),
  iconUrl: z.string().url().nullable().optional(),
  icons: z.array(z.string().url()).optional(),
  description: z.string().min(1),
  tags: z.array(z.string()).optional(),
  transports: z.array(z.string()).optional(),
  language: z.string().nullable().optional(),
  orderInSection: z.number().int().min(1),
  source: z.object({
    origin: z.literal("mcp-servers-readme"),
    path: z.string().min(1),
    snapshotHash: z.string().min(1),
  }),
  rawMd: z.string().min(1),
  lastSeenAt: z.string().min(1),
});

export type CatalogItem = z.infer<typeof CatalogItemSchema>;

export function validateCatalogItem(item: unknown): CatalogItem {
  return CatalogItemSchema.parse(item);
}


