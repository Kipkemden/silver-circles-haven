
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

// In a real app, this would check authentication status from Supabase
const useAuth = () => {
  // Mock authentication for demo
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const isBanned = localStorage.getItem("isBanned") === "true";
  
  return {
    isAuthenticated,
    isBanned,
  };
};

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isBanned } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/onboarding" replace />;
  }
  
  if (isBanned) {
    return <Navigate to="/support" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
