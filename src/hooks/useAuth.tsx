
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, Session } from "@supabase/supabase-js";

// Define the user profile interface that matches our database
interface UserProfile {
  id: string;
  name: string;
  email: string;
  age?: number;
  topic?: string;
  goals?: string[];
  isSubscribed: boolean;
  isBanned: boolean;
  isAdmin: boolean;
  groupId?: string;
}

// Define the auth context type
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (userData: { email: string; password: string; name?: string; age?: number; topic?: string; goals?: string[] }) => 
    Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Transform Supabase profile data to our UserProfile format
const transformProfileData = (profile: any): UserProfile => {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    age: profile.age,
    topic: profile.topic,
    goals: profile.goals || [],
    isSubscribed: profile.is_subscribed || false,
    isBanned: profile.is_banned || false,
    isAdmin: profile.is_admin || false,
    groupId: profile.group_id
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Set up auth state listener FIRST (important order)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event, newSession?.user?.id);
        setSession(newSession);
        
        if (newSession) {
          setIsAuthenticated(true);
          // Fetch the user profile from our profiles table
          await refreshUserProfile(newSession.user.id);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setSession(session);
          setIsAuthenticated(true);
          await refreshUserProfile(session.user.id);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Helper function to refresh the user profile
  const refreshUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return;
      }

      if (profile) {
        const userProfile = transformProfileData(profile);
        setUser(userProfile);
      }
    } catch (error) {
      console.error("Error refreshing user profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast.error(error.message);
        return { success: false, error: error.message };
      }
      
      // Auth state listener will handle setting the user
      return { success: true };
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Failed to sign in");
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error("Failed to sign out");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: { email: string; password: string; name?: string; age?: number; topic?: string; goals?: string[] }) => {
    try {
      setIsLoading(true);
      
      // Modified registration to use signUp instead of custom implementation
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            age: userData.age,
            topic: userData.topic,
            goals: userData.goals
          }
        }
      });
      
      if (error) {
        console.error("Registration error:", error);
        toast.error(error.message);
        return { success: false, error: error.message };
      }
      
      // Success - for now we'll skip subscription check since it will be implemented later
      toast.success("Registration successful!");
      
      // Automatically log in the user after successful registration
      if (data.user) {
        // Note: No need to manually log in, the auth state change will handle this
        return { success: true };
      }
      
      return { success: true };
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error("Failed to register");
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      setIsLoading(true);
      
      if (!user?.id) {
        return { success: false, error: "User not authenticated" };
      }
      
      // Convert from camelCase to snake_case for Supabase
      const profileData: any = {};
      if (data.name) profileData.name = data.name;
      if (data.age !== undefined) profileData.age = data.age;
      if (data.topic) profileData.topic = data.topic;
      if (data.goals) profileData.goals = data.goals;
      
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);
      
      if (error) {
        toast.error(error.message);
        return { success: false, error: error.message };
      }
      
      // Refresh user profile
      await refreshUserProfile(user.id);
      
      toast.success("Profile updated successfully");
      return { success: true };
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile");
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    session,
    login,
    logout,
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
