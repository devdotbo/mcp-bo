import { z } from "zod";

export const CatalogCategoryEnum = z.enum([
  "official_integrations",
  "community_servers",
]);

export type CatalogCategory = z.infer<typeof CatalogCategoryEnum>;

// Simplified catalog item schema for JSONL output
// Shape example:
// {"name":"Convex","category":"official_integrations","orderInSection":96,"description":"Introspect and query your apps deployed to Convex.","homepage":"https://stack.convex.dev/convex-mcp-server","icons":["https://www.convex.dev/favicon.ico"]}
export const CatalogItemSchema = z.object({
  name: z.string().min(1),
  category: CatalogCategoryEnum,
  orderInSection: z.number().int().min(1),
  description: z.string().min(1),
  homepage: z.string().url(),
  icons: z.array(z.string().url()).optional(),
});

export type CatalogItem = z.infer<typeof CatalogItemSchema>;

export function validateCatalogItem(item: unknown): CatalogItem {
  return CatalogItemSchema.parse(item);
}



