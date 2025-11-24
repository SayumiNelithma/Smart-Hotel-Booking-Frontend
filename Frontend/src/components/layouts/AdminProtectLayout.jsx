import { Outlet, Navigate } from "react-router";
import { useUser } from "@clerk/clerk-react";

export default function AdminProtectLayout() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  if (user?.publicMetadata?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
