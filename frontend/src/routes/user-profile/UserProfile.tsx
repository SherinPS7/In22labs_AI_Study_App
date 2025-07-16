"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MessageSquareMore, UserPlus, Share2, Pencil } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Calendar, Edit } from "lucide-react";
import { format } from "date-fns";

// Helper functions
const getPlanStatus = (startDate: string, endDate: string) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (now < start) return "upcoming";
  if (now >= start && now <= end) return "active";
  return "completed";
};

const formatDate = (dateStr: string) =>
  format(new Date(dateStr), "MMM dd, yyyy");

// Replace with your actual auth/session logic
const loggedInUserId = 9;
const profileUserId = 9;
const isOwnProfile = loggedInUserId === profileUserId;

interface UserProfile {
  id: number;
  name: string;
  email?: string;
  bio?: string;
  is_public: boolean;
  follower_count: number;
  following_count: number;
  joined_on: string;
  updated_at: string;
}

interface StudyPlan {
  id: number;
  plan_name: string;
  user_id: number;
  start_date: string;
  end_date: string;
  study_time: number;
  weekdays: string[];
  courses?: any[];
}

export default function UserProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(true);
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [updatedBio, setUpdatedBio] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get<UserProfile>(
          `http://localhost:3000/api/profile/${profileUserId}`,
          { withCredentials: true }
        );
        setUser(res.data);
        setIsPublic(res.data.is_public);
        setUpdatedBio(res.data.bio || "");
        setUpdatedEmail(res.data.email || "");
      } catch (err) {
        console.error("❌ Failed to fetch user profile:", err);
      } finally {
        setLoading(false);
      }
    };

 const fetchStudyPlans = async () => {
  try {
    const res = await axios.get(
      `http://localhost:3000/api/studyplan/study-plans?userId=${profileUserId}`,
      { withCredentials: true }
    );
    console.log("✅ Fetched alternate study plans:", res.data);
    setStudyPlans(res.data.studyPlans); // <-- Store if needed
  } catch (err) {
    console.error("❌ Failed to fetch alternate study plans:", err);
  }
};

  
    fetchProfile();
    fetchStudyPlans();
  }, []);

  const handleToggle = async (val: boolean) => {
    try {
      setIsPublic(val);
      await axios.patch(
        `http://localhost:3000/api/profile/${profileUserId}`,
        { is_public: val },
        { withCredentials: true }
      );
      console.log("✅ Visibility updated");
    } catch (err) {
      console.error("❌ Failed to update visibility:", err);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      await axios.patch(
        `http://localhost:3000/api/profile/${profileUserId}`,
        {
          bio: updatedBio,
          email: updatedEmail,
        },
        { withCredentials: true }
      );
      if (user) {
        setUser({ ...user, bio: updatedBio, email: updatedEmail });
      }
      setEditOpen(false);
    } catch (err) {
      console.error("❌ Failed to update profile:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return <div className="p-6 text-muted-foreground">Loading profile...</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 relative">
      {/* ✏️ Edit Dialog */}
      {isOwnProfile && (
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              className="absolute right-6 top-6 rounded-full p-3 shadow-md"
              size="icon"
            >
              <Pencil className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={updatedEmail}
                  onChange={(e) => setUpdatedEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={updatedBio}
                  onChange={(e) => setUpdatedBio(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button disabled={saving} onClick={handleSaveChanges}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* 👤 Profile Card */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage
                src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
              />
              <AvatarFallback>
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription>
                {user.email || "No email available"}
              </CardDescription>
              <p className="text-sm text-muted-foreground mt-1">
                {user.bio || "No bio yet"}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex gap-6 text-sm text-muted-foreground">
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold text-foreground">
                  {user.follower_count}
                </span>
                <span>Followers</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold text-foreground">
                  {user.following_count}
                </span>
                <span>Following</span>
              </div>
            </div>

            {!isOwnProfile && (
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <UserPlus className="w-4 h-4 mr-1" />
                  Follow
                </Button>
                <Button size="sm">
                  <MessageSquareMore className="w-4 h-4 mr-1" />
                  Message
                </Button>
                <Button size="sm" variant="ghost">
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        {isOwnProfile && (
          <CardContent className="flex items-center gap-4">
            <Label htmlFor="public-profile" className="text-sm">
              Public Profile
            </Label>
            <Switch
              id="public-profile"
              checked={isPublic}
              onCheckedChange={handleToggle}
            />
          </CardContent>
        )}
      </Card>

      {/* 📚 Tabs */}
      <Tabs defaultValue="studyplans" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="studyplans">📚 Study Plans</TabsTrigger>
          <TabsTrigger value="groups">👥 Groups</TabsTrigger>
          <TabsTrigger value="accomplishments">🏆 Accomplishments</TabsTrigger>
        </TabsList>
<TabsContent value="studyplans">
  <Card className="mt-4">
    <CardHeader>
      <CardTitle>Your Study Plans</CardTitle>
    </CardHeader>
    <CardContent>
      {loading && studyPlans.length === 0 ? (
        <div className="text-center py-4">Loading plans...</div>
      ) : studyPlans.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No study plans yet. Create your first plan to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {studyPlans.map((plan) => {
            const status = getPlanStatus(plan.start_date, plan.end_date);
            return (
              <div
                key={plan.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                  <h3 className="text-lg font-semibold text-foreground mb-2 md:mb-0">
                    {plan.plan_name}
                  </h3>
                  {isOwnProfile && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => console.log("Edit", plan.id)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        aria-label="Edit plan"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                     
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>
                    <p>
                      <strong>Duration:</strong>{" "}
                      {formatDate(plan.start_date)} - {formatDate(plan.end_date)}
                    </p>
                    <p>
                      <strong>Daily Study Time:</strong> {plan.study_time} minutes
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Study Days:</strong>{" "}
                      {Array.isArray(plan.weekdays)
                        ? plan.weekdays.join(", ")
                        : "N/A"}
                    </p>
                    <p>
                      <strong>Status:</strong>
                      <span
                        className={`ml-1 px-2 py-1 rounded text-xs ${
                          status === "active"
                            ? "bg-green-100 text-green-800"
                            : status === "upcoming"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </CardContent>
  </Card>
</TabsContent>


        <TabsContent value="groups">
          <p className="text-sm text-muted-foreground mt-4">Coming soon...</p>
        </TabsContent>

        <TabsContent value="accomplishments">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Recent Accomplishments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">Coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
