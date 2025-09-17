import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { NexusHero } from "@/components/nexus-hero";

export async function NexusHeroWrapper() {
  const preloadedStats = await preloadQuery(api.catalog.stats, {});
  return <NexusHero preloadedStats={preloadedStats} />;
}


