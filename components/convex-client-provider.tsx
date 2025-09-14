"use client"

import type React from "react"
import { ConvexProvider, ConvexReactClient } from "convex/react"
import { SessionProvider } from "convex-helpers/react/sessions"

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
const convexClient = new ConvexReactClient(convexUrl ?? "")

export function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProvider client={convexClient}>
      <SessionProvider ssrFriendly>
        {children}
      </SessionProvider>
    </ConvexProvider>
  )
}


