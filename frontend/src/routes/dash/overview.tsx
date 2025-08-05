import  { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import StudyPlanPopup from '../../../src/components/overview/studyplanui/studyplanpopup';
import { useStudyPlan } from '../../hooks/use-studyPlan';
import { calculateStudyMetrics, formatDate, getPlanStatus } from '../../utils/studyMetrics';
import { Planner } from '@/routes/dash/planner';
import ContinueLearning from '../../../src/routes/dash/continue-reading';
import StartLearning from '../../../src/routes/dash/start-learning';
import Footer from '@/components/footer/footer';
import { Plus, Calendar, Clock, Target, TrendingUp, Flame, Trophy, Edit, Trash2 } from 'lucide-react';
import SearchBar from './Overview/searchbar';
import axios from 'axios';
import { Share2} from "lucide-react";
import { toast } from "sonner";

interface StudyPlan {
  id: number;
  plan_name: string;
  user_id: number;
  start_date: string;
  end_date: string;
  weekdays: string[];
  study_time: number;
}

type User = {
  userId: number;
  firstname: string;
  lastname: string;
  mobile: string;
};

type SessionResponse = {
  loggedIn: boolean;
  user: User;
};

const Overview = () => {
 const [user, setUser] = useState<User | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [showText, setShowText] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<StudyPlan | null>(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedProgress, setSelectedProgress] = useState<any>(null);  const navigate = useNavigate();

  // Fetch session
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get<SessionResponse>('http://localhost:3000/api/session/check-session', {
          withCredentials: true,
        });
        if (res.data.loggedIn) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.error('Failed to fetch session:', err);
      } finally {
        setSessionLoading(false);
      }
    };
    fetchSession();
  }, []);

  const {
    plans,
    loading,
    error,
    success,
    activePlan,
    studyLogs,
    todayStudied,
    setError,
    setSuccess,
    handleDelete,
    addStudySession,
    fetchPlans,
  } = useStudyPlan(user?.userId);

  const metrics = calculateStudyMetrics(activePlan, studyLogs, todayStudied);

  const handlePlusClick = () => {
    setShowText(true);
    setTimeout(() => navigate('/MyLearnings'), 1000);
  };

  const handleCreatePlan = () => {
    setEditingPlan(null);
    setIsPopupOpen(true);
  };

  const handleEditPlan = (plan: StudyPlan) => {
    setEditingPlan(plan);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setEditingPlan(null);
  };

  const handlePlanUpdate = () => {
    fetchPlans();
    handleClosePopup();
  };

  const handleShowProgress = (progressData) => {
  setSelectedProgress(progressData);
  setShowProgressModal(true);
};

  // Render fallback during session load
  if (sessionLoading) return <div className="p-4 text-center">Loading session...</div>;
  if (!user) return <div className="p-4 text-center text-red-500">Please log in to view this page</div>;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 xl:max-w-screen-xl">
      {/* Header Section */}
      <main className="w-full mb-6 space-y-6 md:space-y-0 md:flex md:items-center md:justify-between">
  {/* Left: Greeting */}
  <div className="text-center md:text-left">
    <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
      Welcome back, {user.firstname} {user.lastname}!
    </h1>
    <p className="text-muted-foreground text-sm md:text-base mt-1">
      Continue your journey with our curator
    </p>
  </div>

  {/* Right: Search + Button */}
  <div className="flex flex-col gap-3 md:flex-row md:items-center w-full md:w-auto">
    <SearchBar />

<button
  onClick={handlePlusClick}
  className="flex items-center justify-center p-3 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
  aria-label="Add a Course"
>
  <Plus className="h-6 w-6" />
</button>







  </div>
