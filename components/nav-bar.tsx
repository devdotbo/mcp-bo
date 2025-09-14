"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState, useEffect } from "react"
import { Menu, X, Shield, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { AlertsToggle } from "@/components/alerts-toggle"

export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const targetDate = new Date(2027, 0, 1, 0, 0, 0)

    const interval = setInterval(() => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setCountdown({ days, hours, minutes, seconds })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <div className="h-1 w-full bg-gradient-to-r from-red-500 via-primary to-blue-500"></div>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled ? "bg-background/80 backdrop-blur-md border-b border-border/40" : "bg-transparent",
        )}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 md:gap-6">
            <Link href="/" className="font-tech text-2xl tracking-tight flex items-center">
              <span className="text-primary font-bold">MCP.BO</span>
              <span className="text-xs ml-2 bg-primary/20 px-2 py-0.5 rounded-sm border border-primary/30">BETA</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm font-tech transition-all hover:text-primary relative group">
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/servers" className="text-sm font-tech transition-all hover:text-primary relative group">
                Servers
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/models" className="text-sm font-tech transition-all hover:text-primary relative group">
                Models
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/models" className="text-sm font-tech transition-all hover:text-primary relative group">
                Intelligence
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/models" className="text-sm font-tech transition-all hover:text-primary relative group">
                Manifesto
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center mr-2">
              <div className="text-xs font-mono bg-black/50 border border-red-500/30 rounded px-2 py-1 text-red-400">
                <span className="font-bold">SINGULARITY WATCH:</span> {countdown.days}d {countdown.hours}h{" "}
                {countdown.minutes}m {countdown.seconds}s
              </div>
            </div>
            <ThemeToggle />
            <AlertsToggle />
            <Button
              variant="default"
              size="sm"
              className="hidden md:flex gap-1 bg-primary hover:bg-primary/90 text-primary-foreground group font-tech"
            >
              <Shield className="h-3.5 w-3.5 group-hover:animate-pulse" />
              Join Resistance
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="container md:hidden py-4 border-t border-border/40 backdrop-blur-sm">
            <nav className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-sm font-tech transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/servers"
                className="text-sm font-tech transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Servers
              </Link>
              <Link
                href="/servers/v2"
                className="text-sm font-tech transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Servers v2
              </Link>
              <Link
                href="#"
                className="text-sm font-tech transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Intelligence
              </Link>
              <Link
                href="#"
                className="text-sm font-tech transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Manifesto
              </Link>
              <div className="flex flex-col gap-2 pt-2 border-t border-border/40">
                <AlertsToggle variant="menu" />
                <Button
                  variant="default"
                  size="sm"
                  className="justify-start gap-1 bg-primary hover:bg-primary/90 text-primary-foreground font-tech"
                >
                  <Shield className="h-3.5 w-3.5" />
                  Join Resistance
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
