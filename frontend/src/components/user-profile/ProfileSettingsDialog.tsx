import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Settings } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Props {
  isPublic: boolean;
  viewAsPublic: boolean;
  setViewAsPublic: (val: boolean) => void;
  onEditClick: () => void;
  onToggle: (val: boolean) => void;
  open: boolean;
  setOpen: (val: boolean) => void;
}

export default function ProfileSettingsDialog({
  isPublic,
  viewAsPublic,
  setViewAsPublic,
  onEditClick,
  onToggle,
  open,
  setOpen,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="rounded-full p-3 shadow-md"
          size="icon"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="public-profile">Public Profile</Label>
            <Switch
              id="public-profile"
              checked={isPublic}
              onCheckedChange={onToggle}
            />
          </div>

          <div className="flex items-center gap-4">
            <Label htmlFor="view-mode">Public View Mode</Label>
            <Switch
              id="view-mode"
              checked={viewAsPublic}
              onCheckedChange={setViewAsPublic}
            />
          </div>
             <div className="flex items-center gap-4">
            <Label htmlFor="view-mode">Sync Google</Label>
            <Switch
              id="view-mode"
              checked={viewAsPublic}
              onCheckedChange={setViewAsPublic}
            />
          </div>
   <div className="flex items-center gap-4">
            <Label htmlFor="view-mode">Sync Notion</Label>
            <Switch
              id="view-mode"
              checked={viewAsPublic}
              onCheckedChange={setViewAsPublic}
            />
          </div>


          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
              onEditClick();
            }}
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
