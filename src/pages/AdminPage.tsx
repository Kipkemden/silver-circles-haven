
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Ban,
  CalendarPlus,
  Edit,
  MessageSquare,
  PlusCircle, 
  Save,
  Search,
  Trash,
  User,
  UserCheck,
  Users,
  Video,
} from "lucide-react";

// Mock data
const mockUsers = [
  {
    id: "u1",
    name: "Margaret Williams",
    email: "margaret.w@example.com",
    age: 65,
    group: "Retirement Circle #1",
    isSubscribed: true,
    isBanned: false,
  },
  {
    id: "u2",
    name: "Robert Thompson",
    email: "robert.t@example.com",
    age: 62,
    group: "Silver Singles #2",
    isSubscribed: true,
    isBanned: false,
  },
  {
    id: "u3",
    name: "Carol Lewis",
    email: "carol.l@example.com",
    age: 58,
    group: "Retirement Circle #2",
    isSubscribed: true,
    isBanned: false,
  },
  {
    id: "u4",
    name: "James Parker",
    email: "james.p@example.com",
    age: 52,
    group: "Silver Singles #1",
    isSubscribed: false,
    isBanned: true,
  },
  {
    id: "u5",
    name: "Patricia Harris",
    email: "patricia.h@example.com",
    age: 68,
    group: "Retirement Circle #1",
    isSubscribed: true,
    isBanned: false,
  },
];

const mockGroups = [
  {
    id: "g1",
    name: "Retirement Circle #1",
    facilitatorId: "f1",
    facilitatorName: "Dr. Sarah Johnson",
    zoomLink: "https://zoom.us/j/1234567890?pwd=abcdef",
    schedule: "Weekly, Wednesday 10:00 AM EST",
    memberCount: 8,
  },
  {
    id: "g2",
    name: "Retirement Circle #2",
    facilitatorId: "f2",
    facilitatorName: "Dr. Michael Chen",
    zoomLink: "https://zoom.us/j/0987654321?pwd=ghijkl",
    schedule: "Weekly, Thursday 2:00 PM EST",
    memberCount: 6,
  },
  {
    id: "g3",
    name: "Silver Singles #1",
    facilitatorId: "f3",
    facilitatorName: "Dr. Emily Brooks",
    zoomLink: "https://zoom.us/j/5647382910?pwd=mnopqr",
    schedule: "Weekly, Monday 7:00 PM EST",
    memberCount: 7,
  },
  {
    id: "g4",
    name: "Silver Singles #2",
    facilitatorId: "f4",
    facilitatorName: "Dr. Robert Davis",
    zoomLink: "https://zoom.us/j/1029384756?pwd=stuvwx",
    schedule: "Weekly, Tuesday 4:00 PM EST",
    memberCount: 5,
  },
];

const mockMeetings = [
  {
    id: "m1",
    groupId: "g1",
    groupName: "Retirement Circle #1",
    date: "2024-01-10T15:00:00Z",
    zoomLink: "https://zoom.us/j/1234567890?pwd=abcdef",
    topic: "Finding Purpose After Retirement",
  },
  {
    id: "m2",
    groupId: "g3",
    groupName: "Silver Singles #1",
    date: "2024-01-12T00:00:00Z",
    zoomLink: "https://zoom.us/j/5647382910?pwd=mnopqr",
    topic: "Building Confidence in Dating",
  },
  {
    id: "m3",
    groupId: "g2",
    groupName: "Retirement Circle #2",
    date: "2024-01-14T19:00:00Z",
    zoomLink: "https://zoom.us/j/0987654321?pwd=ghijkl",
    topic: "Financial Security in Retirement",
  },
];

// Determines if user is allowed to access admin panel
const checkAdminAccess = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const key = urlParams.get("key");
  return key === "secret"; // In a real app, this would be more secure
};

const AdminPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hasAccess, setHasAccess] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [users, setUsers] = useState(mockUsers);
  const [groups, setGroups] = useState(mockGroups);
  const [meetings, setMeetings] = useState(mockMeetings);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isEditingGroup, setIsEditingGroup] = useState(false);
  const [isEditingMeeting, setIsEditingMeeting] = useState(false);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [isAddingMeeting, setIsAddingMeeting] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    forumType: "retirement-tips",
  });
  
  useEffect(() => {
    const hasAdminAccess = checkAdminAccess();
    setHasAccess(hasAdminAccess);
    setIsCheckingAccess(false);
    
    if (!hasAdminAccess) {
      // Redirect if no access
      navigate("/");
    }
  }, [location, navigate]);

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter groups based on search term
  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.facilitatorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(date);
  };

  const handleToggleBan = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, isBanned: !user.isBanned } : user
      )
    );
    toast.success(`User ${users.find((u) => u.id === userId)?.isBanned ? "unbanned" : "banned"} successfully.`);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser({ ...user });
    setIsEditingUser(true);
  };

  const handleSaveUser = () => {
    if (selectedUser) {
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id ? { ...selectedUser } : user
        )
      );
      setIsEditingUser(false);
      toast.success("User updated successfully.");
    }
  };

  const handleEditGroup = (group: any) => {
    setSelectedGroup({ ...group });
    setIsEditingGroup(true);
  };

  const handleSaveGroup = () => {
    if (selectedGroup) {
      if (isAddingGroup) {
        setGroups([...groups, { ...selectedGroup, id: `g${groups.length + 1}` }]);
        setIsAddingGroup(false);
      } else {
        setGroups(
          groups.map((group) =>
            group.id === selectedGroup.id ? { ...selectedGroup } : group
          )
        );
        setIsEditingGroup(false);
      }
      toast.success(`Group ${isAddingGroup ? "created" : "updated"} successfully.`);
    }
  };

  const handleAddGroup = () => {
    setSelectedGroup({
      id: "",
      name: "",
      facilitatorId: "",
      facilitatorName: "",
      zoomLink: "",
      schedule: "",
      memberCount: 0,
    });
    setIsAddingGroup(true);
    setIsEditingGroup(true);
  };

  const handleDeleteGroup = (groupId: string) => {
    setGroups(groups.filter((group) => group.id !== groupId));
    toast.success("Group deleted successfully.");
  };

  const handleEditMeeting = (meeting: any) => {
    setSelectedMeeting({ ...meeting });
    setIsEditingMeeting(true);
  };

  const handleSaveMeeting = () => {
    if (selectedMeeting) {
      if (isAddingMeeting) {
        setMeetings([...meetings, { ...selectedMeeting, id: `m${meetings.length + 1}` }]);
        setIsAddingMeeting(false);
      } else {
        setMeetings(
          meetings.map((meeting) =>
            meeting.id === selectedMeeting.id ? { ...selectedMeeting } : meeting
          )
        );
        setIsEditingMeeting(false);
      }
      toast.success(`Meeting ${isAddingMeeting ? "created" : "updated"} successfully.`);
    }
  };

  const handleAddMeeting = () => {
    setSelectedMeeting({
      id: "",
      groupId: "",
      groupName: "",
      date: new Date().toISOString(),
      zoomLink: "",
      topic: "",
    });
    setIsAddingMeeting(true);
    setIsEditingMeeting(true);
  };

  const handleDeleteMeeting = (meetingId: string) => {
    setMeetings(meetings.filter((meeting) => meeting.id !== meetingId));
    toast.success("Meeting deleted successfully.");
  };

  const handlePostSubmit = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error("Please fill in both title and content for your post.");
      return;
    }
    
    // In a real app, this would create a post in Supabase
    toast.success("Post created successfully in the public forum.");
    setNewPost({
      title: "",
      content: "",
      forumType: "retirement-tips",
    });
  };

  if (isCheckingAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-36 bg-silver-200 rounded mb-4"></div>
          <div className="h-6 w-72 bg-silver-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-silver-50 pb-12">
      <header className="bg-primary text-white py-6 shadow-md">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-serif font-medium">
              Silver Circles Admin Panel
            </h1>
            <Button variant="secondary" asChild>
              <a href="/" className="text-primary">
                Return to Site
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-8">
        <Tabs defaultValue="users" className="space-y-8">
          <TabsList className="grid grid-cols-4 w-full max-w-3xl mx-auto">
            <TabsTrigger value="users" className="text-base">
              Users
            </TabsTrigger>
            <TabsTrigger value="groups" className="text-base">
              Groups
            </TabsTrigger>
            <TabsTrigger value="meetings" className="text-base">
              Meetings
            </TabsTrigger>
            <TabsTrigger value="forums" className="text-base">
              Forums
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  User Management
                </CardTitle>
                <CardDescription>
                  View and manage all registered users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-silver-500" />
                  <Input
                    placeholder="Search users by name, email or group..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Group</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.age}</TableCell>
                          <TableCell>{user.group}</TableCell>
                          <TableCell>
                            {user.isBanned ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-destructive/20 text-destructive">
                                Banned
                              </span>
                            ) : user.isSubscribed ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-silver-100 text-silver-700">
                                Inactive
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditUser(user)}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant={user.isBanned ? "default" : "destructive"}
                                size="sm"
                                onClick={() => handleToggleBan(user.id)}
                              >
                                {user.isBanned ? (
                                  <UserCheck className="h-4 w-4" />
                                ) : (
                                  <Ban className="h-4 w-4" />
                                )}
                                <span className="sr-only">
                                  {user.isBanned ? "Unban" : "Ban"}
                                </span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Edit User Dialog */}
            <Dialog open={isEditingUser} onOpenChange={setIsEditingUser}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit User</DialogTitle>
                  <DialogDescription>
                    Make changes to the user's information.
                  </DialogDescription>
                </DialogHeader>
                
                {selectedUser && (
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label>Name</label>
                      <Input
                        value={selectedUser.name}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label>Email</label>
                      <Input
                        value={selectedUser.email}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label>Age</label>
                      <Input
                        type="number"
                        value={selectedUser.age}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            age: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label>Group</label>
                      <Select
                        value={selectedUser.group}
                        onValueChange={(value) =>
                          setSelectedUser({ ...selectedUser, group: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a group" />
                        </SelectTrigger>
                        <SelectContent>
                          {groups.map((group) => (
                            <SelectItem key={group.id} value={group.name}>
                              {group.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label>Subscription Status</label>
                      <Select
                        value={selectedUser.isSubscribed ? "active" : "inactive"}
                        onValueChange={(value) =>
                          setSelectedUser({
                            ...selectedUser,
                            isSubscribed: value === "active",
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleSaveUser}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Groups Tab */}
          <TabsContent value="groups" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl flex items-center">
                      <Users className="mr-2 h-5 w-5" />
                      Group Management
                    </CardTitle>
                    <CardDescription>
                      Create and manage circle groups
                    </CardDescription>
                  </div>
                  <Button onClick={handleAddGroup}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Group
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-silver-500" />
                  <Input
                    placeholder="Search groups by name or facilitator..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Group Name</TableHead>
                        <TableHead>Facilitator</TableHead>
                        <TableHead>Schedule</TableHead>
                        <TableHead>Members</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredGroups.map((group) => (
                        <TableRow key={group.id}>
                          <TableCell className="font-medium">
                            {group.name}
                          </TableCell>
                          <TableCell>{group.facilitatorName}</TableCell>
                          <TableCell>{group.schedule}</TableCell>
                          <TableCell>{group.memberCount}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditGroup(group)}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteGroup(group.id)}
                              >
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Edit Group Dialog */}
            <Dialog
              open={isEditingGroup}
              onOpenChange={(open) => {
                setIsEditingGroup(open);
                if (!open) setIsAddingGroup(false);
              }}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {isAddingGroup ? "Create Group" : "Edit Group"}
                  </DialogTitle>
                  <DialogDescription>
                    {isAddingGroup
                      ? "Create a new circle group."
                      : "Make changes to this circle group."}
                  </DialogDescription>
                </DialogHeader>
                
                {selectedGroup && (
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label>Group Name</label>
                      <Input
                        value={selectedGroup.name}
                        onChange={(e) =>
                          setSelectedGroup({
                            ...selectedGroup,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label>Facilitator Name</label>
                      <Input
                        value={selectedGroup.facilitatorName}
                        onChange={(e) =>
                          setSelectedGroup({
                            ...selectedGroup,
                            facilitatorName: e.target.value,
                          })
                        }
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label>Zoom Link</label>
                      <Input
                        value={selectedGroup.zoomLink}
                        onChange={(e) =>
                          setSelectedGroup({
                            ...selectedGroup,
                            zoomLink: e.target.value,
                          })
                        }
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label>Schedule</label>
                      <Input
                        value={selectedGroup.schedule}
                        onChange={(e) =>
                          setSelectedGroup({
                            ...selectedGroup,
                            schedule: e.target.value,
                          })
                        }
                        placeholder="e.g. Weekly, Monday 7:00 PM EST"
                      />
                    </div>
                    
                    {!isAddingGroup && (
                      <div className="space-y-2">
                        <label>Member Count</label>
                        <Input
                          type="number"
                          value={selectedGroup.memberCount}
                          onChange={(e) =>
                            setSelectedGroup({
                              ...selectedGroup,
                              memberCount: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                    )}
                  </div>
                )}
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleSaveGroup}>
                    {isAddingGroup ? "Create Group" : "Save Changes"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Meetings Tab */}
          <TabsContent value="meetings" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl flex items-center">
                      <CalendarPlus className="mr-2 h-5 w-5" />
                      Meeting Setup
                    </CardTitle>
                    <CardDescription>
                      Schedule and manage circle meetings
                    </CardDescription>
                  </div>
                  <Button onClick={handleAddMeeting}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Meeting
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Group</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Topic</TableHead>
                        <TableHead>Zoom Link</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {meetings.map((meeting) => (
                        <TableRow key={meeting.id}>
                          <TableCell className="font-medium">
                            {meeting.groupName}
                          </TableCell>
                          <TableCell>{formatDate(meeting.date)}</TableCell>
                          <TableCell>{meeting.topic}</TableCell>
                          <TableCell>
                            <a
                              href={meeting.zoomLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-primary hover:underline"
                            >
                              <Video className="mr-1 h-4 w-4" />
                              <span>Open Link</span>
                            </a>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditMeeting(meeting)}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteMeeting(meeting.id)}
                              >
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Edit Meeting Dialog */}
            <Dialog
              open={isEditingMeeting}
              onOpenChange={(open) => {
                setIsEditingMeeting(open);
                if (!open) setIsAddingMeeting(false);
              }}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {isAddingMeeting ? "Add Meeting" : "Edit Meeting"}
                  </DialogTitle>
                  <DialogDescription>
                    {isAddingMeeting
                      ? "Schedule a new circle meeting."
                      : "Update this circle meeting."}
                  </DialogDescription>
                </DialogHeader>
                
                {selectedMeeting && (
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label>Group</label>
                      <Select
                        value={selectedMeeting.groupId}
                        onValueChange={(value) => {
                          const group = groups.find((g) => g.id === value);
                          setSelectedMeeting({
                            ...selectedMeeting,
                            groupId: value,
                            groupName: group ? group.name : "",
                            zoomLink: group ? group.zoomLink : "",
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a group" />
                        </SelectTrigger>
                        <SelectContent>
                          {groups.map((group) => (
                            <SelectItem key={group.id} value={group.id}>
                              {group.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label>Date & Time</label>
                      <Input
                        type="datetime-local"
                        value={new Date(selectedMeeting.date)
                          .toISOString()
                          .slice(0, 16)}
                        onChange={(e) =>
                          setSelectedMeeting({
                            ...selectedMeeting,
                            date: new Date(e.target.value).toISOString(),
                          })
                        }
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label>Topic</label>
                      <Input
                        value={selectedMeeting.topic}
                        onChange={(e) =>
                          setSelectedMeeting({
                            ...selectedMeeting,
                            topic: e.target.value,
                          })
                        }
                        placeholder="e.g. Finding Purpose After Retirement"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label>Zoom Link</label>
                      <Input
                        value={selectedMeeting.zoomLink}
                        onChange={(e) =>
                          setSelectedMeeting({
                            ...selectedMeeting,
                            zoomLink: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                )}
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleSaveMeeting}>
                    {isAddingMeeting ? "Schedule Meeting" : "Save Changes"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Forums Tab */}
          <TabsContent value="forums" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Forum Management
                </CardTitle>
                <CardDescription>
                  Create posts and manage the public forums
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Create Public Forum Post</h3>
                  
                  <div className="space-y-2">
                    <label>Forum</label>
                    <Select
                      value={newPost.forumType}
                      onValueChange={(value) =>
                        setNewPost({ ...newPost, forumType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a forum" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="retirement-tips">Retirement Tips</SelectItem>
                        <SelectItem value="dating-after-50">Dating After 50</SelectItem>
                        <SelectItem value="ask-the-community">Ask the Community</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label>Post Title</label>
                    <Input
                      value={newPost.title}
                      onChange={(e) =>
                        setNewPost({ ...newPost, title: e.target.value })
                      }
                      placeholder="Enter a compelling title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label>Post Content</label>
                    <Textarea
                      value={newPost.content}
                      onChange={(e) =>
                        setNewPost({ ...newPost, content: e.target.value })
                      }
                      placeholder="Write your post content here..."
                      rows={6}
                    />
                  </div>
                  
                  <Button
                    onClick={handlePostSubmit}
                    className="flex items-center"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Publish Post
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPage;
