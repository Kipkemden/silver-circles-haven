
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isAuthenticated } = useAuth();
  const searchParams = new URLSearchParams(location.search);
  const preselectedTopic = searchParams.get("topic");
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    topic: preselectedTopic || "",
    goals: "",
    plan: "monthly", // monthly or yearly
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect authenticated users away from the onboarding page
  useState(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  });

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
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
    
    if (!formData.age.trim()) {
      newErrors.age = "Age is required";
    } else {
      const age = parseInt(formData.age);
      if (isNaN(age) || age < 45 || age > 70) {
        newErrors.age = "Age must be between 45 and 70";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.topic) {
      newErrors.topic = "Please select a topic";
    }
    
    if (!formData.goals.trim()) {
      newErrors.goals = "Please share your goals";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      window.scrollTo(0, 0);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      
      // Register the user with Supabase
      const { success, error } = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        age: parseInt(formData.age),
        topic: formData.topic,
        goals: [formData.goals],
        isSubscribed: formData.plan === "yearly", // Just for demo, set as subscribed if yearly plan
      });
      
      if (!success) {
        if (error && error.includes("already registered")) {
          setStep(1);
          setErrors({ email: "This email is already registered. Please login instead." });
          toast.error("Account already exists. Please use the login form.");
        } else {
          toast.error(error || "Registration failed. Please try again.");
        }
        return;
      }
      
      toast.success("Welcome to Silver Circles!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error("There was an error during signup. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginInstead = async () => {
    try {
      setIsLoading(true);
      
      if (!formData.email || !formData.password) {
        setErrors({
          email: !formData.email ? "Email is required" : "",
          password: !formData.password ? "Password is required" : "",
        });
        return;
      }
      
      const { success, error } = await login(formData.email, formData.password);
      
      if (!success) {
        toast.error(error || "Login failed. Please check your credentials.");
        return;
      }
      
      toast.success("Welcome back to Silver Circles!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow py-32 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-xl mx-auto">
            {/* Progress indicator */}
            <div className="mb-8">
              <div className="flex justify-between items-center">
                <div className="text-sm text-primary font-medium">
                  Step {step} of 3
                </div>
                <div className="flex space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-2 w-10 rounded-full",
                        i === step
                          ? "bg-primary"
                          : i < step
                          ? "bg-primary/60"
                          : "bg-silver-200"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            <Card className="border border-silver-200 shadow-sm">
              {step === 1 && (
                <>
                  <CardHeader>
                    <CardTitle className="text-2xl font-serif">Tell us about yourself</CardTitle>
                    <CardDescription>
                      We'll use this information to match you with the right circle.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g. Jane Smith"
                        value={formData.name}
                        onChange={(e) => updateFormData("name", e.target.value)}
                        className={cn(errors.name && "border-destructive")}
                      />
                      {errors.name && (
                        <p className="text-destructive text-sm">{errors.name}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="e.g. jane@example.com"
                        value={formData.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                        className={cn(errors.email && "border-destructive")}
                      />
                      {errors.email && (
                        <p className="text-destructive text-sm">{errors.email}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => updateFormData("password", e.target.value)}
                        className={cn(errors.password && "border-destructive")}
                      />
                      {errors.password && (
                        <p className="text-destructive text-sm">{errors.password}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                        className={cn(errors.confirmPassword && "border-destructive")}
                      />
                      {errors.confirmPassword && (
                        <p className="text-destructive text-sm">{errors.confirmPassword}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="age">Age (45-70)</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="e.g. 55"
                        min="45"
                        max="70"
                        value={formData.age}
                        onChange={(e) => updateFormData("age", e.target.value)}
                        className={cn(errors.age && "border-destructive")}
                      />
                      {errors.age && (
                        <p className="text-destructive text-sm">{errors.age}</p>
                      )}
                    </div>
                    
                    <div className="text-sm text-silver-500 pt-2">
                      <p>Already have an account? 
                        <Button 
                          variant="link" 
                          className="p-0 h-auto ml-1 text-primary"
                          onClick={handleLoginInstead}
                          disabled={isLoading}
                        >
                          Login instead
                        </Button>
                      </p>
                    </div>
                  </CardContent>
                </>
              )}

              {step === 2 && (
                <>
                  <CardHeader>
                    <CardTitle className="text-2xl font-serif">Choose your circle</CardTitle>
                    <CardDescription>
                      Select a topic that interests you most. You can join other circles later.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="topic">Circle Topic</Label>
                      <Select
                        value={formData.topic}
                        onValueChange={(value) => updateFormData("topic", value)}
                      >
                        <SelectTrigger
                          id="topic"
                          className={cn(errors.topic && "border-destructive")}
                        >
                          <SelectValue placeholder="Select a topic" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="retirement">Reinventing Retirement</SelectItem>
                          <SelectItem value="dating">Silver Singles</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.topic && (
                        <p className="text-destructive text-sm">{errors.topic}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="goals">
                        What are your goals for joining this circle?
                      </Label>
                      <Textarea
                        id="goals"
                        placeholder="e.g. I want to find purpose after retirement or I'm looking to build confidence in dating again."
                        rows={4}
                        value={formData.goals}
                        onChange={(e) => updateFormData("goals", e.target.value)}
                        className={cn(errors.goals && "border-destructive")}
                      />
                      {errors.goals && (
                        <p className="text-destructive text-sm">{errors.goals}</p>
                      )}
                    </div>
                  </CardContent>
                </>
              )}

              {step === 3 && (
                <>
                  <CardHeader>
                    <CardTitle className="text-2xl font-serif">Choose your plan</CardTitle>
                    <CardDescription>
                      Select a membership plan that works for you.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <RadioGroup
                      value={formData.plan}
                      onValueChange={(value) => updateFormData("plan", value)}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-3 rounded-lg border border-silver-200 p-4 cursor-pointer hover:bg-silver-50">
                        <RadioGroupItem value="monthly" id="monthly" className="border-primary" />
                        <Label htmlFor="monthly" className="flex flex-col cursor-pointer">
                          <span className="font-medium">Monthly Plan</span>
                          <span className="text-silver-600">$60/month, cancel anytime</span>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-3 rounded-lg border border-primary p-4 bg-blue-50 cursor-pointer">
                        <RadioGroupItem value="yearly" id="yearly" />
                        <Label htmlFor="yearly" className="flex flex-col cursor-pointer flex-1">
                          <div className="flex justify-between items-center w-full">
                            <div>
                              <span className="font-medium">Annual Plan</span>
                              <span className="block text-silver-600">$600/year (save $120)</span>
                            </div>
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                              BEST VALUE
                            </span>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                    
                    <div className="bg-silver-50 p-4 rounded-lg mt-6">
                      <h4 className="font-medium mb-2">Both plans include:</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                          <span>Weekly expert-led group sessions</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                          <span>Private circle forum access</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                          <span>Option to add 1:1 sessions for $150 each</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </>
              )}

              <CardFooter className="flex justify-between">
                {step > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="flex items-center"
                    disabled={isLoading}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                ) : (
                  <div></div>
                )}
                
                {step < 3 ? (
                  <Button 
                    type="button" 
                    onClick={nextStep} 
                    className="flex items-center"
                    disabled={isLoading}
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    type="button" 
                    onClick={handleSubmit} 
                    className="flex items-center"
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "Complete Signup"}
                    {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                )}
              </CardFooter>
            </Card>

            {step === 3 && (
              <p className="text-center mt-6 text-silver-500">
                You'll be redirected to our secure payment processor to complete your subscription.
              </p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OnboardingPage;
