
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-6xl md:text-8xl font-serif font-bold text-silver-900 mb-6">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-serif text-silver-700 mb-6">
            Page Not Found
          </h2>
          <p className="text-silver-600 max-w-md mx-auto mb-10">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>
          <Button asChild size="lg" className="rounded-full">
            <Link to="/" className="flex items-center">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Return to Home
            </Link>
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
