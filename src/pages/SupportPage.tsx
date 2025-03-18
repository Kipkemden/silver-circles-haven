
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const SupportPage = () => {
  const { isBanned, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated || !isBanned) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-silver-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
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
      </Card>
    </div>
  );
};

export default SupportPage;
