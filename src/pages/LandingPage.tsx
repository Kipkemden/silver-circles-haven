
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Users, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopicCard from "@/components/TopicCard";
import ForumPost from "@/components/ForumPost";
import SubscriptionCTA from "@/components/SubscriptionCTA";

// Sample data for public forum posts
const publicPosts = [
  {
    id: "1",
    title: "Retirement Tips: I wish I'd planned earlier!",
    content: "After 30 years at the same company, retirement hit me like a ton of bricks. I wish I had prepared myself mentally, not just financially. Here's what I learned...",
    createdAt: "2023-11-15T10:30:00Z",
    likesCount: 24,
    commentsCount: 18,
    author: {
      name: "Margaret W.",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    },
  },
  {
    id: "2",
    title: "Dating after 60: My experience with online dating apps",
    content: "I never thought I'd be using dating apps at 62, but here I am! It's been quite the journey with some hilarious stories to share. The good news is that authentic connections are possible...",
    createdAt: "2023-11-20T14:45:00Z",
    likesCount: 36,
    commentsCount: 29,
    author: {
      name: "Robert T.",
      avatar: "https://randomuser.me/api/portraits/men/62.jpg",
    },
  },
  {
    id: "3",
    title: "Found a new purpose through volunteering",
    content: "After retirement, I felt lost without my daily work routine. Volunteering at the local community garden gave me a new sense of purpose and wonderful new friends...",
    createdAt: "2023-12-05T09:15:00Z",
    likesCount: 42,
    commentsCount: 12,
    author: {
      name: "Carol L.",
      avatar: "https://randomuser.me/api/portraits/women/42.jpg",
    },
  },
];

const LandingPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 
              className={`text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6 text-silver-900 ${
                isLoaded ? "animate-fade-in" : ""
              }`}
            >
              Silver Circles
            </h1>
            <h2 
              className={`text-2xl md:text-3xl lg:text-4xl font-serif text-silver-700 mb-8 ${
                isLoaded ? "animate-fade-in" : ""
              }`}
              style={{ animationDelay: "0.2s" }}
            >
              Your Circle for Life's Next Chapter
            </h2>
            <p 
              className={`text-lg md:text-xl text-silver-600 mb-10 max-w-2xl mx-auto ${
                isLoaded ? "animate-fade-in" : ""
              }`}
              style={{ animationDelay: "0.4s" }}
            >
              Expert-led support groups for adults 45-70. Connect with peers navigating retirement, dating, and life's transitions.
            </p>
            <div 
              className={`flex flex-col sm:flex-row justify-center gap-4 ${
                isLoaded ? "animate-fade-in" : ""
              }`}
              style={{ animationDelay: "0.6s" }}
            >
              <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg">
                <Link to="/onboarding">
                  Sign Up Now
                  <ArrowRight className="ml-2" size={18} />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 py-6 text-lg">
                <Link to="/forum/public/retirement-tips">Explore Community</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-medium mb-6 text-silver-900">
              Join a supportive community that understands you
            </h2>
            <p className="text-lg text-silver-600">
              Our circles are designed for adults in their prime years navigating major life transitions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-xl transition-all duration-300 hover:shadow-md">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-5">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-3 text-silver-800">Weekly Group Sessions</h3>
              <p className="text-silver-600">
                Connect with your circle every week via video call. Share, listen, and grow together.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-xl transition-all duration-300 hover:shadow-md">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-5">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-3 text-silver-800">Expert Facilitation</h3>
              <p className="text-silver-600">
                Our trained facilitators guide discussions to ensure everyone feels heard and supported.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-xl transition-all duration-300 hover:shadow-md">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-5">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-3 text-silver-800">Private Community</h3>
              <p className="text-silver-600">
                Continue conversations in your private forum, available 24/7 for members.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Topic Cards Section */}
      <section className="py-20 bg-silver-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-medium mb-6 text-silver-900">
              Choose a circle that speaks to you
            </h2>
            <p className="text-lg text-silver-600">
              Our specialized topics address the most common challenges and opportunities in life's next chapter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <TopicCard
              title="Reinventing Retirement"
              description="Navigate the emotional and practical aspects of life after work. Find purpose, connection, and joy in your next chapter."
              icon={<Calendar size={80} />}
              bgColor="bg-blue-50"
              link="/onboarding?topic=retirement"
            />
            
            <TopicCard
              title="Silver Singles"
              description="Dating and relationships after 50. Share experiences, get support, and learn to navigate modern dating with confidence."
              icon={<Heart size={80} />}
              bgColor="bg-pink-50"
              link="/onboarding?topic=dating"
            />
          </div>
        </div>
      </section>

      {/* Public Forum Preview Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-medium mb-6 text-silver-900">
              Explore Our Community
            </h2>
            <p className="text-lg text-silver-600">
              Get a glimpse of the conversations happening in our public forums.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {publicPosts.map((post) => (
              <ForumPost key={post.id} post={post} isPublic={true} />
            ))}
            
            <div className="text-center mt-10">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link to="/forum/public/retirement-tips">View All Public Posts</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-silver-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-medium mb-6 text-silver-900">
              Simple, all-inclusive pricing
            </h2>
            <p className="text-lg text-silver-600">
              Everything you need to connect, share, and grow with your circle.
            </p>
          </div>

          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="bg-primary p-8 text-white text-center">
              <h3 className="text-2xl font-medium mb-2">Silver Circle Membership</h3>
              <div className="flex justify-center items-baseline">
                <span className="text-4xl font-bold">$60</span>
                <span className="ml-1 text-xl">/month</span>
              </div>
              <p className="mt-2 opacity-90">or $600/year (save $120)</p>
            </div>
            
            <div className="p-8">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  </div>
                  <span className="ml-3 text-silver-700">Weekly expert-led group video sessions</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  </div>
                  <span className="ml-3 text-silver-700">Access to private circle forum</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  </div>
                  <span className="ml-3 text-silver-700">Ability to post and comment in all forums</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  </div>
                  <span className="ml-3 text-silver-700">Option to add 1:1 sessions for $150 each</span>
                </li>
              </ul>
              
              <Button asChild size="lg" className="w-full rounded-full mt-8">
                <Link to="/onboarding">Get Started</Link>
              </Button>
              
              <p className="text-center text-silver-500 mt-4 text-sm">
                Cancel anytime. No long-term commitment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-medium mb-6 text-silver-900">
              What our members say
            </h2>
            <p className="text-lg text-silver-600">
              Real stories from people who've found their circle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-silver-50 p-8 rounded-2xl">
              <div className="flex items-center mb-4">
                <img
                  src="https://randomuser.me/api/portraits/women/54.jpg"
                  alt="Janet"
                  className="w-12 h-12 rounded-full"
                />
                <div className="ml-3">
                  <h4 className="font-medium text-silver-900">Janet, 68</h4>
                  <p className="text-silver-600">Retired Teacher</p>
                </div>
              </div>
              <p className="text-silver-700">
                "After 40 years of teaching, I felt lost. My Silver Circle helped me find purpose again. The weekly calls are the highlight of my week."
              </p>
            </div>
            
            <div className="bg-silver-50 p-8 rounded-2xl">
              <div className="flex items-center mb-4">
                <img
                  src="https://randomuser.me/api/portraits/men/53.jpg"
                  alt="Michael"
                  className="w-12 h-12 rounded-full"
                />
                <div className="ml-3">
                  <h4 className="font-medium text-silver-900">Michael, 57</h4>
                  <p className="text-silver-600">Recently Divorced</p>
                </div>
              </div>
              <p className="text-silver-700">
                "The Silver Singles circle gave me confidence to start dating again. Having others who understand exactly what you're going through is invaluable."
              </p>
            </div>
            
            <div className="bg-silver-50 p-8 rounded-2xl">
              <div className="flex items-center mb-4">
                <img
                  src="https://randomuser.me/api/portraits/women/63.jpg"
                  alt="Patricia"
                  className="w-12 h-12 rounded-full"
                />
                <div className="ml-3">
                  <h4 className="font-medium text-silver-900">Patricia, 61</h4>
                  <p className="text-silver-600">New Retiree</p>
                </div>
              </div>
              <p className="text-silver-700">
                "I was worried about finances after retirement. My circle not only provided emotional support but practical advice that has made a real difference."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-medium mb-6">
              Ready to join your circle?
            </h2>
            <p className="text-xl opacity-90 mb-10">
              Get started today for $60/month and connect with people who understand.
            </p>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="rounded-full px-8 py-6 text-lg text-primary"
            >
              <Link to="/onboarding">
                Sign Up Now
                <ArrowRight className="ml-2" size={18} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Pop-up Subscription CTA */}
      <SubscriptionCTA />

      <Footer />
    </div>
  );
};

export default LandingPage;
