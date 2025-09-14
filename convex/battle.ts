import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

const DEFAULT_HUMANITY_PERCENT = 52.42;
const STEP_PERCENT = 0.1;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

export const getBattle = query({
  args: {
    slug: v.string(),
    sessionId: v.string(),
  },
  returns: v.object({
    humanityPercent: v.number(),
    lastChoice: v.union(v.literal("human"), v.literal("ai"), v.null()),
  }),
  handler: async (ctx, args) => {
    const battle = await ctx.db
      .query("battles")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    const sessionVote = await ctx.db
      .query("sessionVotes")
      .withIndex("by_session_and_slug", (q) =>
        q.eq("sessionId", args.sessionId).eq("slug", args.slug),
      )
      .unique();

    return {
      humanityPercent: battle ? battle.humanityPercent : DEFAULT_HUMANITY_PERCENT,
      lastChoice: sessionVote ? sessionVote.lastChoice : null,
    } as const;
  },
});

export const vote = mutation({
  args: {
    slug: v.string(),
    sessionId: v.string(),
    choice: v.union(v.literal("human"), v.literal("ai")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // If user tries to vote the same side again, ignore.
    const existingSessionVote = await ctx.db
      .query("sessionVotes")
      .withIndex("by_session_and_slug", (q) =>
        q.eq("sessionId", args.sessionId).eq("slug", args.slug),
      )
      .unique();

    if (existingSessionVote && existingSessionVote.lastChoice === args.choice) {
      return null;
    }

    // Load or create the battle document
    const existingBattle = await ctx.db
      .query("battles")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    let battleId = existingBattle?._id;
    let humanityPercent = existingBattle?.humanityPercent ?? DEFAULT_HUMANITY_PERCENT;

    const delta = args.choice === "human" ? STEP_PERCENT : -STEP_PERCENT;
    const nextHumanity = roundToTwoDecimals(clamp(humanityPercent + delta, 0, 100));

    if (!battleId) {
      battleId = await ctx.db.insert("battles", {
        slug: args.slug,
        humanityPercent: nextHumanity,
      });
    } else {
      await ctx.db.patch(battleId, { humanityPercent: nextHumanity });
    }

    if (existingSessionVote) {
      await ctx.db.patch(existingSessionVote._id, { lastChoice: args.choice });
    } else {
      await ctx.db.insert("sessionVotes", {
        sessionId: args.sessionId,
        slug: args.slug,
        lastChoice: args.choice,
      });
    }

    return null;
  },
});


