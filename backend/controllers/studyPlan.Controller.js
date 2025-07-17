// controllers/studyPlanController.js
const { StudyPlan, StudyProgress } = require('../models');
const { Course } = require('../models'); // Add this if not already imported
const createNotionDB = require('../utils/createNotionDB');
const { NotionToken } = require('../models');

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
      course_settings,
      sync_with_notion 
    } = req.body;

    if (!user_id || !plan_name || !start_date || !end_date || !study_time) {
      return res.status(400).json({ 
        error: 'user_id, plan_name, start_date, end_date, and study_time are required' 
      });
    }

    if (course_ids && course_ids.length > 5) {
      return res.status(400).json({ error: 'Maximum 5 courses allowed per study plan' });
    }

    if (weekdays && !Array.isArray(weekdays)) {
      return res.status(400).json({ error: 'weekdays must be an array' });
    }

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
      course_count: course_ids ? course_ids.length : 0,
      sync_with_notion: !!sync_with_notion
    });

   if (sync_with_notion) {
  const notionToken = await NotionToken.findOne({ where: { user_id_foreign_key: user_id } });

  if (!notionToken || !notionToken.parent_page_id) {
    return res.status(401).json({
      error: 'Notion not connected or parent page not set. Please reconnect and select a page.'
    });
  }

  const createNotionDB = require('../utils/createNotionDB');
  try {
    await createNotionDB(studyPlan, notionToken);
    console.log('✅ Synced with Notion');
  } catch (err) {
    console.error('❌ Notion sync failed:', err.message);
    return res.status(500).json({
      error: 'Study plan created, but failed to sync with Notion.'
    });
  }
}


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

    res.json(studyPlan); // or res.json({ studyPlan }) based on your API pattern
  } catch (error) {
    console.error('Error fetching study plan:', error);
    res.status(500).json({ error: 'Failed to fetch study plan' });
  }
}
,

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
//http://localhost:3000/api/studyplan/study-plans?userId=8