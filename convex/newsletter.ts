import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const subscribe = mutation({
  args: {
    email: v.string(),
    source: v.optional(v.string()),
  },
  returns: v.object({
    created: v.boolean(),
    _id: v.id("newsletterSignups"),
  }),
  handler: async (ctx, args) => {
    const normalized = args.email.trim().toLowerCase();

    // Minimal server-side validation
    if (!normalized.includes("@") || normalized.startsWith("@") || normalized.endsWith("@")) {
      throw new Error("Invalid email address");
    }

    const existing = await ctx.db
      .query("newsletterSignups")
      .withIndex("by_email", (q) => q.eq("email", normalized))
      .unique();

    if (existing) {
      return { created: false, _id: existing._id };
    }

    const id = await ctx.db.insert("newsletterSignups", {
      email: normalized,
      source: args.source,
    });

    return { created: true, _id: id };
  },
});


