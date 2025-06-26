const { StudyPlan } = require('../models'); // ✅ Correct model import

exports.getAllPlans = async (req, res) => {
  try {
    const userId = req.session?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: User not logged in' });
    }

    const plans = await StudyPlan.findAll({
      where: { user_id_foreign_key: userId },
    });

    res.status(200).json(plans);
  } catch (err) {
    console.error('Error fetching plans:', err);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
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
