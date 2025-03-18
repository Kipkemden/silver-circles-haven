
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { AlertCircle, Save, CreditCard, LogOut } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  useEffect(() => {
    // In a real app, this would fetch user data from Supabase
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      setUserData(parsedData);
      setFormData({
        name: parsedData.name || "",
        email: parsedData.email || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, []);

  const handleSaveProfile = () => {
    // Validate password match if updating password
    if (
      formData.password &&
      formData.password !== formData.confirmPassword
    ) {
      toast.error("Passwords do not match");
      return;
    }

    // In a real app, this would update user data in Supabase
    const updatedUserData = {
      ...userData,
      name: formData.name,
      email: formData.email,
    };
    
    localStorage.setItem("userData", JSON.stringify(updatedUserData));
    setUserData(updatedUserData);
    
    toast.success("Profile updated successfully");
  };

  const handleCancelSubscription = () => {
    // In a real app, this would call Stripe API to cancel subscription
    localStorage.removeItem("isAuthenticated");
    toast.success("Your subscription has been canceled");
    navigate("/");
  };

  const handleLogout = () => {
    // In a real app, this would sign out from Supabase
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-36 bg-silver-200 rounded mb-4"></div>
          <div className="h-6 w-72 bg-silver-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAuthenticated={true} />

      <main className="flex-grow pt-32 pb-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-serif font-medium mb-8">
              Your Profile
            </h1>

            <div className="grid gap-8">
              <Card className="border border-silver-200">
                <CardHeader>
                  <CardTitle className="text-xl">Account Information</CardTitle>
                  <CardDescription>
                    Update your personal details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveProfile} className="flex items-center">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border border-silver-200">
                <CardHeader>
                  <CardTitle className="text-xl">Security</CardTitle>
                  <CardDescription>Update your password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveProfile}>Update Password</Button>
                </CardFooter>
              </Card>

              <Card className="border border-silver-200">
                <CardHeader>
                  <CardTitle className="text-xl">Subscription</CardTitle>
                  <CardDescription>
                    Manage your subscription settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-silver-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Current Plan</h4>
                      <span className="bg-blue-100 text-primary px-2 py-1 rounded-full text-xs font-medium">
                        ACTIVE
                      </span>
                    </div>
                    <p className="text-silver-600 mb-4">
                      {userData.plan === "yearly" ? "Annual Plan - $600/year" : "Monthly Plan - $60/month"}
                    </p>
                    <div className="flex items-center text-sm text-silver-500">
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Next billing date: January 15, 2024</span>
                    </div>
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="payment">
                      <AccordionTrigger>Payment Method</AccordionTrigger>
                      <AccordionContent>
                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center">
                            <div className="h-8 w-12 bg-silver-200 rounded mr-3"></div>
                            <span>•••• •••• •••• 4242</span>
                          </div>
                          <Button variant="outline" size="sm">
                            Update
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="history">
                      <AccordionTrigger>Billing History</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div className="flex justify-between py-2 border-b border-silver-100">
                            <div>
                              <p className="font-medium">Dec 15, 2023</p>
                              <p className="text-sm text-silver-500">
                                Silver Circles Membership
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {userData.plan === "yearly" ? "$600.00" : "$60.00"}
                              </p>
                              <p className="text-sm text-green-600">Paid</p>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Download Invoices</Button>
                  <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                    <DialogTrigger asChild>
                      <Button variant="destructive">Cancel Subscription</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex items-center">
                          <AlertCircle className="mr-2 h-5 w-5 text-destructive" />
                          Cancel Your Subscription?
                        </DialogTitle>
                        <DialogDescription className="pt-4">
                          Are you sure you want to cancel your Silver Circles membership? You'll lose access to:
                          <ul className="list-disc pl-5 pt-2 space-y-1">
                            <li>Weekly group sessions</li>
                            <li>Private forum access</li>
                            <li>Community support</li>
                          </ul>
                          <p className="pt-2">
                            Your access will continue until the end of your current billing period.
                          </p>
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="mt-4">
                        <DialogClose asChild>
                          <Button variant="outline">Keep Subscription</Button>
                        </DialogClose>
                        <Button
                          variant="destructive"
                          onClick={handleCancelSubscription}
                        >
                          Confirm Cancellation
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>

              <div className="text-center pt-4">
                <Button
                  variant="ghost"
                  className="text-silver-600 hover:text-silver-900"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Log Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
