
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

interface ProfileFormData {
  name: string;
  email: string;
  age: string;
  topic: string;
  goals: string[];
}

const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    email: "",
    age: "",
    topic: "",
    goals: [] as string[],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        age: user.age?.toString() || "",
        topic: user.topic || "",
        goals: user.goals || [],
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGoalsChange = (value: string, checked: boolean) => {
    setFormData(prev => {
      let newGoals = [...prev.goals];
      if (checked) {
        newGoals.push(value);
      } else {
        newGoals = newGoals.filter(goal => goal !== value);
      }
      return { ...prev, goals: newGoals };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || isSubmitting) return;

    try {
      setIsSubmitting(true);
      
      const result = await updateProfile({
        name: formData.name,
        age: parseInt(formData.age) || undefined,
        topic: formData.topic,
        goals: formData.goals,
      });

      if (result.success) {
        setIsEditing(false);
        toast.success("Profile updated successfully");
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif mb-2">Loading...</h2>
          <p className="text-silver-600">Please wait while we retrieve your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="border border-silver-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-2xl font-bold">Your Profile</CardTitle>
                {isEditing ? (
                  <div className="space-x-2">
                    <Button variant="ghost" onClick={() => setIsEditing(false)} disabled={isSubmitting}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save"}
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="account" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="preferences">Preferences</TabsTrigger>
                  </TabsList>
                  <TabsContent value="account" className="space-y-4">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          disabled={!isEditing || isSubmitting}
                          placeholder="Your Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={true}
                          placeholder="Your Email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          name="age"
                          type="number"
                          value={formData.age}
                          onChange={handleChange}
                          disabled={!isEditing || isSubmitting}
                          placeholder="Your Age"
                        />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="preferences">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="topic">Preferred Topic</Label>
                        <Input
                          id="topic"
                          name="topic"
                          value={formData.topic}
                          onChange={handleChange}
                          disabled={!isEditing || isSubmitting}
                          placeholder="e.g., Retirement, Dating"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Your Goals</Label>
                        <div className="flex flex-col space-y-2">
                          {["Financial Security", "Social Connections", "Personal Growth"].map((goal) => (
                            <div key={goal} className="flex items-center space-x-2">
                              <Checkbox
                                id={`goal-${goal}`}
                                checked={formData.goals.includes(goal)}
                                onCheckedChange={(checked) => 
                                  handleGoalsChange(goal, checked as boolean)
                                }
                                disabled={!isEditing || isSubmitting}
                              />
                              <Label htmlFor={`goal-${goal}`} className="cursor-pointer">
                                {goal}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                <div className="pt-4">
                  <Button variant="destructive" onClick={handleLogout} disabled={isSubmitting}>
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
