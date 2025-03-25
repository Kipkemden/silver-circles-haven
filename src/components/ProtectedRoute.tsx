
import { ReactNode } from "react";
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
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

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
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // Redirect banned users to support page
  if (user?.isBanned) {
    return <Navigate to="/support" replace />;
  }

  // For now, we'll skip subscription checks since that will be implemented later
  // Just pass through if subscription is required but not implemented yet
  if (requireSubscription && user && !user.isSubscribed) {
    // For now, we'll allow access but this will be updated later
    // when payment functionality is implemented
    console.log("Subscription required but not checking yet - will be implemented later");
    // return <Navigate to="/subscription" replace />;
  }

  // Check admin status if required
  if (adminOnly && user && !user.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
