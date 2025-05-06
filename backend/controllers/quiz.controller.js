const Quiz = require('../models/Quiz');

exports.getAllQuizzes = async (req, res) => {
  const quizzes = await Quiz.findAll();
  res.json(quizzes);
};

exports.getQuizById = async (req, res) => {
  const quiz = await Quiz.findByPk(req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
  res.json(quiz);
};

exports.createQuiz = async (req, res) => {
  const quiz = await Quiz.create(req.body);
  res.status(201).json(quiz);
};

exports.updateQuiz = async (req, res) => {
  await Quiz.update(req.body, { where: { id: req.params.id } });
  res.json({ message: 'Quiz updated' });
};

exports.deleteQuiz = async (req, res) => {
  await Quiz.destroy({ where: { id: req.params.id } });
  res.json({ message: 'Quiz deleted' });
};
