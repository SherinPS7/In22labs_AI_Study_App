import React, { useState, useEffect } from 'react';
import { Calendar, Trophy, Flame, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const StudyStreaks = ({
  initialPlan = {
    startDate: '',
    endDate: '',
    studyTime: 0,
    timeStudied: 0,
  },
}) => {
  const [plan, setPlan] = useState(initialPlan);
  const [showPlanDetails, setShowPlanDetails] = useState(false);
  const [showCalendar, setShowCalendar] = useState({ start: false, end: false });
  const [selectedDays, setSelectedDays] = useState(
    ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].reduce((acc, d) => ({ ...acc, [d]: true }), {})
  );

  // States for data from backend
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [monthlyGoal, setMonthlyGoal] = useState({ target: 0, current: 0 });
  const [lastWeekDays, setLastWeekDays] = useState([]);

  useEffect(() => {
    // Fetch data from backend when the component mounts
    const fetchData = async () => {
      try {
        const res = await fetch('/api/getStudyData'); // replace with your actual backend API
        if (res.ok) {
          const data = await res.json();
          setCurrentStreak(data.currentStreak);
          setLongestStreak(data.longestStreak);
          setMonthlyGoal(data.monthlyGoal);
          setLastWeekDays(data.lastWeekDays);
        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // empty array means this will only run once when the component mounts

  const goalPercentage = monthlyGoal.target
    ? (monthlyGoal.current / monthlyGoal.target) * 100
    : 0;
    const todayProgress = plan.studyTime
    ? (plan.timeStudied / plan.studyTime) * 100
    : 0;  

  const handleToggleDay = (day) => {
    setSelectedDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const clearDate = (key) => setPlan((prev) => ({ ...prev, [key]: '' }));

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Function to send data back to backend (for example, when updating study time)
  const updateStudyData = async () => {
    try {
      const res = await fetch('/api/updateStudyData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studyTime: plan.studyTime,
          timeStudied: plan.timeStudied,
          // other relevant data
        }),
      });
      if (res.ok) {
        console.log('Data updated successfully');
      } else {
        console.error('Failed to update data');
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      {/* Today Progress */}
      <div className="mb-6">
        <div className="text-center text-gray-700 mb-1">Today</div>
        <div className="flex justify-center text-gray-600 text-sm mb-2">
          <span>{plan.timeStudied} min / {plan.studyTime} min</span>
        </div>
        <div className="w-full bg-blue-100 rounded-full h-2">
          <div
            className="bg-green-500 rounded-full h-2 transition-all"
            style={{ width: `${todayProgress}%` }}
          />
        </div>
      </div>

      <Card className="bg-card shadow-lg">
        <CardHeader className="flex flex-col md:flex-row md:justify-between items-start md:items-center pb-2">
          <CardTitle className="text-xl font-semibold">Study Plan</CardTitle>
          <button
            onClick={() => setShowPlanDetails(!showPlanDetails)}
            className="mt-2 md:mt-0 text-blue-600 hover:underline"
          >
            {showPlanDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </CardHeader>
        <CardContent>
          {showPlanDetails ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date & Time Inputs */}
              <div className="space-y-4">
                {['startDate', 'endDate'].map((field, idx) => (
                  <div key={idx}>
                    <label className="block text-sm text-gray-600 mb-1 capitalize">
                      {field.replace(/Date/, ' Date')}:
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={plan[field]}
                        onChange={(e) =>
                          setPlan({ ...plan, [field]: e.target.value })
                        }
                        className="w-full border rounded-md p-2 cursor-pointer"
                      />
                      <button
                        onClick={() => clearDate(field)}
                        className="absolute right-2 top-2 text-gray-400"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex items-center">
                  <label className="text-sm text-gray-600 mr-4">Study time:</label>
                  <input
                    type="number"
                    min="0"
                    value={plan.studyTime}
                    onChange={(e) =>
                      setPlan({ ...plan, studyTime: +e.target.value })
                    }
                    className="w-20 border-b text-center"
                  />
                  <span className="ml-2 text-gray-600">min</span>
                </div>
              </div>

              {/* Weekly Schedule */}
              <div>
                <h2 className="flex items-center text-lg font-medium text-blue-700 mb-4">
                  <Calendar className="mr-2" /> Weekly Plan
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(selectedDays).map(([day, val]) => (
                    <label key={day} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={val}
                        onChange={() => handleToggleDay(day)}
                        className="h-5 w-5 text-blue-600"
                      />
                      <span className="ml-2 text-gray-600">{day}</span>
                    </label>
                  ))}
                </div>
                <div className="flex justify-between mt-6 text-center">
                  {[{ label: 'Planned', value: plan.studyTime }].map((m, i) => (
                    <div key={i} className="flex-1">
                      <div className="flex items-center justify-center">
                        <Clock className="w-5 h-5 mr-1" />
                        <span className="text-sm text-blue-700">{m.label}</span>
                      </div>
                      <div className="text-xl font-bold mt-1">
                        {m.value} <span className="text-sm">min</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Streaks & Goals */}
              <div className="flex flex-col sm:flex-row justify-between mb-6">
                <div className="flex items-center mb-4 sm:mb-0">
                  <div className="bg-primary/20 p-2 rounded-full mr-3">
                    <Flame className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Streak</p>
                    <p className="text-2xl font-bold">{currentStreak}d</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Longest</p>
                    <p className="text-xl font-medium">{longestStreak}d</p>
                  </div>
                </div>
              </div>

              {/* Last Week */}
              <div className="mb-6">
                <div className="flex justify-between flex-wrap gap-2">
                  {lastWeekDays.map((day, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div
                        className={`${
                          day.studied ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                        } w-10 h-10 flex items-center justify-center rounded-full mb-1`}
                      >
                        {idx + 1}
                      </div>
                      <span className="text-xs text-gray-600">{day.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Goal */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm text-gray-500">Monthly Goal</p>
                  <p className="text-sm font-medium">
                    {monthlyGoal.current}/{monthlyGoal.target} days
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2 transition-all"
                    style={{ width: `${goalPercentage}%` }}
                  />
                </div>
              </div>

              <div className="text-green-600 text-center text-lg font-semibold">
                You're on a {currentStreak}-day streak! Keep it up!
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyStreaks;
