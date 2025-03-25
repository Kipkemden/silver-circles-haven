
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasValidResetToken, setHasValidResetToken] = useState(false);

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate("/dashboard");
      return;
    }

    // Check if we have a valid hash in the URL
    const checkResetToken = async () => {
      const hash = window.location.hash;
      
      if (!hash || !hash.includes('type=recovery')) {
        toast.error("Invalid or expired password reset link");
        navigate("/login");
        return;
      }
      
      // Verify hash is valid with Supabase
      try {
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error validating reset token:", error);
          toast.error("Invalid or expired password reset link");
          navigate("/login");
          return;
        }
        
        setHasValidResetToken(true);
      } catch (error) {
        console.error("Error validating reset token:", error);
        toast.error("Invalid or expired password reset link");
        navigate("/login");
      }
    };
    
    checkResetToken();
  }, [isAuthenticated, navigate]);

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isLoading) return;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      });
      
      if (error) {
        console.error("Reset password error:", error);
        toast.error("Failed to reset password. Please try again.");
        return;
      }
      
      toast.success("Your password has been successfully reset!");
      
      // Redirect to login page after successful password reset
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasValidResetToken) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center p-6">
            <h2 className="text-2xl font-serif mb-2">Verifying reset link...</h2>
            <p className="text-silver-600">Please wait while we verify your password reset link.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow py-32 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-md mx-auto">
            <Card className="border border-silver-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-serif">Reset Your Password</CardTitle>
                <CardDescription>
                  Please enter a new password for your account
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleResetPassword}>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your new password"
                      value={formData.password}
                      onChange={(e) => updateFormData("password", e.target.value)}
                      className={cn(errors.password && "border-destructive")}
                      disabled={isLoading}
                    />
                    {errors.password && (
                      <p className="text-destructive text-sm">{errors.password}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your new password"
                      value={formData.confirmPassword}
                      onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                      className={cn(errors.confirmPassword && "border-destructive")}
                      disabled={isLoading}
                    />
                    {errors.confirmPassword && (
                      <p className="text-destructive text-sm">{errors.confirmPassword}</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit"
                    className="w-full flex items-center justify-center"
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating..." : "Reset Password"}
                    {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPasswordPage;
