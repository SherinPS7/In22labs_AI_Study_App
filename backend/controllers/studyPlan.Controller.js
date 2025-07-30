// controllers/studyPlanController.js

const { StudyPlan, StudyProgress, User, Course } = require('../models');
const { createGoogleCalendarEvent,updateGoogleCalendarEvent, deleteGoogleCalendarEvent } = require('../utils/googlecal');
const { oauth2Client } = require('../config/googlecalender');

const studyPlanController = {

  // GET /api/study-plans?userId=1 : Get all study plans for user
  getAllStudyPlans: async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }

      const studyPlans = await StudyPlan.findAll({
        where: { user_id: userId },
        order: [['created_at', 'DESC']]
      });

      res.json({ studyPlans });

    } catch (error) {
      console.error('Error fetching study plans:', error);
      res.status(500).json({ error: 'Failed to fetch study plans' });
    }
  },

  // POST /api/study-plans : Create a new study plan with Google sync option




createStudyPlan:async (req, res) => {
  try {
    console.log("Received createStudyPlan request with body:", JSON.stringify(req.body, null, 2));

    const {
      user_id,
      plan_name,
      start_date,
      end_date,
      weekdays,
      study_time,      // Duration in minutes (integer)
      course_ids,
      course_settings,
      start_time,
    } = req.body;

    // Fetch user and check sync preference
    const user = await User.findByPk(user_id);
    if (!user) {
      console.log(`User not found with id ${user_id}. Aborting.`);
      return res.status(404).json({ error: "User not found" });
    }
    const shouldSyncGoogle = !!user.sync_with_google;
    console.log(`User's sync_with_google from DB: ${shouldSyncGoogle}`);

    // ===== Validations =====
    if (!user_id || !plan_name || !start_date || !end_date || typeof study_time !== 'number') {
      console.log("Validation failed: one or more required fields are missing or invalid.");
      return res.status(400).json({
        error: "user_id, plan_name, start_date, end_date, and study_time (positive integer) are required",
      });
    }
    if (study_time <= 0) {
      console.log("Validation failed: study_time must be a positive integer representing minutes.");
      return res.status(400).json({ error: "study_time must be a positive integer representing total minutes" });
    }
    console.log("Basic required fields check passed.");

    if (course_ids && course_ids.length > 5) {
      console.log(`Validation failed: course_ids length ${course_ids.length} exceeds maximum allowed.`);
      return res.status(400).json({ error: "Maximum 5 courses allowed per study plan" });
    }
    console.log("Course count check passed.");

    if (weekdays && !Array.isArray(weekdays)) {
      console.log("Validation failed: weekdays must be an array.");
      return res.status(400).json({ error: "weekdays must be an array" });
    }
    console.log("Weekdays array check passed.");

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    if (startDate >= endDate) {
      console.log(`Validation failed: start_date ${start_date} is not before end_date ${end_date}.`);
      return res.status(400).json({ error: "end_date must be after start_date" });
    }
    console.log("Date range validity check passed.");

    if (!course_settings || typeof course_settings !== "object" || Array.isArray(course_settings)) {
      console.log("Validation failed: course_settings must be a plain object.");
      return res.status(400).json({ error: "course_settings must be an object" });
    }
    console.log("Course settings object check passed.");

    // Validate each course's specific settings
    for (const [courseId, settings] of Object.entries(course_settings)) {
      console.log(`Validating settings for course ID ${courseId}...`);

      if (!settings.start_time || !/^\d{2}:\d{2}$/.test(settings.start_time)) {
        console.log(`Validation failed: Missing or invalid start_time for course ${courseId}.`);
        return res.status(400).json({ error: `Missing or invalid start_time for course ${courseId}` });
      }
      const [h, m] = settings.start_time.split(":").map(Number);
      if (h < 0 || h > 23 || m < 0 || m > 59) {
        console.log(`Validation failed: Invalid start_time value ${settings.start_time} for course ${courseId}.`);
        return res.status(400).json({ error: `Invalid start_time value for course ${courseId}` });
      }

      if (!Array.isArray(settings.study_days) || settings.study_days.length === 0) {
        console.log(`Validation failed: Missing or empty study_days for course ${courseId}.`);
        return res.status(400).json({ error: `Missing or empty study_days for course ${courseId}` });
      }

      if (!settings.daily_hours || typeof settings.daily_hours !== "number" || settings.daily_hours <= 0) {
        console.log(`Validation failed: daily_hours must be a positive number for course ${courseId}.`);
        return res.status(400).json({ error: `daily_hours must be a positive number for course ${courseId}` });
      }

      console.log(`Settings for course ${courseId} passed validation.`);
    }
if (!start_time || !/^\d{2}:\d{2}$/.test(start_time)) {
  return res.status(400).json({ error: "start_time must be provided in HH:mm format" });
}

    // ===== Create study plan in DB =====
    console.log("Validation passed for all inputs, creating study plan record in DB...");
    const studyPlan = await StudyPlan.create({
      user_id,
      plan_name,
      start_date,
      end_date,
      weekdays: weekdays || [],
      study_time,   // Duration in minutes, stored as integer
      course_ids: course_ids || [],
      course_settings: course_settings || {},
      course_count: course_ids ? course_ids.length : 0,
      start_time
    });
    console.log("Study plan created with ID:", studyPlan.id);

    // ===== Google Calendar Sync =====
    // ===== Google Calendar Sync =====
if (shouldSyncGoogle) {
  const userWithTokens = await User.findByPk(user_id, { include: ['googleToken'] });

  if (!userWithTokens?.googleToken) {
    // Request OAuth flow if tokens missing
    const statePayload = JSON.stringify({
      userId: user_id,
      planData: req.body,
      returnUrl: req.body.returnUrl || undefined,
    });

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar'],
      prompt: 'consent',
      state: statePayload,
    });

    return res.status(401).json({
      error: "Google account not connected. Please authenticate.",
      googleAuthUrl: authUrl,
    });
  }

  try {
    const mapDay = {
      Sunday: "SU",
      Monday: "MO",
      Tuesday: "TU",
      Wednesday: "WE",
      Thursday: "TH",
      Friday: "FR",
      Saturday: "SA",
    };

    // Collect all unique study days from all courses
    const allStudyDaysSet = new Set();
    for (const settings of Object.values(course_settings)) {
      if (Array.isArray(settings.study_days)) {
        settings.study_days.forEach(d => allStudyDaysSet.add(d));
      }
    }
    const allStudyDays = Array.from(allStudyDaysSet);
    const eventDays = allStudyDays.map(d => mapDay[d] || d.toUpperCase().slice(0, 2));

    // Determine start time for event:
    // Option 1: Use the plan-wide start_time if available
    // Option 2: Fallback to earliest course start_time
    let startTimeStr = req.body.start_time || null;
    if (!startTimeStr) {
      // Find earliest start_time among courses if plan-level start_time not provided
      const courseStartTimes = Object.values(course_settings)
        .map(c => c.start_time)
        .filter(Boolean);
      if (courseStartTimes.length) {
        startTimeStr = courseStartTimes.reduce((earliest, current) => 
          current < earliest ? current : earliest, courseStartTimes[0]);
      } else {
        startTimeStr = "09:00"; // Default fallback
      }
    }

    // Calculate total duration in minutes (use study_time provided in request)
    const durationMinutes = typeof study_time === 'number' && study_time > 0 ? study_time : 60; // default 60 mins

    // Calculate event end time
    const [startH, startM] = startTimeStr.split(":").map(Number);
    let endH = startH + Math.floor(durationMinutes / 60);
    let endM = startM + (durationMinutes % 60);
    if (endM >= 60) {
      endH += 1;
      endM -= 60;
    }
    endH = endH % 24;
    const endTimeStr = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;

    // Dates
    const todayDateStr = new Date().toISOString().split("T")[0];
    const eventStartDateTime = new Date(`${todayDateStr}T${startTimeStr}:00+05:30`);
    const eventEndDateTime = new Date(`${todayDateStr}T${endTimeStr}:00+05:30`);

    // Calculate duration in days inclusive
    const startDateObj = new Date(start_date);
    const endDateObj = new Date(end_date);
    const durationInDays = Math.ceil((endDateObj - startDateObj) / (1000 * 60 * 60 * 24)) + 1;

    // Compose event summary and description using the study plan + courses info
    const eventSummary = `Study Plan: ${plan_name}`;
    const eventDescription = `Study plan from ${start_date} to ${end_date} with courses: ${course_ids?.join(", ") || "None"}`;

    // Create single Google Calendar event
    const googleEventId = await createGoogleCalendarEvent(userWithTokens, {
      summary: eventSummary,
      description: eventDescription,
      startTime: startTimeStr,
      endTime: endTimeStr,
      days: eventDays,
      durationInDays,
    });

    console.log(`Created single Google Calendar event for study plan with ID ${googleEventId}`);

 studyPlan.google_event_id = googleEventId;
console.log('Setting google_event_id to:', googleEventId);
await studyPlan.save();
console.log('StudyPlan after save:', studyPlan.toJSON());

  } catch (syncError) {
    console.error("Failed to sync study plan to Google Calendar:", syncError);
    // Don't block main response on calendar sync failure
  }
}


    // ===== Final response =====
    return res.status(201).json({ studyPlan });

  } catch (error) {
    console.error("⚠️ Unexpected error in createStudyPlan:", error);
    return res.status(500).json({ error: "Failed to create study plan" });
  }
},





  // GET /api/study-plans/:id
  getStudyPlanById: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.session.userId;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: No session' });
      }

      if (isNaN(Number(id))) {
        return res.status(400).json({ error: 'Invalid study plan ID' });
      }

      const studyPlan = await StudyPlan.findOne({
        where: {
          id,
          user_id_foreign_key: userId
        }
      });

      if (!studyPlan) {
        return res.status(404).json({ error: 'Study plan not found or access denied' });
      }

      res.json(studyPlan);

    } catch (error) {
      console.error('Error fetching study plan:', error);
      res.status(500).json({ error: 'Failed to fetch study plan' });
    }
  },

  // PUT /api/study-plans/:id - Update study plan
