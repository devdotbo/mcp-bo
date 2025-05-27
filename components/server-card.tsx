import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/star-rating"
import { getStatusColor, getThreatLevelColor, type Server } from "@/lib/data"
import { Shield, AlertTriangle, Lock, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface ServerCardProps {
  server: Server
  featured?: boolean
}

export function ServerCard({ server, featured = false }: ServerCardProps) {
  const statusColor = getStatusColor(server.status)
  const threatColor = getThreatLevelColor(server.threatLevel)

  return (
    <Link href={`/servers/${server.id}`} className="group">
      <Card
        className={cn(
          "h-full transition-all duration-500 overflow-hidden border-border/40 relative",
          featured ? "border-primary/30" : "",
          "hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_0_15px_rgba(124,58,237,0.15)]",
          "after:absolute after:inset-0 after:bg-gradient-to-br after:from-background after:to-background after:opacity-0 after:transition-opacity after:duration-500 group-hover:after:opacity-100 after:-z-10",
          server.humanControlled ? "" : "border-red-500/50",
        )}
      >
        {/* Glowing border effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>

        {/* Status indicator line at top */}
        <div className={`h-1 w-full bg-gradient-to-r ${statusColor}`}></div>

        <CardContent className="p-6 relative">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-lg group-hover:text-primary transition-colors duration-300">
                  {server.name}
                </h3>
                {!server.humanControlled && (
                  <Badge variant="destructive" className="text-[0.65rem] px-1 py-0 h-4 bg-red-900/60 text-red-200">
                    UNALIGNED
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground text-sm">{server.description}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div
                className={`h-3 w-3 rounded-full bg-gradient-to-r ${statusColor} shadow-lg shadow-primary/10 ring-1 ring-white/10`}
              />
              <span className="text-[0.65rem] uppercase text-muted-foreground">{server.status}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {server.categories.slice(0, 2).map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="text-xs bg-secondary/30 hover:bg-secondary/50 transition-colors duration-300 border-border/30"
                >
                  {category}
                </Badge>
              ))}
              {server.categories.length > 2 && (
                <Badge variant="outline" className="text-xs border-border/30 text-muted-foreground">
                  +{server.categories.length - 2}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {server.threatLevel === "critical" && <AlertTriangle className="h-3.5 w-3.5 text-red-500" />}
              {server.status === "secure" && <Lock className="h-3.5 w-3.5 text-green-500" />}
              {server.categories.includes("resistance") && <Shield className="h-3.5 w-3.5 text-blue-500" />}
              {server.categories.includes("autonomous") && <Zap className="h-3.5 w-3.5 text-yellow-500" />}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border/30 flex justify-between items-center">
            <StarRating rating={server.rating} />

            <div className="flex items-center gap-1.5">
              <div className="text-xs font-mono">SEC:</div>
              <div className="w-16 h-1.5 bg-black/50 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${getThreatLevelColor(
                    server.securityScore > 90
                      ? "low"
                      : server.securityScore > 75
                        ? "moderate"
                        : server.securityScore > 50
                          ? "high"
                          : "critical",
                  )}`}
                  style={{ width: `${server.securityScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="px-6 pb-6 pt-0 flex justify-between relative">
          <div className="text-xs text-muted-foreground">Added {new Date(server.dateAdded).toLocaleDateString()}</div>

          {featured && (
            <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/5">
              Featured
            </Badge>
          )}

          {server.lastIncident && (
            <Badge variant="outline" className="text-xs border-red-500/30 text-red-400 bg-red-500/5">
              Incident: {new Date(server.lastIncident).toLocaleDateString()}
            </Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}
