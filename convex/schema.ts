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
    // - by_name_and_order: for listing by name with stable orderInSection
    .index("by_category_and_order", ["category", "orderInSection"]) 
    .index("by_name", ["name"]) 
    .index("by_name_and_order", ["name", "orderInSection"]) 
    .searchIndex("search_name", { searchField: "name", filterFields: ["category"] }),

  // Newsletter signups captured from the UI
  newsletterSignups: defineTable({
    email: v.string(),
    source: v.optional(v.string()),
  }).index("by_email", ["email"]),

  // Single battle state document identified by slug (e.g., "human_vs_ai")
  battles: defineTable({
    slug: v.string(),
    humanityPercent: v.number(),
  }).index("by_slug", ["slug"]),

  // Track last choice per session and battle slug
  sessionVotes: defineTable({
    sessionId: v.string(),
    slug: v.string(),
    lastChoice: v.union(v.literal("human"), v.literal("ai")),
  }).index("by_session_and_slug", ["sessionId", "slug"]),
});


