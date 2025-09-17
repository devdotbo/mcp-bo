import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { ServersPageClient } from "@/components/servers-page-client";

const INITIAL_ITEMS = 48;

export default async function ServersV2Page() {
  const initialAllPreloaded = await preloadQuery(api.catalog.listAll, {
    paginationOpts: { numItems: INITIAL_ITEMS, cursor: null },
  });
  return <ServersPageClient initialAllPreloaded={initialAllPreloaded} />;
}


