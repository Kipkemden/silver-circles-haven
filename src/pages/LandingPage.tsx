
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

      {/* Hero Section - Optimized for mobile */}
      <section className="compact-hero bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 
              className={`text-3xl md:text-4xl lg:text-5xl font-serif font-bold leading-tight compact-title text-silver-900 ${
                isLoaded ? "animate-fade-in" : ""
              }`}
            >
              Silver Circles
            </h1>
            <h2 
              className={`text-xl md:text-2xl lg:text-3xl font-serif text-silver-700 compact-subtitle ${
                isLoaded ? "animate-fade-in" : ""
              }`}
              style={{ animationDelay: "0.2s" }}
            >
              Your Circle for Life's Next Chapter
            </h2>
            <p 
              className={`text-base md:text-lg text-silver-600 compact-content max-w-2xl mx-auto ${
                isLoaded ? "animate-fade-in" : ""
              }`}
              style={{ animationDelay: "0.4s" }}
            >
              Real Support That Fits Your Life, Not Your Wallet
            </p>
            <div 
              className={`flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 ${
                isLoaded ? "animate-fade-in" : ""
              }`}
              style={{ animationDelay: "0.6s" }}
            >
              <Button asChild size="default" className="rounded-full px-6 py-2 text-base">
                <Link to="/onboarding">
                  Sign Up Now
                  <ArrowRight className="ml-2" size={16} />
                </Link>
              </Button>
              <Button asChild variant="outline" size="default" className="rounded-full px-6 py-2 text-base">
                <Link to="/forum/public/retirement-tips">Explore Community</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section - Wider layout */}
      <section className="compact-section bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="content-wide mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-base md:text-lg font-medium text-silver-800 mb-4">
                Picture it: You're 60, retirement's knocking, and "What's next?" keeps you up. Or 67, eyeing a date, heart thumping with nerves. Therapy's a wallet-busting $150 a session—too stiff, too scary. Friends? They're MIA or miss the mark. You need a lifeline—someone to hear you out, lift you up, and say, "I've been there."
              </p>
              
              <p className="text-base md:text-lg text-silver-700 mb-4">
                Meet Silver Circles. We're not therapy. We're not a casual coffee chat that fizzles out. We're small, online support groups built for you—45 to 70, tackling life's big shifts. Whether it's reinventing retirement or finding love later in life, you'll join 6-10 others who get it, guided by pros who've lived it: a retired therapist, a seasoned career coach, or an expert who's walked your path.
              </p>
              
              <p className="text-base md:text-lg text-silver-700 mb-6">
                It's real talk, real support, and real understanding—for just $60 a month. Plus, it's all on Zoom—easy, cozy, from your couch. Therapy's $200 price tag? Not here.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <blockquote className="border-l-4 border-primary pl-3 italic">
                    <p className="text-silver-800">"I was drifting post-job. My circle, led by a retired exec, gave me clarity—and buddies who cheer me on."</p>
                  </blockquote>
                  <p className="font-medium text-right mt-2">— Joan, 64, in "Reinventing Retirement"</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-xl">
                  <blockquote className="border-l-4 border-primary pl-3 italic">
                    <p className="text-silver-800">"Dating at my age felt wild. My group, with a relationship pro, turned jitters into guts."</p>
                  </blockquote>
                  <p className="font-medium text-right mt-2">— Tom, 57, in "Silver Singles"</p>
                </div>
              </div>
              
              <p className="text-base md:text-lg text-silver-700 mb-6">
                Why Silver Circles? Because life after 45 isn't meant to be faced solo. Therapy can be too formal, too pricey—$200 sessions add up fast. Friends might not always show up. But our senior support groups are here, online, every week, blending expert wisdom with peer connection. It's your safe space to vent, dream, and grow—without breaking the bank.
              </p>
              
              <div className="text-center mt-6">
                <Button asChild size="default" className="rounded-full px-6">
                  <Link to="/onboarding">Join Your Circle Today</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Compact */}
      <section className="compact-section bg-silver-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-medium compact-title text-silver-900">
              Join a supportive community that understands you
            </h2>
            <p className="text-base md:text-lg text-silver-600">
              Our circles are designed for adults in their prime years navigating major life transitions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 content-wide mx-auto">
            <div className="flex flex-col items-center text-center compact-card rounded-xl transition-all duration-300 hover:shadow-md">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-silver-800">Weekly Group Sessions</h3>
              <p className="text-silver-600 text-sm md:text-base">
                Connect with your circle every week via video call. Share, listen, and grow together.
              </p>
            </div>

            <div className="flex flex-col items-center text-center compact-card rounded-xl transition-all duration-300 hover:shadow-md">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-silver-800">Expert Facilitation</h3>
              <p className="text-silver-600 text-sm md:text-base">
                Our trained facilitators guide discussions to ensure everyone feels heard and supported.
              </p>
            </div>

            <div className="flex flex-col items-center text-center compact-card rounded-xl transition-all duration-300 hover:shadow-md">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-silver-800">Private Community</h3>
              <p className="text-silver-600 text-sm md:text-base">
                Continue conversations in your private forum, available 24/7 for members.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Topic Cards Section - Compact with wider layout */}
      <section className="compact-section bg-silver-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-medium compact-title text-silver-900">
              Choose a circle that speaks to you
            </h2>
            <p className="text-base md:text-lg text-silver-600">
              Our specialized topics address the most common challenges and opportunities in life's next chapter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 content-wide mx-auto">
            <TopicCard
              title="Reinventing Retirement"
              description="Navigate the emotional and practical aspects of life after work. Find purpose, connection, and joy in your next chapter."
              icon={<Calendar size={60} />}
              bgColor="bg-blue-50"
              link="/onboarding?topic=retirement"
            />
            
            <TopicCard
              title="Silver Singles"
              description="Dating and relationships after 50. Share experiences, get support, and learn to navigate modern dating with confidence."
              icon={<Heart size={60} />}
              bgColor="bg-pink-50"
              link="/onboarding?topic=dating"
            />
          </div>
        </div>
      </section>

      {/* Public Forum Preview Section - Wider layout */}
      <section className="compact-section bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-medium compact-title text-silver-900">
              Explore Our Community
            </h2>
            <p className="text-base md:text-lg text-silver-600">
              Get a glimpse of the conversations happening in our public forums.
            </p>
          </div>

          <div className="content-wide mx-auto">
            {publicPosts.map((post) => (
              <ForumPost key={post.id} post={post} isPublic={true} />
            ))}
            
            <div className="text-center mt-6">
              <Button asChild size="default" className="rounded-full px-6">
                <Link to="/forum/public/retirement-tips">View All Public Posts</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Compact */}
      <section className="compact-section bg-silver-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-medium compact-title text-silver-900">
              Simple, all-inclusive pricing
            </h2>
            <p className="text-base md:text-lg text-silver-600">
              Everything you need to connect, share, and grow with your circle.
            </p>
          </div>

          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="bg-primary p-6 text-white text-center">
              <h3 className="text-xl font-medium mb-1">Silver Circle Membership</h3>
              <div className="flex justify-center items-baseline">
                <span className="text-3xl font-bold">$60</span>
                <span className="ml-1 text-lg">/month</span>
              </div>
              <p className="mt-1 opacity-90 text-sm">or $600/year (save $120)</p>
            </div>
            
            <div className="p-6">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-4 w-4 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  </div>
                  <span className="ml-3 text-silver-700 text-sm md:text-base">Weekly expert-led group video sessions</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-4 w-4 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  </div>
                  <span className="ml-3 text-silver-700 text-sm md:text-base">Access to private circle forum</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-4 w-4 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  </div>
                  <span className="ml-3 text-silver-700 text-sm md:text-base">Ability to post and comment in all forums</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-4 w-4 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  </div>
                  <span className="ml-3 text-silver-700 text-sm md:text-base">Option to add 1:1 sessions for $150 each</span>
                </li>
              </ul>
              
              <Button asChild size="default" className="w-full rounded-full mt-6">
                <Link to="/onboarding">Get Started</Link>
              </Button>
              
              <p className="text-center text-silver-500 mt-3 text-xs">
                Cancel anytime. No long-term commitment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Wider layout */}
      <section className="compact-section bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-medium compact-title text-silver-900">
              What our members say
            </h2>
            <p className="text-base md:text-lg text-silver-600">
              Real stories from people who've found their circle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 content-wide mx-auto">
            <div className="bg-silver-50 p-5 rounded-2xl">
              <div className="flex items-center mb-3">
                <img
                  src="https://randomuser.me/api/portraits/women/54.jpg"
                  alt="Janet"
                  className="w-10 h-10 rounded-full"
                />
                <div className="ml-3">
                  <h4 className="font-medium text-silver-900 text-sm md:text-base">Janet, 68</h4>
                  <p className="text-silver-600 text-xs md:text-sm">Retired Teacher</p>
                </div>
              </div>
              <p className="text-silver-700 text-sm md:text-base">
                "After 40 years of teaching, I felt lost. My Silver Circle helped me find purpose again. The weekly calls are the highlight of my week."
              </p>
            </div>
            
            <div className="bg-silver-50 p-5 rounded-2xl">
              <div className="flex items-center mb-3">
                <img
                  src="https://randomuser.me/api/portraits/men/53.jpg"
                  alt="Michael"
                  className="w-10 h-10 rounded-full"
                />
                <div className="ml-3">
                  <h4 className="font-medium text-silver-900 text-sm md:text-base">Michael, 57</h4>
                  <p className="text-silver-600 text-xs md:text-sm">Recently Divorced</p>
                </div>
              </div>
              <p className="text-silver-700 text-sm md:text-base">
                "The Silver Singles circle gave me confidence to start dating again. Having others who understand exactly what you're going through is invaluable."
              </p>
            </div>
            
            <div className="bg-silver-50 p-5 rounded-2xl">
              <div className="flex items-center mb-3">
                <img
                  src="https://randomuser.me/api/portraits/women/63.jpg"
                  alt="Patricia"
                  className="w-10 h-10 rounded-full"
                />
                <div className="ml-3">
                  <h4 className="font-medium text-silver-900 text-sm md:text-base">Patricia, 61</h4>
                  <p className="text-silver-600 text-xs md:text-sm">New Retiree</p>
                </div>
              </div>
              <p className="text-silver-700 text-sm md:text-base">
                "I was worried about finances after retirement. My circle not only provided emotional support but practical advice that has made a real difference."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Compact */}
      <section className="compact-section bg-primary text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-serif font-medium mb-3">
              Ready to join your circle?
            </h2>
            <p className="text-base md:text-lg opacity-90 mb-6">
              Get started today for $60/month and connect with people who understand.
            </p>
            <Button
              asChild
              size="default"
              variant="secondary"
              className="rounded-full px-6 py-2 text-base text-primary"
            >
              <Link to="/onboarding">
                Sign Up Now
                <ArrowRight className="ml-2" size={16} />
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
