import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultTopic = searchParams.get("topic") || "";
  const { register } = useAuth();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    topic: defaultTopic,
    goals: [] as string[],
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const goalsByTopic: Record<string, string[]> = {
    "retirement": [
      "Find purpose after work",
      "Create new social connections",
      "Financial planning support",
      "Explore new hobbies",
      "Overcome boredom/isolation",
      "Health and wellness focus"
    ],
    "dating": [
      "Build dating confidence",
      "Navigate online dating apps",
      "Find meaningful connections",
      "Overcome anxiety about dating",
      "Dating after divorce/loss",
      "Understanding modern dating norms"
    ],
    "": [] // Default empty array for when no topic is selected
  };
  
  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  const toggleGoal = (goal: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };
  
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.age.trim()) {
      newErrors.age = "Age is required";
    } else if (isNaN(Number(formData.age)) || Number(formData.age) < 18) {
      newErrors.age = "Please enter a valid age (18+)";
    }
    
    if (!formData.topic) {
      newErrors.topic = "Please select a topic";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    
    if (formData.goals.length === 0) {
      newErrors.goals = "Please select at least one goal";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const nextStep = () => {
    let isValid = false;
    
    switch (step) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      default:
        isValid = true;
    }
    
    if (isValid) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };
  
  const handleSubmit = async () => {
    if (!validateStep3()) return;
    
    try {
      setIsLoading(true);
      
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        age: parseInt(formData.age),
        topic: formData.topic,
        goals: formData.goals,
      };
      
      console.log("Registering with data:", userData);
      const { success, error } = await register(userData);
      
      if (!success) {
        toast.error(error || "Registration failed. Please try again.");
        console.error("Registration error:", error);
        return;
      }
      
      toast.success("Registration successful! Welcome to Silver Circles.");
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
      
    } catch (error: any) {
      toast.error("Registration failed. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Your Name</Label>
        <Input
          id="name"
          placeholder="e.g. John Smith"
          value={formData.name}
          onChange={(e) => updateFormData("name", e.target.value)}
          className={cn(errors.name && "border-destructive")}
        />
        {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="e.g. john.smith@example.com"
          value={formData.email}
          onChange={(e) => updateFormData("email", e.target.value)}
          className={cn(errors.email && "border-destructive")}
        />
        {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Create Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Create a secure password"
          value={formData.password}
          onChange={(e) => updateFormData("password", e.target.value)}
          className={cn(errors.password && "border-destructive")}
        />
        {errors.password && <p className="text-destructive text-sm">{errors.password}</p>}
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
    </div>
  );
  
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="age">Your Age</Label>
        <Input
          id="age"
          type="number"
          placeholder="e.g. 65"
          min="18"
          max="120"
          value={formData.age}
          onChange={(e) => updateFormData("age", e.target.value)}
          className={cn(errors.age && "border-destructive")}
        />
        {errors.age && <p className="text-destructive text-sm">{errors.age}</p>}
      </div>
      
      <div className="space-y-3">
        <Label>What brings you to Silver Circles?</Label>
        <RadioGroup
          value={formData.topic}
          onValueChange={(value) => {
            updateFormData("topic", value);
            updateFormData("goals", []);
          }}
          className="grid grid-cols-1 gap-4"
        >
          <Label
            htmlFor="retirement"
            className={cn(
              "flex items-center justify-between p-4 border rounded-md cursor-pointer",
              formData.topic === "retirement"
                ? "border-primary bg-primary/5"
                : "border-input hover:bg-accent"
            )}
          >
            <div className="space-y-1">
              <div className="font-medium">Reinventing Retirement</div>
              <div className="text-sm text-silver-500">
                Finding purpose, connection, and joy after work
              </div>
            </div>
            <RadioGroupItem
              value="retirement"
              id="retirement"
              className="border-primary"
            />
          </Label>
          
          <Label
            htmlFor="dating"
            className={cn(
              "flex items-center justify-between p-4 border rounded-md cursor-pointer",
              formData.topic === "dating"
                ? "border-primary bg-primary/5"
                : "border-input hover:bg-accent"
            )}
          >
            <div className="space-y-1">
              <div className="font-medium">Silver Singles</div>
              <div className="text-sm text-silver-500">
                Dating and relationships after 50
              </div>
            </div>
            <RadioGroupItem
              value="dating"
              id="dating"
              className="border-primary"
            />
          </Label>
        </RadioGroup>
        {errors.topic && <p className="text-destructive text-sm">{errors.topic}</p>}
      </div>
    </div>
  );
  
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>What are your main goals? (Select all that apply)</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {goalsByTopic[formData.topic]?.map((goal) => (
            <div
              key={goal}
              onClick={() => toggleGoal(goal)}
              className={cn(
                "flex items-center justify-between p-3 border rounded-md cursor-pointer transition-colors",
                formData.goals.includes(goal)
                  ? "border-primary bg-primary/5"
                  : "border-input hover:bg-accent"
              )}
            >
              <span className="mr-2">{goal}</span>
              {formData.goals.includes(goal) && (
                <Check size={18} className="text-primary" />
              )}
            </div>
          ))}
        </div>
        {errors.goals && <p className="text-destructive text-sm">{errors.goals}</p>}
      </div>
    </div>
  );
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow py-32 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-xl mx-auto">
            <Card className="border border-silver-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-serif">
                  Join Silver Circles
                </CardTitle>
                <CardDescription>
                  {step === 1 && "Create your account to get started"}
                  {step === 2 && "Tell us about yourself"}
                  {step === 3 && "What are you hoping to achieve?"}
                </CardDescription>
                
                <div className="flex items-center justify-between mt-6">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={cn(
                        "flex-1 h-2 rounded-full transition-colors",
                        s === step
                          ? "bg-primary"
                          : s < step
                          ? "bg-primary/40"
                          : "bg-silver-200"
                      )}
                    />
                  ))}
                </div>
              </CardHeader>
              
              <CardContent>{renderStepContent()}</CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <div className="flex justify-between w-full">
                  <Button
                    type="button"
                    onClick={prevStep}
                    variant="outline"
                    disabled={step === 1}
                    className={cn(step === 1 && "invisible")}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  
                  {step < 3 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="ml-auto"
                    >
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="ml-auto"
                    >
                      {isLoading ? "Joining..." : "Complete Signup"}
                      {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  )}
                </div>
                
                <Separator className="my-2" />
                
                <p className="text-center text-sm text-silver-500">
                  Already have an account?{" "}
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => navigate("/login")}
                    className="p-0 h-auto"
                  >
                    Sign in
                  </Button>
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default OnboardingPage;
