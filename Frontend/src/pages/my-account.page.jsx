import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Calendar, Settings, LayoutDashboard } from "lucide-react";
import AccountDashboard from "@/components/AccountDashboard";
import BookingHistory from "@/components/BookingHistory";

const TABS = {
  DASHBOARD: "dashboard",
  BOOKINGS: "bookings",
  SETTINGS: "settings",
};

export default function MyAccountPage() {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState(TABS.DASHBOARD);

  if (!isLoaded) {
    return (
      <main className="px-4 py-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 py-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Account</h1>
        <p className="text-muted-foreground">
          Manage your profile, bookings, and account settings
        </p>
      </div>

      {/* Mobile Navigation - Horizontal tabs */}
      <div className="lg:hidden mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Button
            variant={activeTab === TABS.DASHBOARD ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab(TABS.DASHBOARD)}
            className="flex-shrink-0"
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <Button
            variant={activeTab === TABS.BOOKINGS ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab(TABS.BOOKINGS)}
            className="flex-shrink-0"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Bookings
          </Button>
          <Button
            variant={activeTab === TABS.SETTINGS ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab(TABS.SETTINGS)}
            className="flex-shrink-0"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Desktop Sidebar Navigation */}
        <div className="hidden lg:block lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-2">
                <Button
                  variant={activeTab === TABS.DASHBOARD ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab(TABS.DASHBOARD)}
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  variant={activeTab === TABS.BOOKINGS ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab(TABS.BOOKINGS)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Booking History
                </Button>
                <Button
                  variant={activeTab === TABS.SETTINGS ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab(TABS.SETTINGS)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === TABS.DASHBOARD && <AccountDashboard />}
          {activeTab === TABS.BOOKINGS && <BookingHistory />}
          {activeTab === TABS.SETTINGS && (
            <Card>
              <CardContent className="py-8">
                <div className="text-center space-y-4">
                  <Settings className="w-16 h-16 mx-auto text-gray-400" />
                  <h3 className="text-xl font-semibold">Account Settings</h3>
                  <p className="text-muted-foreground">
                    Advanced settings and preferences coming soon.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}

