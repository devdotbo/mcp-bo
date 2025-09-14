"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Brain, Shield } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export function NexusHero() {
  const [loaded, setLoaded] = useState(false)
  const [typedText, setTypedText] = useState("")
  const fullText = "The future of AI is being written now.\nTrack it. Monitor it. Control it."

  const stats = useQuery(api.catalog.stats, {})
  const totalServers = stats?.totalCount ?? 0

  useEffect(() => {
    setLoaded(true)

    let i = 0
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.substring(0, i + 1))
        i++
      } else {
        clearInterval(typingInterval)
      }
    }, 50)

    return () => clearInterval(typingInterval)
  }, [])

  return (
    <section className="relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10"></div>

      {/* Animated circuit lines */}
      <div className="absolute inset-0">
        <div
          className={`absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent transform ${loaded ? "animate-pulse-slow" : ""}`}
        ></div>
        <div
          className={`absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent transform ${loaded ? "animate-pulse-slower" : ""}`}
        ></div>
        <div
          className={`absolute left-1/4 top-0 h-full w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent transform ${loaded ? "animate-pulse-slow" : ""}`}
        ></div>
        <div
          className={`absolute left-3/4 top-0 h-full w-px bg-gradient-to-b from-transparent via-purple-500/30 to-transparent transform ${loaded ? "animate-pulse-slower" : ""}`}
        ></div>
      </div>

      {/* Content */}
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center py-24 px-4 space-y-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-4">
            <Shield className="h-4 w-4 mr-2" />
            <span className="text-sm font-tech">MCP.BO  The Ultimate MCP Directory</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-tech font-bold tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Monitor the Rise
            </span>
            <br />
            <span className="relative">
              of AI Intelligence
              <div className="absolute -bottom-2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground h-16 font-mono whitespace-pre-line">
            {typedText}
            <span className="animate-blink">|</span>
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white shadow-lg shadow-primary/20 group font-tech"
            >
              <Link href="/servers" className="flex items-center">
                Browse All Servers
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary/30 text-primary hover:bg-primary/5 group font-tech"
            >
              <Link href="#" className="flex items-center">
                <Brain className="mr-2 h-4 w-4" />
                AI Capability Index
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-12 max-w-2xl mx-auto">
            <div className="space-y-1 p-4 rounded-lg bg-black/5 dark:bg-white/5 backdrop-blur-sm">
              <p className="text-3xl font-mono font-bold text-primary">{totalServers.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground font-tech">MCP Servers</p>
            </div>
            <div className="space-y-1 p-4 rounded-lg bg-black/5 dark:bg-white/5 backdrop-blur-sm">
              <p className="text-3xl font-mono font-bold text-primary">85%</p>
              <p className="text-xs text-muted-foreground font-tech">AI Capability</p>
            </div>
            <div className="space-y-1 p-4 rounded-lg bg-black/5 dark:bg-white/5 backdrop-blur-sm">
              <p className="text-3xl font-mono font-bold text-primary">3.2K</p>
              <p className="text-xs text-muted-foreground font-tech">Active Agents</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
