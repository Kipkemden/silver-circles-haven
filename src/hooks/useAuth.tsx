
import { useEffect, useState } from "react";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isBanned, setIsBanned] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // In a real app, this would check authentication status from Supabase
    // For now, we're using localStorage as a simple mock
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    const banStatus = localStorage.getItem("isBanned") === "true";
    
    setIsAuthenticated(authStatus);
    setIsBanned(banStatus);
    setIsLoading(false);
  }, []);

  const login = () => {
    localStorage.setItem("isAuthenticated", "true");
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.setItem("isAuthenticated", "false");
    setIsAuthenticated(false);
  };

  const toggleBan = (userId: string, shouldBan: boolean) => {
    // In a real app, this would update the user's ban status in Supabase
    // For now, we'll just update localStorage for the current user
    localStorage.setItem("isBanned", shouldBan ? "true" : "false");
    setIsBanned(shouldBan);
    return Promise.resolve({ success: true });
  };

  return {
    isAuthenticated,
    isBanned,
    isLoading,
    login,
    logout,
    toggleBan
  };
};
