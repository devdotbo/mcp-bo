"use client"

import { useEffect, useState } from "react"

export function Analytics() {
  const [activeUsers, setActiveUsers] = useState(0)
  const [serversTracked, setServersTracked] = useState(0)
  const [aiCapabilityIndex, setAiCapabilityIndex] = useState(0)

  useEffect(() => {
    // Simulate loading data
    const timer1 = setTimeout(() => {
      setActiveUsers(Math.floor(Math.random() * 1000) + 3000)
    }, 1000)

    const timer2 = setTimeout(() => {
      setServersTracked(Math.floor(Math.random() * 20) + 180)
    }, 1500)

    const timer3 = setTimeout(() => {
      setAiCapabilityIndex(Math.floor(Math.random() * 10) + 85)
    }, 2000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  return (
    <div className="fixed bottom-4 left-4 z-10 p-3 bg-black/80 border border-primary/30 rounded-lg backdrop-blur-md text-xs font-mono hidden md:block">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-green-400">ACTIVE USERS: {activeUsers.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span className="text-blue-400">SERVERS TRACKED: {serversTracked}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-red-400">AI CAPABILITY INDEX: {aiCapabilityIndex}%</span>
        </div>
      </div>
    </div>
  )
}
