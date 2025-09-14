import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { newsletterSchema } from "../lib/schemas";

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
    const parsed = newsletterSchema.safeParse({ email: args.email, source: args.source });
    if (!parsed.success) {
      throw new Error(parsed.error.issues[0]?.message ?? "Invalid input");
    }
    const normalized = parsed.data.email.toLowerCase();

    const existing = await ctx.db
      .query("newsletterSignups")
      .withIndex("by_email", (q) => q.eq("email", normalized))
      .unique();

    if (existing) {
      return { created: false, _id: existing._id };
    }

    const id = await ctx.db.insert("newsletterSignups", { email: normalized, source: parsed.data.source });

    return { created: true, _id: id };
  },
});


