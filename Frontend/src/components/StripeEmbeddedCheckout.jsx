import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, X, Shield, Lock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

// Initialize Stripe with publishable key
const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
if (!publishableKey) {
  console.error("⚠️ VITE_STRIPE_PUBLISHABLE_KEY is not set in environment variables");
}

const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

function StripeEmbeddedCheckout({ clientSecret, onSuccess, onCancel, bookingDetails }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!clientSecret) {
      const errorMsg = "Payment session not available. Please try again.";
      setError(errorMsg);
      setIsLoading(false);
      return;
    }

    if (!publishableKey) {
      const errorMsg = "Stripe publishable key not configured. Please contact support.";
      setError(errorMsg);
      setIsLoading(false);
      return;
    }

    if (!stripePromise) {
      const errorMsg = "Failed to initialize Stripe. Please refresh the page.";
      setError(errorMsg);
      setIsLoading(false);
      return;
    }

    // Small delay to ensure Stripe is loaded
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [clientSecret]);

  const options = {
    clientSecret,
    onComplete: () => {
      // Payment completed successfully
      toast.success("Payment successful! Redirecting...");
      if (onSuccess) {
        onSuccess();
      }
    },
  };

  // Don't render if stripePromise is not available
  if (!stripePromise) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="border-2 border-destructive/50">
          <CardHeader className="bg-destructive/5 border-b">
            <CardTitle className="text-destructive flex items-center gap-2">
              <X className="w-5 h-5" />
              Configuration Error
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-destructive" />
              </div>
              <div>
                <p className="font-semibold text-lg mb-2">
                  Stripe is not properly configured
                </p>
                <p className="text-sm text-muted-foreground">
                  Please contact support for assistance.
                </p>
              </div>
              {onCancel && (
                <Button onClick={onCancel} variant="outline" size="lg" className="mt-4">
                  Go Back to Booking
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="border-2 border-destructive/50">
          <CardHeader className="bg-destructive/5 border-b">
            <CardTitle className="text-destructive">Payment Error</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
                <X className="w-8 h-8 text-destructive" />
              </div>
              <div>
                <p className="font-semibold text-lg mb-2">{error}</p>
                <p className="text-sm text-muted-foreground">
                  Please try again or contact support if the problem persists.
                </p>
              </div>
              {onCancel && (
                <Button onClick={onCancel} variant="outline" size="lg" className="mt-4">
                  Go Back to Booking
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Card className="border-2">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Secure Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
              </div>
              <div className="text-center">
                <p className="font-semibold text-lg">Loading secure payment form...</p>
                <p className="text-sm text-muted-foreground mt-1">Please wait while we prepare your checkout</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-2">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-serif">Secure Payment</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Enter your payment details below</p>
              </div>
            </div>
            {onCancel && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onCancel}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {bookingDetails && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-5 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Total Amount</span>
                </div>
                <span className="text-3xl font-bold text-primary">
                  ${bookingDetails.totalPrice}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground pt-3 border-t border-primary/20">
                <span>
                  {bookingDetails.nights} {bookingDetails.nights === 1 ? 'night' : 'nights'} × ${bookingDetails.pricePerNight}/night
                </span>
                <Badge variant="secondary" className="gap-1">
                  <Shield className="w-3 h-3" />
                  Secure
                </Badge>
              </div>
            </motion.div>
          )}
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Lock className="w-4 h-4" />
              <span>Your payment information is encrypted and secure</span>
            </div>
            <div id="checkout" className="min-h-[500px] rounded-lg overflow-hidden border border-border/50">
              <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={options}
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default StripeEmbeddedCheckout;

