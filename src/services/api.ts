
import { toast } from "sonner";

// Mock user types
export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  topic: string;
  goals?: string[];
  isSubscribed: boolean;
  groupId?: string;
  isBanned: boolean;
}

export interface Group {
  id: string;
  name: string;
  facilitatorId: string;
  facilitatorName: string;
  zoomLink: string;
  schedule: string;
  memberCount: number;
}

export interface Meeting {
  id: string;
  groupId: string;
  groupName: string;
  date: string;
  zoomLink: string;
  topic: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  userId: string;
  userName?: string;
  groupId?: string | null;
  isPublic: boolean;
  createdAt: string;
  forumType?: string;
}

// Mock database
const mockUsers: User[] = [
  {
    id: "u1",
    name: "Margaret Williams",
    email: "margaret.w@example.com",
    age: 65,
    topic: "Retirement",
    goals: ["Find purpose", "Meet peers"],
    isSubscribed: true,
    groupId: "g1",
    isBanned: false,
  },
  {
    id: "u2",
    name: "Robert Thompson",
    email: "robert.t@example.com",
    age: 62,
    topic: "Dating",
    goals: ["Meet new people", "Build confidence"],
    isSubscribed: true,
    groupId: "g3",
    isBanned: false,
  },
  {
    id: "u3",
    name: "Carol Lewis",
    email: "carol.l@example.com",
    age: 58,
    topic: "Retirement",
    goals: ["Financial security", "Social connection"],
    isSubscribed: true,
    groupId: "g2",
    isBanned: false,
  },
  {
    id: "u4",
    name: "James Parker",
    email: "james.p@example.com",
    age: 52,
    topic: "Dating",
    goals: ["Dating confidence", "Find companionship"],
    isSubscribed: false,
    groupId: "g4",
    isBanned: true,
  },
  {
    id: "u5",
    name: "Patricia Harris",
    email: "patricia.h@example.com",
    age: 68,
    topic: "Retirement",
    goals: ["Stay active", "Community"],
    isSubscribed: true,
    groupId: "g1",
    isBanned: false,
  },
];

const mockGroups: Group[] = [
  {
    id: "g1",
    name: "Retirement Circle #1",
    facilitatorId: "f1",
    facilitatorName: "Dr. Sarah Johnson",
    zoomLink: "https://zoom.us/j/1234567890?pwd=abcdef",
    schedule: "Weekly, Wednesday 10:00 AM EST",
    memberCount: 8,
  },
  {
    id: "g2",
    name: "Retirement Circle #2",
    facilitatorId: "f2",
    facilitatorName: "Dr. Michael Chen",
    zoomLink: "https://zoom.us/j/0987654321?pwd=ghijkl",
    schedule: "Weekly, Thursday 2:00 PM EST",
    memberCount: 6,
  },
  {
    id: "g3",
    name: "Silver Singles #1",
    facilitatorId: "f3",
    facilitatorName: "Dr. Emily Brooks",
    zoomLink: "https://zoom.us/j/5647382910?pwd=mnopqr",
    schedule: "Weekly, Monday 7:00 PM EST",
    memberCount: 7,
  },
  {
    id: "g4",
    name: "Silver Singles #2",
    facilitatorId: "f4",
    facilitatorName: "Dr. Robert Davis",
    zoomLink: "https://zoom.us/j/1029384756?pwd=stuvwx",
    schedule: "Weekly, Tuesday 4:00 PM EST",
    memberCount: 5,
  },
];

const mockMeetings: Meeting[] = [
  {
    id: "m1",
    groupId: "g1",
    groupName: "Retirement Circle #1",
    date: "2024-01-10T15:00:00Z",
    zoomLink: "https://zoom.us/j/1234567890?pwd=abcdef",
    topic: "Finding Purpose After Retirement",
  },
  {
    id: "m2",
    groupId: "g3",
    groupName: "Silver Singles #1",
    date: "2024-01-12T00:00:00Z",
    zoomLink: "https://zoom.us/j/5647382910?pwd=mnopqr",
    topic: "Building Confidence in Dating",
  },
  {
    id: "m3",
    groupId: "g2",
    groupName: "Retirement Circle #2",
    date: "2024-01-14T19:00:00Z",
    zoomLink: "https://zoom.us/j/0987654321?pwd=ghijkl",
    topic: "Financial Security in Retirement",
  },
];