</main>


      {/* Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button onClick={() => setError('')} className="float-right font-bold">&times;</button>
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
          <button onClick={() => setSuccess('')} className="float-right font-bold">&times;</button>
        </div>
      )}

      {/* Study Progress Section */}
      <Card className="mb-6 bg-gray shadow-lg">
        <CardHeader>
          <CardTitle className="flex flex-col md:flex-row items-center justify-between text-lg md:text-xl">
            <div className="flex items-center mb-2 md:mb-0">
              <TrendingUp className="w-5 h-5 mr-2" />
              Your Progress
            </div>
            {activePlan && (
              <button
                onClick={addStudySession}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                + Log Study Time
              </button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Today's Progress */}
          {activePlan ? (
            <div className="bg-gray shadow-lg rounded-lg p-6 mb-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-medium text-gray-700 mb-1">
                  Today's Goal - {activePlan.plan_name}
                </h3>
                <div className="flex justify-center text-gray-600 text-sm mb-2">
                  <span className="font-mono">{metrics.todayStudied} min / {metrics.todayTarget} min</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 rounded-full h-3 transition-all duration-300"
                    style={{ width: `${Math.min(metrics.todayProgress, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {metrics.todayProgress >= 100 ? '🎉 Goal completed!' : `${Math.round(metrics.todayProgress)}% complete`}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gray shadow-lg rounded-lg p-6 mb-4 text-center">
              <p className="text-gray-600">No active study plan. Create one to track your progress!</p>
            </div>
          )}

          {/* Streak and Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
            {/* Streak Card */}
            <div className="bg-gray shadow-lg rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className="bg-orange-100 p-2 rounded-full mr-3">
                    <Flame className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Streak</p>
                    <p className="text-2xl font-bold">{metrics.currentStreak}d</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Best</p>
                    <p className="text-xl font-medium">{metrics.bestStreak}d</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-green-600 font-medium">
                  {metrics.currentStreak > 0 ? `🔥 ${metrics.currentStreak} day streak!` : 'Start your streak today!'}
                </p>
              </div>
            </div>

            {/* Weekly Stats */}
            <div className="bg-gray shadow-lg rounded-lg p-6">
              <div className="flex items-center mb-3">
                <Clock className="w-5 h-5 text-blue-500 mr-2" />
                <h3 className="font-medium">This Week</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Time:</span>
                  <span className="font-medium">{Math.floor(metrics.weeklyTotalMinutes / 60)}h {metrics.weeklyTotalMinutes % 60}m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Days Studied:</span>
                  <span className="font-medium">{metrics.weeklyDaysStudied}/7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Daily Average:</span>
                  <span className="font-medium">{metrics.weeklyAverage}min</span>
                </div>
              </div>
            </div>

            {/* Monthly Goal */}
            <div className="bg-gray shadow-lg rounded-lg p-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Monthly Goal
                </h3>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-blue-500 rounded-full h-2 transition-all duration-300"
                  style={{ width: `${Math.min((metrics.weeklyDaysStudied / 20) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 text-center">
                {Math.round((metrics.weeklyDaysStudied / 20) * 100)}% of monthly goal achieved
              </p>
            </div>
          </div>

          {/* Last 7 Days */}
          <div className="bg-gray shadow-lg rounded-lg p-6">
            <h3 className="font-medium mb-3 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Last 7 Days
            </h3>
            <div className="flex justify-between gap-1 overflow-x-auto pb-2">
              {metrics.last7Days.map((day, idx) => (
                <div key={idx} className="flex flex-col items-center flex-shrink-0 w-1/7">
                  <div
                    className={`${
                      day.studied ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                    } w-8 h-8 flex items-center justify-center rounded-full mb-1 text-xs font-medium`}
                  >
                    {day.studied ? '✓' : '○'}
                  </div>
                  <span className="text-xs text-gray-600">{day.date}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Study Plan Management Section */}
      <Card className="mb-6 bg-gray shadow-lg">
        <CardHeader>
          <CardTitle>Study Plan Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <button
              onClick={handleCreatePlan}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Study Plan
            </button>
          </div>

          {/* Existing Plans */}
          {loading && plans.length === 0 ? (
            <div className="text-center py-4">Loading plans...</div>
          ) : plans.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No study plans yet. Create your first plan to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              
              {plans.map((plan) => {
  const status = getPlanStatus(plan.start_date, plan.end_date);
  return (
    <div
      key={plan.id}
      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer relative"
      onClick={() => navigate(`/studyplan/${plan.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          navigate(`/studyplan/${plan.id}`);
        }
      }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
        <h3 className="text-lg font-semibold text-white-800 mb-2 md:mb-0">{plan.plan_name}</h3>
       <div className="flex gap-2 z-10" onClick={(e) => e.stopPropagation()}>
  <button
    onClick={() => handleEditPlan(plan)}
    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
    aria-label="Edit plan"
    title="Edit plan"
  >
    <Edit className="w-4 h-4" />
  </button>

  <button
    onClick={() => handleDelete(plan.id)}
    className="p-1 text-red-600 hover:bg-red-100 rounded"
    aria-label="Delete plan"
    title="Delete plan"
  >
    <Trash2 className="w-4 h-4" />
  </button>

  <button
    onClick={() => {
      const shareUrl = `${window.location.origin}/studyplan/${plan.id}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success("Study plan link copied to clipboard!");
    }}
    className="p-1 text-gray-600 hover:bg-gray-200 rounded"
    aria-label="Share plan"
    title="Share plan link"
  >
    <Share2 className="w-4 h-4" />
  </button>
</div>

      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm text-gray-600">
        <div>
          <p><strong>Duration:</strong> {formatDate(plan.start_date)} - {formatDate(plan.end_date)}</p>
          <p><strong>Daily Study Time:</strong> {plan.study_time} minutes</p>
        </div>
        <div>
          <p><strong>Study Days:</strong> {Array.isArray(plan.weekdays) ? plan.weekdays.join(', ') : 'N/A'}</p>
          <p>
            <strong>Status:</strong>
            <span className={`ml-1 px-2 py-1 rounded text-xs ${
              status === 'active' ? 'bg-green-100 text-green-800' :
              status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-600'
            }`}>
              {status === 'active' ? 'Active' : status === 'upcoming' ? 'Upcoming' : 'Completed'}
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

      <StudyPlanPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        userId={user.userId}
        editingPlan={editingPlan}
        setSuccess={setSuccess}
        setError={setError}
        onPlanUpdate={handlePlanUpdate}
      />

{showProgressModal && selectedProgress && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-black rounded-lg shadow-lg p-6 max-w-2xl w-full relative">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-black"
        onClick={() => setShowProgressModal(false)}
      >
        ✕
      </button>
      <h2 className="text-xl font-bold mb-4">
        Progress for: {selectedProgress.planName}
      </h2>

      {selectedProgress.progress.length === 0 ? (
        <p>No progress data available.</p>
      ) : (
        <div className="space-y-4">
          {selectedProgress.progress.map((course) => (
            <div key={course.courseId} className="border rounded p-4">
              <h3 className="font-semibold">{course.courseName}</h3>
              <p className="text-sm mb-2">
                Watched: {course.watchedVideos} / {course.totalVideos}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full"
                  style={{ width: `${(course.watchedVideos / course.totalVideos) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs mt-2 text-gray-500">
                Daily: {course.settings?.daily_hours || 0} hr(s), Days: {course.settings?.study_days?.join(', ') || 'N/A'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)}


      {/* Planner Section */}
      <Card className="mb-6 bg-gray shadow-lg">
        <CardContent>
          <Planner />
        </CardContent>
      </Card>

      {/* Start Learning Section */}
      <Card className="mb-6 bg-gray shadow-lg">
        <CardContent>
          <StartLearning />
        </CardContent>
      </Card>

      {/* Continue Learning Section */}
      <Card className="mb-6 bg-gray shadow-lg">
        <CardContent>
          <ContinueLearning />
        </CardContent>
      </Card>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Overview;