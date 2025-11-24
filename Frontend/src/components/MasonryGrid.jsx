import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function MasonryGrid({ children, className, gap = "lg" }) {
  const gapClasses = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };

  return (
    <div
      className={cn(
        "masonry-grid",
        gapClasses[gap] || gapClasses.lg,
        className
      )}
    >
      {children}
    </div>
  );
}

export function MasonryItem({ children, className, delay = 0 }) {
  return (
    <motion.div
      className={cn("masonry-item", className)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay }}
    >
      {children}
    </motion.div>
  );
}

