"use client"

import { useEffect, useState, useCallback } from "react"
import { Bell } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

type AlertsToggleProps = {
  className?: string
  variant?: "inline" | "menu"
}

const STORAGE_KEY = "alertsEnabled"

export function AlertsToggle({ className, variant = "inline" }: AlertsToggleProps) {
  const [mounted, setMounted] = useState(false)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const stored = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null
      if (stored === "true") {
        setEnabled(true)
      }
    } catch (_) {
      // ignore
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    try {
      window.localStorage.setItem(STORAGE_KEY, enabled ? "true" : "false")
    } catch (_) {
      // ignore
    }
  }, [enabled, mounted])

  const requestPermissionIfNeeded = useCallback(async () => {
    if (typeof window === "undefined" || typeof Notification === "undefined") {
      return "unsupported" as const
    }
    if (Notification.permission === "granted") return "granted" as const
    if (Notification.permission === "denied") return "denied" as const
    try {
      const res = await Notification.requestPermission()
      return res
    } catch (_) {
      return "denied" as const
    }
  }, [])

  const handleChange = useCallback(async (checked: boolean) => {
    if (!checked) {
      setEnabled(false)
      return
    }

    const perm = await requestPermissionIfNeeded()
    if (perm === "granted") {
      setEnabled(true)
    } else {
      // permission denied or unsupported -> revert toggle
      setEnabled(false)
    }
  }, [requestPermissionIfNeeded])

  // Basic layouts for desktop inline vs mobile menu
  const isInline = variant === "inline"

  return (
    <div
      className={cn(
        isInline
          ? "hidden md:flex items-center gap-2 border border-primary/50 text-primary font-tech rounded px-2 py-1"
          : "flex items-center justify-between gap-3",
        className,
      )}
    >
      <div className={cn("flex items-center gap-2", isInline ? "" : "")}>
        <Bell className="h-3.5 w-3.5" />
        <span>Alerts</span>
      </div>
      <Switch
        checked={enabled}
        onCheckedChange={handleChange}
        aria-label="Toggle alerts notifications"
      />
    </div>
  )
}


