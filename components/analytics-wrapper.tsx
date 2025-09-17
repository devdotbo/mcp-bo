import { preloadQuery } from "convex/nextjs";
import { Analytics } from "@/components/analytics";
import { api } from "@/convex/_generated/api";

export async function AnalyticsWrapper() {
  const preloadedStats = await preloadQuery(api.catalog.stats, {});
  return <Analytics preloadedStats={preloadedStats} />;
}


