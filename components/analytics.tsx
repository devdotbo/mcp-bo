"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export function Analytics() {
  const stats = useQuery(api.catalog.stats, {})

  const totalServers = stats?.totalCount ?? 0
  const officialCount = stats?.officialCount ?? 0
  const communityCount = stats?.communityCount ?? 0

  return (
    <div className="fixed bottom-4 left-4 z-10 p-3 bg-black/80 border border-primary/30 rounded-lg backdrop-blur-md text-xs font-mono hidden md:block">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span className="text-amber-300">TOTAL SERVERS: {totalServers.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-official animate-pulse"></span>
          <span className="text-official">OFFICIAL: {officialCount.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-community animate-pulse"></span>
          <span className="text-community">COMMUNITY: {communityCount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
