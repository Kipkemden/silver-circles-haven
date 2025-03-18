
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-silver-200 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <h3 className="text-2xl font-serif font-bold text-primary">Silver Circles</h3>
            </Link>
            <p className="text-silver-600 mb-6">
              Expert-led support groups for adults 45-70 navigating life's transitions.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-silver-500 hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={22} />
              </a>
              <a
                href="#"
                className="text-silver-500 hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={22} />
              </a>
              <a
                href="#"
                className="text-silver-500 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={22} />
              </a>
              <a
                href="mailto:contact@silvercircles.com"
                className="text-silver-500 hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail size={22} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-xl mb-5 text-silver-800">Explore</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/forum/public/retirement-tips"
                  className="text-silver-600 hover:text-primary transition-colors"
                >
                  Community Forums
                </Link>
              </li>
              <li>
                <Link
                  to="/onboarding"
                  className="text-silver-600 hover:text-primary transition-colors"
                >
                  Join a Circle
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-silver-600 hover:text-primary transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-xl mb-5 text-silver-800">Circle Topics</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-silver-600 hover:text-primary transition-colors"
                >
                  Reinventing Retirement
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-silver-600 hover:text-primary transition-colors"
                >
                  Silver Singles
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-silver-600 hover:text-primary transition-colors"
                >
                  Coming Soon: Health & Wellness
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-xl mb-5 text-silver-800">Legal</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-silver-600 hover:text-primary transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-silver-600 hover:text-primary transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-silver-600 hover:text-primary transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-silver-200 mt-12 pt-8 text-silver-500 text-center">
          <p>&copy; {currentYear} Silver Circles. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
