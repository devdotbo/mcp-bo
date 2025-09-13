"use client"

import type React from "react"
import { ConvexProvider, ConvexReactClient } from "convex/react"

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
const convexClient = new ConvexReactClient(convexUrl ?? "")

export function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  return <ConvexProvider client={convexClient}>{children}</ConvexProvider>
}


