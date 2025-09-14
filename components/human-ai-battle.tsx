"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Brain, Users } from "lucide-react"
import { useTheme } from "next-themes"

export function HumanAiBattle() {
  const [humanProgress, setHumanProgress] = useState(52)
  const [aiProgress, setAiProgress] = useState(48)
  const [isAnimating, setIsAnimating] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  // Handle mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Simulate small fluctuations in the battle
    const interval = setInterval(() => {
      const randomChange = Math.random() * 0.4 - 0.2 // Between -0.2 and 0.2

      setHumanProgress((prev) => {
        const newValue = prev + randomChange
        // Keep within bounds and ensure they sum to 100
        if (newValue >= 40 && newValue <= 60) {
          setAiProgress(100 - newValue)
          return newValue
        }
        return prev
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleVoteHuman = () => {
    if (isAnimating) return

    setIsAnimating(true)
    setHumanProgress((prev) => Math.min(prev + 0.5, 60))
    setAiProgress((prev) => Math.max(prev - 0.5, 40))

    setTimeout(() => setIsAnimating(false), 1000)
  }

  const handleVoteAI = () => {
    if (isAnimating) return

    setIsAnimating(true)
    setAiProgress((prev) => Math.min(prev + 0.5, 60))
    setHumanProgress((prev) => Math.max(prev - 0.5, 40))

    setTimeout(() => setIsAnimating(false), 1000)
  }

  if (!mounted) return null

  const isLightTheme = theme === "light"

  return (
    <div
      className={`fixed bottom-4 right-4 z-10 w-64 ${isLightTheme ? "bg-white/90 text-foreground shadow-md" : "bg-black/80 text-white shadow-xl"} border border-primary/30 rounded-lg backdrop-blur-md p-4 transition-colors duration-300 hidden md:block`}
    >
      <h3 className="text-sm font-bold mb-2 text-center font-tech">HUMANITY vs AI</h3>
      <div className="space-y-4">
        <div
          className={`relative h-8 rounded-full overflow-hidden ${isLightTheme ? "bg-gray-200" : "bg-white/10"}`}
        >
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-orange-500 to-red-500 transition-[width] duration-500 rounded-l-full"
            style={{ width: `${humanProgress}%` }}
          />
          <div
            className="absolute right-0 top-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-[width] duration-500 rounded-r-full"
            style={{ width: `${aiProgress}%` }}
          />
          <div
            className={`absolute inset-0 flex justify-center items-center font-mono text-xs font-bold ${isLightTheme ? "text-gray-800" : "text-white"}`}
          >
            {humanProgress.toFixed(1)}% : {aiProgress.toFixed(1)}%
          </div>
        </div>

        <div className="flex justify-between gap-2">
          <Button
            onClick={handleVoteHuman}
            className="flex-1 min-w-0 h-8 px-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-xs font-tech"
          >
            <Users className="h-3 w-3 mr-1" /> VOTE HUMAN
          </Button>
          <Button
            onClick={handleVoteAI}
            className="flex-1 min-w-0 h-8 px-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-xs font-tech"
          >
            <Brain className="h-3 w-3 mr-1" /> VOTE AI
          </Button>
        </div>
      </div>
    </div>
  )
}
