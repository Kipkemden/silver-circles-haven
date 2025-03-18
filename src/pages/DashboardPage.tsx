
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MessageSquare, Video, Clock, Users, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ForumPost from "@/components/ForumPost";

// Mock data
const upcomingMeeting = {
  topic: "Reinventing Retirement",
  groupName: "Retirement Circle #1",
  date: new Date(Date.now() + 86400000 * 3), // 3 days from now
  zoomLink: "https://zoom.us/j/1234567890?pwd=abcdefg",
};

const formatMeetingDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
};

const privatePosts = [
  {
    id: "p1",
    title: "What surprised you most about retirement?",
    content: "I've been retired for 3 months now, and I was surprised by how much I miss the social aspect of work more than the work itself. Has anyone else experienced this?",
    createdAt: "2023-12-15T14:30:00Z",
    likesCount: 12,
    commentsCount: 8,
    author: {
      name: "David S.",
      avatar: "https://randomuser.me/api/portraits/men/55.jpg",
    },
  },
  {
    id: "p2",
    title: "Travel plans for 2024?",
    content: "Now that I have more flexibility, I'm planning my first big trip in May. Anyone have recommendations for senior-friendly destinations that aren't too crowded?",
    createdAt: "2023-12-18T10:15:00Z",
    likesCount: 15,
    commentsCount: 10,
    author: {
      name: "Linda M.",
      avatar: "https://randomuser.me/api/portraits/women/52.jpg",
    },
  },
];

const DashboardPage = () => {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // In a real app, this would fetch user data from Supabase
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-36 bg-silver-200 rounded mb-4"></div>
          <div className="h-6 w-72 bg-silver-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAuthenticated={true} />

      <main className="flex-grow pt-32 pb-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-serif font-medium mb-2">
              Welcome, {userData.name.split(" ")[0]}
            </h1>
            <p className="text-silver-600 mb-10">
              Your {userData.topic === "retirement" ? "Reinventing Retirement" : "Silver Singles"} circle is here to support you.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <Card className="md:col-span-2 border border-silver-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-primary" />
                    Your Next Circle Meeting
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                      <h3 className="font-medium text-lg">{upcomingMeeting.topic}</h3>
                      <div className="flex items-center text-silver-600 mt-1">
                        <Users className="mr-2 h-4 w-4" />
                        <span>{upcomingMeeting.groupName}</span>
                      </div>
                      <div className="flex items-center text-silver-600 mt-1">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>{formatMeetingDate(upcomingMeeting.date)}</span>
                      </div>
                    </div>
                    <Button
                      asChild
                      className="flex items-center"
                      size="lg"
                    >
                      <a href={upcomingMeeting.zoomLink} target="_blank" rel="noopener noreferrer">
                        <Video className="mr-2 h-5 w-5" />
                        Join Meeting
                      </a>
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 text-silver-500">
                  <p>A calendar invitation has been sent to your email with the meeting details.</p>
                </CardFooter>
              </Card>

              <Card className="border border-silver-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                    Your Circle Forum
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-silver-600">
                  <p>
                    Connect with your circle members anytime in your private forum.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to="/forum/private/my-circle">
                      Go to Forum
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="mb-12">
              <Tabs defaultValue="posts">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-serif">Recent Circle Activity</h2>
                  <TabsList>
                    <TabsTrigger value="posts">Posts</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="posts" className="mt-0">
                  {privatePosts.map((post) => (
                    <ForumPost key={post.id} post={post} isPublic={false} />
                  ))}
                  
                  <div className="text-center mt-6">
                    <Button asChild variant="outline" className="rounded-full">
                      <Link to="/forum/private/my-circle">View All Posts</Link>
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="resources" className="mt-0">
                  <Card className="border border-silver-200 mb-6">
                    <CardHeader>
                      <CardTitle>Retirement Planning Guide</CardTitle>
                      <CardDescription>PDF Resource • Added Dec 15, 2023</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-silver-600">
                        A comprehensive guide to financial, emotional, and social aspects of retirement planning.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline">Download PDF</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="border border-silver-200">
                    <CardHeader>
                      <CardTitle>Circle Discussion Topics</CardTitle>
                      <CardDescription>Upcoming discussion themes for your circle</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex">
                          <div className="mr-3 text-primary">•</div>
                          <p>Finding purpose beyond your career</p>
                        </li>
                        <li className="flex">
                          <div className="mr-3 text-primary">•</div>
                          <p>Building new social connections</p>
                        </li>
                        <li className="flex">
                          <div className="mr-3 text-primary">•</div>
                          <p>Maintaining wellbeing and health</p>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="bg-silver-50 rounded-2xl p-8 border border-silver-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="mb-6 md:mb-0">
                  <h2 className="text-2xl font-serif mb-2">Enhance Your Experience</h2>
                  <p className="text-silver-600 max-w-xl">
                    Book a 1:1 session with our expert facilitator for personalized guidance on your specific challenges.
                  </p>
                </div>
                <Button size="lg" className="md:self-end">
                  Book 1:1 Session ($150)
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;
