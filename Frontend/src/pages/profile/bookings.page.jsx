import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import { useGetMyBookingsQuery, useCancelBookingMutation, useUpdateBookingMutation } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Calendar, MapPin, Users, CreditCard, Edit, Trash2, Eye } from "lucide-react";

function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return d;
  }
}

function getStatusColor(status) {
  switch (status) {
    case "CONFIRMED":
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
}

function getPaymentStatusColor(status) {
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
}

export default function ProfileBookingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const bookingIdParam = searchParams.get('bookingId');
  const { data: bookings, isLoading, isError, error, refetch } = useGetMyBookingsQuery(undefined, {
    refetchOnMountOrArgChange: true, // Refetch when component mounts
  });
  const [cancelBooking] = useCancelBookingMutation();
  const [updateBooking] = useUpdateBookingMutation();
  const [editingBooking, setEditingBooking] = useState(null);
  const [editForm, setEditForm] = useState({});
  const bookingRefs = useRef({});

  // Scroll to specific booking if bookingId is provided in URL
  useEffect(() => {
    if (bookingIdParam && bookings && bookings.length > 0) {
      const booking = bookings.find(b => b._id === bookingIdParam);
      if (booking) {
        // Small delay to ensure DOM is rendered
        setTimeout(() => {
          const element = bookingRefs.current[bookingIdParam];
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Highlight the booking briefly
            element.classList.add('ring-2', 'ring-green-500', 'ring-offset-2');
            setTimeout(() => {
              element.classList.remove('ring-2', 'ring-green-500', 'ring-offset-2');
            }, 3000);
            // Remove bookingId from URL after scrolling
            setSearchParams({}, { replace: true });
          }
        }, 100);
      }
    }
  }, [bookingIdParam, bookings, setSearchParams]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    
    try {
      await cancelBooking(bookingId).unwrap();
      toast.success("Booking cancelled successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to cancel booking");
    }
  };

  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
    setEditForm({
      checkIn: booking.checkIn.split('T')[0],
      checkOut: booking.checkOut.split('T')[0],
      roomNumber: booking.roomNumber,
      guestCount: booking.guestCount,
      specialRequests: booking.specialRequests || ""
    });
  };

  const handleUpdateBooking = async () => {
    try {
      await updateBooking({
        bookingId: editingBooking._id,
        ...editForm
      }).unwrap();
      toast.success("Booking updated successfully");
      setEditingBooking(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update booking");
    }
  };

  const canCancelBooking = (booking) => {
    if (booking.status === "CANCELLED" || booking.status === "COMPLETED") return false;
    const checkInDate = new Date(booking.checkIn);
    const now = new Date();
    const hoursUntilCheckIn = (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntilCheckIn >= 24;
  };

  const canEditBooking = (booking) => {
    return booking.status !== "CANCELLED" && booking.status !== "COMPLETED";
  };

  if (isLoading) return <main className="px-4 py-8">Loading your bookings...</main>;
  if (isError) return <main className="px-4 py-8">Error loading bookings: {error?.toString()}</main>;

  return (
    <main className="px-4 py-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      
      {bookings?.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 text-lg">No bookings found</p>
            <p className="text-gray-400">Start exploring hotels to make your first booking!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {bookings?.map((booking) => (
            <Card 
              key={booking._id} 
              ref={(el) => {
                if (el) bookingRefs.current[booking._id] = el;
              }}
              className="overflow-hidden transition-all duration-300"
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{booking.hotelId?.name}</CardTitle>
                    <p className="text-gray-600 flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4" />
                      {booking.hotelId?.location}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                    <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                      {booking.paymentStatus}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Check-in:</span>
                      <span>{formatDate(booking.checkIn)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Check-out:</span>
                      <span>{formatDate(booking.checkOut)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Room:</span>
                      <span>#{booking.roomNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Guests:</span>
                      <span>{booking.guestCount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Total:</span>
                      <span className="font-bold text-green-600">${booking.totalPrice}</span>
                    </div>
                    {booking.bookingReference && (
                      <div className="text-sm text-gray-500">
                        Reference: <span className="font-mono">{booking.bookingReference}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {booking.specialRequests && (
                      <div>
                        <span className="font-medium text-sm">Special Requests:</span>
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded mt-1">
                          {booking.specialRequests}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex gap-2 pt-4">
                      {canEditBooking(booking) && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditBooking(booking)}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Edit Booking</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="editCheckIn">Check-in</Label>
                                  <Input
                                    id="editCheckIn"
                                    type="date"
                                    value={editForm.checkIn}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, checkIn: e.target.value }))}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="editCheckOut">Check-out</Label>
                                  <Input
                                    id="editCheckOut"
                                    type="date"
                                    value={editForm.checkOut}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, checkOut: e.target.value }))}
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="editRoomNumber">Room Number</Label>
                                  <Input
                                    id="editRoomNumber"
                                    type="number"
                                    value={editForm.roomNumber}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, roomNumber: e.target.value }))}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="editGuestCount">Guests</Label>
                                  <Input
                                    id="editGuestCount"
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={editForm.guestCount}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, guestCount: e.target.value }))}
                                  />
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="editSpecialRequests">Special Requests</Label>
                                <Textarea
                                  id="editSpecialRequests"
                                  value={editForm.specialRequests}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, specialRequests: e.target.value }))}
                                  rows={3}
                                />
                              </div>
                              <div className="flex gap-2 justify-end">
                                <Button variant="outline" onClick={() => setEditingBooking(null)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleUpdateBooking}>
                                  Update Booking
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                      
                      {canCancelBooking(booking) && (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleCancelBooking(booking._id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
