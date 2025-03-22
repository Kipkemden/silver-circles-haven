
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const [resetPasswordMode, setResetPasswordMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Debug: Log isAuthenticated value
  console.log("LoginPage - isAuthenticated:", isAuthenticated);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    console.log("useEffect running - isAuthenticated:", isAuthenticated);
    if (isAuthenticated) {
      console.log("Redirecting to /dashboard");
      navigate("/dashboard", { replace: true }); // replace: true prevents back navigation to login
    }
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
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!resetPasswordMode && !formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const { success, error } = await login(formData.email, formData.password);
      console.log("handleLogin - Login result:", { success, error });
      
      if (!success) {
        toast.error(error || "Login failed. Please check your credentials.");
        setIsSubmitting(false);
        return;
      }
      
      toast.success("Welcome back to Silver Circles!");
      // Redirect will be handled by useEffect when isAuthenticated updates
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors({ email: "Please enter a valid email" });
      return;
    }
    
    try {
      setIsSubmitting(true);
      const redirectUrl = `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: redirectUrl,
      });
      
      if (error) {
        toast.error("Failed to send reset password email. Please try again.");
        console.error("Reset password error:", error);
        setIsSubmitting(false);
        return;
      }
      
      toast.success("Password reset email sent! Please check your inbox.");
      setResetPasswordMode(false);
      setIsSubmitting(false);
    } catch (error) {
      toast.error("Failed to send reset password email. Please try again.");
      console.error("Reset password error:", error);
      setIsSubmitting(false);
    }
  };

  // Reset the isSubmitting state if there's an error to ensure button is clickable
  useEffect(() => {
    if (Object.keys(errors).length > 0 && isSubmitting) {
      setIsSubmitting(false);
    }
  }, [errors, isSubmitting]);

  // Handle pressing enter in form fields
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (resetPasswordMode) {
        handleResetPassword();
      } else {
        handleLogin();
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow py-32 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-md mx-auto">
            <Card className="border border-silver-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-serif">
                  {resetPasswordMode ? "Reset Password" : "Welcome Back"}
                </CardTitle>
                <CardDescription>
                  {resetPasswordMode
                    ? "Enter your email to receive a password reset link"
                    : "Sign in to your Silver Circles account"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g. jane@example.com"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={cn(errors.email && "border-destructive")}
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <p className="text-destructive text-sm">{errors.email}</p>
                  )}
                </div>
                {!resetPasswordMode && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password">Password</Label>
                      <Button
                        variant="link"
                        className="p-0 h-auto text-xs text-primary"
                        onClick={() => setResetPasswordMode(true)}
                        disabled={isSubmitting}
                        type="button"
                      >
                        Forgot password?
                      </Button>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => updateFormData("password", e.target.value)}
                      onKeyPress={handleKeyPress}
                      className={cn(errors.password && "border-destructive")}
                      disabled={isSubmitting}
                    />
                    {errors.password && (
                      <p className="text-destructive text-sm">{errors.password}</p>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                {resetPasswordMode ? (
                  <>
                    <Button
                      type="button"
                      onClick={handleResetPassword}
                      className="w-full flex items-center justify-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Reset Link"}
                      {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-primary"
                      onClick={() => setResetPasswordMode(false)}
                      disabled={isSubmitting}
                      type="button"
                    >
                      Back to Login
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="button"
                      onClick={handleLogin}
                      className="w-full flex items-center justify-center"
                      disabled={isSubmitting && authLoading}
                    >
                      {isSubmitting ? "Signing In..." : "Sign In"}
                      {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                    <p className="text-sm text-silver-500 text-center">
                      Don't have an account yet?{" "}
                      <Link to="/onboarding" className="text-primary hover:underline">
                        Sign up
                      </Link>
                    </p>
                  </>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
