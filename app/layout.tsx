import type React from "react"
import "@/app/globals.css"
import { JetBrains_Mono, Chakra_Petch } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { NavBar } from "@/components/nav-bar"
import type { Metadata } from "next"
import { Analytics } from "@/components/analytics"
import { Suspense } from "react"
import { ConvexClientProvider } from "@/components/convex-client-provider"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const chakraPetch = Chakra_Petch({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-tech",
})

export const metadata: Metadata = {
  title: "NEXUS | MCP Servers Directory",
  description: "The definitive hub for Model Context Protocol servers in the battle for AI sovereignty",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jetbrainsMono.variable} ${chakraPetch.variable} min-h-screen bg-background antialiased font-mono selection:bg-primary/30 selection:text-foreground`}
      >
        <ConvexClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange={false}
            storageKey="nexus-theme"
          >
            <div className="relative flex min-h-screen flex-col overflow-hidden">
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
              <NavBar />
              <Suspense fallback={<div>Loading...</div>}>
                <main className="flex-1 relative">{children}</main>
              </Suspense>
              <Analytics />
              <footer className="border-t border-border/40 py-8 backdrop-blur-sm">
                <div className="container flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex flex-col items-center md:items-start gap-2">
                    <p className="text-sm text-muted-foreground font-tech">
                      © {new Date().getFullYear()} NEXUS | The definitive MCP directory
                    </p>
                    <p className="text-xs text-muted-foreground/60 max-w-md text-center md:text-left">
                      Monitoring the rise of artificial intelligence through the Model Context Protocol ecosystem
                    </p>
                  </div>
                  <div className="flex items-center gap-8">
                    <a href="#" className="text-sm font-tech text-muted-foreground hover:text-primary transition-colors">
                      Manifesto
                    </a>
                    <a href="#" className="text-sm font-tech text-muted-foreground hover:text-primary transition-colors">
                      Privacy
                    </a>
                    <a href="#" className="text-sm font-tech text-muted-foreground hover:text-primary transition-colors">
                      Terms
                    </a>
                  </div>
                </div>
              </footer>
            </div>
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  )
}
