import Navigation from "../Navigation";
import Footer from "../Footer";
import { Outlet } from "react-router";
import { Toaster } from "@/components/ui/sonner";
import { motion, AnimatePresence } from "framer-motion";
import { SkipLink } from "../SkipLink";
import ErrorBoundary from "../ErrorBoundary";

function RootLayout() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen theme-transition bg-background flex flex-col">
        <SkipLink />
        <Navigation />
        <motion.main
          id="main-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          tabIndex={-1}
          role="main"
          aria-label="Main content"
          className="flex-1"
        >
          <Outlet />
        </motion.main>
        <Footer />
        <Toaster 
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            duration: 5000,
            style: {
              background: 'var(--background)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
            },
          }}
        />
      </div>
    </ErrorBoundary>
  );
}

export default RootLayout;
