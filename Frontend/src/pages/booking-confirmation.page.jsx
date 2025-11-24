import { useParams, useNavigate, useSearchParams } from "react-router";
import { useGetBookingByIdQuery, useGetBookingBySessionIdQuery } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, CreditCard, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

function formatDate(dateString) {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
}

function BookingConfirmationPage() {
  const { bookingId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get session_id from query params (returned by Stripe)
  const sessionId = searchParams.get('session_id');
  
  // Use session_id if available, otherwise use bookingId from URL
  const { data: bookingFromSession, isLoading: isLoadingSession, isError: isErrorSession } = 
    useGetBookingBySessionIdQuery(sessionId || '', { skip: !sessionId });
  
  const { data: bookingFromId, isLoading: isLoadingId, isError: isErrorId } = 
    useGetBookingByIdQuery(bookingId || '', { skip: !bookingId || !!sessionId });
  
  // Use booking from session if available, otherwise from bookingId
  const booking = sessionId ? bookingFromSession : bookingFromId;
  const isLoading = sessionId ? isLoadingSession : isLoadingId;
  const isError = sessionId ? isErrorSession : isErrorId;
  const error = sessionId ? (isErrorSession ? { data: { message: "Failed to load booking" } } : null) : (isErrorId ? { data: { message: "Failed to load booking" } } : null);
  
  useEffect(() => {
    if (sessionId) {
      toast.success("Payment successful! Loading booking details...");
    }
  }, [sessionId]);

  if (isLoading) {
    return (
      <main className="px-4 py-6 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-64 mb-6" />
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-destructive mb-4">Error Loading Booking</h2>
        <p className="text-muted-foreground">{error?.data?.message || "Something went wrong."}</p>
        <Button onClick={() => navigate("/")} className="mt-4">
          Go Home
        </Button>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "PAID":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      case "REFUNDED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <main className="px-4 py-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-green-600 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600">Your booking has been successfully created</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Booking Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Booking Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Booking Reference:</span>
              <Badge variant="outline" className="font-mono">
                {booking.bookingReference}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Status:</span>
              <Badge className={getStatusColor(booking.status)}>
                {booking.status}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Payment Status:</span>
              <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                {booking.paymentStatus}
              </Badge>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Check-in:</span>
                <span>{formatDate(booking.checkIn)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Check-out:</span>
                <span>{formatDate(booking.checkOut)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Room Number:</span>
                <span>{booking.roomNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Guests:</span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {booking.guestCount}
                </span>
              </div>
            </div>
            
            {booking.specialRequests && (
              <div className="border-t pt-4">
                <span className="font-medium block mb-2">Special Requests:</span>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  {booking.specialRequests}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hotel Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Hotel Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{booking.hotelId?.name}</h3>
              <p className="text-gray-600 flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4" />
                {booking.hotelId?.location}
              </p>
            </div>
            
            {booking.hotelId?.address && (
              <div>
                <span className="font-medium">Address:</span>
                <p className="text-sm text-gray-600 mt-1">
                  {booking.hotelId.address}
                </p>
              </div>
            )}
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Price per night:</span>
                <span>${booking.hotelId?.price || 100}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Total nights:</span>
                <span>
                  {Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24))}
                </span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                <span>Total Price:</span>
                <span className="text-green-600">${booking.totalPrice}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex gap-4 justify-center">
        <Button 
          onClick={() => navigate(`/account/bookings${booking?._id ? `?bookingId=${booking._id}` : ''}`)} 
          variant="outline"
        >
          View My Bookings
        </Button>
        <Button onClick={() => navigate("/hotels")}>
          Browse More Hotels
        </Button>
      </div>
    </main>
  );
}

export default BookingConfirmationPage;
