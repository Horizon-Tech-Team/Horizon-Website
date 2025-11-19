"use client"

import { useEffect, useState } from "react"
import LoadingLogo from "./loading-logo"

export default function SiteLoading() {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState("Initializing...")

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)

    // Update loading text based on progress
    const textInterval = setInterval(() => {
      if (progress < 30) {
        setLoadingText("Loading resources...")
      } else if (progress < 60) {
        setLoadingText("Preparing dashboard...")
      } else if (progress < 90) {
        setLoadingText("Almost ready...")
      } else {
        setLoadingText("Welcome to Horizon Tech Fest!")
      }
    }, 800)

    return () => {
      clearInterval(interval)
      clearInterval(textInterval)
    }
  }, [progress])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-primary/5 to-background z-50 flex items-center justify-center">
      <div className="text-center space-y-8 max-w-md mx-auto px-6">
        {/* Main Logo Loading */}
        <LoadingLogo size="xl" text={loadingText} className="mb-8" />

        {/* Progress Bar */}
        <div className="w-full max-w-xs mx-auto">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Loading</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Event Info */}
        <div className="text-center space-y-2 opacity-60">
          <p className="text-sm font-medium">Horizon Tech Fest 2025</p>
          <p className="text-xs text-muted-foreground">Connecting Innovation & Excellence</p>
        </div>
      </div>
    </div>
  )
}
