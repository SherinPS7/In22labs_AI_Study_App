import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Edit, Share2, Save } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface StudyPlan {
  id: number;
  plan_name: string;
  start_date: string;
  end_date: string;
  study_time: number;
  weekdays: string[];
}

interface Props {
  studyPlans: StudyPlan[];
  isOwnProfile: boolean;
  userName: string;
}

export default function StudyPlansTab({ studyPlans, isOwnProfile, userName }: Props) {
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

  const handleShareClick = (planId: number) => {
    const shareUrl = `${window.location.origin}/studyplan/${planId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Study plan link copied to clipboard!");
  };

  const handleSaveClick = (planId: number) => {
    // TODO: Add save logic here (API call to save plan)
    toast.success("Study plan saved to your profile! (Demo only)");
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>
          {isOwnProfile ? "Your" : `${userName}'s`} Study Plans
        </CardTitle>
        {isOwnProfile && (
          <CardDescription>Manage and track your study progress</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {studyPlans.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No study plans found</p>
            {isOwnProfile && (
              <Button className="mt-4" variant="outline">
                Create Your First Study Plan
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {studyPlans.map((plan) => {
              const status = getPlanStatus(plan.start_date, plan.end_date);
              return (
                <div
                  key={plan.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() =>
                    window.location.assign(`/studyplan/${plan.id}`)
                  }
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      window.location.assign(`/studyplan/${plan.id}`);
                    }
                  }}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                    <h3 className="text-lg font-semibold text-foreground mb-2 md:mb-0">
                      {plan.plan_name}
                    </h3>
                    <div
                      className="flex gap-2 items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Edit button only own profile */}
                      {isOwnProfile && (
                        <button
                          onClick={() => console.log("Edit", plan.id)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                          aria-label="Edit plan"
                          title="Edit plan"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}

                      {/* Always show Share button */}
                      <button
                        onClick={() => handleShareClick(plan.id)}
                        className="p-1 text-gray-600 hover:bg-gray-200 rounded flex items-center"
                        aria-label="Share plan"
                        title="Copy share link"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>

                      {!isOwnProfile && (
  <Button
    size="sm"
    onClick={() => handleSaveClick(plan.id)}
    className="ml-2 flex items-center gap-1"
    aria-label="Save plan"
    title="Save study plan"
  >
    <Save className="w-4 h-4" />
  </Button>
)}

                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <p>
                        <strong>Duration:</strong> {formatDate(plan.start_date)} -{" "}
                        {formatDate(plan.end_date)}
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
                        <strong>Status:</strong>{" "}
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
  );
}
