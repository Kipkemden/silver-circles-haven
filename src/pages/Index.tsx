
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium mb-6">
            Welcome to Silver Circles
          </h1>
          <p className="text-xl text-silver-600 max-w-3xl mx-auto mb-10">
            A supportive community for seniors looking to connect, share experiences, and navigate life's transitions together.
          </p>
          
          {isLoading ? (
            <div className="animate-pulse inline-block bg-primary/20 rounded-full px-12 py-4 w-48 h-14"></div>
          ) : isAuthenticated ? (
            <div className="space-y-4">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link to="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <p className="text-silver-500 mt-2">
                Access your personal dashboard to connect with your circle
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link to="/onboarding">
                  Join Silver Circles
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <p className="text-silver-500 mt-2">
                Already a member? <Link to="/login" className="text-primary hover:underline">Login here</Link>
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
