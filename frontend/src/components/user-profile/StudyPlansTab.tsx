import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Edit, Share2, Save } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import axios from "axios";

interface StudyPlan {
  id: number;
  plan_name: string;
  start_date: string;
  end_date: string;
  study_time: number;
  weekdays: string[];
  // Add course_settings to interface if possible:
  course_settings?: Record<
    string,
    {
      daily_hours: number;
      start_time: string; // HH:mm
      study_days: string[];
      notes?: string;
    }
  >;
}

interface Props {
  studyPlans: StudyPlan[];
  isOwnProfile: boolean;
  userName: string;
}

// Helper: add hours to a "HH:mm" string and return "HH:mm"
function addHours(time: string, hours: number): string {
  if (!time) return "-";
  const [h, m] = time.split(":").map(Number);
  const date = new Date(0, 0, 0, h, m || 0);
  date.setMinutes(date.getMinutes() + Math.round(hours * 60));
  const hh = date.getHours().toString().padStart(2, "0");
  const mm = date.getMinutes().toString().padStart(2, "0");
  return `${hh}:${mm}`;
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

  const formatDate = (dateStr: string) => format(new Date(dateStr), "MMM dd, yyyy");

  const handleShareClick = (planId: number) => {
    const shareUrl = `${window.location.origin}/studyplan/${planId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Study plan link copied to clipboard!");
  };

const handleSaveClick = async (planId: number) => {
  try {
    await axios.post(
      `http://localhost:3000/api/profile/${planId}/save`, 
      {},
      { withCredentials: true }
    );
    toast.success("Study plan saved! You can now customize it.");
    // Optionally redirect to new plan page or refresh the list
  } catch (error) {
    toast.error("Failed to save study plan.");
  }
};



  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="font-semibold text-lg text-foreground">
          {isOwnProfile ? "Your" : `${userName}'s`} Study Plans
        </CardTitle>
        {isOwnProfile && (
          <CardDescription className="text-muted-foreground">
            Manage and track your study progress
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {studyPlans.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
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
                  onClick={() => window.location.assign(`/studyplan/${plan.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      window.location.assign(`/studyplan/${plan.id}`);
                    }
                  }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{plan.plan_name}</h3>
                    <div className="flex gap-2 items-center" onClick={(e) => e.stopPropagation()}>
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
                        <strong>Duration:</strong> {formatDate(plan.start_date)} - {formatDate(plan.end_date)}
                      </p>
                      <p>
                        <strong>Daily Study Time:</strong> {plan.study_time} minutes
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong>Study Days:</strong> {Array.isArray(plan.weekdays) ? plan.weekdays.join(", ") : "N/A"}
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

                  {/* {plan.course_settings && Object.keys(plan.course_settings).length > 0 && (
                    <div className="mt-4 bg-black-50 rounded border p-3 text-sm text-muted-foreground">
                      <strong className="text-blue-700 text-xs tracking-wide">Study Sessions:</strong>
                      <ul className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                        {Object.entries(plan.course_settings).map(([courseId, settings]) => {
                          const endTime = addHours(settings.start_time, settings.daily_hours);
                          return (
                            <li key={courseId} className="flex flex-col md:flex-row md:items-center md:gap-3">
                              {/* You can replace 'Course {courseId}' with course name if you have lookup */}
                              {/* <span className="font-medium text-gray-900">Course {courseId}:</span>
                              <span className="ml-1">
                                <span className="text-gray-700">Start </span>
                                <span className="font-semibold">{settings.start_time}</span>
                                <span className="mx-1">→</span>
                                <span className="text-gray-700">End </span>
                                <span className="font-semibold">{endTime}</span>
                                <span className="ml-2 text-gray-500">
                                  ({settings.daily_hours}h on {settings.study_days?.join(", ")})
                                </span>
                              </span>
                            </li>
                          );
                        })}
                      </ul>
            //         </div> */}
            {/* //  )}  */}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
