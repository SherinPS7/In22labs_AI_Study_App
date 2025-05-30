// utils/streaks.ts
export type StudyEntry = { date: string; studied: boolean };

export const calculateStreaks = (studyHistory: StudyEntry[]) => {
  const studiedDates = studyHistory
    .filter((entry) => entry.studied)
    .map((entry) => entry.date)
    .sort();

  if (studiedDates.length === 0) return { currentStreak: 0, longestStreak: 0 };

  const daysBetween = (a: string, b: string) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    dateA.setHours(0, 0, 0, 0);
    dateB.setHours(0, 0, 0, 0);
    return Math.round((dateB.getTime() - dateA.getTime()) / (1000 * 60 * 60 * 24));
  };

  // Current streak
  let currentStreak = 0;
  let today = new Date();
  today.setHours(0, 0, 0, 0);
  let streakDate = today.toISOString().split('T')[0];
  const studiedSet = new Set(studiedDates);

  if (studiedSet.has(streakDate)) {
    while (studiedSet.has(streakDate)) {
      currentStreak++;
      const d = new Date(streakDate);
      d.setDate(d.getDate() - 1);
      streakDate = d.toISOString().split('T')[0];
    }
  } else {
    let d = new Date(streakDate);
    d.setDate(d.getDate() - 1);
    streakDate = d.toISOString().split('T')[0];
    while (studiedSet.has(streakDate)) {
      currentStreak++;
      d = new Date(streakDate);
      d.setDate(d.getDate() - 1);
      streakDate = d.toISOString().split('T')[0];
    }
  }

  // Longest streak
  let longestStreak = 1, tempStreak = 1;
  for (let i = 1; i < studiedDates.length; i++) {
    if (daysBetween(studiedDates[i - 1], studiedDates[i]) === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  return { currentStreak, longestStreak };
};
