import { motion } from "framer-motion";

export function HotelIllustration({ className }) {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className={className}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      aria-hidden="true"
    >
      {/* Building base */}
      <motion.rect
        x="50"
        y="100"
        width="100"
        height="80"
        fill="currentColor"
        className="text-primary/20"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
      
      {/* Windows */}
      {[0, 1, 2].map((i) => (
        <motion.rect
          key={i}
          x={65 + i * 30}
          y={120}
          width="15"
          height="20"
          fill="currentColor"
          className="text-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
        />
      ))}
      
      {/* Door */}
      <motion.rect
        x="90"
        y="150"
        width="20"
        height="30"
        fill="currentColor"
        className="text-primary"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.3, delay: 0.8 }}
      />
      
      {/* Roof */}
      <motion.polygon
        points="50,100 100,60 150,100"
        fill="currentColor"
        className="text-primary/30"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      />
    </motion.svg>
  );
}

export function EmptyStateIllustration({ className, message = "No items found" }) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="w-32 h-32 mx-auto mb-4 text-muted-foreground/30">
          <HotelIllustration />
        </div>
        <p className="text-muted-foreground text-lg">{message}</p>
      </motion.div>
    </div>
  );
}

