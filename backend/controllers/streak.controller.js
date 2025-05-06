const Streak = require('../models/Streak');

exports.getStreak = async (req, res) => {
  const streak = await Streak.findOne({ where: { userId: req.params.userId } });
  if (!streak) return res.status(404).json({ error: 'Streak not found' });
  res.json(streak);
};

exports.updateStreak = async (req, res) => {
  const [updated] = await Streak.update(req.body, {
    where: { userId: req.params.userId }
  });

  if (updated) {
    const newStreak = await Streak.findOne({ where: { userId: req.params.userId } });
    res.json(newStreak);
  } else {
    res.status(404).json({ error: 'Streak not found' });
  }
};
