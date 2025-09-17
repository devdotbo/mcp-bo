"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Brain, Users } from "lucide-react"
import { useTheme } from "next-themes"
import { useSessionQuery, useSessionMutation } from "convex-helpers/react/sessions"
import { api } from "@/convex/_generated/api"

const SLUG = "human_vs_ai"

export function HumanAiBattle() {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const battle = useSessionQuery(api.battle.getBattle, { slug: SLUG })
  const voteMutation = useSessionMutation(api.battle.vote)

  const humanityPercent = useMemo(() => {
    return battle?.humanityPercent ?? 52.42
  }, [battle])
  const aiPercent = useMemo(() => 100 - humanityPercent, [humanityPercent])

  const lastChoice = battle?.lastChoice
  const isLightTheme = theme === "light"

  const [isAnimating, setIsAnimating] = useState(false)

  if (!mounted) return null

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 w-64 ${isLightTheme ? "bg-white/90 text-foreground shadow-md" : "bg-black/80 text-white shadow-xl"} border border-primary/30 rounded-lg p-4 transition-colors duration-300 hidden md:block`}
    >
      <h3 className="text-sm font-bold mb-2 text-center font-tech">HUMANITY vs AI</h3>
      <div className="space-y-4">
        <div
          className={`relative h-8 rounded-full overflow-hidden ${isLightTheme ? "bg-gray-200" : "bg-white/10"}`}
        >
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-orange-500 to-red-500 transition-[width] duration-500 rounded-l-full"
            style={{ width: `${humanityPercent}%` }}
          />
          <div
            className="absolute right-0 top-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-[width] duration-500 rounded-r-full"
            style={{ width: `${aiPercent}%` }}
          />
          <div
            className={`absolute inset-0 flex justify-center items-center font-mono text-xs font-bold ${isLightTheme ? "text-gray-800" : "text-white"}`}
          >
            {humanityPercent.toFixed(2)}% : {aiPercent.toFixed(2)}%
          </div>
        </div>

        <div className="flex justify-between gap-2">
          <Button
            onClick={async () => {
              if (isAnimating) return
              setIsAnimating(true)
              await voteMutation({ slug: SLUG, choice: "human" })
              setTimeout(() => setIsAnimating(false), 500)
            }}
            disabled={lastChoice === "human"}
            className="flex-1 min-w-0 h-8 px-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-xs font-tech disabled:opacity-50"
          >
            <Users className="h-3 w-3 mr-1" /> VOTE HUMAN
          </Button>
          <Button
            onClick={async () => {
              if (isAnimating) return
              setIsAnimating(true)
              await voteMutation({ slug: SLUG, choice: "ai" })
              setTimeout(() => setIsAnimating(false), 500)
            }}
            disabled={lastChoice === "ai"}
            className="flex-1 min-w-0 h-8 px-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-xs font-tech disabled:opacity-50"
          >
            <Brain className="h-3 w-3 mr-1" /> VOTE AI
          </Button>
        </div>
      </div>
    </div>
  )
}
