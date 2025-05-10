import React, { useState } from 'react';
import { Calendar, Trophy, Flame, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const StudyStreaks = () => {
  // Original streak data
  const currentStreak = 5;
  const longestStreak = 14;
  const lastWeekDays = [
    { date: "03/28", studied: true },
    { date: "03/29", studied: true },
    { date: "03/30", studied: true },
    { date: "03/31", studied: true },
    { date: "04/01", studied: true },
    { date: "04/02", studied: true },
    { date: "04/03", studied: true },
  ];

  const monthlyGoal = { target: 25, current: 16 };
  const goalPercentage = (monthlyGoal.current / monthlyGoal.target) * 100;

  // Study plan data
  const [startDate, setStartDate] = useState("1, January, 2025");
  const [endDate, setEndDate] = useState("20, January, 2025");
  const [studyTime, setStudyTime] = useState(30);
  const [timeStudied, setTimeStudied] = useState(12);
  const [showPlanDetails, setShowPlanDetails] = useState(false);
  
  // Calendar pickers state
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 0)); // January 2025

  // Weekly schedule state
  const [selectedDays, setSelectedDays] = useState({
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: true,
    Sunday: true
  });

  // Progress percentage for today's study
  const todayProgress = (timeStudied / studyTime) * 100;

  const handleToggleDay = (day) => {
    setSelectedDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  const clearDate = (setter) => {
    setter("");
  };

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const [day, month, year] = dateStr.split(', ');
      return `${day}, ${month}, ${year}`;
    } catch (e) {
      return dateStr;
    }
  };

  // Generate calendar for date picker
  const generateCalendarDays = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday, 1 is Monday, etc.
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Adjust for Monday as first day of week (0 becomes 6, otherwise subtract 1)
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    
    const days = [];
    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(null);
    }
    
    // Add actual days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays(currentMonth.getFullYear(), currentMonth.getMonth());
  const monthNames = ["January", "February", "March", "April", "May", "June", 
                      "July", "August", "September", "October", "November", "December"];
  
  // Navigate between months
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  // Select a date
  const selectDate = (day, setter, calendarToggle) => {
    if (day) {
      const newDate = `${day}, ${monthNames[currentMonth.getMonth()]}, ${currentMonth.getFullYear()}`;
      setter(newDate);
      calendarToggle(false);
    }
  };

  return (
    <div>
      {/* Progress bar at the top */}
      <div className="mb-4">
        <div className="flex justify-center text-center mb-1">
          <div className="text-gray-700">Today</div>
        </div>
        <div className="flex justify-center items-center text-sm text-gray-600 mb-1">
          <span>{timeStudied} min/</span>
          <span>{studyTime} min</span>
        </div>
        <div className="w-full bg-blue-100 rounded-full h-2">
          <div 
            className="bg-green-500 rounded-full h-2 transition-all duration-500" 
            style={{ width: `${todayProgress}%` }}
          />
        </div>
      </div>

      <Card className="bg-card shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">CHANGE STUDY PLAN</CardTitle>
          <button 
            onClick={() => setShowPlanDetails(!showPlanDetails)}
            className="text-sm text-blue-600 hover:underline"
          >
            {showPlanDetails ? "Hide Details" : "Show Details"}
          </button>
        </CardHeader>
        <CardContent>
          {showPlanDetails ? (
            <div className="grid grid-cols-2 gap-6">
              {/* Left section - Date inputs and study time */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 block mb-2">Start Date:</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={formatDate(startDate)} 
                      onClick={() => {
                        setShowStartCalendar(!showStartCalendar);
                        setShowEndCalendar(false);
                      }}
                      readOnly
                      className="w-full border rounded-md p-2 pl-10 pr-8 cursor-pointer" 
                    />
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        clearDate(setStartDate);
                      }}
                      className="absolute right-2 top-2 rounded-full w-6 h-6 flex items-center justify-center text-gray-400 border border-gray-300"
                    >
                      ✕
                    </button>
                    
                    {/* Calendar dropdown for start date */}
                    {showStartCalendar && (
                      <div className="absolute left-0 top-12 z-10 bg-white border rounded-md shadow-lg p-2 w-64">
                        <div className="flex justify-between items-center mb-2">
                          <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded">◀</button>
                          <div className="font-medium">
                            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                          </div>
                          <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">▶</button>
                        </div>
                        
                        <div className="grid grid-cols-7 gap-1 text-center">
                          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
                            <div key={day} className="text-xs text-gray-500 py-1">{day}</div>
                          ))}
                          
                          {calendarDays.map((day, index) => (
                            <div 
                              key={index}
                              className={`
                                py-1 rounded-full w-8 h-8 flex items-center justify-center text-sm
                                ${day ? 'hover:bg-blue-100 cursor-pointer' : ''}
                                ${day && formatDate(startDate).includes(`${day}, ${monthNames[currentMonth.getMonth()]}`) ? 'bg-blue-500 text-white' : ''}
                              `}
                              onClick={() => day && selectDate(day, setStartDate, setShowStartCalendar)}
                            >
                              {day}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 block mb-2">End Date:</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={formatDate(endDate)} 
                      onClick={() => {
                        setShowEndCalendar(!showEndCalendar);
                        setShowStartCalendar(false);
                      }}
                      readOnly
                      className="w-full border rounded-md p-2 pl-10 pr-8 cursor-pointer" 
                    />
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        clearDate(setEndDate);
                      }}
                      className="absolute right-2 top-2 rounded-full w-6 h-6 flex items-center justify-center text-gray-400 border border-gray-300"
                    >
                      ✕
                    </button>
                    
                    {/* Calendar dropdown for end date */}
                    {showEndCalendar && (
                      <div className="absolute left-0 top-12 z-10 bg-white border rounded-md shadow-lg p-2 w-64">
                        <div className="flex justify-between items-center mb-2">
                          <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded">◀</button>
                          <div className="font-medium">
                            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                          </div>
                          <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">▶</button>
                        </div>
                        
                        <div className="grid grid-cols-7 gap-1 text-center">
                          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
                            <div key={day} className="text-xs text-gray-500 py-1">{day}</div>
                          ))}
                          
                          {calendarDays.map((day, index) => (
                            <div 
                              key={index}
                              className={`
                                py-1 rounded-full w-8 h-8 flex items-center justify-center text-sm
                                ${day ? 'hover:bg-blue-100 cursor-pointer' : ''}
                                ${day && formatDate(endDate).includes(`${day}, ${monthNames[currentMonth.getMonth()]}`) ? 'bg-blue-500 text-white' : ''}
                              `}
                              onClick={() => day && selectDate(day, setEndDate, setShowEndCalendar)}
                            >
                              {day}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    
                  </div>
                </div>
                
                <div className="flex items-center">
                  <label className="text-sm text-gray-600 mr-4">Study time:</label>
                  <div className="relative flex-1">
                    <input 
                      type="number" 
                      value={studyTime}
                      onChange={(e) => setStudyTime(parseInt(e.target.value) || 0)}
                      className="w-16 border-b border-gray-300 text-center text-lg" 
                    />
                    <span className="ml-2 text-gray-600">min</span>
                  </div>
                </div>
              </div>
              
              {/* Right section - Weekly schedule */}
              <div>
                <div className="flex items-center mb-4">
                  <Calendar className="text-blue-600 w-6 h-6 mr-2" />
                  <h2 className="text-lg font-semibold text-blue-700">Weekly Study Plan</h2>
                </div>
                
                <div className="space-y-2">
                  {Object.keys(selectedDays).map((day, index) => (
                    <div key={index} className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={selectedDays[day]} 
                        onChange={() => handleToggleDay(day)}
                        className="form-checkbox h-5 w-5 text-blue-600 rounded-sm border-2 border-blue-500"
                      />
                      <span className="ml-3 text-gray-600">{day}</span>
                    </div>
                  ))}
                </div>
                
                {/* Study time metrics */}
                <div className="flex justify-between mt-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-700 mr-1" />
                      <span className="text-sm text-blue-700">Planned Study Time</span>
                    </div>
                    <div className="text-xl font-bold text-blue-900 mt-1">{studyTime} <span className="text-sm">min</span></div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-700 mr-1" />
                      <span className="text-sm text-blue-700">Time Studied</span>
                    </div>
                    <div className="text-xl font-bold text-blue-900 mt-1">{timeStudied} <span className="text-sm">min</span></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Current streak display */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-primary/20 p-2 rounded-full mr-3">
                    <Flame className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Streak</p>
                    <p className="text-xl font-bold">{currentStreak} days</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Longest</p>
                  <div className="flex items-center">
                    <Trophy className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="font-medium">{longestStreak} days</span>
                  </div>
                </div>
              </div>
              
              {/* Weekly calendar */}
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Last 7 Days</p>
                <div className="flex justify-between">
                  {lastWeekDays.map((day, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center mb-1
                          ${day.studied 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted text-muted-foreground'}`
                        }
                      >
                        {index + 1}
                      </div>
                      <span className="text-xs text-muted-foreground">{day.date}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Monthly goal */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm text-muted-foreground">Monthly Goal</p>
                  <p className="text-sm font-medium">{monthlyGoal.current}/{monthlyGoal.target} days</p>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary rounded-full h-2" 
                    style={{ width: `${goalPercentage}%` }}
                  ></div>
                </div>
              </div>
            </>
          )}
          
          {/* Right aligned text showing the streak message */}
          <div className="text-right mt-4">
            <div className="text-green-600 text-xl font-medium">You're on a {currentStreak} day streak!!</div>
            <div className="text-green-600 text-xl font-bold">Good Job!!!!</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyStreaks;