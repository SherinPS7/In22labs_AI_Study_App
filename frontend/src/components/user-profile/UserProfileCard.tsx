import { useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import {
  
  Share2,
  UserPlus,
  UserCheck,
  UserX,
} from "lucide-react";
import { toast } from "sonner";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { QRCodeSVG } from 'qrcode.react';


interface MinimalUser {
  id: number;
  name: string;
  email: string;
  is_following?: boolean;
  requested_at?: string;
  status?: "pending" | "accepted" | "rejected";
}

interface UserProfile {
  id: number;
  name: string;
  email?: string;
  bio?: string;
  is_public: boolean;
  is_following?: boolean;
  has_pending_request?: boolean;
  follower_count: number;
  following_count: number;
  joined_on: string;
}

interface Props {
  user: UserProfile;
  isOwnProfile: boolean;
  onUpdate?: () => void;
}

const BASE_URL = "http://localhost:3000";

export default function UserProfileCard({
  user,
  isOwnProfile,
  onUpdate,
}: Props) {

  // State for QR modal
  const [showShareDialog, setShowShareDialog] = useState(false);

  const [state, setState] = useState({
    isFollowing: user.is_following ?? false,
    hasPendingRequest: user.has_pending_request ?? false,
    loading: false,
    showDialog: false,
    dialogType: null as "followers" | "following" | "requests" | null,
    list: [] as MinimalUser[],
    isPublic: user.is_public,
  });

  const formatDate = (dateStr: string) =>
    format(new Date(dateStr), "MMMM dd, yyyy");

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  // The shareable public profile link
  const profileLink = `${window.location.origin}/profile/${user.id}`;

  // ... your handlers remain unchanged ...

  const handleFollowAction = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      if (state.hasPendingRequest) {
        await axios.delete(`${BASE_URL}/api/profile/requests/${user.id}`, {
          withCredentials: true,
        });
        toast.success("Follow request canceled");
        setState((prev) => ({
          ...prev,
          hasPendingRequest: false,
          loading: false,
        }));
      } else {
        await axios.post(
          `${BASE_URL}/api/profile/follow/${user.id}`,
          {},
          { withCredentials: true }
        );
        if (state.isPublic) {
          toast.success("Followed successfully");
          setState((prev) => ({
            ...prev,
            isFollowing: true,
            loading: false,
          }));
        } else {
          toast.success("Follow request sent");
          setState((prev) => ({
            ...prev,
            hasPendingRequest: true,
            loading: false,
          }));
        }
      }
      onUpdate?.();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Follow action failed");
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleUnfollow = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      await axios.delete(`${BASE_URL}/api/profile/unfollow/${user.id}`, {
        withCredentials: true,
      });
      toast.success("Unfollowed successfully");
      setState((prev) => ({ ...prev, isFollowing: false, loading: false }));
      onUpdate?.();
    } catch (err) {
      toast.error("Failed to unfollow");
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleViewList = async (type: "followers" | "following" | "requests") => {
    try {
      let url = "";
      if (type === "requests") {
        url = `${BASE_URL}/api/profile/requests/pending`;
      } else {
        url = `${BASE_URL}/api/profile/${user.id}/${type}`;
      }
      const res = await axios.get(url, { withCredentials: true });
      setState((prev) => ({
        ...prev,
        list: res.data || [],
        showDialog: true,
        dialogType: type,
      }));
    } catch (err: any) {
      toast.error(err?.response?.data?.error || `Failed to load ${type}`);
    }
  };

  const handleRequestAction = async (
    requestId: number,
    action: "accept" | "reject"
  ) => {
    try {
      await axios.post(
        `${BASE_URL}/api/profile/requests/${action}/${requestId}`,
        {},
        { withCredentials: true }
      );
      toast.success(`Request ${action}ed`);
      setState((prev) => ({
        ...prev,
        list: prev.list.filter((u) => u.id !== requestId),
      }));
      onUpdate?.();
    } catch (err) {
      toast.error("Failed to update request");
    }
  };

  const followButtonState = state.loading
    ? { text: "Processing...", variant: "outline" as const }
    : state.hasPendingRequest
    ? { text: "Requested", variant: "outline" as const }
    : state.isFollowing
    ? { text: "Following", variant: "default" as const }
    : { text: "Follow", variant: "default" as const };

  return (
    <>
     <Card>
  <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-6">
    <div className="flex items-center gap-4">
      <Avatar className="w-20 h-20">
        <AvatarImage
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
        />
        <AvatarFallback>
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>
      <div>
        <div className="flex items-center gap-2">
          <CardTitle className="text-2xl">{user.name}</CardTitle>
          {!state.isPublic && (
            <Badge variant="outline">Private</Badge>
          )}
        </div>
        {isOwnProfile && (
          <CardDescription>
            {user.email || "No email available"}
          </CardDescription>
        )}
        <p className="text-sm text-muted-foreground mt-1">
          {user.bio || "No bio yet"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Joined {formatDate(user.joined_on)}
        </p>
      </div>
    </div>

    <div className="flex flex-col sm:flex-row gap-4 items-center">
      <div className="flex gap-6 text-sm text-muted-foreground">
        <button
          className="flex flex-col items-center hover:text-foreground transition-colors"
          onClick={() => handleViewList("followers")}
        >
          <span className="text-lg font-bold text-foreground">
            {user.follower_count}
          </span>
          <span>Followers</span>
        </button>
        <button
          className="flex flex-col items-center hover:text-foreground transition-colors"
          onClick={() => handleViewList("following")}
        >
          <span className="text-lg font-bold text-foreground">
            {user.following_count}
          </span>
          <span>Following</span>
        </button>
        {isOwnProfile && !state.isPublic && (
          <button
            className="flex flex-col items-center hover:text-foreground transition-colors"
            onClick={() => handleViewList("requests")}
          >
            <span className="text-lg font-bold text-foreground">
              {state.list.length}
            </span>
            <span>Requests</span>
          </button>
        )}
      </div>

      {!isOwnProfile && (
        <div className="flex gap-2">
          {state.isFollowing ? (
            <Button
              size="sm"
              onClick={handleUnfollow}
              disabled={state.loading}
              variant="outline"
            >
              <UserX className="w-4 h-4 mr-2" /> Unfollow
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleFollowAction}
              disabled={state.loading}
              variant={followButtonState.variant}
            >
              {state.hasPendingRequest ? (
                <UserCheck className="w-4 h-4 mr-2" />
              ) : (
                <UserPlus className="w-4 h-4 mr-2" />
              )}
              {followButtonState.text}
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowShareDialog(true)}
          >
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
        </div>
      )}
    </div>
  </CardHeader>
</Card>


      {/* QR/Share Dialog */}
    
<Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Share Profile</DialogTitle>
    </DialogHeader>
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="text"
          readOnly
          value={profileLink}
          className="w-full border px-2 py-1 rounded text-sm"
        />
        <Button
          size="sm"
          onClick={() => {
            navigator.clipboard.writeText(profileLink);
            toast.success("Link copied!");
          }}
        >
          Copy
        </Button>
      </div>
      <div className="flex justify-center">
        <QRCodeSVG value={profileLink} size={168} />
      </div>
    </div>
  </DialogContent>
</Dialog>


      {/* Follower/Following/Requests Dialog */}
      <Dialog
        open={state.showDialog}
        onOpenChange={(open) =>
          setState((prev) => ({ ...prev, showDialog: open }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {state.dialogType === "followers"
                ? "Followers"
                : state.dialogType === "following"
                ? "Following"
                : "Follow Requests"}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto">
            {state.list.length > 0 ? (
              state.list.map((u) => (
                <div
                  key={u.id}
                  className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-lg transition-colors"
                >
                  <div>
                    <p>{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                    {u.requested_at && (
                      <p className="text-xs">Requested {formatDate(u.requested_at)}</p>
                    )}
                  </div>
                  {state.dialogType === "requests" ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRequestAction(u.id, "reject")}
                      >
                        Decline
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleRequestAction(u.id, "accept")}
                      >
                        Accept
                      </Button>
                    </div>
                  ) : null}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                {state.dialogType === "requests"
                  ? "No pending requests"
                  : `No ${state.dialogType} found`}
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
