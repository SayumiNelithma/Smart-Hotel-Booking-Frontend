import { useState, useMemo } from "react";
import { useGetMyBookingsQuery, useCancelBookingMutation, useUpdateBookingMutation } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Filter, Calendar as CalendarIcon, X } from "lucide-react";
import BookingCard from "./BookingCard";

export default function BookingHistory() {
  const { data: bookings, isLoading, isError, error } = useGetMyBookingsQuery();
  const [cancelBooking] = useCancelBookingMutation();
  const [updateBooking] = useUpdateBookingMutation();
  const [editingBooking, setEditingBooking] = useState(null);
  const [editForm, setEditForm] = useState({});
  
  // Filter states
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("ALL");
  const [dateRangeFilter, setDateRangeFilter] = useState({
    startDate: "",
    endDate: "",
  });
  const [showFilters, setShowFilters] = useState(false);

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

  // Filter bookings
  const filteredBookings = useMemo(() => {
    if (!bookings) return [];

    let filtered = [...bookings];

    // Filter by payment status
    if (paymentStatusFilter !== "ALL") {
      filtered = filtered.filter(booking => booking.paymentStatus === paymentStatusFilter);
    }

    // Filter by date range
    if (dateRangeFilter.startDate) {
      const startDate = new Date(dateRangeFilter.startDate);
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.createdAt);
        return bookingDate >= startDate;
      });
    }

    if (dateRangeFilter.endDate) {
      const endDate = new Date(dateRangeFilter.endDate);
      endDate.setHours(23, 59, 59, 999); // Include the entire end date
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.createdAt);
        return bookingDate <= endDate;
      });
    }

    return filtered;
  }, [bookings, paymentStatusFilter, dateRangeFilter]);

  const clearFilters = () => {
    setPaymentStatusFilter("ALL");
    setDateRangeFilter({ startDate: "", endDate: "" });
  };

  const hasActiveFilters = paymentStatusFilter !== "ALL" || dateRangeFilter.startDate || dateRangeFilter.endDate;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-red-500">
            <p>Error loading bookings: {error?.toString()}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </h3>
            <div className="flex gap-2">
              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-1" />
                  Clear Filters
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? "Hide" : "Show"} Filters
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="paymentStatus">Payment Status</Label>
                <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                  <SelectTrigger id="paymentStatus">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="PAID">Paid</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="FAILED">Failed</SelectItem>
                    <SelectItem value="REFUNDED">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">From Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={dateRangeFilter.startDate}
                  onChange={(e) => setDateRangeFilter({ ...dateRangeFilter, startDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">To Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={dateRangeFilter.endDate}
                  onChange={(e) => setDateRangeFilter({ ...dateRangeFilter, endDate: e.target.value })}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <CalendarIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg font-medium">No bookings found</p>
            <p className="text-gray-400 mt-2">
              {hasActiveFilters 
                ? "Try adjusting your filters to see more results."
                : "Start exploring hotels to make your first booking!"}
            </p>
            {hasActiveFilters && (
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredBookings.length} of {bookings?.length || 0} booking{filteredBookings.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              onCancel={handleCancelBooking}
              onEdit={handleEditBooking}
              canCancel={canCancelBooking(booking)}
              canEdit={canEditBooking(booking)}
            />
          ))}
        </div>
      )}

      {/* Edit Booking Dialog */}
      {editingBooking && (
        <Dialog open={!!editingBooking} onOpenChange={() => setEditingBooking(null)}>
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
    </div>
  );
}

