import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { HumanAiBattle } from "@/components/human-ai-battle";

const SLUG = "human_vs_ai" as const;

export async function HumanAiBattleWrapper() {
  const preloadedHumanity = await preloadQuery(api.battle.getHumanity, { slug: SLUG });
  return <HumanAiBattle preloadedHumanity={preloadedHumanity} />;
}


