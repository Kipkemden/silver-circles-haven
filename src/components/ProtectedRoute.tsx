
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
  requireSubscription?: boolean;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requireSubscription = false,
  adminOnly = false
}: ProtectedRouteProps) => {
  const { isAuthenticated, isBanned, isLoading, user } = useAuth();
  const location = useLocation();
  
  console.log("ProtectedRoute - auth state:", { isAuthenticated, isLoading, user });

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif mb-2">Loading...</h2>
          <p className="text-silver-600">Please wait while we verify your account.</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log("ProtectedRoute - Not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // Redirect banned users to support page
  if (isBanned) {
    console.log("ProtectedRoute - User is banned, redirecting to support");
    return <Navigate to="/support" replace />;
  }

  // Check subscription status if required
  if (requireSubscription && user && !user.isSubscribed) {
    console.log("ProtectedRoute - Subscription required, redirecting");
    return <Navigate to="/subscription" replace />;
  }

  // Check admin status if required
  if (adminOnly && user && !user.isAdmin) {
    console.log("ProtectedRoute - Admin access required, redirecting");
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
