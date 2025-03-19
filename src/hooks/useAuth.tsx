
import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { api } from "@/services/api";
import { toast } from "sonner";
import { User } from "@/services/api";

type AuthContextType = {
  isAuthenticated: boolean;
  isBanned: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  toggleBan: (userId: string, shouldBan: boolean) => Promise<{ success: boolean; error?: string }>;
  register: (userData: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (userId: string, data: Partial<User>) => Promise<{ success: boolean; error?: string, user?: User }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isBanned, setIsBanned] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already authenticated on mount
    const checkAuthStatus = async () => {
      setIsLoading(true);
      
      try {
        // Use the API service to check auth status
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
        
        // Store authentication state in localStorage
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("isBanned", user.isBanned ? "true" : "false");
        
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
      
      // Clear authentication state from localStorage
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("isBanned");
      localStorage.removeItem("currentUser");
      
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User>) => {
    try {
      setIsLoading(true);
      const { user, error } = await api.auth.signUp(userData);
      
      if (error) {
        toast.error(error);
        return { success: false, error };
      }
      
      if (user) {
        setIsAuthenticated(true);
        setIsBanned(false);
        setUser(user);
        
        // Store authentication state in localStorage
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("isBanned", "false");
        
        toast.success("Registration successful!");
        return { success: true };
      }
      
      return { success: false, error: "Registration failed" };
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
      return { success: false, error: "Registration failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userId: string, data: Partial<User>) => {
    try {
      const { data: updatedUser, error } = await api.users.update(userId, data);
      
      if (error) {
        toast.error(error);
        return { success: false, error };
      }
      
      if (updatedUser && user && user.id === userId) {
        setUser(updatedUser);
        toast.success("Profile updated successfully!");
        return { success: true, user: updatedUser };
      }
      
      return { success: true };
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Profile update failed. Please try again.");
      return { success: false, error: "Profile update failed" };
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
    toggleBan,
    register,
    updateProfile
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
