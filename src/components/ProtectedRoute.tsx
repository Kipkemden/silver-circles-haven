
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

  // Check admin status if required
  if (adminOnly && user) {
    // Check if user is admin
    // This will be properly implemented when we fetch the user profile from Supabase
    const isAdmin = user.isAdmin; // We'll add this property to the User type
    if (!isAdmin) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
