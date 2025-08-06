
"use client";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileSettingsDialog from "@/components/user-profile/ProfileSettingsDialog";
import UserProfileCard from "@/components/user-profile/UserProfileCard";
import StudyPlansTab from "@/components/user-profile/StudyPlansTab";
import GroupsTab from "@/components/user-profile/GroupsTab";
import AccomplishmentsTab from "@/components/user-profile/AccomplishmentsTab";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
export interface UserProfile {
  id: number;
  name: string;
  email?: string;
  bio?: string;
  joined_on: string;
  follower_count: number;
  following_count: number;
  is_public: boolean;
}

export interface StudyPlan {
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
  const { userId: profileUserId } = useParams<{ userId: string }>();
  const [state, setState] = useState({
    user: null as UserProfile | null,
    studyPlans: [] as StudyPlan[],
    isPublic: true,
    loading: true,
    editOpen: false,
    updatedBio: "",
    updatedEmail: "",
    saving: false,
    isOwnProfile: false,
    settingsOpen: false,
    viewAsPublic: false,
    error: null as string | null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        const session = await axios.get(`${BASE_URL}/session/check-session`, { 
          withCredentials: true 
        });

        const currentUserId = session.data?.user?.userId?.toString();
        if (!profileUserId) throw new Error("Profile ID not found");

        const isOwn = currentUserId === profileUserId;

        const [profile, plans] = await Promise.all([
          axios.get(`${BASE_URL}/profile/${profileUserId}`, {
            withCredentials: true
          }),
          axios.get(`${BASE_URL}/studyplan/study-plans?userId=${profileUserId}`, {
            withCredentials: true
          }),
        ]);

        setState(prev => ({
          ...prev,
          user: profile.data,
          studyPlans: plans.data.studyPlans || [],
          isPublic: profile.data.is_public,
          updatedBio: profile.data.bio || "",
          updatedEmail: profile.data.email || "",
          isOwnProfile: isOwn,
          loading: false
        }));
      } catch (err) {
        setState(prev => ({
          ...prev,
          error: err instanceof Error ? err.message : "Failed to load profile",
          loading: false
        }));
      }
    };

    fetchData();
  }, [profileUserId]);

  const handleToggle = async (val: boolean) => {
    try {
      const session = await axios.get(`${BASE_URL}/session/check-session`, { withCredentials: true });
      const currentUserId = session.data?.user?.userId?.toString();

      if (!currentUserId || currentUserId !== profileUserId) {
        console.warn("Unauthorized visibility update attempt");
        return;
      }

      setState(prev => ({ ...prev, isPublic: val }));

      await axios.patch(
        `${BASE_URL}/profile/${currentUserId}`,
        { is_public: val },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Failed to update visibility:", err);
      setState(prev => ({ ...prev, isPublic: !val }));
    }
  };

  if (state.error) {
    return (
      <div className="p-6 text-center text-destructive">
        <h2 className="text-xl font-semibold">Error</h2>
        <p>{state.error}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (state.loading || !state.user) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 relative">
      {state.isOwnProfile && (
        <ProfileSettingsDialog
          isPublic={state.isPublic}
          viewAsPublic={state.viewAsPublic}
          setViewAsPublic={(val) => setState(prev => ({ ...prev, viewAsPublic: val }))}
          onEditClick={() => setState(prev => ({ ...prev, editOpen: true }))}
          onToggle={handleToggle}
          open={state.settingsOpen}
          setOpen={(val) => setState(prev => ({ ...prev, settingsOpen: val }))}
        />
      )}

      <UserProfileCard 
        user={state.user} 
        isOwnProfile={state.isOwnProfile} 
      />

      <Tabs defaultValue="studyplans">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="studyplans">📚 Study Plans</TabsTrigger>
          <TabsTrigger value="groups">👥 Groups</TabsTrigger>
          <TabsTrigger value="accomplishments">🏆 Accomplishments</TabsTrigger>
          {state.isOwnProfile && <TabsTrigger value="settings">⚙️ Settings</TabsTrigger>}
        </TabsList>

        <TabsContent value="studyplans">
          <StudyPlansTab 
            studyPlans={state.studyPlans} 
            isOwnProfile={state.isOwnProfile} 
            userName={state.user.name} 
          />
        </TabsContent>

        <TabsContent value="groups">
          <GroupsTab 
            isOwnProfile={state.isOwnProfile} 
            userName={state.user.name} 
          />
        </TabsContent>

       <TabsContent value="accomplishments">
  <AccomplishmentsTab 
    isOwnProfile={state.isOwnProfile} 
    userId={state.user.id}
    userName={state.user.name} 
  />
</TabsContent>


        {state.isOwnProfile && (
          <TabsContent value="settings">
            <div className="mt-4 p-6 border rounded-lg">
              <h3 className="font-semibold mb-4">Profile Settings</h3>
              <div className="flex items-center gap-4">
                <Label htmlFor="public-profile">Public Profile</Label>
                <Switch
                  id="public-profile"
                  checked={state.isPublic}
                  onCheckedChange={handleToggle}
                />
                <span className="text-sm text-muted-foreground">
                  {state.isPublic ? "Visible to everyone" : "Only visible to you"}
                </span>
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
