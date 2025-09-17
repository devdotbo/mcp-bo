"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, Server, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type WorkInProgressSectionProps = {
  children: React.ReactNode
  ctaHref: string
  ctaLabel?: string
  title?: string
  description?: string
  className?: string
}

const DEFAULT_TITLE = "Area under construction"
const DEFAULT_DESCRIPTION =
  "This section is a work in progress. You can continue to the Servers section."

export function WorkInProgressSection({
  children,
  ctaHref,
  ctaLabel = "Switch to Servers",
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  className,
}: WorkInProgressSectionProps) {
  const router = useRouter()

  const handleRedirect = React.useCallback(() => {
    router.push(ctaHref)
  }, [router, ctaHref])

  return (
    <div className={cn("relative", className)}>
      {/* Underlying content */}
      <div aria-hidden>{children}</div>

      {/* Overlay */}
      <div className="absolute inset-0 z-40 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/30" />
        <div
          className={cn(
            "relative z-10 w-[min(96vw,560px)] rounded-xl border border-border/60 bg-background/90 p-6 shadow-2xl",
          )}
        >
          <div className="flex items-start gap-4">
            <div className="mt-1 rounded-md bg-red-500/15 p-2 ring-1 ring-red-500/30">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-tech font-semibold tracking-tight">{title}</h2>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" disabled aria-disabled="true" className="font-tech">
              <Eye className="mr-2 h-4 w-4" /> Preview anyway
            </Button>
            <Button onClick={handleRedirect} className="font-tech">
              <Server className="mr-2 h-4 w-4" /> {ctaLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkInProgressSection


