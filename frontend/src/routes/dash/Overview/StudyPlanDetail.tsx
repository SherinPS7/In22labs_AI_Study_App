import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

// Interfaces
interface Course {
  id: number;
  course_name: string;
  user_id_foreign_key?: number;
  ref_course_id?: number | null;
  notion_template_db_id?: string | null;
}

interface StudyPlan {
  id: number;
  plan_name: string;
  user_id: number;
  start_date: string;
  end_date: string;
  weekdays: string[];
  study_time: number;
  course_details?: Course[];
}

// Gradient colors to visually differentiate courses
const gradients = [
  "linear-gradient(135deg, #09af67, rgb(77, 96, 90))",
  "linear-gradient(135deg, rgb(24, 173, 118), rgb(64, 91, 91))",
  "linear-gradient(135deg, rgb(26, 90, 57), rgb(62, 70, 66))",
  "linear-gradient(135deg, rgb(48, 99, 76), rgb(88, 104, 116))",
  "linear-gradient(135deg, rgb(46, 98, 53), rgb(91, 180, 135))",
  "linear-gradient(135deg, rgb(39, 91, 85), rgb(94, 190, 209))",
  "linear-gradient(135deg, rgb(75, 128, 116), rgb(32, 55, 69))",
];

const getGradientForCourse = (courseId: number) =>
  gradients[courseId % gradients.length];

const StudyPlanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progressMap, setProgressMap] = useState<Record<number, number>>({}); // courseId => progress %

  // Format date nicely, fallback to N/A
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get study plan status (Upcoming, Active, Completed)
  const getPlanStatus = (startDateStr: string, endDateStr: string) => {
    const now = new Date();
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    if (now < start) return "Upcoming";
    if (now > end) return "Completed";
    return "Active";
  };

  useEffect(() => {
    if (!id) return;

    const fetchPlan = async () => {
      setLoading(true);
      try {
        // Fetch study plan with course details
        const res = await axios.get(
          `http://localhost:3000/api/studyplan/study-plans/${id}/with-courses`,
          { withCredentials: true }
        );

        setPlan(res.data.studyPlan);

        // If there are courses, fetch progress for each
        if (res.data.studyPlan.course_details?.length) {
          const progressResults = await Promise.all(
            res.data.studyPlan.course_details.map(async (course: Course) => {
              try {
                const progressRes = await axios.get<{
                  watchedVideos: number;
                  totalVideos: number;
                }>(`http://localhost:3000/api/videos/course/progress/${course.id}`, {
                  withCredentials: true,
                });

                const { watchedVideos, totalVideos } = progressRes.data;
                return {
                  courseId: course.id,
                  progress: totalVideos > 0 ? Math.round((watchedVideos / totalVideos) * 100) : 0,
                };
              } catch {
                return { courseId: course.id, progress: 0 };
              }
            })
          );

          const progressMapData: Record<number, number> = {};
          progressResults.forEach(({ courseId, progress }) => {
            progressMapData[courseId] = progress;
          });

          setProgressMap(progressMapData);
        }
      } catch {
        setError("Failed to load study plan");
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id]);

  if (loading)
    return (
      <div className="p-6 text-center text-xl font-semibold text-gray-600">
        Loading study plan...
      </div>
    );
  if (error)
    return (
      <div className="p-6 text-center text-red-600 text-lg font-semibold">
        {error}
      </div>
    );
  if (!plan) return <div className="p-6 text-center">No plan found.</div>;

  const status = getPlanStatus(plan.start_date, plan.end_date);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Card className="mb-8 shadow-lg border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
            {plan.plan_name}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 dark:text-gray-300 mb-8">
            <div className="space-y-2">
              <p>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  Duration:
                </span>{" "}
                {formatDate(plan.start_date)} — {formatDate(plan.end_date)}
              </p>
              <p>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  Daily Study Time:
                </span>{" "}
                {plan.study_time} minutes
              </p>
              <p>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  Study Days:
                </span>{" "}
                {plan.weekdays.join(", ")}
              </p>
            </div>
            <div className="space-y-2">
              <p>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  Status:
                </span>{" "}
                <span
                  className={`inline-block ml-1 px-3 py-1 rounded-full text-xs font-semibold ${
                    status === "Active"
                      ? "bg-green-100 text-green-800"
                      : status === "Upcoming"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {status}
                </span>
              </p>
            </div>
          </div>

          {/* Courses Section */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Courses
            </h2>

            {plan.course_details && plan.course_details.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plan.course_details.map((course) => (
                  <article
                    key={course.id}
                    tabIndex={0}
                    role="button"
                    onClick={() => navigate(`/course/${course.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        navigate(`/course/${course.id}`);
                      }
                    }}
                    className="rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition duration-300 hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-primary/50 bg-gradient-to-tr"
                    style={{ background: getGradientForCourse(course.id) }}
                    aria-label={`View course ${course.course_name}`}
                  >
                    <div className="relative h-48 flex items-center justify-center">
                      <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" />
                      <h3 className="z-10 px-6 text-3xl font-extrabold text-white text-center line-clamp-2">
                        {course.course_name}
                      </h3>
                      <div className="absolute top-3 right-3 z-20">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Play ${course.course_name}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/course/${course.id}`);
                          }}
                          className="bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full"
                        >
                          <Play className="w-7 h-7 text-white" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-5 bg-white/20 backdrop-blur rounded-b-2xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold bg-white/40 py-1 px-2 rounded-full text-white select-none pointer-events-none">
                          Started
                        </span>
                        <span className="text-xs text-white/80 select-none pointer-events-none">
                          Self Curated
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-white font-medium">Progress</span>
                        <span className="text-white font-semibold">
                          {progressMap[course.id] ?? 0}%
                        </span>
                      </div>
                      <div className="w-full bg-white/40 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-white h-2 rounded-full transition-all duration-500"
                          style={{ width: `${progressMap[course.id] ?? 0}%` }}
                        />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No courses associated with this plan.</p>
            )}
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyPlanDetail;
