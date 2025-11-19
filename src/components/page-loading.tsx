"use client"

import LoadingLogo from "./loading-logo"

interface PageLoadingProps {
  text?: string
  fullScreen?: boolean
}

export default function PageLoading({ text = "Loading page...", fullScreen = true }: PageLoadingProps) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="rounded-2xl p-8 translate-y-[-15%]">
          <LoadingLogo size="lg" text={text} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[400px] w-full -translate-y-6">
      <LoadingLogo size="md" text={text} />
    </div>
  )
}
