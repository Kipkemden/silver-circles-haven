import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

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

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (userData: { email: string; password: string; name?: string; age?: number; topic?: string; goals?: string[] }) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const transformProfileData = (profile: any): UserProfile => ({
  id: profile.id,
  name: profile.name || "",
  email: profile.email,
  age: profile.age,
  topic: profile.topic,
  goals: profile.goals || [],
  isSubscribed: profile.is_subscribed || false,
  isBanned: profile.is_banned || false,
  isAdmin: profile.is_admin || false,
  groupId: profile.group_id,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        if (newSession) {
          setIsAuthenticated(true);
          await refreshUserProfile(newSession.user.id);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
        setIsLoading(false);
      }
    );

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (session) {
          setSession(session);
          setIsAuthenticated(true);
          await refreshUserProfile(session.user.id);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        toast.error("Failed to verify authentication. Please try logging in again.");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
    return () => subscription.unsubscribe();
  }, []);

  const refreshUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setUser(transformProfileData(profile));
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Failed to load user profile");
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setSession(data.session);
      setIsAuthenticated(true);
      await refreshUserProfile(data.user.id);
      navigate("/dashboard");
      toast.success("Signed in successfully");
      return { success: true };
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Failed to sign in: " + error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      toast.success("Signed out successfully");
      navigate("/login");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error("Failed to sign out: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    name?: string;
    age?: number;
    topic?: string;
    goals?: string[];
  }) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            age: userData.age,
            topic: userData.topic,
            goals: userData.goals,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        await supabase.from("profiles").insert({
          id: data.user.id,
          email: userData.email,
          name: userData.name,
          age: userData.age,
          topic: userData.topic,
          goals: userData.goals,
        });
      }

      toast.success("Registration successful! Please check your email to verify your account.");
      return { success: true };
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error("Failed to register: " + error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      user,
      session,
      login,
      logout,
      register,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};