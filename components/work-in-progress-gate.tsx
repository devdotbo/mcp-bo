"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AlertTriangle, Server, Eye } from "lucide-react"

type WorkInProgressGateProps = {
  ctaHref: string
  ctaLabel?: string
  title?: string
  description?: string
  className?: string
}

const DEFAULT_TITLE = "Area under construction"
const DEFAULT_DESCRIPTION =
  "This page is a work in progress. You can continue to the Servers section."

export function WorkInProgressGate({
  ctaHref,
  ctaLabel = "Switch to Servers",
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  className,
}: WorkInProgressGateProps) {
  const router = useRouter()
  const [open] = React.useState(true)

  const handleRedirect = React.useCallback(() => {
    router.push(ctaHref)
  }, [router, ctaHref])

  return (
    <DialogPrimitive.Root open={open}>
      <DialogPrimitive.Portal>
        {/* Custom blurred overlay */}
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
            className,
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[min(96vw,560px)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border/60 bg-background/85 p-6 shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:zoom-in-90 data-[state=closed]:zoom-out-95",
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
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export default WorkInProgressGate


