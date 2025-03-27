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

interface ProfileRow {
  id: string;
  name: string;
  email: string;
  age?: number;
  topic?: string;
  goals?: string[];
  is_subscribed: boolean;
  is_banned: boolean;
  is_admin: boolean;
  created_at?: string;
  group_id?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (
    userData: {
      email: string;
      password: string;
      name?: string;
      age?: number;
      topic?: string;
      goals?: string[];
    }
  ) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const transformProfileData = (profile: any): UserProfile => {
  return {
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
  };
};

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
          setIsLoading(false);
          navigate("/login");
        }
      }
    );

    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session) {
          setSession(session);
          setIsAuthenticated(true);
          await refreshUserProfile(session.user.id);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        toast.error("Failed to verify authentication. Please try logging in again.");
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => subscription.unsubscribe();
  }, [navigate]);

  const refreshUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (!profile) {
        const newProfileData: ProfileRow = {
          id: userId,
          email: session?.user.email || "",
          name: "",
          age: undefined,
          topic: undefined,
          goals: undefined,
          is_subscribed: false,
          is_banned: false,
          is_admin: false,
          group_id: undefined,
        };
        const { data: insertedProfile, error: insertError } = await supabase
          .from("profiles")
          .insert([newProfileData])
          .select()
          .single();
        if (insertError) throw insertError;
        setUser(transformProfileData(insertedProfile));
      } else {
        setUser(transformProfileData(profile));
      }
    } catch (error) {
      console.error("Error refreshing/creating profile:", error);
      toast.error("Failed to load user profile. Please try again.");
      setUser(null);
      setIsAuthenticated(false);
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

      navigate("/dashboard");
      return { success: true };
    } catch (error: any) {
      console.error("Unexpected login error:", error);
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

  const register = async (
    userData: {
      email: string;
      password: string;
      name?: string;
      age?: number;
      topic?: string;
      goals?: string[];
    }
  ) => {
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

      if (error) {
        toast.error(error.message);
        return { success: false, error: error.message };
      }

      if (data.user) {
        const newProfileData: ProfileRow = {
          id: data.user.id,
          email: userData.email,
          name: userData.name || "",
          age: userData.age,
          topic: userData.topic,
          goals: userData.goals || [],
          is_subscribed: false,
          is_banned: false,
          is_admin: false,
          group_id: undefined,
        };
        const { error: insertError } = await supabase
          .from("profiles")
          .insert([newProfileData]);
        if (insertError) throw insertError;
      }

      toast.success("Registration successful! Check your email to confirm your account.");
      return { success: true };
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error("Failed to register: " + error.message);
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

      const profileData: Partial<ProfileRow> = {};
      if (data.name) profileData.name = data.name;
      if (data.age !== undefined) profileData.age = data.age;
      if (data.topic) profileData.topic = data.topic;
      if (data.goals) profileData.goals = data.goals;
      if (data.groupId) profileData.group_id = data.groupId;

      const { data: updatedProfile, error } = await supabase
        .from("profiles")
        .update(profileData)
        .eq("id", user.id)
        .select()
        .single();

      if (error) {
        toast.error(error.message);
        return { success: false, error: error.message };
      }

      setUser(transformProfileData(updatedProfile));
      toast.success("Profile updated successfully");
      return { success: true };
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile: " + error.message);
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
    updateProfile,
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