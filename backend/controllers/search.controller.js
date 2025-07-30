const { Op } = require('sequelize');
const { User, Group, StudyPlan, Course } = require('../models');

exports.searchMulti = async (req, res) => {
  const query = req.query.query?.trim();

  if (!query) return res.status(400).json({ error: 'Search query is required' });

  try {
    const [users, groups, studyPlans, courses] = await Promise.all([
      User.findAll({
        where: {
          [Op.or]: [
            { first_name: { [Op.iLike]: `%${query}%` } },
            { last_name: { [Op.iLike]: `%${query}%` } },
          ]
        },
        attributes: ['id', 'first_name', 'last_name']
      }),

      Group.findAll({
        where: {
          group_name: { [Op.iLike]: `%${query}%` },  // <-- corrected column name
        },
        attributes: ['id', 'group_name']  // <-- corrected attribute name
      }),

      StudyPlan.findAll({
        where: {
          plan_name: { [Op.iLike]: `%${query}%` },
        },
        attributes: ['id', 'plan_name']
      }),

      Course.findAll({
        where: {
          course_name: { [Op.iLike]: `%${query}%` },
        },
        attributes: ['id', 'course_name']
      })
    ]);

    res.json({ users, groups, studyPlans, courses });
  } catch (error) {
    console.error('❌ Error in searchMulti:', error);
    res.status(500).json({ error: 'Search failed on server' });
  }
};

