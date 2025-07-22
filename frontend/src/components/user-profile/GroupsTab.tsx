import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
  isOwnProfile: boolean;
  userName: string;
}

export default function GroupsTab({ isOwnProfile, userName }: Props) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>
          {isOwnProfile ? "Your" : `${userName}'s`} Study Groups
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isOwnProfile ? (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              You haven't joined any study groups yet.
            </p>
            <Button>Browse Study Groups</Button>
          </div>
        ) : (
          <p className="text-muted-foreground">
            {userName} hasn't shared their study groups.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

