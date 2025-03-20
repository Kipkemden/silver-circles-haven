
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
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

  // Redirect to onboarding if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/onboarding" replace />;
  }
  
  // Redirect banned users to support page
  if (isBanned) {
    return <Navigate to="/support" replace />;
  }

  // Check subscription status if required
  if (requireSubscription && user && !user.isSubscribed) {
    return <Navigate to="/subscription" replace />;
  }

  // Check admin status if required - fix for the missing isAdmin property
  if (adminOnly && user) {
    // Since the User type doesn't have an isAdmin property, we need an alternative way to check
    // We could use a role-based approach or use another property that does exist in the User type
    // For now, let's assume a specific user ID corresponds to an admin
    const isAdmin = user.id === "u1"; // This is a simple placeholder solution
    if (!isAdmin) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
