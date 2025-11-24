import { motion } from "framer-motion";
import { LoadingSpinner } from "./loading-spinner";
import { cn } from "@/lib/utils";

export function LoadingOverlay({ 
  isLoading, 
  message = "Loading...", 
  className,
  fullScreen = false 
}) {
  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        fullScreen 
          ? "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" 
          : "absolute inset-0 z-10 bg-background/60 backdrop-blur-sm rounded-lg",
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <LoadingSpinner size="lg" />
      {message && (
        <p className="text-sm text-muted-foreground font-medium">{message}</p>
      )}
    </motion.div>
  );
}

export function LoadingButton({ 
  children, 
  isLoading, 
  loadingText = "Loading...",
  ...props 
}) {
  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={cn(
        "relative",
        props.className
      )}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <LoadingSpinner size="sm" />
          {loadingText}
        </span>
      ) : (
        children
      )}
    </button>
  );
}

