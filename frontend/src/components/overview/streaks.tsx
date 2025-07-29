import React, { useState } from 'react';
import { Calendar, Trophy, Flame, Clock, Target, TrendingUp } from 'lucide-react';

interface StudyLog {
  date: string;
  minutesStudied: number;
  completed: boolean;
  planId?: number;
}

interface StudyPlan {
  id: number;
  plan_name: string;
  study_time: number;
  start_date: string;
  end_date: string;
  weekdays: string[];
}

interface StudyStreaksProps {
  activePlan: StudyPlan | null;
  studyLogs: StudyLog[];
  setStudyLogs: (logs: StudyLog[]) => void;
  todayStudied: number;
  setTodayStudied: (minutes: number) => void;
  setSuccess: (message: string) => void;
}

const StudyStreaks: React.FC<StudyStreaksProps> = ({
  activePlan,
  studyLogs,
  setStudyLogs,
  todayStudied,
  setTodayStudied,
  setSuccess
}) => {
  // Calculate metrics based on plans and logs
  const calculateMetrics = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Today's progress
    const todayTarget = activePlan?.study_time || 0;
    const todayProgress = Math.min((todayStudied / todayTarget) * 100, 100);
    
    // Current streak calculation
    let currentStreak = 0;
    const sortedLogs = [...studyLogs].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    for (let i = 0; i < sortedLogs.length; i++) {
      const logDate = new Date(sortedLogs[i].date);
      logDate.setHours(0, 0, 0, 0);
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);
      
      if (logDate.getTime() === expectedDate.getTime() && sortedLogs[i].completed) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    // Best streak
    let bestStreak = 0;
    let tempStreak = 0;
    studyLogs.forEach(log => {
      if (log.completed) {
        tempStreak++;
        bestStreak = Math.max(bestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    });
    
    // Weekly stats (last 7 days)
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - 6);
    
    const weekLogs = studyLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= weekStart && logDate <= today;
    });
    
    const weeklyTotalMinutes = weekLogs.reduce((sum, log) => sum + (log.minutesStudied || 0), 0);
    const weeklyDaysStudied = weekLogs.filter(log => log.completed).length;
    const weeklyAverage = weeklyDaysStudied > 0 ? Math.round(weeklyTotalMinutes / weeklyDaysStudied) : 0;
    
    // Last 7 days visualization
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const log = studyLogs.find(l => {
        const logDate = new Date(l.date);
        return logDate.toDateString() === date.toDateString();
      });
      
      last7Days.push({
        date: date.toLocaleDateString('en', { weekday: 'short' }),
        studied: log?.completed || false,
        minutes: log?.minutesStudied || 0
      });
    }
    
    return {
      todayTarget,
      todayStudied,
      todayProgress,
      currentStreak,
      bestStreak,
      weeklyTotalMinutes,
      weeklyDaysStudied,
      weeklyAverage,
      last7Days
    };
  };

  const metrics = calculateMetrics();

  // Add study session function
  const addStudySession = () => {
    const minutes = parseInt(prompt('How many minutes did you study today?', '0') || '0');
    if (minutes && minutes > 0) {
      const today = new Date().toISOString().split('T')[0];
      const existingLogIndex = studyLogs.findIndex(log => log.date === today);
      
      const newLog = {
        date: today,
        minutesStudied: minutes,
        completed: minutes >= (activePlan?.study_time || 60),
        planId: activePlan?.id
      };
      
      if (existingLogIndex >= 0) {
        const updatedLogs = [...studyLogs];
        updatedLogs[existingLogIndex] = {
          ...updatedLogs[existingLogIndex],
          minutesStudied: updatedLogs[existingLogIndex].minutesStudied + minutes,
          completed: (updatedLogs[existingLogIndex].minutesStudied + minutes) >= (activePlan?.study_time || 60)
        };
        setStudyLogs(updatedLogs);
      } else {
        setStudyLogs([...studyLogs, newLog]);
      }
      
      setTodayStudied(prev => prev + minutes);
      setSuccess(`Added ${minutes} minutes to today's study log!`);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-green-800 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Your Progress
        </h2>
        <button
          onClick={addStudySession}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          + Log Study Time
        </button>
      </div>

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
            <div className="w-full bg-blue-100 rounded-full h-3">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
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
    </div>
  );
};

export default StudyStreaks;