"use client"

import { Skeleton } from "./ui/skeleton"

// Post Card Skeleton
export function PostCardSkeleton() {
  return (
    <div className="w-full max-w-xl mx-auto bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-gray-700/30 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>

      {/* Image */}
      <Skeleton className="w-full h-64 rounded-xl mb-4" />

      {/* Content */}
      <div className="space-y-2 mb-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-8" />
        </div>
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  )
}

// Feed Composer Skeleton
export function FeedComposerSkeleton() {
  return (
    <div className="w-full max-w-xl mx-auto bg-gradient-to-br from-white/90 to-blue-50/40 dark:from-gray-800/90 dark:to-gray-700/40 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg">
      <div className="flex items-start gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-4">
          <Skeleton className="h-20 w-full rounded-lg" />
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-16 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Blog Card Skeleton
export function BlogCardSkeleton() {
  return (
    <div className="group block rounded-2xl border bg-gradient-to-br from-white/90 to-blue-50/40 dark:from-gray-800/90 dark:to-gray-700/40 dark:border-gray-600 p-6 shadow-lg">
      <div className="mb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
      </div>
    </div>
  )
}

// Profile Card Skeleton
export function ProfileCardSkeleton() {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
      <div className="text-center mb-6">
        <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
        <Skeleton className="h-6 w-32 mx-auto mb-2" />
        <Skeleton className="h-4 w-48 mx-auto" />
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <Skeleton className="h-8 w-8 mx-auto mb-2" />
          <Skeleton className="h-4 w-12 mx-auto" />
        </div>
        <div className="text-center">
          <Skeleton className="h-8 w-8 mx-auto mb-2" />
          <Skeleton className="h-4 w-12 mx-auto" />
        </div>
        <div className="text-center">
          <Skeleton className="h-8 w-8 mx-auto mb-2" />
          <Skeleton className="h-4 w-12 mx-auto" />
        </div>
      </div>
      
      <Skeleton className="h-10 w-full rounded-full" />
    </div>
  )
}

// Notification Skeleton
export function NotificationSkeleton() {
  return (
    <div className="rounded-sm border dark:border-gray-600 p-2 text-sm dark:bg-gray-700">
      <div className="flex items-start gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="flex-1 space-y-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  )
}

// Shimmer Effect Component
export function ShimmerEffect({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  )
}

// Loading Spinner
export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  }

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`} />
  )
}

// Loading Dots
export function LoadingDots() {
  return (
    <div className="flex space-x-1">
      <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"></div>
    </div>
  )
}
