import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Convex schema for catalog items parsed from parser/output/catalogItems.jsonl
// Mirrors parser/lib/schema.ts (Zod): name, category, orderInSection, description, homepage, icons?

export default defineSchema({
  catalogItems: defineTable({
    name: v.string(),
    category: v.union(
      v.literal("official_integrations"),
      v.literal("community_servers"),
    ),
    orderInSection: v.number(),
    description: v.string(),
    homepage: v.string(),
    icons: v.optional(v.array(v.string())),
  })
    // Helpful indexes:
    // - by_category_and_order: for listing per section with a stable order
    // - by_name: for fast lookup/search by exact name
    .index("by_category_and_order", ["category", "orderInSection"]) 
    .index("by_name", ["name"]),
});


