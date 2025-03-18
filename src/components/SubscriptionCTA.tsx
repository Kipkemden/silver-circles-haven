
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface SubscriptionCTAProps {
  className?: string;
  delay?: number; // Delay in seconds before showing
  showOnScroll?: boolean;
}

const SubscriptionCTA = ({
  className,
  delay = 30, // 30 seconds default
  showOnScroll = true,
}: SubscriptionCTAProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay * 1000);

    // Set up scroll listener if showOnScroll is true
    if (showOnScroll) {
      const handleScroll = () => {
        if (window.scrollY > window.innerHeight * 0.3) {
          setIsVisible(true);
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
        clearTimeout(timer);
      };
    }

    return () => clearTimeout(timer);
  }, [delay, showOnScroll]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed bottom-6 left-0 right-0 z-40 mx-auto w-[95%] max-w-xl ${className}`}
    >
      <div className="glass rounded-xl px-6 py-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-serif font-medium text-silver-900">
              Ready to join the conversation?
            </h3>
            <p className="text-silver-700">
              Subscribe now to unlock all premium features.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="rounded-full border-silver-300"
              onClick={() => setIsVisible(false)}
            >
              Not now
            </Button>
            <Button asChild className="rounded-full">
              <Link to="/onboarding">Subscribe $60/mo</Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SubscriptionCTA;
