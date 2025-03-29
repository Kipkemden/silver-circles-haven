
import { cn } from "@/lib/utils"

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("loader", className)} role="status" aria-label="Loading">
      <span className="sr-only">Loading...</span>
    </div>
  )
}
