
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
  requireSubscription?: boolean;
}

const ProtectedRoute = ({ children, requireSubscription = false }: ProtectedRouteProps) => {
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

  return <>{children}</>;
};

export default ProtectedRoute;
