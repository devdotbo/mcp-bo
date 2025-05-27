"use server"

import { createClient } from "redis"

const redisClient = createClient({
  url: process.env.REDIS_URL,
})

redisClient.on("error", (err) => console.error("Redis Client Error", err))

async function getRedisClient() {
  if (!redisClient.isOpen) {
    await redisClient.connect()
  }
  return redisClient
}

export async function submitEmailSignup(email: string) {
  try {
    const redis = await getRedisClient()
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
    await redis.set(`email:${email}`, JSON.stringify({
      email,
      timestamp,
      source: "coming-soon",
    }))

    // Add to a list for easy retrieval
    await redis.lPush("email-signups", email)

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
    const redis = await getRedisClient()
    const count = await redis.get("email-signup-count")
    return count || 0
  } catch (error) {
    console.error("Error getting signup count:", error)
    return 0
  }
}
