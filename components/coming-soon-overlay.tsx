"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Shield, Clock, Bell, CheckCircle, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { submitEmailSignup, getEmailSignupCount } from "@/app/actions/email-signup"

export function ComingSoonOverlay() {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  })
  const [signupCount, setSignupCount] = useState(0)

  useEffect(() => {
    // Set a fixed launch date (June 30, 2025)
    const launchDate = new Date("2025-06-30T00:00:00")

    const interval = setInterval(() => {
      const now = new Date()
      const difference = launchDate.getTime() - now.getTime()

      // If the launch date has passed, show zeros
      if (difference <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        clearInterval(interval)
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setCountdown({ days, hours, minutes, seconds })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Load initial signup count
    getEmailSignupCount().then((count) => {
      setSignupCount(count as number)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: "" })

    try {
      const result = await submitEmailSignup(email)

      if (result.success) {
        setSubmitStatus({ type: "success", message: result.message })
        setEmail("")
        // Update signup count
        setSignupCount((prev) => prev + 1)
      } else {
        setSubmitStatus({ type: "error", message: result.message })
      }
    } catch (error) {
      setSubmitStatus({ type: "error", message: "Something went wrong. Please try again." })
    } finally {
      setIsSubmitting(false)

      // Clear status after 5 seconds
      setTimeout(() => {
        setSubmitStatus({ type: null, message: "" })
      }, 5000)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop with blur effect */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md"></div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-2xl w-full mx-4 p-8 rounded-lg border border-primary/30 bg-black/80 text-white shadow-2xl"
      >
        <div className="absolute -top-3 -left-3 w-20 h-20 bg-gradient-to-br from-primary to-purple-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-3 -right-3 w-16 h-16 bg-gradient-to-br from-primary to-purple-500 rounded-full opacity-20 animate-pulse-slow"></div>

        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary">
              <Shield className="h-5 w-5 mr-2" />
              <span className="text-sm font-tech">MCP.BO: MCP BATTLE OBSERVATORY</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-tech font-bold tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Coming Soon
            </span>
          </h1>

          <p className="text-lg text-gray-300 max-w-lg mx-auto">
            The definitive hub for Model Context Protocol servers is under development. Join the resistance and be the
            first to know when we launch.
          </p>

          <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
            <div className="bg-black/40 border border-primary/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-mono font-bold text-white">{countdown.days}</div>
              <div className="text-xs text-gray-400 uppercase">Days</div>
            </div>
            <div className="bg-black/40 border border-primary/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-mono font-bold text-white">{countdown.hours}</div>
              <div className="text-xs text-gray-400 uppercase">Hours</div>
            </div>
            <div className="bg-black/40 border border-primary/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-mono font-bold text-white">{countdown.minutes}</div>
              <div className="text-xs text-gray-400 uppercase">Minutes</div>
            </div>
            <div className="bg-black/40 border border-primary/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-mono font-bold text-white">{countdown.seconds}</div>
              <div className="text-xs text-gray-400 uppercase">Seconds</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1 group">
              <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10"></div>
              <input
                type="email"
                placeholder="Enter your email for updates"
                className="w-full px-4 py-2 bg-black/50 border border-primary/30 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 disabled:opacity-50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white font-tech disabled:opacity-50"
            >
              <Bell className="h-4 w-4 mr-2" />
              {isSubmitting ? "Submitting..." : "Notify Me"}
            </Button>
          </form>

          {submitStatus.type && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center justify-center gap-2 text-sm ${
                submitStatus.type === "success" ? "text-green-400" : "text-red-400"
              }`}
            >
              {submitStatus.type === "success" ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              {submitStatus.message}
            </motion.div>
          )}

          <div className="pt-4 text-xs text-gray-400 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-3 w-3" />
              <span>Launch date: June 30, 2025</span>
            </div>
            <p>The battle for AI sovereignty is approaching. Stay vigilant and prepare for the resistance.</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
