import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Lock, MessageSquare, PlusCircle, Search, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ForumPost from "@/components/ForumPost";
import SubscriptionCTA from "@/components/SubscriptionCTA";

const publicForums = {
  "retirement-tips": {
    id: "retirement-tips",
    name: "Retirement Tips",
    description: "Share advice and experiences about retirement planning and adjusting to post-work life.",
    posts: [
      {
        id: "rt1",
        title: "Retirement Tips: I wish I'd planned earlier!",
        content: "After 30 years at the same company, retirement hit me like a ton of bricks. I wish I had prepared myself mentally, not just financially. Here's what I learned: start building hobbies and interests outside work at least 5 years before you plan to retire. The social and purpose aspects are the hardest to replace.",
        createdAt: "2023-11-15T10:30:00Z",
        likesCount: 24,
        commentsCount: 18,
        author: { name: "Margaret W.", avatar: "https://randomuser.me/api/portraits/women/65.jpg" },
      },
      {
        id: "rt2",
        title: "How I found purpose after corporate life",
        content: "The first 6 months of retirement were honestly a bit depressing. I missed the structure and the feeling of accomplishment from my executive role. What turned things around was volunteering with a local literacy program. Teaching adults to read gave me the same sense of purpose but with more flexibility and less stress.",
        createdAt: "2023-11-25T09:45:00Z",
        likesCount: 32,
        commentsCount: 15,
        author: { name: "Thomas J.", avatar: "https://randomuser.me/api/portraits/men/45.jpg" },
      },
      {
        id: "rt3",
        title: "Financial freedom at 60 - my journey",
        content: "I started serious retirement planning at 45, and it was almost too late. Here's my advice: max out catch-up contributions to your 401(k) after 50, consider downsizing earlier than you think necessary, and be realistic about healthcare costs. The peace of mind from financial security is priceless.",
        createdAt: "2023-12-02T11:20:00Z",
        likesCount: 45,
        commentsCount: 22,
        author: { name: "Diane M.", avatar: "https://randomuser.me/api/portraits/women/32.jpg" },
      },
    ],
  },
  "dating-after-50": {
    id: "dating-after-50",
    name: "Dating After 50",
    description: "Navigate the world of dating and relationships in your silver years.",
    posts: [
      {
        id: "da1",
        title: "Dating after 60: My experience with online dating apps",
        content: "I never thought I'd be using dating apps at 62, but here I am! It's been quite the journey with some hilarious stories to share. The good news is that authentic connections are possible. My advice: be completely honest in your profile, use recent photos, and take your time getting to know people before meeting.",
        createdAt: "2023-11-20T14:45:00Z",
        likesCount: 36,
        commentsCount: 29,
        author: { name: "Robert T.", avatar: "https://randomuser.me/api/portraits/men/62.jpg" },
      },
      {
        id: "da2",
        title: "Finding love again after loss",
        content: "After losing my husband of 30 years, I didn't think I'd ever feel ready to date again. It took three years of grief and healing before I could consider opening my heart. If you're in this position, be patient with yourself. There's no timeline for grief, and it's okay to take things slowly.",
        createdAt: "2023-11-28T16:30:00Z",
        likesCount: 41,
        commentsCount: 27,
        author: { name: "Helen P.", avatar: "https://randomuser.me/api/portraits/women/58.jpg" },
      },
      {
        id: "da3",
        title: "Balancing dating with grandparenting",
        content: "My biggest challenge dating at 56 is balancing my love life with my role as a grandparent. I help watch my grandkids three days a week, which limits my availability. Has anyone else successfully navigated this? I'm looking for a partner who understands that my family comes first.",
        createdAt: "2023-12-10T13:15:00Z",
        likesCount: 29,
        commentsCount: 18,
        author: { name: "James L.", avatar: "https://randomuser.me/api/portraits/men/52.jpg" },
      },
    ],
  },
  "ask-the-community": {
    id: "ask-the-community",
    name: "Ask the Community",
    description: "General questions and discussions for the Silver Circles community.",
    posts: [
      {
        id: "ac1",
        title: "Found a new purpose through volunteering",
        content: "After retirement, I felt lost without my daily work routine. Volunteering at the local community garden gave me a new sense of purpose and wonderful new friends. If you're feeling adrift, I highly recommend finding a cause you care about and giving your time.",
        createdAt: "2023-12-05T09:15:00Z",
        likesCount: 42,
        commentsCount: 12,
        author: { name: "Carol L.", avatar: "https://randomuser.me/api/portraits/women/42.jpg" },
      },
      {
        id: "ac2",
        title: "Relocating for retirement - worth it?",
        content: "We're considering selling our home in the Northeast and moving to a warmer climate for retirement. Has anyone made a major move after 60? What unexpected challenges did you face? We're worried about leaving our social network behind.",
        createdAt: "2023-12-12T15:45:00Z",
        likesCount: 38,
        commentsCount: 31,
        author: { name: "Michael B.", avatar: "https://randomuser.me/api/portraits/men/39.jpg" },
      },
      {
        id: "ac3",
        title: "Technology help for seniors",
        content: "My children gave me a new iPad, but I'm struggling to use it effectively. Are there any good resources specifically designed to help older adults learn new technology? I don't want to always be calling my kids for help with basic tasks.",
        createdAt: "2023-12-18T11:30:00Z",
        likesCount: 27,
        commentsCount: 24,
        author: { name: "Patricia H.", avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
      },
    ],
  },
};

const privateForums = {
  "my-circle": {
    id: "my-circle",
    name: "Your Private Circle",
    description: "A safe space for your circle members to connect and share.",
    posts: [
      {
        id: "pc1",
        title: "What surprised you most about retirement?",
        content: "I've been retired for 3 months now, and I was surprised by how much I miss the social aspect of work more than the work itself. Has anyone else experienced this? I'm trying to find new ways to connect with people.",
        createdAt: "2023-12-15T14:30:00Z",
        likesCount: 12,
        commentsCount: 8,
        author: { name: "David S.", avatar: "https://randomuser.me/api/portraits/men/55.jpg" },
      },
      {
        id: "pc2",
        title: "Travel plans for 2024?",
        content: "Now that I have more flexibility, I'm planning my first big trip in May. Anyone have recommendations for senior-friendly destinations that aren't too crowded? I'm considering Portugal or Croatia.",
        createdAt: "2023-12-18T10:15:00Z",
        likesCount: 15,
        commentsCount: 10,
        author: { name: "Linda M.", avatar: "https://randomuser.me/api/portraits/women/52.jpg" },
      },
      {
        id: "pc3",
        title: "Thoughts from our last meeting",
        content: "I really appreciated everyone's insights during our discussion about finding purpose. The suggestion about mentoring younger professionals in my field has given me a lot to think about. Has anyone else started implementing ideas from our meeting?",
        createdAt: "2023-12-20T16:45:00Z",
        likesCount: 18,
        commentsCount: 14,
        author: { name: "Richard K.", avatar: "https://randomuser.me/api/portraits/men/67.jpg" },
      },
    ],
  },
};

const ForumPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [currentForum, setCurrentForum] = useState<any>(null);
  const [showComposeForm, setShowComposeForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [forumType, setForumType] = useState<"public" | "private">("public");
  const [forumId, setForumId] = useState<string | undefined>(id);

  useEffect(() => {
    const path = window.location.pathname;
    const pathParts = path.split("/");

    if (pathParts.includes("private")) {
      setForumType("private");
      const privateId = pathParts[pathParts.indexOf("private") + 1];
      setForumId(privateId || "my-circle");
    } else {
      setForumType("public");
      const publicId = pathParts[pathParts.indexOf("public") + 1];
      setForumId(publicId || "retirement-tips");
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (forumType === "public") {
      const validId = forumId || "retirement-tips";
      if (publicForums[validId as keyof typeof publicForums]) {
        setCurrentForum(publicForums[validId as keyof typeof publicForums]);
        setFilteredPosts(publicForums[validId as keyof typeof publicForums].posts);
      } else {
        navigate("/forum/public/retirement-tips");
      }
    } else if (forumType === "private") {
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }
      const validId = forumId || "my-circle";
      if (privateForums[validId as keyof typeof privateForums]) {
        setCurrentForum(privateForums[validId as keyof typeof privateForums]);
        setFilteredPosts(privateForums[validId as keyof typeof privateForums].posts);
      } else {
        navigate("/forum/private/my-circle");
      }
    }
  }, [forumType, forumId, isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (currentForum && currentForum.posts) {
      if (searchQuery.trim() === "") {
        setFilteredPosts(currentForum.posts);
      } else {
        const query = searchQuery.toLowerCase();
        setFilteredPosts(
          currentForum.posts.filter(
            (post: any) =>
              post.title.toLowerCase().includes(query) ||
              post.content.toLowerCase().includes(query) ||
              post.author.name.toLowerCase().includes(query)
          )
        );
      }
    }
  }, [searchQuery, currentForum]);

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error("Please fill in both title and content for your post.");
      return;
    }

    toast.success("Your post has been published!");
    setNewPost({ title: "", content: "" });
    setShowComposeForm(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif mb-2">Loading...</h2>
          <p className="text-silver-600">Loading, please wait as we verify your account...</p>
        </div>
      </div>
    );
  }

  if (!currentForum) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow pt-32 pb-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-serif mb-4">Forum Not Found</h1>
            <p className="text-silver-600 mb-6">
              The forum you're looking for doesn't exist or you don't have access.
            </p>
            <Button asChild>
              <Link to="/forum/public/retirement-tips">Browse Public Forums</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <div className="flex items-center mb-2">
                  <h1 className="text-3xl md:text-4xl font-serif font-medium">
                    {currentForum.name}
                  </h1>
                  {forumType === "private" && (
                    <Lock className="ml-3 text-primary" size={20} />
                  )}
                </div>
                <p className="text-silver-600">{currentForum.description}</p>
              </div>
              <div className="flex items-center gap-2 mt-4 md:mt-0">
                {forumType === "public" && !isAuthenticated && (
                  <Button asChild className="rounded-full">
                    <Link to="/onboarding">Subscribe to Post</Link>
                  </Button>
                )}
                {(forumType === "private" || isAuthenticated) && (
                  <Button
                    onClick={() => setShowComposeForm(true)}
                    className="flex items-center rounded-full"
                  >
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create New Post
                  </Button>
                )}
              </div>
            </div>

            {showComposeForm && (
              <Card className="mb-8 border border-silver-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xl">Create a New Post</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowComposeForm(false)}
                  >
                    <XCircle className="h-5 w-5" />
                  </Button>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <Input
                    placeholder="Post Title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  />
                  <Textarea
                    placeholder="Share your thoughts, questions, or experiences..."
                    rows={5}
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  />
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowComposeForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreatePost}>Publish Post</Button>
                </CardFooter>
              </Card>
            )}

            {forumType === "public" && (
              <Tabs defaultValue={forumId || "retirement-tips"} className="mb-8">
                <TabsList className="grid grid-cols-3 w-full md:w-auto">
                  <TabsTrigger value="retirement-tips" asChild className="text-sm md:text-base">
                    <Link to="/forum/public/retirement-tips">Retirement Tips</Link>
                  </TabsTrigger>
                  <TabsTrigger value="dating-after-50" asChild className="text-sm md:text-base">
                    <Link to="/forum/public/dating-after-50">Dating After 50</Link>
                  </TabsTrigger>
                  <TabsTrigger value="ask-the-community" asChild className="text-sm md:text-base">
                    <Link to="/forum/public/ask-the-community">Ask Community</Link>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}

            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-silver-500" />
                <Input
                  placeholder="Search posts..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {filteredPosts.length > 0 ? (
              <div>
                {filteredPosts.map((post) => (
                  <ForumPost
                    key={post.id}
                    post={post}
                    isPublic={forumType === "public" && !isAuthenticated}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="mx-auto h-12 w-12 text-silver-300" />
                <h3 className="mt-4 text-xl font-medium text-silver-700">No posts found</h3>
                <p className="mt-2 text-silver-500">
                  {searchQuery ? "Try adjusting your search terms" : "Be the first to start a conversation"}
                </p>
                {(forumType === "private" || isAuthenticated) && !showComposeForm && (
                  <Button onClick={() => setShowComposeForm(true)} className="mt-6">
                    Create Post
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {forumType === "public" && !isAuthenticated && <SubscriptionCTA />}
      <Footer />
    </div>
  );
};

export default ForumPage;