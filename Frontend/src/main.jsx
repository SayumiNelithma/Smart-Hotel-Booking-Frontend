import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";

import RootLayout from "./components/layouts/root-layout.page.jsx";
import HomePage from "./pages/home.page.jsx";
import HotelDetailsPage from "./pages/hotel-details.page.jsx";
import HotelsPage from "./pages/hotels.page.jsx";
import HotelBookingPage from "./pages/hotel-booking.page.jsx";
import NotFoundPage from "./pages/not-found.page.jsx";
import SignInPage from "./pages/sign-in.page.jsx";
import SignUpPage from "./pages/sign-up.page.jsx";

import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router";
import { store } from "./lib/store";

import { ClerkProvider } from "@clerk/clerk-react";
import { ThemeProvider } from "./components/ThemeProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import { LoadingOverlay } from "./components/ui/loading-overlay";

import "./index.css";
import ProtectLayout from "./components/layouts/protect.layout.jsx";
import AdminProtectLayout from "./components/layouts/AdminProtectLayout.jsx";
import CreateHotelPage from "./pages/Admin/create-hotel.page.jsx";
import AdminBookingsPage from "./pages/Admin/bookings.page.jsx";
import ProfileBookingsPage from "./pages/profile/bookings.page.jsx";
import BookingConfirmationPage from "./pages/booking-confirmation.page.jsx";
import MyAccountPage from "./pages/my-account.page.jsx";

// Lazy load heavy components for better performance
const LazyAdminBookingsPage = lazy(() => Promise.resolve({ default: AdminBookingsPage }));
const LazyCreateHotelPage = lazy(() => Promise.resolve({ default: CreateHotelPage }));

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!clerkPublishableKey) {
  throw new Error("Missing Clerk publishable key");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <ClerkProvider publishableKey={clerkPublishableKey}>
          <Provider store={store}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<RootLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="/sign-in" element={<SignInPage />} />
                  <Route path="/sign-up" element={<SignUpPage />} />
                  <Route path="/hotels" element={<HotelsPage />} />
                  <Route element={<ProtectLayout />}>
                    <Route path="/hotels/:_id" element={<HotelDetailsPage />} />
                    <Route path="/hotels/:_id/book" element={<HotelBookingPage />} />
                  </Route>
                  <Route element={<AdminProtectLayout />}>
                    <Route 
                      path="/admin/create-hotel" 
                      element={
                        <Suspense fallback={<LoadingOverlay fullScreen isLoading message="Loading..." />}>
                          <LazyCreateHotelPage />
                        </Suspense>
                      } 
                    />
                    <Route 
                      path="/admin/bookings" 
                      element={
                        <Suspense fallback={<LoadingOverlay fullScreen isLoading message="Loading..." />}>
                          <LazyAdminBookingsPage />
                        </Suspense>
                      } 
                    />
                  </Route>
                  <Route element={<ProtectLayout />}>
                    <Route path="/account/bookings" element={<ProfileBookingsPage />} />
                    <Route path="/my-account" element={<MyAccountPage />} />
                    <Route path="/account" element={<MyAccountPage />} />
                    <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
                    <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmationPage />} />
                  </Route>
                </Route>
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </BrowserRouter>
          </Provider>
        </ClerkProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>
);