updateStudyPlan : async (req, res) => {
  try {
    const { id } = req.params;
    const {
      plan_name,
      start_date,
      end_date,
      weekdays,
      study_time,
      course_ids,
      course_settings,
      start_time,
      sync_with_google,
    } = req.body;

    // Fetch the study plan
    const studyPlan = await StudyPlan.findByPk(id);
    if (!studyPlan) {
      return res.status(404).json({ error: 'Study plan not found' });
    }

    // Validations
    if (course_ids && course_ids.length > 5) {
      return res.status(400).json({ error: 'Maximum 5 courses allowed per study plan' });
    }
    if (weekdays && !Array.isArray(weekdays)) {
      return res.status(400).json({ error: 'weekdays must be an array' });
    }
    if (start_date && end_date) {
      const startDateObj = new Date(start_date);
      const endDateObj = new Date(end_date);
      if (startDateObj >= endDateObj) {
        return res.status(400).json({ error: 'end_date must be after start_date' });
      }
    }
    if (start_time !== undefined && !/^\d{2}:\d{2}$/.test(start_time)) {
      return res.status(400).json({ error: 'start_time must be in HH:mm format' });
    }

    // Update Study Plan
    await studyPlan.update({
      plan_name: plan_name !== undefined ? plan_name : studyPlan.plan_name,
      start_date: start_date !== undefined ? start_date : studyPlan.start_date,
      end_date: end_date !== undefined ? end_date : studyPlan.end_date,
      weekdays: weekdays !== undefined ? weekdays : studyPlan.weekdays,
      study_time: study_time !== undefined ? study_time : studyPlan.study_time,
      course_ids: course_ids !== undefined ? course_ids : studyPlan.course_ids,
      course_settings: course_settings !== undefined ? course_settings : studyPlan.course_settings,
      course_count: course_ids ? course_ids.length : studyPlan.course_count,
      start_time: start_time !== undefined ? start_time : studyPlan.start_time,
      sync_with_google: sync_with_google !== undefined ? sync_with_google : studyPlan.sync_with_google,
    });

    // Google Calendar Sync
    if (studyPlan.sync_with_google) {
      const user = await User.findByPk(studyPlan.user_id, { include: ['googleToken'] });
      if (!user?.googleToken) {
        console.warn(`Google tokens missing for user ${studyPlan.user_id}. Skipping calendar sync.`);
      } else {
        try {
          // Map weekdays for recurrence
          const mapDay = {
            Sunday: "SU",
            Monday: "MO",
            Tuesday: "TU",
            Wednesday: "WE",
            Thursday: "TH",
            Friday: "FR",
            Saturday: "SA",
          };

          // Aggregate unique study days across all courses
          const allDaysSet = new Set();
          Object.values(studyPlan.course_settings).forEach(c => {
            c.study_days.forEach(day => allDaysSet.add(day));
          });
          const allDays = Array.from(allDaysSet);
          const eventDays = allDays.map(d => mapDay[d] || d.slice(0, 2).toUpperCase());

          // Determine start_time for event
          let eventStartTime = studyPlan.start_time;
          if (!eventStartTime) {
            const courseTimes = Object.values(studyPlan.course_settings).map(c => c.start_time).filter(Boolean);
            eventStartTime = courseTimes.length ? courseTimes.sort()[0] : "09:00";
          }

          // Calculate end time
          const durationInMinutes = studyPlan.study_time || 60;
          const [startH, startM] = eventStartTime.split(":").map(Number);
          let endHour = startH + Math.floor(durationInMinutes / 60);
          let endMin = startM + (durationInMinutes % 60);
          if (endMin >= 60) {
            endHour += 1;
            endMin -= 60;
          }
          endHour %= 24;
          const eventEndTime = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;

          // Dates for recurrence rule
          const startDateObj = new Date(studyPlan.start_date);
          const endDateObj = new Date(studyPlan.end_date);
          const durationDays = Math.ceil((endDateObj - startDateObj) / (1000 * 60 * 60 * 24)) + 1;

          // Assemble event details
          const eventSummary = `Study Plan: ${studyPlan.plan_name}`;
          const eventDescription = `Study plan from ${studyPlan.start_date} to ${studyPlan.end_date} with courses: ${studyPlan.course_ids.join(', ')}`;

          // Update or create event
          if (studyPlan.google_event_id) {
            // You need to implement updateGoogleCalendarEvent
            const updatedEventId = await updateGoogleCalendarEvent(user, studyPlan.google_event_id, {
              summary: eventSummary,
              description: eventDescription,
              startTime: eventStartTime,
              endTime: eventEndTime,
              days: eventDays,
              durationInDays: durationDays,
            });
            studyPlan.google_event_id = updatedEventId || studyPlan.google_event_id;
            await studyPlan.save();
            console.log(`Updated Google Calendar event with ID: ${updatedEventId}`);
          } else {
            const newEventId = await createGoogleCalendarEvent(user, {
              summary: eventSummary,
              description: eventDescription,
              startTime: eventStartTime,
              endTime: eventEndTime,
              days: eventDays,
              durationInDays: durationDays,
            });
            studyPlan.google_event_id = newEventId;
            await studyPlan.save();
            console.log(`Created Google Calendar event with ID: ${newEventId}`);
          }

        } catch (syncErr) {
          console.error("Google Calendar sync failed: ", syncErr);
          // Don't fail the update operation due to calendar issues.
        }
      }
    }

    return res.json({ studyPlan });
  } catch (err) {
    console.error("Failed to update study plan:", err);
    return res.status(500).json({ error: "Failed to update study plan" });
  }
},

  // DELETE /api/study-plans/:id
 
