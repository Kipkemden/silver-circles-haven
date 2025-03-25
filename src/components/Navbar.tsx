
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogOut, User, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = async () => {
    await logout();
    closeMenu();
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/90 shadow-sm backdrop-blur-sm py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center" onClick={closeMenu}>
          <div className="text-2xl font-serif font-bold text-primary">
            <span className="sr-only">Silver Circles</span>
            Silver Circles
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/forum/public/retirement-tips"
            className={cn(
              "text-silver-700 hover:text-primary transition-colors font-medium",
              location.pathname.includes("/forum/public") && "text-primary"
            )}
          >
            Community
          </Link>
          
          {isLoading ? (
            // Loading state
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-silver-200 h-10 w-20"></div>
              <div className="rounded-full bg-silver-200 h-10 w-20"></div>
            </div>
          ) : isAuthenticated ? (
            // Authenticated user menu
            <>
              <Link
                to="/dashboard"
                className={cn(
                  "text-silver-700 hover:text-primary transition-colors font-medium",
                  location.pathname === "/dashboard" && "text-primary"
                )}
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className={cn(
                  "text-silver-700 hover:text-primary transition-colors font-medium",
                  location.pathname === "/profile" && "text-primary"
                )}
              >
                Profile
              </Link>
              <Button asChild size="lg" className="rounded-full px-6">
                <Link to="/forum/private/my-circle">My Circle</Link>
              </Button>
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                size="lg" 
                className="rounded-full px-6 flex items-center"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            // Guest menu
            <>
              <Button asChild variant="ghost" size="lg">
                <Link to="/login">Log In</Link>
              </Button>
              <Button asChild size="lg" className="rounded-full px-6">
                <Link to="/onboarding">Sign Up Now</Link>
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-silver-800 hover:text-primary"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg animate-fade-in">
          <nav className="container mx-auto px-4 py-6 flex flex-col space-y-4">
            <Link
              to="/forum/public/retirement-tips"
              className="text-silver-700 hover:text-primary py-2 text-lg"
              onClick={closeMenu}
            >
              Community
            </Link>
            
            {isLoading ? (
              // Loading state
              <div className="animate-pulse space-y-4">
                <div className="rounded bg-silver-200 h-10 w-full"></div>
                <div className="rounded bg-silver-200 h-10 w-full"></div>
              </div>
            ) : isAuthenticated ? (
              // Authenticated user menu
              <>
                <Link
                  to="/dashboard"
                  className="text-silver-700 hover:text-primary py-2 text-lg"
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="text-silver-700 hover:text-primary py-2 text-lg"
                  onClick={closeMenu}
                >
                  Profile
                </Link>
                <Button
                  asChild
                  size="lg"
                  className="w-full justify-center rounded-full mt-2"
                >
                  <Link to="/forum/private/my-circle" onClick={closeMenu}>
                    My Circle
                  </Link>
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="lg"
                  className="w-full justify-center rounded-full mt-2 flex items-center"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              // Guest menu
              <>
                <Link
                  to="/login"
                  className="text-silver-700 hover:text-primary py-2 text-lg"
                  onClick={closeMenu}
                >
                  Log In
                </Link>
                <Button
                  asChild
                  size="lg"
                  className="w-full justify-center rounded-full mt-2"
                >
                  <Link to="/onboarding" onClick={closeMenu}>
                    Sign Up Now
                  </Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
