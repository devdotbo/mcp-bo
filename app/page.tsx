import { getFeaturedServers } from "@/lib/data"
import { ServerCard } from "@/components/server-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Shield } from "lucide-react"
import { NexusHero } from "@/components/nexus-hero"
// Analytics is rendered via SSR wrapper in RootLayout to avoid duplicate preloadQuery calls
import { HumanAiBattle } from "@/components/human-ai-battle"
import { WorkInProgressSection } from "@/components/work-in-progress-section"

export default function Home() {
  const featuredServers = getFeaturedServers()

  return (
    <div className="relative">
      <NexusHero />
      {/* SSR Analytics rendered in RootLayout */}
      <HumanAiBattle />

      <div className="container py-16 space-y-24">
        <WorkInProgressSection ctaHref="/servers">
          <section className="space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-primary" />
                <h2 className="text-4xl font-tech font-bold tracking-tight">Featured Models</h2>
              </div>
              <p className="text-muted-foreground">Critical LLMs you need to monitor</p>
            </div>
            <Button asChild variant="ghost" size="sm" className="gap-1 group font-tech">
              <Link href="/servers">
                View all <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredServers.map((server) => (
              <ServerCard key={server.id} server={server} featured />
            ))}
          </div>
          </section>
        </WorkInProgressSection>

        {/*
        <WorkInProgressSection ctaHref="/servers">
          <section className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-xl -z-10"></div>
            <div className="p-8 md:p-12 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-5 w-5 text-primary" />
                <h2 className="text-3xl font-tech font-bold">AI Capability Threshold</h2>
              </div>
              <p className="text-lg max-w-3xl">
                Our AI Capability Index tracks the collective intelligence of all MCP servers. Current estimates place AI
                capability at <span className="font-bold text-primary">85%</span> of human-level general intelligence.
                Monitor this threshold closely.
              </p>
              <div className="w-full h-4 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full"
                  style={{ width: "85%" }}
                >
                  <div className="h-full w-full bg-gradient-to-r from-transparent to-white/20 animate-pulse"></div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground font-tech">
                <span>Narrow AI</span>
                <span>Human-level AGI</span>
                <span>Superintelligence</span>
              </div>
              <Button className="mt-4 bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 font-tech">
                View Detailed Analysis
              </Button>
            </div>
          </section>
        </WorkInProgressSection>
        */}

        {/*
        <WorkInProgressSection ctaHref="/servers">
          <section className="space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-primary" />
                <h2 className="text-4xl font-tech font-bold tracking-tight">Recently Added</h2>
              </div>
              <p className="text-muted-foreground">New MCP servers to keep on your radar</p>
            </div>
            <Button asChild variant="ghost" size="sm" className="gap-1 group font-tech">
              <Link href="/servers">
                View all <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recentServers.map((server) => (
              <ServerCard key={server.id} server={server} />
            ))}
          </div>
          </section>
        </WorkInProgressSection>
        */}
      </div>
    </div>
  )
}
