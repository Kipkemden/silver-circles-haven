import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGoalsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
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
    if (!user) return;

    const result = await updateProfile(user.id, {
      name: formData.name,
      age: parseInt(formData.age),
      topic: formData.topic,
      goals: formData.goals,
    });

    if (result.success) {
      setIsEditing(false);
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
                    <Button variant="ghost" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit}>Save</Button>
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
                        <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                          Name
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder="Your Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                          Email
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled
                          placeholder="Your Email"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="age" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                          Age
                        </label>
                        <Input
                          id="age"
                          name="age"
                          type="number"
                          value={formData.age}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder="Your Age"
                        />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="preferences">
                    <div className="space-y-2">
                      <label htmlFor="topic" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                        Preferred Topic
                      </label>
                      <Input
                        id="topic"
                        name="topic"
                        value={formData.topic}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="e.g., Retirement, Dating"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                        Your Goals
                      </label>
                      <div className="flex flex-col space-y-2">
                        <div>
                          <label className="inline-flex items-center space-x-2">
                            <Input
                              type="checkbox"
                              value="Financial Security"
                              checked={formData.goals.includes("Financial Security")}
                              onChange={handleGoalsChange}
                              disabled={!isEditing}
                              className="h-4 w-4 rounded"
                            />
                            <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                              Financial Security
                            </span>
                          </label>
                        </div>
                        <div>
                          <label className="inline-flex items-center space-x-2">
                            <Input
                              type="checkbox"
                              value="Social Connections"
                              checked={formData.goals.includes("Social Connections")}
                              onChange={handleGoalsChange}
                              disabled={!isEditing}
                              className="h-4 w-4 rounded"
                            />
                            <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                              Social Connections
                            </span>
                          </label>
                        </div>
                        <div>
                          <label className="inline-flex items-center space-x-2">
                            <Input
                              type="checkbox"
                              value="Personal Growth"
                              checked={formData.goals.includes("Personal Growth")}
                              onChange={handleGoalsChange}
                              disabled={!isEditing}
                              className="h-4 w-4 rounded"
                            />
                            <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                              Personal Growth
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <Button variant="destructive" onClick={handleLogout}>
                Logout
              </Button>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
