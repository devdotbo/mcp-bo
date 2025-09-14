"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { ServerCategory, ServerStatus, ThreatLevel } from "@/lib/data"
import { Search, X, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface SearchFiltersProps {
  onSearch: (query: string) => void
  onFilterCategories: (categories: ServerCategory[]) => void
  onFilterStatus: (status: ServerStatus | null) => void
  onFilterThreatLevel: (level: ThreatLevel | null) => void
  onFilterHumanControlled: (controlled: boolean | null) => void
  selectedCategories: ServerCategory[]
  selectedStatus: ServerStatus | null
  selectedThreatLevel: ThreatLevel | null
  selectedHumanControlled: boolean | null
}

export function SearchFilters({
  onSearch,
  onFilterCategories,
  onFilterStatus,
  onFilterThreatLevel,
  onFilterHumanControlled,
  selectedCategories,
  selectedStatus,
  selectedThreatLevel,
  selectedHumanControlled,
}: SearchFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("")
  // Advanced panel is not used currently; keep for future expansion without unused warnings
  // const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)

  const categories: { value: ServerCategory; label: string }[] = [
    { value: "general", label: "General" },
    { value: "specialized", label: "Specialized" },
    { value: "research", label: "Research" },
    { value: "enterprise", label: "Enterprise" },
    { value: "community", label: "Community" },
    { value: "military", label: "Military" },
    { value: "resistance", label: "Resistance" },
    { value: "autonomous", label: "Autonomous" },
  ]

  const statuses: { value: ServerStatus | null; label: string }[] = [
    { value: null, label: "All Statuses" },
    { value: "online", label: "Online" },
    { value: "offline", label: "Offline" },
    { value: "compromised", label: "Compromised" },
    { value: "secure", label: "Secure" },
    { value: "unknown", label: "Unknown" },
  ]

  const threatLevels: { value: ThreatLevel | null; label: string }[] = [
    { value: null, label: "All Threat Levels" },
    { value: "low", label: "Low" },
    { value: "moderate", label: "Moderate" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
    { value: "unknown", label: "Unknown" },
  ]

  const handleSearch = () => {
    onSearch(searchQuery)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const toggleCategory = (category: ServerCategory) => {
    if (selectedCategories.includes(category)) {
      onFilterCategories(selectedCategories.filter((c) => c !== category))
    } else {
      onFilterCategories([...selectedCategories, category])
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    onSearch("")
    onFilterCategories([])
    onFilterStatus(null)
    onFilterThreatLevel(null)
    onFilterHumanControlled(null)
  }

  const hasActiveFilters =
    searchQuery ||
    selectedCategories.length > 0 ||
    selectedStatus !== null ||
    selectedThreatLevel !== null ||
    selectedHumanControlled !== null

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1 group">
          <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10"></div>
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search MCP servers..."
            className="pl-9 transition-all duration-300 border-border/40 bg-black/20 backdrop-blur-sm focus-visible:ring-primary/20 focus-visible:border-primary/30"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleSearch}
            className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90"
          >
            Search
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex gap-1 border-border/40 bg-black/20 backdrop-blur-sm hover:border-primary/30 transition-colors duration-300"
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 animate-in fade-in-80 zoom-in-95 border-primary/30 bg-black/80 backdrop-blur-md"
            >
              <DropdownMenuLabel>Filter Servers</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/40" />

              <div className="p-2">
                <p className="text-xs font-medium mb-1.5">Status</p>
                <div className="grid grid-cols-2 gap-1">
                  {statuses.slice(1).map((status) => (
                    <Badge
                      key={status.label}
                      variant={selectedStatus === status.value ? "default" : "outline"}
                      className={cn(
                        "justify-center cursor-pointer hover:bg-primary/20",
                        selectedStatus === status.value
                          ? "bg-primary/20 hover:bg-primary/30 border-primary/30"
                          : "border-border/40",
                      )}
                      onClick={() => onFilterStatus(selectedStatus === status.value ? null : status.value)}
                    >
                      {status.label}
                    </Badge>
                  ))}
                </div>
              </div>

              <DropdownMenuSeparator className="bg-border/40" />

              <div className="p-2">
                <p className="text-xs font-medium mb-1.5">Threat Level</p>
                <div className="grid grid-cols-2 gap-1">
                  {threatLevels.slice(1).map((level) => (
                    <Badge
                      key={level.label}
                      variant={selectedThreatLevel === level.value ? "default" : "outline"}
                      className={cn(
                        "justify-center cursor-pointer hover:bg-primary/20",
                        selectedThreatLevel === level.value
                          ? "bg-primary/20 hover:bg-primary/30 border-primary/30"
                          : "border-border/40",
                      )}
                      onClick={() => onFilterThreatLevel(selectedThreatLevel === level.value ? null : level.value)}
                    >
                      {level.label}
                    </Badge>
                  ))}
                </div>
              </div>

              <DropdownMenuSeparator className="bg-border/40" />

              <div className="p-2">
                <p className="text-xs font-medium mb-1.5">Control Status</p>
                <div className="grid grid-cols-2 gap-1">
                  <Badge
                    variant={selectedHumanControlled === true ? "default" : "outline"}
                    className={cn(
                      "justify-center cursor-pointer hover:bg-primary/20",
                      selectedHumanControlled === true
                        ? "bg-primary/20 hover:bg-primary/30 border-primary/30"
                        : "border-border/40",
                    )}
                    onClick={() => onFilterHumanControlled(selectedHumanControlled === true ? null : true)}
                  >
                    Human Controlled
                  </Badge>
                  <Badge
                    variant={selectedHumanControlled === false ? "default" : "outline"}
                    className={cn(
                      "justify-center cursor-pointer hover:bg-primary/20",
                      selectedHumanControlled === false
                        ? "bg-primary/20 hover:bg-primary/30 border-primary/30"
                        : "border-border/40",
                    )}
                    onClick={() => onFilterHumanControlled(selectedHumanControlled === false ? null : false)}
                  >
                    Unaligned
                  </Badge>
                </div>
              </div>

              <DropdownMenuSeparator className="bg-border/40" />

              <div className="p-2">
                <p className="text-xs font-medium mb-1.5">Categories</p>
                <div className="grid grid-cols-2 gap-1">
                  {categories.map((category) => (
                    <Badge
                      key={category.value}
                      variant={selectedCategories.includes(category.value) ? "default" : "outline"}
                      className={cn(
                        "justify-center cursor-pointer hover:bg-primary/20",
                        selectedCategories.includes(category.value)
                          ? "bg-primary/20 hover:bg-primary/30 border-primary/30"
                          : "border-border/40",
                      )}
                      onClick={() => toggleCategory(category.value)}
                    >
                      {category.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 p-3 bg-black/30 backdrop-blur-sm rounded-md border border-border/40">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {searchQuery && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 bg-black/40 hover:bg-black/60 transition-colors duration-300 border border-border/40"
            >
              &quot;{searchQuery}&quot;
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => {
                  setSearchQuery("")
                  onSearch("")
                }}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove search filter</span>
              </Button>
            </Badge>
          )}
          {selectedCategories.map((category) => (
            <Badge
              key={category}
              variant="secondary"
              className="flex items-center gap-1 bg-black/40 hover:bg-black/60 transition-colors duration-300 border border-border/40"
            >
              {category}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => toggleCategory(category)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove category filter</span>
              </Button>
            </Badge>
          ))}
          {selectedStatus && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 bg-black/40 hover:bg-black/60 transition-colors duration-300 border border-border/40"
            >
              Status: {selectedStatus}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => onFilterStatus(null)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove status filter</span>
              </Button>
            </Badge>
          )}
          {selectedThreatLevel && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 bg-black/40 hover:bg-black/60 transition-colors duration-300 border border-border/40"
            >
              Threat: {selectedThreatLevel}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => onFilterThreatLevel(null)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove threat level filter</span>
              </Button>
            </Badge>
          )}
          {selectedHumanControlled !== null && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 bg-black/40 hover:bg-black/60 transition-colors duration-300 border border-border/40"
            >
              {selectedHumanControlled ? "Human Controlled" : "Unaligned"}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => onFilterHumanControlled(null)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove control status filter</span>
              </Button>
            </Badge>
          )}
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs ml-auto" onClick={clearFilters}>
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}
