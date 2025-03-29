import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
}

export const LoadingSpinner = ({ className }: LoadingSpinnerProps) => {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};