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
import { Plus, Calendar, Clock, BookOpen, Target, TrendingUp, Flame,Trophy,Edit,Trash2 } from 'lucide-react';
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
    // State
    plans,
    loading,
    error,
    success,
    activePlan,
    studyLogs,
    todayStudied,
    
    // Actions
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
    console.log('Create plan button clicked'); // Debug log
    setEditingPlan(null); // Ensure we're creating, not editing
    setIsPopupOpen(true);
    console.log('Popup should be open now'); // Debug log
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
    fetchPlans(); // Refresh the plans list
    handleClosePopup();
  };


// import Footer from "@/components/footer/footer"
// import StudyStreaks from "@/components/overview/StudyPlan"
// import { Planner } from "@/routes/dash/planner"
// import ContinueLearning from "../../../src/routes/dash/continue-reading"
// import StartLearning from "../../../src/routes/dash/start-learning"
// import Categories from "../../../src/routes/dash/categories"
// import SearchBar from "./Overview/searchbar"
// import { useState } from "react";


  const [searchResults, setSearchResults] = useState([]);

  return (
    <div className="w-full max-w-7xl mx-auto px-2 py-4">
      {/* Header Section */}
      <main className="flex flex-row items-center gap-4 w-full mb-6">
        {/* Welcome Message */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground whitespace-nowrap">
            Welcome Back, ABC!
          </h1>
          <p className="text-muted-foreground text-sm font-light tracking-tight leading-tight whitespace-nowrap">
            Continue your journey with our curator
          </p>
        </div>

        {/* Search Bar + Plus Icon */}
        {/* <div className="flex-1 flex justify-center items-center gap-2"> */}
        <div >
          <SearchBar/>
        </div>
          <button
            onClick={handlePlusClick}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-primary text-white rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 ease-in-out"
          >
            <Plus className="h-5 w-5" />
            {showText && <span className="whitespace-nowrap">Generate New Course</span>}
          </button>
        {/* </div> */}
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
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
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
          {activePlan && (
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
          )}

          {/* Streak and Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
          </div>

          {/* Last 7 Days and Monthly Goal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Last 7 Days */}
            <div className="bg-gray shadow-lg rounded-lg p-6">
              <h3 className="font-medium mb-3 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Last 7 Days
              </h3>
              <div className="flex justify-between gap-1">
                {metrics.last7Days.map((day, idx) => (
                  <div key={idx} className="flex flex-col items-center">
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
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-white-800">{plan.plan_name}</h3>
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
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
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