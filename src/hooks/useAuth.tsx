
import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User as ApiUser } from "@/services/api";
import { User, Session } from "@supabase/supabase-js";

type AuthContextType = {
  isAuthenticated: boolean;
  isBanned: boolean;
  isLoading: boolean;
  user: ApiUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  toggleBan: (userId: string, shouldBan: boolean) => Promise<{ success: boolean; error?: string }>;
  register: (userData: Partial<ApiUser>) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (userId: string, data: Partial<ApiUser>) => Promise<{ success: boolean; error?: string, user?: ApiUser }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isBanned, setIsBanned] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<ApiUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  // Transform Supabase user to our API User format
  const transformSupabaseUser = async (supabaseUser: User | null): Promise<ApiUser | null> => {
    if (!supabaseUser) return null;
    
    try {
      // For now, create a minimal user object with the data we have
      const apiUser: ApiUser = {
        id: supabaseUser.id,
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
        email: supabaseUser.email || '',
        age: supabaseUser.user_metadata?.age || 0,
        topic: supabaseUser.user_metadata?.topic || '',
        goals: supabaseUser.user_metadata?.goals || [],
        isSubscribed: false,
        isBanned: false,
        isAdmin: false,
      };
      
      return apiUser;
    } catch (error) {
      console.error("Error transforming user:", error);
      return null;
    }
  };

  useEffect(() => {
    // Check if user is already authenticated on mount
    const checkAuthStatus = async () => {
      setIsLoading(true);
      
      try {
        // Set up auth state listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log("Auth state changed:", event, session);
            setSession(session);
            
            if (session) {
              const apiUser = await transformSupabaseUser(session.user);
              setUser(apiUser);
              setIsAuthenticated(true);
              setIsBanned(apiUser?.isBanned || false);
            } else {
              setUser(null);
              setIsAuthenticated(false);
              setIsBanned(false);
            }
          }
        );

        // THEN check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setSession(session);
          const apiUser = await transformSupabaseUser(session.user);
          setUser(apiUser);
          setIsAuthenticated(true);
          setIsBanned(apiUser?.isBanned || false);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          setIsBanned(false);
        }

        return () => subscription.unsubscribe();
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Login error:", error);
        toast.error(error.message);
        return { success: false, error: error.message };
      }
      
      if (data.user) {
        const apiUser = await transformSupabaseUser(data.user);
        
        if (apiUser) {
          setIsAuthenticated(true);
          setIsBanned(apiUser.isBanned || false);
          setUser(apiUser);
          
          toast.success("Login successful!");
          return { success: true };
        }
      }
      
      return { success: false, error: "Login failed" };
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
      return { success: false, error: error.message || "Login failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error);
        throw error;
      }
      
      setIsAuthenticated(false);
      setIsBanned(false);
      setUser(null);
      setSession(null);
      
      toast.success("Logged out successfully");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<ApiUser>) => {
    try {
      setIsLoading(true);
      console.log("Registering with data:", userData);
      
      // Register with Supabase auth
      const { data, error } = await supabase.auth.signUp({
        email: userData.email || '',
        password: userData.password as string || '',
        options: {
          data: {
            name: userData.name,
            age: userData.age,
            topic: userData.topic,
            goals: userData.goals,
          },
        },
      });
      
      if (error) {
        console.error("Registration error:", error);
        toast.error(error.message);
        return { success: false, error: error.message };
      }
      
      if (data.user) {
        console.log("User registered successfully:", data.user);
        const apiUser = await transformSupabaseUser(data.user);
        
        if (apiUser) {
          setIsAuthenticated(true);
          setIsBanned(false);
          setUser(apiUser);
          
          toast.success("Registration successful!");
          return { success: true };
        }
      }
      
      return { success: false, error: "Registration failed" };
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
      return { success: false, error: error.message || "Registration failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userId: string, data: Partial<ApiUser>) => {
    try {
      // Update user metadata in Supabase Auth
      const { error } = await supabase.auth.updateUser({
        data: {
          name: data.name,
          age: data.age,
          topic: data.topic,
          goals: data.goals,
        }
      });
      
      if (error) {
        toast.error(error.message);
        return { success: false, error: error.message };
      }
      
      // If updating the current user, refresh the user state
      if (user && user.id === userId) {
        const currentUser = await supabase.auth.getUser();
        if (currentUser.data.user) {
          const updatedApiUser = await transformSupabaseUser(currentUser.data.user);
          if (updatedApiUser) {
            setUser(updatedApiUser);
            toast.success("Profile updated successfully!");
            return { success: true, user: updatedApiUser };
          }
        }
      }
      
      toast.success("Profile updated successfully!");
      return { success: true };
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error("Profile update failed. Please try again.");
      return { success: false, error: error.message || "Profile update failed" };
    }
  };

  const toggleBan = async (userId: string, shouldBan: boolean) => {
    try {
      // In a real implementation, we would update a field in the database
      // For now, just show success message
      
      // If the banned user is the current user, update the state
      if (user && user.id === userId) {
        setIsBanned(shouldBan);
        setUser({ ...user, isBanned: shouldBan });
      }
      
      toast.success(`User ${shouldBan ? "banned" : "unbanned"} successfully`);
      return { success: true };
    } catch (error: any) {
      console.error("Ban toggle error:", error);
      return { success: false, error: error.message || "Failed to update ban status" };
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
