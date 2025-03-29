
import { cn } from "@/lib/utils"

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("loader", className)} role="status" aria-label="Loading">
      <span className="sr-only">Loading...</span>
    </div>
  )
}
import { cn } from "@/lib/utils"

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center p-4", className)}>
      <div className="loader" role="status" aria-label="Loading">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
}
