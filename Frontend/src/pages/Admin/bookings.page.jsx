import React, { useState } from "react";
import { useGetAllBookingsQuery, useConfirmBookingMutation, useUpdateBookingStatusMutation } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Calendar, MapPin, Users, CreditCard, CheckCircle, XCircle, Clock, Search, Filter, Mail } from "lucide-react";

function formatDate(d) {
  if (!d) return "-";
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

export default function AdminBookingsPage() {
  const { data: bookings, isLoading, isError, error } = useGetAllBookingsQuery();
  const [confirmBooking] = useConfirmBookingMutation();
  const [updateBookingStatus] = useUpdateBookingStatusMutation();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [emailMessage, setEmailMessage] = useState("");

  const handleConfirmBooking = async (bookingId) => {
    try {
      await confirmBooking({ bookingId, emailMessage }).unwrap();
      toast.success("Booking confirmed and email sent successfully");
      setSelectedBooking(null);
      setEmailMessage("");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to confirm booking");
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus({ bookingId, status: newStatus }).unwrap();
      toast.success(`Booking status updated to ${newStatus}`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update booking status");
    }
  };

  const filteredBookings = bookings?.filter(booking => {
    const matchesSearch = 
      booking.hotelId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.bookingReference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.userId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || booking.status === statusFilter;
    const matchesPayment = paymentFilter === "ALL" || booking.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  }) || [];

  if (isLoading) return <main className="px-4 py-8">Loading bookings...</main>;
  if (isError) return <main className="px-4 py-8">Error loading bookings: {error?.toString() || "Unknown error"}</main>;

  return (
    <main className="px-4 py-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Booking Management</h1>
        <div className="text-sm text-gray-500">
          Total: {filteredBookings.length} bookings
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Payments</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="REFUNDED">Refunded</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("ALL");
                setPaymentFilter("ALL");
              }}
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="grid gap-4">
        {filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 text-lg">No bookings found</p>
              <p className="text-gray-400">Try adjusting your search filters</p>
            </CardContent>
          </Card>
        ) : (
          filteredBookings.map((booking) => (
            <Card key={booking._id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{booking.hotelId?.name}</CardTitle>
                    <p className="text-gray-600 flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4" />
                      {booking.hotelId?.location}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Reference: <span className="font-mono">{booking.bookingReference}</span>
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
                    <div className="text-sm text-gray-500">
                      User ID: <span className="font-mono">{booking.userId}</span>
                    </div>
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
                      {booking.status === "PENDING" && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm"
                              onClick={() => setSelectedBooking(booking)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Confirm Booking
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Confirm Booking</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="font-medium">{booking.hotelId?.name}</p>
                                <p className="text-sm text-gray-600">
                                  {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Room #{booking.roomNumber} • {booking.guestCount} guests
                                </p>
                              </div>
                              
                              <div>
                                <Label htmlFor="emailMessage">Welcome Message (Optional)</Label>
                                <Textarea
                                  id="emailMessage"
                                  placeholder="Add a personalized welcome message..."
                                  value={emailMessage}
                                  onChange={(e) => setEmailMessage(e.target.value)}
                                  rows={4}
                                />
                              </div>
                              
                              <div className="flex gap-2 justify-end">
                                <Button 
                                  variant="outline" 
                                  onClick={() => {
                                    setSelectedBooking(null);
                                    setEmailMessage("");
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  onClick={() => handleConfirmBooking(booking._id)}
                                >
                                  <Mail className="w-4 h-4 mr-1" />
                                  Confirm & Send Email
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                      
                      <Select
                        value={booking.status}
                        onValueChange={(newStatus) => handleUpdateStatus(booking._id, newStatus)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}
