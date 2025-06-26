const db = require('../models');
const Studyplan = db.StudyPlan; // Assuming Studyplan is defined in your models

exports.getAllPlans = async (req, res) => {
  const plans = await Studyplan.findAll();
  res.json(plans);
};

exports.getPlanById = async (req, res) => {
  const plan = await Studyplan.findByPk(req.params.id);
  if (!plan) return res.status(404).json({ error: 'Plan not found' });
  res.json(plan);
};

exports.createPlan = async (req, res) => {
  const newPlan = await Studyplan.create(req.body);
  res.status(201).json(newPlan);
};

exports.updatePlan = async (req, res) => {
  await Studyplan.update(req.body, { where: { id: req.params.id } });
  res.json({ message: 'Plan updated' });
};

exports.deletePlan = async (req, res) => {
  await Studyplan.destroy({ where: { id: req.params.id } });
  res.json({ message: 'Plan deleted' });
};
