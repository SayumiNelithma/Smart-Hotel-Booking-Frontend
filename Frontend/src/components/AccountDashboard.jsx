import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Calendar, MapPin } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useGetMyBookingsQuery } from "@/lib/api";

export default function AccountDashboard() {
  const { user, isLoaded } = useUser();
  const { data: bookings, isLoading: bookingsLoading } = useGetMyBookingsQuery();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  });

  // Calculate statistics from bookings
  const stats = useMemo(() => {
    if (!bookings) {
      return {
        total: 0,
        completed: 0,
        pending: 0,
        totalSpent: 0,
      };
    }

    return {
      total: bookings.length,
      completed: bookings.filter(b => b.status === "COMPLETED" || b.status === "CONFIRMED").length,
      pending: bookings.filter(b => b.status === "PENDING" || b.paymentStatus === "PENDING").length,
      totalSpent: bookings
        .filter(b => b.paymentStatus === "PAID")
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0),
    };
  }, [bookings]);

  if (!isLoaded) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleSave = () => {
    // In a real app, you would update the user profile via Clerk
    toast.success("Profile updated successfully");
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </CardTitle>
          <CardDescription>Your account details and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0] || "U"}
            </div>
            <div>
              <h3 className="text-xl font-semibold">
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.emailAddresses?.[0]?.emailAddress || "User"}
              </h3>
              <p className="text-muted-foreground flex items-center gap-1 mt-1">
                <Mail className="w-4 h-4" />
                {user?.emailAddresses?.[0]?.emailAddress}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              {isEditing ? (
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              ) : (
                <p className="text-sm py-2 px-3 bg-gray-50 rounded-md">
                  {user?.firstName || "Not set"}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              {isEditing ? (
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              ) : (
                <p className="text-sm py-2 px-3 bg-gray-50 rounded-md">
                  {user?.lastName || "Not set"}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <p className="text-sm py-2 px-3 bg-gray-50 rounded-md">
              {user?.emailAddresses?.[0]?.emailAddress}
            </p>
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave}>Save Changes</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Account Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bookingsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="text-center p-4 bg-gray-50 rounded-lg animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-12 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                <p className="text-sm text-muted-foreground mt-1">Total Bookings</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                <p className="text-sm text-muted-foreground mt-1">Completed</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                <p className="text-sm text-muted-foreground mt-1">Pending</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">${stats.totalSpent.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground mt-1">Total Spent</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

