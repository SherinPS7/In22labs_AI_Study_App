const express = require('express');
const router = express.Router();
// const db = require('../db');
const db = require('../config/postgres');


router.post('/update-streak', async (req, res) => {
  const userId = req.user.id;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayDate = today.toISOString().split('T')[0];

  try {
    const result = await db.query('SELECT * FROM user_streaks WHERE user_id = $1', [userId]);

    let currentStreak = 1;
    let longestStreak = 1;
    let monthlyGoalCurrent = 0;

    if (result.rows.length === 0) {
      await db.query(
        `INSERT INTO user_streaks (user_id, last_login, current_streak, longest_streak)
         VALUES ($1, $2, $3, $4)`,
        [userId, todayDate, currentStreak, longestStreak]
      );
    } else {
      const streak = result.rows[0];
      const lastLogin = streak.last_login ? new Date(streak.last_login) : null;

      if (lastLogin) {
        lastLogin.setHours(0, 0, 0, 0);
        const diffDays = Math.floor((today - lastLogin) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          currentStreak = streak.current_streak + 1;
          longestStreak = Math.max(currentStreak, streak.longest_streak);
        } else if (diffDays === 0) {
          currentStreak = streak.current_streak;
          longestStreak = streak.longest_streak;
        } else {
          currentStreak = 1;
          longestStreak = Math.max(1, streak.longest_streak);
        }
      }

      // ✅ Monthly study time
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const firstDayStr = firstDayOfMonth.toISOString().split('T')[0];

      const studyTimeResult = await db.query(
        `SELECT COALESCE(SUM(study_time), 0) AS total_study_time
         FROM study_plan
         WHERE user_id = $1
           AND login_time::date >= $2
           AND login_time::date <= $3`,
        [userId, firstDayStr, todayDate]
      );

      const totalStudyTime = studyTimeResult.rows[0].total_study_time || 0;
      monthlyGoalCurrent = totalStudyTime;

      await db.query(
        `UPDATE user_streaks
         SET last_login = $1,
             current_streak = $2,
             longest_streak = $3,
             monthly_goal_current = $4
         WHERE user_id = $5`,
        [todayDate, currentStreak, longestStreak, monthlyGoalCurrent, userId]
      );
    }

    const todayStudyResult = await db.query(
      `SELECT COALESCE(SUM(EXTRACT(EPOCH FROM (logout_time - login_time)) / 60), 0) AS time_studied_today
       FROM study_plan
       WHERE user_id = $1 AND login_time::date = $2`,
      [userId, todayDate]
    );

    const timeStudied = todayStudyResult.rows[0].time_studied_today || 0;

    res.json({
      currentStreak,
      longestStreak,
      monthlyGoalCurrent,
      timeStudied
    });
  } catch (err) {
    console.error('Error updating streak:', err);
    res.status(500).json({ error: 'Failed to update streak' });
  }
});

module.exports = router;
