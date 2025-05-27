"use server"

import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

export async function submitEmailSignup(email: string) {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { success: false, message: "Invalid email format" }
    }

    // Check if email already exists
    const existingEmail = await redis.get(`email:${email}`)
    if (existingEmail) {
      // Return success even if email already exists
      return { success: true, message: "Successfully signed up for updates!" }
    }

    // Store email with timestamp
    const timestamp = new Date().toISOString()
    await redis.set(`email:${email}`, {
      email,
      timestamp,
      source: "coming-soon",
    })

    // Add to a list for easy retrieval
    await redis.lpush("email-signups", email)

    // Increment counter
    await redis.incr("email-signup-count")

    return { success: true, message: "Successfully signed up for updates!" }
  } catch (error) {
    console.error("Error storing email:", error)
    return { success: false, message: "Failed to sign up. Please try again." }
  }
}

export async function getEmailSignupCount() {
  try {
    const count = await redis.get("email-signup-count")
    return count || 0
  } catch (error) {
    console.error("Error getting signup count:", error)
    return 0
  }
}
