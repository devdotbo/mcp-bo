"use client"

import { useParams, notFound } from "next/navigation"
import { getServerById } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StarRating } from "@/components/star-rating"
import { AlertTriangle, Brain, Github, Shield, Zap } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ServerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const server = getServerById(id as string)
  const [threatLevel, setThreatLevel] = useState(Math.floor(Math.random() * 100))

  if (!server) {
    notFound()
  }

  const getThreatColor = () => {
    if (threatLevel < 30) return "text-green-500"
    if (threatLevel < 70) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="container py-12 max-w-4xl">
      <div className="space-y-10">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-xl -z-10"></div>
          <div className="p-8 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h1 className="text-4xl font-tech font-bold tracking-tight">{server.name}</h1>
              <Badge
                variant={server.status === "online" ? "default" : "destructive"}
                className={`px-3 py-1 ${server.status === "online" ? "bg-gradient-to-r from-green-500 to-emerald-600" : "bg-gradient-to-r from-red-500 to-orange-600"} font-tech`}
              >
                {server.status === "online" ? "Online" : "Offline"}
              </Badge>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <StarRating rating={server.rating} size="md" />
              <span className="text-sm text-muted-foreground">
                Added on{" "}
                {new Date(server.dateAdded).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2 space-y-6">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg leading-relaxed">{server.fullDescription}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {server.categories.map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="px-3 py-1 bg-secondary/50 hover:bg-secondary transition-colors duration-300 font-tech"
                >
                  {category}
                </Badge>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                className="gap-2 bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 font-tech"
              >
                <Link href={server.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                  View on GitHub
                </Link>
              </Button>
              <Button
                variant="outline"
                className="border-muted/50 hover:border-primary/30 transition-colors duration-300 font-tech"
              >
                Connect to Server
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-tech">Security Analysis</h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-tech">Threat Level</span>
                      <span className={`${getThreatColor()} font-mono`}>{threatLevel}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${threatLevel < 30 ? "bg-green-500" : threatLevel < 70 ? "bg-yellow-500" : "bg-red-500"}`}
                        style={{ width: `${threatLevel}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="font-tech">Authentication</span>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 font-tech">
                      Secure
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="font-tech">Data Encryption</span>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 font-mono">
                      AES-256
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="font-tech">Containment Protocol</span>
                    <Badge
                      variant="outline"
                      className={
                        server.status === "online"
                          ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 font-tech"
                          : "bg-green-500/10 text-green-500 border-green-500/20 font-tech"
                      }
                    >
                      {server.status === "online" ? "Active" : "Not Required"}
                    </Badge>
                  </div>
                </div>

                {threatLevel > 70 && (
                  <div className="flex items-center gap-2 p-3 rounded-md bg-red-500/10 text-red-500 border border-red-500/20 text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-tech">High threat level detected. Monitor closely.</span>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-tech">Capability Assessment</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-tech">Reasoning</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Zap
                          key={i}
                          className={`h-4 w-4 ${i < Math.ceil((server.rating / 5) * 5) ? "text-primary" : "text-muted"}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="font-tech">Knowledge</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Zap
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor((server.rating / 5) * 5) ? "text-primary" : "text-muted"}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="font-tech">Planning</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Zap
                          key={i}
                          className={`h-4 w-4 ${i < Math.ceil((server.rating / 5) * 4) ? "text-primary" : "text-muted"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
