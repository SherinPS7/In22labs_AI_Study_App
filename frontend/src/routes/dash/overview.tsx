import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useNavigate } from "react-router-dom";
import StudyPlanPopup from '../../../src/components/overview/studyplanui/studyplanpopup';
import { useStudyPlan } from '../../hooks/use-studyPlan';
import { calculateStudyMetrics, formatDate, getPlanStatus } from '../../utils/studyMetrics';
import { Planner } from "@/routes/dash/planner";
import ContinueLearning from "../../../src/routes/dash/continue-reading";
import StartLearning from "../../../src/routes/dash/start-learning";
import Footer from "@/components/footer/footer";
import { Plus, Calendar, Clock, BookOpen, Target, TrendingUp, Flame, Trophy, Edit, Trash2, BarChart } from 'lucide-react';
import SearchBar from "./Overview/searchbar"

interface StudyPlan {
  id: number;
  plan_name: string;
  user_id: number;
  start_date: string;
  end_date: string;
  weekdays: string[];
  study_time: number;
}

const Overview = ({ userId = 1 }) => {
  const [showText, setShowText] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<StudyPlan | null>(null);
  const navigate = useNavigate();

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
    fetchPlans
  } = useStudyPlan(userId);

  const metrics = calculateStudyMetrics(activePlan, studyLogs, todayStudied);

  const handlePlusClick = () => {
    setShowText(true);
    setTimeout(() => {
      navigate("/MyLearnings");
    }, 1000);
  };

  const handleCreatePlan = () => {
    console.log('Create plan button clicked');
    setEditingPlan(null);
    setIsPopupOpen(true);
    console.log('Popup should be open now');
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

  const handleViewProgress = async (planId, planName) => {
    try {
      const response = await fetch(`http://localhost:4000/api/study-plans/${planId}/course-progress`);
      const data = await response.json();
      setSelectedProgress({ ...data, planName });
      setShowProgressModal(true);
    } catch (error) {
      console.error('Failed to fetch progress', error);
      setError('Failed to load progress');
    }
  };

  const [searchResults, setSearchResults] = useState([]);
  const [selectedProgress, setSelectedProgress] = useState(null);
  const [showProgressModal, setShowProgressModal] = useState(false);

  return (
    <div className="w-full px-4 py-4 sm:px-6 lg:px-8"> {/* Added xl:max-w-screen-xl */}
      {/* Header Section */}
      <main className="flex flex-col md:flex-row items-center justify-between gap-4 w-full mb-6">
        {/* Welcome Message */}
        <div className="flex flex-col text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground whitespace-nowrap">
            Welcome Back, ABC!
          </h1>
          <p className="text-muted-foreground text-sm md:text-base font-light tracking-tight leading-tight whitespace-nowrap">
            Continue your journey with our curator
          </p>
        </div>

        {/* Search Bar + Plus Icon */}
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <SearchBar />
          <button
            onClick={handlePlusClick}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-primary text-white rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 ease-in-out w-full md:w-auto justify-center"
          >
            <Plus className="h-5 w-5" />
            {showText && <span className="whitespace-nowrap">Generate New Course</span>}
          </button>
        </div>
      </main>

      {/* Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
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
      <button
        onClick={addStudySession}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
      >
        + Log Study Time
      </button>
    </CardTitle>
  </CardHeader>
  <CardContent>

    
    {/* Today's Progress */}
{loading ? (
  <div className="bg-gray shadow-lg rounded-lg p-6 mb-4">
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
      <p className="text-gray-500 mt-2">Loading study plans...</p>
    </div>
  </div>
) : activePlan ? (
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
  <div className="bg-gray shadow-lg rounded-lg p-6 mb-4">
    <div className="text-center py-8 text-gray-500">
      <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
      <p className="text-lg font-medium mb-1">No Active Study Plan</p>
      <p className="text-sm">Create a study plan to start tracking your daily goals!</p>
      <button
        onClick={handleCreatePlan}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Create Study Plan
      </button>
    </div>
  </div>
)}

    {/* Simplified Stats - Just Streaks and Login Time */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      {/* Streak Card */}
      <div className="bg-gray shadow-lg rounded-lg p-6">
        <div className="text-center">
          <div className="bg-orange-100 p-3 rounded-full mx-auto mb-3 w-fit">
            <Flame className="w-6 h-6 text-orange-500" />
          </div>
          <p className="text-sm text-white-500 mb-1">Current Streak</p>
          <p className="text-3xl font-bold text-white-800 mb-2">{metrics.currentStreak}</p>
          <p className="text-xs text-white-400">days</p>
          
          {/* Best Streak */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-green-600">Best: {metrics.bestStreak} days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Login Time / Session Stats */}
      <div className="bg-gray shadow-lg rounded-lg p-6">
        <div className="text-center">
          <div className="bg-blue-100 p-3 rounded-full mx-auto mb-3 w-fit">
            <Clock className="w-6 h-6 text-blue-500" />
          </div>
          <p className="text-sm text-white-500 mb-1">Today's Study Time</p>
          <p className="text-3xl font-bold text-white-800 mb-2">{metrics.todayStudied}</p>
          <p className="text-xs text-white-400">minutes</p>
          
          {/* Status indicator */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-center">
              {metrics.todayProgress >= 100 ? (
                <span className="text-green-600 font-medium">✅ Goal achieved!</span>
              ) : (
                <span className="text-blue-600 font-medium">
                  {metrics.todayTarget - metrics.todayStudied} min remaining
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Simple Last 7 Days Visualization */}
    <div className="bg-gray shadow-lg rounded-lg p-6">
      <h3 className="font-medium mb-3 flex items-center justify-center">
        <Calendar className="w-4 h-4 mr-2" />
        Last 7 Days
      </h3>
      <div className="flex justify-center gap-2">
        {metrics.last7Days.map((day, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div
              className={`${
                day.studied ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              } w-10 h-10 flex items-center justify-center rounded-full mb-1 text-sm font-medium`}
            >
              {day.studied ? '✓' : '○'}
            </div>
            <span className="text-xs text-gray-600">{day.date}</span>
          </div>
        ))}
      </div>
      
      {/* Streak motivation */}
      <div className="text-center mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          {metrics.currentStreak > 0 ? (
            <span className="text-orange-600 font-medium">
              🔥 {metrics.currentStreak} day streak! Keep it going!
            </span>
          ) : (
            <span className="text-gray-500">
              Start your streak today! 💪
            </span>
          )}
        </p>
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

          {/* Debug info - remove this after testing */}
          <div className="text-sm text-gray-500 mb-2">
            Popup State: {isPopupOpen ? 'Open' : 'Closed'}
          </div>
        </CardContent>
      </Card>

      {/* Existing Plans Section */}
      <Card className="mb-6 bg-gray shadow-lg">
        <CardHeader>
          <CardTitle>Your Study Plans ({plans.length})</CardTitle>
        </CardHeader>
        <CardContent>
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
                  <div key={plan.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                      <h3 className="text-lg font-semibold text-white-800 mb-2 md:mb-0">{plan.plan_name}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditPlan(plan)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(plan.id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                        onClick={() => handleViewProgress(plan.id, plan.plan_name)}
                        className="p-1 text-green-600 hover:bg-green-100 rounded"
                      >
                        <BarChart className="w-4 h-4" />
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
                        <p><strong>Status:</strong>
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

      {/* Study Plan Popup */}
      <StudyPlanPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        userId={userId}
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