const mockPosts: Post[] = [
  {
    id: "p1",
    title: "I wish I'd planned for retirement earlier",
    content: "Looking back, I should have started my retirement planning in my 40s. Anyone else feel the same way?",
    userId: "u1",
    userName: "Margaret W.",
    groupId: null,
    isPublic: true,
    createdAt: "2023-12-10T14:30:00Z",
    forumType: "retirement-tips",
  },
  {
    id: "p2",
    title: "Dating after divorce - how to start?",
    content: "After 25 years of marriage and now divorced, I'm not sure how to jump back into dating. Any advice?",
    userId: "u2",
    userName: "Robert T.",
    groupId: null,
    isPublic: true,
    createdAt: "2023-12-11T09:15:00Z",
    forumType: "dating-after-50",
  },
  {
    id: "p3",
    title: "Health insurance options post-retirement?",
    content: "I'm retiring next year before Medicare eligibility. What are my best options for health coverage?",
    userId: "u3",
    userName: "Carol L.",
    groupId: null,
    isPublic: true,
    createdAt: "2023-12-12T18:45:00Z",
    forumType: "ask-the-community",
  },
  {
    id: "p4",
    title: "First date success story!",
    content: "Had my first date in 15 years yesterday and it went surprisingly well! Nervous but excited for date #2.",
    userId: "u4",
    userName: "James P.",
    groupId: "g3",
    isPublic: false,
    createdAt: "2023-12-13T20:00:00Z",
  },
  {
    id: "p5",
    title: "My retirement hobby turned into income",
    content: "Started woodworking as a hobby after retiring and now I'm selling pieces at local markets!",
    userId: "u5",
    userName: "Patricia H.",
    groupId: "g1",
    isPublic: false,
    createdAt: "2023-12-14T11:30:00Z",
  },
];

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API Service (Mock for now, would connect to Supabase in production)
export const api = {
  // Auth methods
  auth: {
    signUp: async (userData: Partial<User>) => {
      await delay(800);
      const newUser = {
        id: `u${mockUsers.length + 1}`,
        name: userData.name || "",
        email: userData.email || "",
        age: userData.age || 45,
        topic: userData.topic || "Retirement",
        goals: userData.goals || [],
        isSubscribed: false,
        isBanned: false,
      };
      
      mockUsers.push(newUser as User);
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      localStorage.setItem("isAuthenticated", "true");
      
      return { user: newUser, error: null };
    },
    
    signIn: async (email: string, password: string) => {
      await delay(800);
      const user = mockUsers.find(u => u.email === email);
      
      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("isBanned", user.isBanned ? "true" : "false");
        return { user, error: null };
      }
      
      return { user: null, error: "Invalid credentials" };
    },
    
    signOut: async () => {
      await delay(300);
      localStorage.removeItem("currentUser");
      localStorage.setItem("isAuthenticated", "false");
      return { error: null };
    },
    
    getCurrentUser: () => {
      const userData = localStorage.getItem("currentUser");
      return userData ? JSON.parse(userData) : null;
    }
  },
  
  // User methods
  users: {
    getAll: async () => {
      await delay(500);
      return { data: mockUsers, error: null };
    },
    
    get: async (id: string) => {
      await delay(300);
      const user = mockUsers.find(u => u.id === id);
      return { data: user, error: user ? null : "User not found" };
    },
    
    update: async (id: string, updates: Partial<User>) => {
      await delay(500);
      const index = mockUsers.findIndex(u => u.id === id);
      
      if (index >= 0) {
        mockUsers[index] = { ...mockUsers[index], ...updates };
        
        // If updating current user, update localStorage
        const currentUser = api.auth.getCurrentUser();
        if (currentUser && currentUser.id === id) {
          localStorage.setItem("currentUser", JSON.stringify(mockUsers[index]));
        }
        
        return { data: mockUsers[index], error: null };
      }
      
      return { data: null, error: "User not found" };
    },
    
    toggleBan: async (id: string, shouldBan: boolean) => {
      await delay(400);
      try {
        const { data, error } = await api.users.update(id, { isBanned: shouldBan });
        if (error) throw new Error(error);
        
        toast.success(`User ${shouldBan ? "banned" : "unbanned"} successfully`);
        return { success: true, data };
      } catch (error) {
        toast.error(`Failed to ${shouldBan ? "ban" : "unban"} user`);
        return { success: false, error };
      }
    }
  },
  
  // Group methods
  groups: {
    getAll: async () => {
      await delay(600);
      return { data: mockGroups, error: null };
    },
    
    get: async (id: string) => {
      await delay(300);
      const group = mockGroups.find(g => g.id === id);
      return { data: group, error: group ? null : "Group not found" };
    },
    
    create: async (groupData: Omit<Group, "id">) => {
      await delay(700);
      const newGroup = {
        id: `g${mockGroups.length + 1}`,
        ...groupData
      };
      
      mockGroups.push(newGroup);
      return { data: newGroup, error: null };
    },
    
    update: async (id: string, updates: Partial<Group>) => {
      await delay(500);
      const index = mockGroups.findIndex(g => g.id === id);
      
      if (index >= 0) {
        mockGroups[index] = { ...mockGroups[index], ...updates };
        return { data: mockGroups[index], error: null };
      }
      
      return { data: null, error: "Group not found" };
    },
    
    delete: async (id: string) => {
      await delay(600);
      const index = mockGroups.findIndex(g => g.id === id);
      
      if (index >= 0) {
        mockGroups.splice(index, 1);
        return { error: null };
      }
      
      return { error: "Group not found" };
    }
  },
  
  // Meeting methods
  meetings: {
    getAll: async () => {
      await delay(500);
      return { data: mockMeetings, error: null };
    },
    
    getByGroup: async (groupId: string) => {
      await delay(400);
      const meetings = mockMeetings.filter(m => m.groupId === groupId);
      return { data: meetings, error: null };
    },
    
    create: async (meetingData: Omit<Meeting, "id">) => {
      await delay(600);
      const newMeeting = {
        id: `m${mockMeetings.length + 1}`,
        ...meetingData
      };
      
      mockMeetings.push(newMeeting);
      return { data: newMeeting, error: null };
    },
    
    update: async (id: string, updates: Partial<Meeting>) => {
      await delay(500);
      const index = mockMeetings.findIndex(m => m.id === id);
      
      if (index >= 0) {
        mockMeetings[index] = { ...mockMeetings[index], ...updates };
        return { data: mockMeetings[index], error: null };
      }
      
      return { data: null, error: "Meeting not found" };
    },
    
    delete: async (id: string) => {
      await delay(500);
      const index = mockMeetings.findIndex(m => m.id === id);
      
      if (index >= 0) {
        mockMeetings.splice(index, 1);
        return { error: null };
      }
      
      return { error: "Meeting not found" };
    }
  },
  
  // Posts methods
  posts: {
    getAll: async () => {
      await delay(600);
      return { data: mockPosts, error: null };
    },
    
    getPublic: async (forumType?: string) => {
      await delay(500);
      let posts = mockPosts.filter(p => p.isPublic);
      
      if (forumType) {
        posts = posts.filter(p => p.forumType === forumType);
      }
      
      return { data: posts, error: null };
    },
    
    getByGroup: async (groupId: string) => {
      await delay(400);
      const posts = mockPosts.filter(p => p.groupId === groupId);
      return { data: posts, error: null };
    },
    
    create: async (postData: Omit<Post, "id" | "createdAt">) => {
      await delay(700);
      const newPost = {
        id: `p${mockPosts.length + 1}`,
        ...postData,
        createdAt: new Date().toISOString()
      };
      
      mockPosts.push(newPost);
      return { data: newPost, error: null };
    },
    
    update: async (id: string, updates: Partial<Post>) => {
      await delay(500);
      const index = mockPosts.findIndex(p => p.id === id);
      
      if (index >= 0) {
        mockPosts[index] = { ...mockPosts[index], ...updates };
        return { data: mockPosts[index], error: null };
      }
      
      return { data: null, error: "Post not found" };
    },
    
    delete: async (id: string) => {
      await delay(600);
      const index = mockPosts.findIndex(p => p.id === id);
      
      if (index >= 0) {
        mockPosts.splice(index, 1);
        return { error: null };
      }
      
      return { error: "Post not found" };
    }
  },
  
  // Subscription methods
  subscriptions: {
    create: async (userId: string) => {
      await delay(900);
      // In production, this would create Stripe subscription
      const index = mockUsers.findIndex(u => u.id === userId);
      
      if (index >= 0) {
        mockUsers[index].isSubscribed = true;
        
        // Update currentUser if needed
        const currentUser = api.auth.getCurrentUser();
        if (currentUser && currentUser.id === userId) {
          currentUser.isSubscribed = true;
          localStorage.setItem("currentUser", JSON.stringify(currentUser));
        }
        
        return { data: { success: true }, error: null };
      }
      
      return { data: null, error: "User not found" };
    },
    
    cancel: async (userId: string) => {
      await delay(800);
      // In production, this would cancel Stripe subscription
      const index = mockUsers.findIndex(u => u.id === userId);
      
      if (index >= 0) {
        mockUsers[index].isSubscribed = false;
        
        // Update currentUser if needed
        const currentUser = api.auth.getCurrentUser();
        if (currentUser && currentUser.id === userId) {
          currentUser.isSubscribed = false;
          localStorage.setItem("currentUser", JSON.stringify(currentUser));
        }
        
        return { data: { success: true }, error: null };
      }
      
      return { data: null, error: "User not found" };
    }
  }
};

// Helper to setup mock data for testing
export const setupMockData = () => {
  // You can call this function to setup initial mock data if needed
  console.log("Mock data setup completed");
};
