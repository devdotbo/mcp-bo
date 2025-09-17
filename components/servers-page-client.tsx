"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Preloaded, usePreloadedQuery, usePaginatedQuery, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { CatalogItemCard, type CatalogItem } from "@/components/catalog-item-card"
import type { Doc } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Menu, Loader2 } from "lucide-react"

const PAGE_SIZE = 48
const INITIAL_ITEMS = 48

export function ServersPageClient({
  initialAllPreloaded,
}: {
  initialAllPreloaded: Preloaded<typeof api.catalog.listAll>
}) {
  const [activeFilter, setActiveFilter] = useState<"all" | "official_integrations" | "community_servers">(
    "all",
  )
  const [searchQuery, setSearchQuery] = useState("")

  const filterLabel = useMemo(() => {
    switch (activeFilter) {
      case "official_integrations":
        return "Official"
      case "community_servers":
        return "Community"
      default:
        return "All"
    }
  }, [activeFilter])

  // Preloaded initial page for All
  const initialAll = usePreloadedQuery(initialAllPreloaded)

  const { results: items, status, loadMore } = usePaginatedQuery(
    activeFilter === "all" ? api.catalog.listAll : api.catalog.listByCategory,
    activeFilter === "all" ? {} : { category: activeFilter },
    { initialNumItems: INITIAL_ITEMS },
  )

  const categoryFilter: CatalogItem["category"] | undefined =
    activeFilter === "all" ? undefined : activeFilter
  const searchResults = useQuery(api.catalog.searchByName, {
    queryText: searchQuery,
    category: categoryFilter,
    limit: 12,
  })

  const mapDocToItem = (d: Doc<"catalogItems">): CatalogItem => ({
    _id: d._id,
    _creationTime: d._creationTime,
    name: d.name,
    category: d.category,
    orderInSection: d.orderInSection,
    description: d.description,
    homepage: d.homepage,
  })

  const visibleItems: Array<CatalogItem> = useMemo(() => {
    if (searchQuery.trim().length > 0) {
      return (searchResults ?? []).map(mapDocToItem)
    }

    if (activeFilter === "all") {
      const clientItems = (items ?? []).map(mapDocToItem)
      if (clientItems.length > 0) return clientItems
      // Fallback to SSR-preloaded page until client data arrives
      return (initialAll?.page ?? []).map(mapDocToItem)
    }

    return (items ?? []).map(mapDocToItem)
  }, [items, searchResults, searchQuery, activeFilter, initialAll])

  const canLoadMore = status === "CanLoadMore" || status === "LoadingMore"
  const loadingMore = status === "LoadingMore"

  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const isRequestingRef = useRef(false)

  useEffect(() => {
    if (searchQuery.length > 0) return
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !isRequestingRef.current && !loadingMore && canLoadMore) {
            isRequestingRef.current = true
            loadMore(PAGE_SIZE)
          }
        }
      },
      { root: null, rootMargin: "0px 0px 1200px 0px", threshold: 0 },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [canLoadMore, loadingMore, loadMore, searchQuery])

  // Reset request lock when loading completes
  useEffect(() => {
    if (!loadingMore) {
      isRequestingRef.current = false
    }
  }, [loadingMore])

  return (
    <div className="container py-12 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-tech font-bold tracking-tight">MCP Servers Directory</h1>
        <p className="text-muted-foreground text-lg max-w-3xl">
        Monitor and track Model Context Protocol servers across the network. Stay vigilant against unaligned AI systems.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-36"
          />
          <div className="absolute inset-y-1 right-1 flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 justify-between">
                  <span className="font-tech">Filter: {filterLabel}</span>
                  <Menu className="h-4 w-4 opacity-70 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={activeFilter} onValueChange={(v) => setActiveFilter(v as "all" | CatalogItem["category"]) }>
                  <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="official_integrations">Official</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="community_servers">Community</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>


      {visibleItems.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleItems.map((item) => (
            <CatalogItemCard key={item._id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">...</p>
        </div>
      )}

      {searchQuery.length === 0 && (
        <div ref={sentinelRef} className="flex justify-center py-6">
          {loadingMore && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
        </div>
      )}
    </div>
  )
}


