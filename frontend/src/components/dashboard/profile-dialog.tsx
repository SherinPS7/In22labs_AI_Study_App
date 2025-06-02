import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Button } from '../ui/button';
import { User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { formatDate } from '@/utils/format-date';

const DEFAULT_AVATAR = '/cta (1).png'; // Place a local image in your public folder

const ProfileDialog = () => {
  const authInfo = useSelector((state: RootState) => state.auth);

  const fetchAvatarImage = () => {
    const name = authInfo.userData?.name;
    if (!name) return DEFAULT_AVATAR;
    const initials = name
      .split(' ')
      .map((word: string) => word.charAt(0))
      .join('')
      .toUpperCase();
    // Use an avatar generator API or fallback image
    return `https://ui-avatars.com/api/?name=${initials}&background=random`;
  };

  if (!authInfo.userData) return null; // Skip rendering if user data is not available

  return (
    <Dialog>
      <DialogTrigger>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              <User className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Profile</TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>
            Manage your profile information.
          </DialogDescription>
        </DialogHeader>

        <main className="my-4 space-y-3">
          <section className="flex justify-start gap-6 items-center">
            <img
              src={fetchAvatarImage()}
              alt={authInfo.userData.name}
              className="w-24 h-24 rounded-full object-contain"
            />
            <main className="flex flex-col gap-2 justify-start">
              <h1 className="text-xl font-semibold text-foreground tracking-tight">
                {authInfo.userData.name}
              </h1>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-muted-foreground">
                  Email: <span className="text-foreground">{authInfo.userData.email}</span>
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  Mobile: <span className="text-foreground">
                    {authInfo.userData.mobile || 'Not Provided'}
                  </span>
                </span>
              </div>
            </main>
          </section>
        </main>

        <DialogFooter className="flex justify-start items-center flex-row w-full gap-6">
          <p className="text-sm font-light text-muted-foreground tracking-tight">
            Account created: {formatDate(authInfo.userData.$createdAt)}
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
