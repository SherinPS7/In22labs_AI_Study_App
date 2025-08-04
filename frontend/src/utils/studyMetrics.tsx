// Simplified calculateStudyMetrics function
export const calculateStudyMetrics = (activePlan, studyLogs, todayStudied) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Today's progress
  const todayTarget = activePlan?.study_time || 0;
  const todayProgress = todayTarget > 0 ? Math.min((todayStudied / todayTarget) * 100, 100) : 0;
  
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
  
  // Best streak calculation
  let bestStreak = 0;
  let tempStreak = 0;
  
  // Sort logs by date to calculate consecutive streaks properly
  const chronologicalLogs = [...studyLogs].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  chronologicalLogs.forEach(log => {
    if (log.completed) {
      tempStreak++;
      bestStreak = Math.max(bestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  });
  
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
    last7Days
  };
};

// Keep the existing helper functions
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const getPlanStatus = (startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (now < start) return 'upcoming';
  if (now > end) return 'completed';
  return 'active';
};