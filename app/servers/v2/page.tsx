"use client"

import { useMemo, useState } from "react"
import { usePaginatedQuery, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { CatalogItemCard, type CatalogItem } from "@/components/catalog-item-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Menu } from "lucide-react"

const PAGE_SIZE = 24

export default function ServersV2Page() {
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

  const { results: items, status, loadMore } = usePaginatedQuery(
    activeFilter === "all" ? api.catalog.listAll : api.catalog.listByCategory,
    activeFilter === "all" ? {} : { category: activeFilter },
    { initialNumItems: PAGE_SIZE },
  )

  const searchResults = useQuery(api.catalog.searchByName, {
    queryText: searchQuery,
    category: activeFilter === "all" ? undefined : (activeFilter as any),
    limit: 12,
  })

  const visibleItems: Array<CatalogItem> = useMemo(() => {
    if (searchQuery.trim().length > 0) {
      // map search results to CatalogItem type shape
      return (searchResults ?? []).map((d: any) => ({
        _id: d._id,
        _creationTime: d._creationTime,
        name: d.name,
        category: d.category,
        orderInSection: d.orderInSection,
        description: d.description,
        homepage: d.homepage,
      }))
    }
    return (items ?? []).map((d: any) => ({
      _id: d._id,
      _creationTime: d._creationTime,
      name: d.name,
      category: d.category,
      orderInSection: d.orderInSection,
      description: d.description,
      homepage: d.homepage,
    }))
  }, [items, searchResults, searchQuery])

  const canLoadMore = status === "CanLoadMore" || status === "LoadingMore"
  const loadingMore = status === "LoadingMore"

  return (
    <div className="container py-12 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-tech font-bold tracking-tight">MCP Servers Directory (v2)</h1>
        <p className="text-muted-foreground text-lg max-w-3xl">
          Real data from Convex. Browse official and community servers. The original page remains unchanged.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="w-[200px]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span className="font-tech">Filter: {filterLabel}</span>
                <Menu className="h-4 w-4 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={activeFilter} onValueChange={(v) => setActiveFilter(v as any)}>
                <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="official_integrations">Official</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="community_servers">Community</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
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
          <p className="text-muted-foreground">No servers found.</p>
        </div>
      )}

      {searchQuery.length === 0 && canLoadMore && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => loadMore(PAGE_SIZE)} disabled={loadingMore}>
            {loadingMore ? "Loading…" : "Load more"}
          </Button>
        </div>
      )}
    </div>
  )
}


