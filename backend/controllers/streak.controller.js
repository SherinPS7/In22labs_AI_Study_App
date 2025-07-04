const db = require('../models');
const QuizAttempt = db.QuizAttempt;
const Course = db.Course;
const Keywords = db.Keywords;
const generateQuizFromOpenAI = require("../utils/quizPromptGenerator");
const { Op } = require("sequelize");

exports.generateQuiz = async (req, res) => {
  const { user_id, course_id } = req.body;
  if (!user_id || !course_id) return res.status(400).json({ error: "user_id and course_id required" });

  try {
    const today = new Date().toISOString().split('T')[0];

    const existing = await QuizAttempt.findOne({
      where: { user_id, course_id, date: today }
    });

    if (existing) {
      return res.status(403).json({ error: "Quiz already generated today", quiz: existing.quiz_data });
    }

    const course = await Course.findByPk(course_id);
    const keywords = await Keywords.findAll({ where: { course_id_foreign_key: course_id } });
    const topics = keywords.map(k => k.keyword);

    const quiz = await generateQuizFromOpenAI(course.course_name, topics);

    await QuizAttempt.create({
      user_id,
      course_id,
      quiz_data: quiz,
      date: today
    });

    res.json({ quiz });
  } catch (err) {
    console.error("Quiz generation failed:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
