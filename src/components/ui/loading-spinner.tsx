
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  message?: string;
}

export const LoadingSpinner = ({ className, message = "Loading..." }: LoadingSpinnerProps) => {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      <div 
        className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">{message}</span>
      </div>
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
};
