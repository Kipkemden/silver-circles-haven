
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SupportPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const isBanned = user?.isBanned || false;
  const showBannedView = isAuthenticated && isBanned;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md">
          {showBannedView ? (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-serif text-destructive">Account Restricted</CardTitle>
                <CardDescription>
                  Your account has been temporarily restricted from accessing Silver Circles.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  This may have happened for one of the following reasons:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Violation of our community guidelines</li>
                  <li>Posting inappropriate content</li>
                  <li>Harassment of other members</li>
                  <li>Multiple reports from other community members</li>
                </ul>
                <p className="text-sm mt-4">
                  If you believe this is a mistake, please contact our support team for assistance.
                </p>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button className="w-full" variant="default">
                  Contact Support
                </Button>
                <Button className="w-full" variant="outline" onClick={() => navigate('/')}>
                  Return to Homepage
                </Button>
              </CardFooter>
            </>
          ) : (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-serif">Need Help?</CardTitle>
                <CardDescription>
                  Our support team is here to assist you with any questions or issues.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-md">
                  <h3 className="font-medium text-blue-800 mb-2">Support Hours</h3>
                  <p className="text-blue-700 text-sm">
                    Monday - Friday: 9:00 AM - 6:00 PM EST
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Common Questions</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>How do I join a circle?</li>
                    <li>How can I update my subscription?</li>
                    <li>What happens during circle meetings?</li>
                    <li>How do I reset my password?</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button className="w-full" variant="default">
                  Contact Support
                </Button>
                {isAuthenticated ? (
                  <Button className="w-full" variant="outline" onClick={() => navigate('/dashboard')}>
                    Back to Dashboard
                  </Button>
                ) : (
                  <Button className="w-full" variant="outline" onClick={() => navigate('/')}>
                    Return to Homepage
                  </Button>
                )}
              </CardFooter>
            </>
          )}
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default SupportPage;
