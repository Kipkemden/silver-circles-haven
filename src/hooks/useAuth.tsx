
import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { api } from "@/services/api";
import { toast } from "sonner";

type AuthContextType = {
  isAuthenticated: boolean;
  isBanned: boolean;
  isLoading: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  toggleBan: (userId: string, shouldBan: boolean) => Promise<{ success: boolean; error?: string }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isBanned, setIsBanned] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    // Check if user is already authenticated on mount
    const checkAuthStatus = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, this would check session with Supabase
        const authStatus = localStorage.getItem("isAuthenticated") === "true";
        const banStatus = localStorage.getItem("isBanned") === "true";
        const currentUser = api.auth.getCurrentUser();
        
        setIsAuthenticated(authStatus);
        setIsBanned(banStatus);
        setUser(currentUser);
      } catch (error) {
        console.error("Auth status check failed:", error);
        // Reset auth state if check fails
        setIsAuthenticated(false);
        setIsBanned(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { user, error } = await api.auth.signIn(email, password);
      
      if (error) {
        toast.error(error);
        return { success: false, error };
      }
      
      if (user) {
        setIsAuthenticated(true);
        setIsBanned(user.isBanned || false);
        setUser(user);
        toast.success("Login successful!");
        return { success: true };
      }
      
      return { success: false, error: "Login failed" };
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
      return { success: false, error: "Login failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await api.auth.signOut();
      
      setIsAuthenticated(false);
      setIsBanned(false);
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBan = async (userId: string, shouldBan: boolean) => {
    try {
      const { success, error, data } = await api.users.toggleBan(userId, shouldBan);
      
      // If the banned user is the current user, update the state
      if (success && user && user.id === userId) {
        setIsBanned(shouldBan);
        localStorage.setItem("isBanned", shouldBan ? "true" : "false");
      }
      
      return { success, error: error ? String(error) : undefined };
    } catch (error) {
      console.error("Ban toggle error:", error);
      return { success: false, error: "Failed to update ban status" };
    }
  };

  const value = {
    isAuthenticated,
    isBanned,
    isLoading,
    user,
    login,
    logout,
    toggleBan
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
