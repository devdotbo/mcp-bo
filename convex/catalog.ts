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
    const result = await ctx.db
      .query("catalogItems")
      .withIndex("by_category_and_order", (q) =>
        q.eq("category", args.category),
      )
      .order("asc")
      .paginate(args.paginationOpts);

    // Explicitly return only validated fields to avoid extra fields like `pageStatus`.
    return {
      page: result.page,
      isDone: result.isDone,
      continueCursor: result.continueCursor,
    };
  },
});

// List all catalog items regardless of category in a stable order
export const listAll = query({
  args: {
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
    // Use the by_name_and_order index to provide a deterministic order across categories
    const result = await ctx.db
      .query("catalogItems")
      .withIndex("by_name_and_order")
      .order("asc")
      .paginate(args.paginationOpts);

    return {
      page: result.page,
      isDone: result.isDone,
      continueCursor: result.continueCursor,
    };
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
    const result = await ctx.db
      .query("catalogItems")
      .withIndex("by_name_and_order", (q) => q.eq("name", args.name))
      .order("asc")
      .paginate(args.paginationOpts);

    // Explicitly return only validated fields to avoid extra fields like `pageStatus`.
    return {
      page: result.page,
      isDone: result.isDone,
      continueCursor: result.continueCursor,
    };
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

    const results = await q.take(limit);
    // Ensure deterministic ordering for UI by orderInSection
    return results.sort((a, b) => a.orderInSection - b.orderInSection);
  },
});


export const stats = query({
  args: {},
  returns: v.object({
    totalCount: v.number(),
    officialCount: v.number(),
    communityCount: v.number(),
  }),
  handler: async (ctx) => {
    const countByCategory = async (
      category: "official_integrations" | "community_servers",
    ): Promise<number> => {
      let count = 0;
      const q = ctx.db
        .query("catalogItems")
        .withIndex("by_category_and_order", (q) => q.eq("category", category));
      for await (const _ of q) {
        count += 1;
      }
      return count;
    };

    const [officialCount, communityCount] = await Promise.all([
      countByCategory("official_integrations"),
      countByCategory("community_servers"),
    ]);

    const totalCount = officialCount + communityCount;

    return { totalCount, officialCount, communityCount };
  },
});