deleteStudyPlan : async (req, res) => {
  try {
    const { id } = req.params;

    const studyPlan = await StudyPlan.findByPk(id);
    if (!studyPlan) {
      return res.status(404).json({ error: 'Study plan not found' });
    }

    if (studyPlan.google_event_id) {
      // Fetch the user with Google tokens
      const user = await User.findByPk(studyPlan.user_id, { include: ['googleToken'] });

      if (user?.googleToken) {
        try {
          // Delete the Google Calendar event
          await deleteGoogleCalendarEvent(user, studyPlan.google_event_id);
          console.log(`Successfully deleted Google event ${studyPlan.google_event_id}`);
        } catch (err) {
          console.error('Failed to delete Google Calendar event:', err);
          // Optionally decide whether to block study plan deletion or continue.
          // Here we continue.
        }
      } else {
        console.warn(
          `Cannot delete Google event: no valid Google tokens for user ID ${studyPlan.user_id}`
        );
      }
    }

    // Delete the study plan from DB
    await studyPlan.destroy();

    res.json({ message: 'Study plan and its Google Calendar event deleted successfully' });
  } catch (error) {
    console.error('Error deleting study plan:', error);
    res.status(500).json({ error: 'Failed to delete study plan' });
  }
},


  // GET /api/study-plans/:id/progress - Get progress for a study plan
  getStudyProgress: async (req, res) => {
    try {
      const { id } = req.params;
      const { limit = 30 } = req.query;

      const progress = await StudyProgress.findAll({
        where: { plan_id: id },
        order: [['study_date', 'DESC']],
        limit: parseInt(limit)
      });

      res.json({ progress });

    } catch (error) {
      console.error('Error fetching study progress for plan:', error);
      res.status(500).json({ error: 'Failed to fetch study progress for plan' });
    }
  },

  // GET /api/users/:userId/registered-courses - Get courses registered by user
  getRegisteredCourses: async (req, res) => {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }

      const courses = await Course.findAll({
        attributes: ['id', 'course_name', 'createdAt', 'updatedAt'],
        where: { user_id_foreign_key: userId },
        order: [['createdAt', 'DESC']]
      });

      res.json({ courses });

    } catch (error) {
      console.error('Error fetching registered courses:', error);
      res.status(500).json({ error: 'Failed to fetch registered courses' });
    }
  },

  // GET /api/study-plans/user/:userId - Get study plans with course details
  getStudyPlansByUser: async (req, res) => {
    try {
      const { userId } = req.params;

      const studyPlans = await StudyPlan.findAll({
        where: { user_id: userId },
        order: [['created_at', 'DESC']]
      });

      const studyPlansWithCourses = await Promise.all(
        studyPlans.map(async (plan) => {
          const planData = plan.toJSON();

          if (planData.course_ids && planData.course_ids.length > 0) {
            const courseDetails = await Course.findAll({
              where: { id: planData.course_ids },
              attributes: ['id', 'course_name', 'description', 'duration_weeks']
            });
            planData.course_details = courseDetails;
          }

          return planData;
        })
      );

      res.json({ studyPlans: studyPlansWithCourses });

    } catch (error) {
      console.error('Error fetching study plans with courses:', error);
      res.status(500).json({ error: 'Failed to fetch study plans with courses' });
    }
  },

  // GET /api/study-plans/:id/with-courses - Get single study plan with full course details
  getStudyPlanWithCourses: async (req, res) => {
    try {
      const { id } = req.params;

      const studyPlan = await StudyPlan.findByPk(id);

      if (!studyPlan) {
        return res.status(404).json({ error: 'Study plan not found' });
      }

      const planData = studyPlan.toJSON();

      if (planData.course_ids && planData.course_ids.length > 0) {
        const courseDetails = await Course.findAll({
          where: { id: planData.course_ids },
          attributes: [
            'id',
            'course_name',
            'user_id_foreign_key',
            'ref_course_id',
            'notion_template_db_id'
          ]
        });

        planData.course_details = courseDetails;
      }

      res.json({ studyPlan: planData });

    } catch (error) {
      console.error('Error fetching study plan with courses:', error);
      res.status(500).json({ error: 'Failed to fetch study plan with courses' });
    }
  }

};

module.exports = studyPlanController;
// if google not opted created plan stores in db 
//if google opted && tokens exist  then the event gets created in db and google cal and with the google calender event id in study plan model
//if google opted &&tokens do not exist then return 401 with google auth url  then it get authenticated and the creation of eevnt is directed to 
//it, so the first time they authtenticate istelf it will be used.
