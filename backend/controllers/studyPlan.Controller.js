// controllers/studyPlanController.js
const { StudyPlan, StudyProgress } = require('../models');
const { Course } = require('../models'); // Add this if not already imported

const studyPlanController = {
  
  // ========================
  // STUDY PLAN CRUD OPERATIONS
  // ========================
  
  // GET /api/study-plans?userId=1
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

  // POST /api/study-plans - UPDATED to handle course_ids and course_settings
  createStudyPlan: async (req, res) => {
    try {
      const { 
        user_id, 
        plan_name, 
        start_date, 
        end_date, 
        weekdays, 
        study_time, 
        course_ids, 
        course_settings 
      } = req.body;
      
      if (!user_id || !plan_name || !start_date || !end_date || !study_time) {
        return res.status(400).json({ 
          error: 'user_id, plan_name, start_date, end_date, and study_time are required' 
        });
      }

      // Validate course limit
      if (course_ids && course_ids.length > 5) {
        return res.status(400).json({ error: 'Maximum 5 courses allowed per study plan' });
      }

      // Validate weekdays array
      if (weekdays && !Array.isArray(weekdays)) {
        return res.status(400).json({ error: 'weekdays must be an array' });
      }

      // Validate date format and logic
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);
      
      if (startDate >= endDate) {
        return res.status(400).json({ error: 'end_date must be after start_date' });
      }
      
      const studyPlan = await StudyPlan.create({
        user_id,
        plan_name,
        start_date,
        end_date,
        weekdays: weekdays || [],
        study_time,
        course_ids: course_ids || [],
        course_settings: course_settings || {},
        course_count: course_ids ? course_ids.length : 0
      });
      
      res.status(201).json({ studyPlan });
    } catch (error) {
      console.error('Error creating study plan:', error);
      res.status(500).json({ error: 'Failed to create study plan' });
    }
  },

  // GET /api/study-plans/:id
  getStudyPlanById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const studyPlan = await StudyPlan.findByPk(id);
      
      if (!studyPlan) {
        return res.status(404).json({ error: 'Study plan not found' });
      }
      
      res.json({ studyPlan });
    } catch (error) {
      console.error('Error fetching study plan:', error);
      res.status(500).json({ error: 'Failed to fetch study plan' });
    }
  },

  // PUT /api/study-plans/:id - UPDATED to handle course_ids and course_settings
  updateStudyPlan: async (req, res) => {
    try {
      const { id } = req.params;
      const { 
        plan_name, 
        start_date, 
        end_date, 
        weekdays, 
        study_time, 
        course_ids, 
        course_settings 
      } = req.body;
      
      const studyPlan = await StudyPlan.findByPk(id);
      
      if (!studyPlan) {
        return res.status(404).json({ error: 'Study plan not found' });
      }

      // Validate course limit
      if (course_ids && course_ids.length > 5) {
        return res.status(400).json({ error: 'Maximum 5 courses allowed per study plan' });
      }

      // Validate weekdays if provided
      if (weekdays && !Array.isArray(weekdays)) {
        return res.status(400).json({ error: 'weekdays must be an array' });
      }

      // Validate dates if both are provided
      if (start_date && end_date) {
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
        
        if (startDate >= endDate) {
          return res.status(400).json({ error: 'end_date must be after start_date' });
        }
      }
      
      await studyPlan.update({
        plan_name: plan_name || studyPlan.plan_name,
        start_date: start_date || studyPlan.start_date,
        end_date: end_date || studyPlan.end_date,
        weekdays: weekdays !== undefined ? weekdays : studyPlan.weekdays,
        study_time: study_time || studyPlan.study_time,
        course_ids: course_ids !== undefined ? course_ids : studyPlan.course_ids,
        course_settings: course_settings !== undefined ? course_settings : studyPlan.course_settings,
        course_count: course_ids ? course_ids.length : studyPlan.course_count
      });
      
      res.json({ studyPlan });
    } catch (error) {
      console.error('Error updating study plan:', error);
      res.status(500).json({ error: 'Failed to update study plan' });
    }
  },

  // DELETE /api/study-plans/:id
  deleteStudyPlan: async (req, res) => {
    try {
      const { id } = req.params;
      
      const studyPlan = await StudyPlan.findByPk(id);
      
      if (!studyPlan) {
        return res.status(404).json({ error: 'Study plan not found' });
      }
      
      await studyPlan.destroy();
      res.json({ message: 'Study plan deleted successfully' });
    } catch (error) {
      console.error('Error deleting study plan:', error);
      res.status(500).json({ error: 'Failed to delete study plan' });
    }
  },

  // GET /api/study-plans/:id/progress
  getStudyProgress: async (req, res) => {
    try {
      const { id } = req.params;
      const { limit = 30 } = req.query;
      
      // Get progress for a specific study plan
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

  // NEW METHOD: GET /api/users/:userId/registered-courses
  getRegisteredCourses: async (req, res) => {
    try {
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }
      
      const courses = await Course.findAll({
        attributes: ['id', 'course_name', 'createdAt', 'updatedAt'],
        where: {
          user_id_foreign_key: userId
        },
        order: [['createdAt', 'DESC']]
      });
      
      res.json({ courses });
    } catch (error) {
      console.error('Error fetching registered courses:', error);
      res.status(500).json({ error: 'Failed to fetch registered courses' });
    }
  },

  // NEW METHOD: GET /api/study-plans/user/:userId - Alternative way to get user's study plans
  getStudyPlansByUser: async (req, res) => {
    try {
      const { userId } = req.params;
      
      const studyPlans = await StudyPlan.findAll({
        where: { user_id: userId },
        order: [['created_at', 'DESC']]
      });
      
      // Parse course data and add course details if needed
      const studyPlansWithCourses = await Promise.all(
        studyPlans.map(async (plan) => {
          const planData = plan.toJSON();
          
          // If plan has course_ids, fetch course details
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


  // GET /api/study-plans/:id/course-progress
getStudyPlanVideoProgress: async (req, res) => {
  try {
    const { id } = req.params; // planId
    const plan = await StudyPlan.findByPk(id);

    if (!plan) {
      return res.status(404).json({ error: 'Study Plan not found' });
    }

    console.log('plan.course_ids:', plan.course_ids);
    console.log('plan.course_settings:', plan.course_settings);

    const courseIds = Array.isArray(plan.course_ids) ? plan.course_ids : JSON.parse(plan.course_ids);
    const courseSettings = typeof plan.course_settings === 'object' 
      ? plan.course_settings 
      : JSON.parse(plan.course_settings);

    const courses = await Course.findAll({
      where: { id: courseIds },
      include: { association: 'Videos' } // Make sure your model associations are set
    });

    const result = courses.map(course => {
      const videos = course.Videos || [];
      const watched = videos.filter(video => video.video_progress).length;
      const total = videos.length;

      return {
        courseId: course.id,
        courseName: course.course_name,
        totalVideos: total,
        watchedVideos: watched,
        settings: courseSettings[course.id] || {}
      };
    });

    res.json({ planName: plan.plan_name, progress: result });
  } catch (error) {
    console.error('Error fetching study plan video progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
},

  // NEW METHOD: GET /api/study-plans/:id/with-courses - Get study plan with full course details
  getStudyPlanWithCourses: async (req, res) => {
    try {
      const { id } = req.params;
      
      const studyPlan = await StudyPlan.findByPk(id);
      
      if (!studyPlan) {
        return res.status(404).json({ error: 'Study plan not found' });
      }
      
      const planData = studyPlan.toJSON();
      
      // If plan has course_ids, fetch course details
      if (planData.course_ids && planData.course_ids.length > 0) {
        const courseDetails = await Course.findAll({
          where: { id: planData.course_ids },
          attributes: ['id', 'course_name', 'description', 'duration_weeks', 'createdAt']
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