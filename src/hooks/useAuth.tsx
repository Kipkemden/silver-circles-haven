import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, Session } from "@supabase/supabase-js";

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

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event, newSession?.user?.id);
        setSession(newSession);

        if (newSession) {
          setIsAuthenticated(true);
          await refreshUserProfile(newSession.user.id);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    );

    const initializeAuth = async () => {
      try {
        console.log("Initializing auth...");
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log("Session check:", { session: session ? "exists" : "null", error });

        if (error) throw error;
        if (session) {
          setSession(session);
          setIsAuthenticated(true);
          await refreshUserProfile(session.user.id);
        } else {
          console.log("No active session found");
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        toast.error("Authentication failed. Please try again.");
      } finally {
        setIsLoading(false);
        console.log("Auth initialization complete");
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const refreshUserProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for userId:", userId);
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      console.log("Profile fetch result:", { profile, error });
      if (error && error.code !== "PGRST116") { // PGRST116 = no rows found
        console.error("Profile fetch error:", error);
        throw error;
      }

      if (!profile) {
        console.log("No profile found, creating one...");
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
        console.log("Inserting profile:", newProfileData);
        const { data: insertedProfile, error: insertError } = await supabase
          .from("profiles")
          .insert([newProfileData])
          .select()
          .single();
        console.log("Insert result:", { insertedProfile, insertError });
        if (insertError) throw insertError;
        const transformedProfile = transformProfileData(insertedProfile);
        setUser(transformedProfile);
        console.log("User profile set:", transformedProfile);
      } else {
        const transformedProfile = transformProfileData(profile);
        setUser(transformedProfile);
        console.log("User profile set:", transformedProfile);
      }
    } catch (error) {
      console.error("Error refreshing/creating profile:", error);
      toast.error("Failed to load user profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log("Attempting login for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("Login result:", { user: data?.user?.id, error });
      if (error) {
        console.error("Login error:", error);
        toast.error(error.message);
        return { success: false, error: error.message };
      }

      console.log("Login successful, user:", data.user.id);
      return { success: true };
    } catch (error: any) {
      console.error("Unexpected login error:", error);
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
      console.log("Registering user:", userData.email);
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

      console.log("Register result:", { user: data?.user?.id, error });
      if (error) {
        console.error("Registration error:", error);
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
        console.log("Inserting profile after signup:", newProfileData);
        const { data: insertedProfile, error: insertError } = await supabase
          .from("profiles")
          .insert([newProfileData])
          .select()
          .single();
        console.log("Insert result:", { insertedProfile, insertError });
        if (insertError) throw insertError;
      }

      toast.success("Registration successful! Check your email to confirm your account.");
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

      const profileData: Partial<ProfileRow> = {};
      if (data.name) profileData.name = data.name;
      if (data.age !== undefined) profileData.age = data.age;
      if (data.topic) profileData.topic = data.topic;
      if (data.goals) profileData.goals = data.goals;
      if (data.groupId) profileData.group_id = data.groupId;

      console.log("Updating profile for user:", user.id, "with data:", profileData);
      const { data: updatedProfile, error } = await supabase
        .from("profiles")
        .update(profileData)
        .eq("id", user.id)
        .select()
        .single();

      if (error) {
        console.error("Profile update error:", error);
        toast.error(error.message);
        return { success: false, error: error.message };
      }

      const transformedProfile = transformProfileData(updatedProfile);
      setUser(transformedProfile);
      console.log("User profile set:", transformedProfile);
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