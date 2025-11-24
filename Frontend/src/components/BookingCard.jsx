import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, CreditCard, Edit, Trash2, Building2 } from "lucide-react";
import { Link } from "react-router";

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

function formatDateTime(d) {
  try {
    return new Date(d).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return d;
  }
}

function getStatusColor(status) {
  switch (status) {
    case "CONFIRMED":
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

export default function BookingCard({ booking, onCancel, onEdit, canCancel, canEdit }) {
  const hotel = booking.hotelId;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="md:flex">
        {/* Hotel Image */}
        <div className="md:w-64 h-48 md:h-auto relative overflow-hidden">
          <img
            src={hotel?.image || "https://via.placeholder.com/640x480?text=Hotel+image"}
            alt={hotel?.name || "Hotel"}
            className="object-cover w-full h-full"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://via.placeholder.com/640x480?text=No+image";
            }}
          />
        </div>

        {/* Booking Details */}
        <div className="flex-1">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-xl mb-2">{hotel?.name || "Unknown Hotel"}</CardTitle>
                <p className="text-gray-600 flex items-center gap-1 text-sm">
                  <MapPin className="w-4 h-4" />
                  {hotel?.location || hotel?.address || "Location not available"}
                </p>
              </div>
              <div className="flex flex-col gap-2 items-end">
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
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Check-in:</span>
                  <span>{formatDate(booking.checkIn)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Check-out:</span>
                  <span>{formatDate(booking.checkOut)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Room:</span>
                  <span>#{booking.roomNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Guests:</span>
                  <span>{booking.guestCount || 1}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Total:</span>
                  <span className="font-bold text-green-600">${booking.totalPrice?.toFixed(2)}</span>
                </div>
                {booking.bookingReference && (
                  <div className="text-xs text-gray-500 pt-2 border-t">
                    Reference: <span className="font-mono">{booking.bookingReference}</span>
                  </div>
                )}
                <div className="text-xs text-gray-500">
                  Booked: {formatDateTime(booking.createdAt)}
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
                  {canEdit && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onEdit(booking)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  )}
                  
                  {canCancel && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => onCancel(booking._id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  )}

                  {hotel?._id && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      asChild
                    >
                      <Link to={`/hotels/${hotel._id}`}>
                        View Hotel
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}

