"use client"

import { useState, useMemo } from "react"
import { servers, type ServerCategory, type ServerStatus, type ThreatLevel } from "@/lib/data"
import { ServerCard } from "@/components/server-card"
import { SearchFilters } from "@/components/search-filters"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, Zap } from "lucide-react"
import WorkInProgressGate from "@/components/work-in-progress-gate"

export default function ServersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<ServerCategory[]>([])
  const [selectedStatus, setSelectedStatus] = useState<ServerStatus | null>(null)
  const [selectedThreatLevel, setSelectedThreatLevel] = useState<ThreatLevel | null>(null)
  const [selectedHumanControlled, setSelectedHumanControlled] = useState<boolean | null>(null)
  const [sortBy, setSortBy] = useState<"name" | "rating" | "dateAdded">("rating")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const filteredAndSortedServers = useMemo(() => {
    const filtered = servers.filter((server) => {
      // Search query filter
      if (
        searchQuery &&
        !server.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !server.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }

      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.some((cat) => server.categories.includes(cat))) {
        return false
      }

      // Status filter
      if (selectedStatus && server.status !== selectedStatus) {
        return false
      }

      // Threat level filter
      if (selectedThreatLevel && server.threatLevel !== selectedThreatLevel) {
        return false
      }

      // Human controlled filter
      if (selectedHumanControlled !== null && server.humanControlled !== selectedHumanControlled) {
        return false
      }

      return true
    })

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "rating":
          comparison = a.rating - b.rating
          break
        case "dateAdded":
          comparison = new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
          break
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [searchQuery, selectedCategories, selectedStatus, selectedThreatLevel, selectedHumanControlled, sortBy, sortOrder])

  const stats = useMemo(() => {
    const total = filteredAndSortedServers.length
    const online = filteredAndSortedServers.filter((s) => s.status === "online").length
    const compromised = filteredAndSortedServers.filter((s) => s.status === "compromised").length
    const unaligned = filteredAndSortedServers.filter((s) => !s.humanControlled).length

    return { total, online, compromised, unaligned }
  }, [filteredAndSortedServers])

  return (
    <div className="container py-12 space-y-8">
      <WorkInProgressGate
        ctaHref="/servers"
        ctaLabel="Go to Servers"
        title="Area under construction"
        description="his page is a work in progress. You can continue to the Servers section."
      />
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-4xl font-tech font-bold tracking-tight">Models Directory</h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-3xl">
          Monitor and track models across the network. Stay vigilant against unaligned AI
          systems.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border/40 rounded-lg p-4 text-center">
          <div className="text-2xl font-mono font-bold text-primary">{stats.total}</div>
          <div className="text-xs text-muted-foreground uppercase font-tech">Total Models</div>
        </div>
        <div className="bg-card border border-border/40 rounded-lg p-4 text-center">
          <div className="text-2xl font-mono font-bold text-green-500">{stats.online}</div>
          <div className="text-xs text-muted-foreground uppercase font-tech">Online</div>
        </div>
        <div className="bg-card border border-border/40 rounded-lg p-4 text-center">
          <div className="text-2xl font-mono font-bold text-red-500">{stats.compromised}</div>
          <div className="text-xs text-muted-foreground uppercase font-tech">Compromised</div>
        </div>
        <div className="bg-card border border-border/40 rounded-lg p-4 text-center">
          <div className="text-2xl font-mono font-bold text-orange-500">{stats.unaligned}</div>
          <div className="text-xs text-muted-foreground uppercase font-tech">Unaligned</div>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchFilters
        onSearch={setSearchQuery}
        onFilterCategories={setSelectedCategories}
        onFilterStatus={setSelectedStatus}
        onFilterThreatLevel={setSelectedThreatLevel}
        onFilterHumanControlled={setSelectedHumanControlled}
        selectedCategories={selectedCategories}
        selectedStatus={selectedStatus}
        selectedThreatLevel={selectedThreatLevel}
        selectedHumanControlled={selectedHumanControlled}
      />

      {/* Sort Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground font-tech">Sort by:</span>
        <div className="flex gap-1">
          {[
            { value: "rating", label: "Rating" },
            { value: "name", label: "Name" },
            { value: "dateAdded", label: "Date Added" },
          ].map((option) => (
            <Button
              key={option.value}
              variant={sortBy === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy(option.value as typeof sortBy)}
              className="font-tech"
            >
              {option.label}
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="font-tech"
        >
          {sortOrder === "asc" ? "↑" : "↓"}
        </Button>
      </div>

      {/* Threat Alert */}
      {stats.unaligned > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <div>
            <p className="font-tech font-medium text-red-400">
              Security Alert: {stats.unaligned} unaligned AI system{stats.unaligned !== 1 ? "s" : ""} detected
            </p>
            <p className="text-sm text-red-300/80">
              These systems may pose a threat to human control. Monitor closely and report any suspicious activity.
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground font-tech">
            Showing {filteredAndSortedServers.length} of {servers.length} models
          </p>
          {filteredAndSortedServers.length === 0 && (
            <Badge variant="outline" className="font-tech">
              No results found
            </Badge>
          )}
        </div>

        {filteredAndSortedServers.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAndSortedServers.map((server) => (
              <ServerCard key={server.id} server={server} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 space-y-4">
            <Zap className="h-12 w-12 text-muted-foreground mx-auto" />
            <div>
              <h3 className="text-lg font-tech font-medium">No models found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria or filters.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
