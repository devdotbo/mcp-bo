import { query } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

// Category literal must match schema validators
const categoryValidator = v.union(
  v.literal("official_integrations"),
  v.literal("community_servers"),
);

export const listByCategory = query({
  args: {
    category: categoryValidator,
    paginationOpts: paginationOptsValidator,
  },
  returns: v.object({
    page: v.array(
      v.object({
        _id: v.id("catalogItems"),
        _creationTime: v.number(),
        name: v.string(),
        category: categoryValidator,
        orderInSection: v.number(),
        description: v.string(),
        homepage: v.string(),
        icons: v.optional(v.array(v.string())),
      }),
    ),
    isDone: v.boolean(),
    continueCursor: v.union(v.string(), v.null()),
  }),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("catalogItems")
      .withIndex("by_category_and_order", (q) =>
        q.eq("category", args.category),
      )
      .order("asc")
      .paginate(args.paginationOpts);
  },
});

export const listByName = query({
  args: {
    name: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  returns: v.object({
    page: v.array(
      v.object({
        _id: v.id("catalogItems"),
        _creationTime: v.number(),
        name: v.string(),
        category: categoryValidator,
        orderInSection: v.number(),
        description: v.string(),
        homepage: v.string(),
        icons: v.optional(v.array(v.string())),
      }),
    ),
    isDone: v.boolean(),
    continueCursor: v.union(v.string(), v.null()),
  }),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("catalogItems")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .order("asc")
      .paginate(args.paginationOpts);
  },
});

export const searchByName = query({
  args: {
    queryText: v.string(),
    category: v.optional(categoryValidator),
    limit: v.number(),
  },
  returns: v.array(
    v.object({
      _id: v.id("catalogItems"),
      _creationTime: v.number(),
      name: v.string(),
      category: categoryValidator,
      orderInSection: v.number(),
      description: v.string(),
      homepage: v.string(),
      icons: v.optional(v.array(v.string())),
    }),
  ),
  handler: async (ctx, args) => {
    const { queryText, category, limit } = args;

    const q = ctx.db
      .query("catalogItems")
      .withSearchIndex("search_name", (s) => {
        const scoped = s.search("name", queryText);
        return category ? scoped.eq("category", category) : scoped;
      });

    return await q.take(limit);
  },
});


