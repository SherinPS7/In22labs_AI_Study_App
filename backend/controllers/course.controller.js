const db = require('../models');
const Course = db.Course; 
const Videos = db.Videos;
const Keywords = db.Keywords;
const generateKeywords = require('../utils/generateKeywords');
const { createCourseMasterPlanInNotion } = require('../utils/createMasterPlanNotion');

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// exports.createCourse = async (req, res) => {
//   try {
//     const newCourse = await Course.create(req.body);
//     res.status(201).json(newCourse);
//   } catch (error) {
//     console.error('Error creating course:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// } 

exports.updateCourse = async (req, res) => {
  try {
    await Course.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'Course updated' });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createCourse = async (req, res) => {
  const { course_name, user_id_foreign_key } = req.body;

  if (!course_name || !user_id_foreign_key) {
    return res.status(400).json({ error: 'course_name and user_id_foreign_key are required' });
  }

  try {
    const newCourse = await Course.create({ course_name, user_id_foreign_key });

    const result = await generateKeywords(course_name, newCourse.id);
    if (!result.success) {
      return res.status(201).json({
        course: newCourse,
        generatedTopics: [],
        generatedVideos: [],
        videoUrls: [],
        notionStatus: '⚠️ Keyword generation failed',
        notionPageId: null,
        notionError: result.error || 'Unknown keyword generation error',
        rawResponse: result.raw || null,
      });
    }

    const notionResult = await createCourseMasterPlanInNotion(
      newCourse,
      result.topics,
      result.videosGenerated,
      result.videoUrls
    );

    return res.status(201).json({
      course: newCourse,
      generatedTopics: result.topics,
      generatedVideos: result.videosGenerated,
      videoUrls: result.videoUrls || [],
      notionStatus: notionResult.success ? '✅ Page created' : '⚠️ Failed to create Notion page',
      notionPageId: notionResult.pageId || null,
      notionError: notionResult.error || null,
    });

  } catch (error) {
    console.error('❌ Error creating course and storing keywords:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};


exports.deleteCourse = async (req, res) => {
  try {

    await Keywords.destroy({ where: { course_id_foreign_key: req.params.id } });
    await Videos.destroy({ where: { course_id_foreign_key: req.params.id } });
    await Course.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Course deleted' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getCoursesByUserId = async (req, res) => {
  const userId = req.params.userId;

  try {
    const courses = await Course.findAll({
      where: { user_id_foreign_key: userId }
    });
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses by user ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};