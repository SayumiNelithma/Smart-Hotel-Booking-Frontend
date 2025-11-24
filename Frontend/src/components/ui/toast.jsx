import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

const toastVariants = {
  success: {
    icon: CheckCircle2,
    className: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200",
    iconClassName: "text-green-600 dark:text-green-400",
  },
  error: {
    icon: XCircle,
    className: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200",
    iconClassName: "text-red-600 dark:text-red-400",
  },
  warning: {
    icon: AlertCircle,
    className: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200",
    iconClassName: "text-yellow-600 dark:text-yellow-400",
  },
  info: {
    icon: Info,
    className: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200",
    iconClassName: "text-blue-600 dark:text-blue-400",
  },
};

export function Toast({
  id,
  title,
  description,
  variant = "info",
  duration = 5000,
  onClose,
  ...props
}) {
  const [isVisible, setIsVisible] = React.useState(true);
  const variantConfig = toastVariants[variant] || toastVariants.info;
  const Icon = variantConfig.icon;

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(id), 300); // Wait for exit animation
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "relative flex items-start gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm",
            variantConfig.className,
            props.className
          )}
          role="alert"
          aria-live="polite"
          aria-atomic="true"
        >
          <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", variantConfig.iconClassName)} aria-hidden="true" />
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className="font-semibold text-sm mb-1">{title}</h4>
            )}
            {description && (
              <p className="text-sm opacity-90">{description}</p>
            )}
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onClose?.(id), 300);
            }}
            className="flex-shrink-0 rounded-md p-1 hover:bg-black/10 dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ToastContainer({ toasts, onClose }) {
  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none"
      aria-live="assertive"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} onClose={onClose} />
        </div>
      ))}
    </div>
  );
}

