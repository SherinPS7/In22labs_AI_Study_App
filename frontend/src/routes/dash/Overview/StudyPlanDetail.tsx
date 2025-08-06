import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {  Play } from 'lucide-react';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
// Course interface as per your API response
interface Course {
  id: number;
  course_name: string;
  user_id_foreign_key?: number;
  ref_course_id?: number | null;
  notion_template_db_id?: string | null;
}

// Progress shape for a course video watching (simulate or fetch from backend)
// interface CourseProgress {
//   watchedVideos: number;
//   totalVideos: number;
// }

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

const gradients = [
  'linear-gradient(135deg, #09af67, rgb(77, 96, 90))',
  'linear-gradient(135deg, rgb(24, 173, 118), rgb(64, 91, 91))',
  'linear-gradient(135deg, rgb(26, 90, 57), rgb(62, 70, 66))',
  'linear-gradient(135deg, rgb(48, 99, 76), rgb(88, 104, 116))',
  'linear-gradient(135deg, rgb(46, 98, 53), rgb(91, 180, 135))',
  'linear-gradient(135deg, rgb(39, 91, 85), rgb(94, 190, 209))',
  'linear-gradient(135deg, rgb(75, 128, 116), rgb(32, 55, 69))',
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

  // Format dates
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Status based on dates
  const getPlanStatus = (startDateStr: string, endDateStr: string) => {
    const now = new Date();
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    if (now < start) return 'upcoming';
    if (now > end) return 'completed';
    return 'active';
  };

  // Fetch plan + courses
  useEffect(() => {
    if (!id) return;

    const fetchPlan = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/studyplan/study-plans/${id}/with-courses`, {
          withCredentials: true,
        });
        setPlan(res.data.studyPlan);

        if (res.data.studyPlan.course_details?.length) {
          // Fetch progress for each course
          const progressResults = await Promise.all(
            res.data.studyPlan.course_details.map(async (course: Course) => {
              try {
                const progressRes = await axios.get<{ watchedVideos: number; totalVideos: number }>(
                  `${BASE_URL}/videos/course/progress/${course.id}`,
                  { withCredentials: true }
                );
                const { watchedVideos, totalVideos } = progressRes.data;
                const progress = totalVideos > 0 ? Math.round((watchedVideos / totalVideos) * 100) : 0;
                return { courseId: course.id, progress };
              } catch {
                return { courseId: course.id, progress: 0 };
              }
            })
          );
          // Map progress by courseId
          const map: Record<number, number> = {};
          progressResults.forEach(({ courseId, progress }) => {
            map[courseId] = progress;
          });
          setProgressMap(map);
        }
      } catch (err) {
        setError('Failed to load study plan');
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id]);

  const status = plan ? getPlanStatus(plan.start_date, plan.end_date) : null;

  if (loading) return <div className="p-6 text-center">Loading study plan...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;
  if (!plan) return <div className="p-6 text-center">No plan found.</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{plan.plan_name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 mb-6">
            <div>
              <p><strong>Duration:</strong> {formatDate(plan.start_date)} — {formatDate(plan.end_date)}</p>
              <p><strong>Daily Study Time:</strong> {plan.study_time} minutes</p>
              <p><strong>Study Days:</strong> {plan.weekdays.join(', ')}</p>
              <p>
                <strong>Status:</strong>{' '}
                <span className={`px-2 py-1 rounded text-xs ${
                  status === 'active' ? 'bg-green-100 text-green-800' :
                  status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {status}
                </span>
              </p>
            </div>
          </div>

          {/* Courses cards */}
          <h3 className="text-2xl font-semibold mb-4">Courses</h3>
          {plan.course_details && plan.course_details.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plan.course_details.map((course) => (
                <div
                  key={course.id}
                  className="rounded-2xl shadow-md overflow-hidden bg-card cursor-pointer"
                  onClick={() => navigate(`/course/${course.id}`)}
                  style={{ background: getGradientForCourse(course.id) }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') navigate(`/course/${course.id}`);
                  }}
                >
                  <div className="relative h-48 flex items-center justify-center text-white">
                    <div className="absolute inset-0 bg-black/20" />
                    <h3 className="z-10 text-2xl md:text-3xl font-bold text-center px-4">{course.course_name}</h3>
                    <div className="absolute top-2 right-2 z-10">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-background/30 backdrop-blur-sm hover:bg-background/50 rounded-full"
                      >
                        <Play className="w-6 h-6 text-white" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 text-white bg-muted/10 dark:bg-muted/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium px-2 py-1 bg-white/20 text-white rounded-full">Started</span>
                      <span className="text-xs text-white/70">Self Curated</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Progress</span>
                      <span className="text-sm font-medium text-primary">
                        {progressMap[course.id] ?? 0}%
                      </span>
                    </div>
                    <div className="w-full bg-white/30 rounded-full h-2 mt-1">
                      <div
                        className="bg-white rounded-full h-2"
                        style={{ width: `${progressMap[course.id] ?? 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No courses associated with this plan.</p>
          )}

          {/* Edit/Delete buttons can go here if needed */}

        </CardContent>
      </Card>
    </div>
  );
};

export default StudyPlanDetail;
