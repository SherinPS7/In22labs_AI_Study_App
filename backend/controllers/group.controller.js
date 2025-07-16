const db = require('../models');
const { Op } = require('sequelize');
const { Group, GroupMember, StudyPlan, User } = db;

// ✅ Generate unique 6-character group code
function generateGroupCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

const GroupController = {
  // ✅ Create a new group
  async createGroup(req, res) {
    try {
      const { name } = req.body;
      const userId = req.session.userId;

      if (!userId) return res.status(401).json({ message: 'Not logged in' });

      const code = generateGroupCode();

      const group = await Group.create({
        name,
        code,
        creator_user_id: userId
      });

      // Add the user to the group
      await GroupMember.create({
        group_id: group.id,
        user_id: userId
      });

      // Optional: link existing study plan to this group
      await StudyPlan.update(
        { group_id: group.id },
        { where: { user_id: userId } }
      );

      return res.status(201).json({ message: 'Group created', group });
    } catch (err) {
      console.error('Create group error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  },
  async getGroupLeaderboard(req, res) {
  try {
    const { groupId } = req.params;

    const members = await db.GroupMember.findAll({
      where: { group_id: groupId },
      attributes: ['user_id']
    });

    const userIds = members.map(m => m.user_id);

    const progress = await db.StudyProgress.findAll({
      where: {
        user_id: userIds
      },
      attributes: ['user_id', [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'completed']],
      group: ['user_id'],
      raw: true
    });

    // Optional: attach user names
    const users = await db.User.findAll({
      where: { id: userIds },
      attributes: ['id', 'first_name', 'last_name'],
      raw: true
    });

    const leaderboard = progress.map(p => {
      const user = users.find(u => u.id === p.user_id);
      return {
        user_id: p.user_id,
        name: `${user.first_name} ${user.last_name}`,
        completed: parseInt(p.completed)
      };
    }).sort((a, b) => b.completed - a.completed);

    return res.status(200).json({ leaderboard });
  } catch (err) {
    console.error('Get leaderboard error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
},
// async leaveGroup(req, res) {
//   try {
//     const userId = req.session.userId;
//     if (!userId) return res.status(401).json({ message: 'Not logged in' });

//     const membership = await db.GroupMember.findOne({
//       where: { user_id: userId }
//     });

//     if (!membership) {
//       return res.status(400).json({ message: 'Not in any group' });
//     }

//     // Remove from group
//     await db.GroupMember.destroy({
//       where: { user_id: userId }
//     });

//     // Unlink StudyPlan
//     await db.StudyPlan.update(
//       { group_id: null },
//       { where: { user_id: userId } }
//     );

//     return res.status(200).json({ message: 'Left group successfully' });
//   } catch (err) {
//     console.error('Leave group error:', err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// }
async leaveGroup(req, res) {
  try {
    const userId = req.session.userId;
    const { groupId } = req.body;

    if (!userId) return res.status(401).json({ message: 'Not logged in' });
    if (!groupId) return res.status(400).json({ message: 'Group ID required' });

    const membership = await db.GroupMember.findOne({
      where: { user_id: userId, group_id: groupId }
    });

    if (!membership) {
      return res.status(400).json({ message: 'Not part of this group' });
    }

    // ❗ Leave only this specific group
    await db.GroupMember.destroy({
      where: { user_id: userId, group_id: groupId }
    });

    // ❗ Unlink only plans tied to this group
    await db.StudyPlan.update(
      { group_id: null },
      { where: { user_id: userId, group_id: groupId } }
    );

    return res.status(200).json({ message: 'Left group successfully' });
  } catch (err) {
    console.error('Leave group error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

,
async addPlansToGroup(req, res) {
    try {
      const userId = req.session.userId;
      const { planIds, groupId } = req.body;

      if (!userId) return res.status(401).json({ message: 'Not logged in' });

      // Check user is creator of the group
      const group = await Group.findOne({ where: { id: groupId } });
      if (!group || group.creator_user_id !== userId) {
        return res.status(403).json({ message: 'Not group admin' });
      }

      // Assign group_id to selected plans
      await StudyPlan.update(
        { group_id: groupId },
        { where: { id: planIds, user_id: userId } }
      );

      return res.status(200).json({ message: 'Plans shared to group' });
    } catch (err) {
      console.error('Add plans error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  },
 async joinGroup(req, res) {
    try {
      const { code } = req.body;
      const userId = req.session.userId;

      if (!userId) return res.status(401).json({ message: 'Not logged in' });

      const group = await Group.findOne({ where: { code } });
      if (!group) return res.status(404).json({ message: 'Invalid group code' });

      const alreadyJoined = await GroupMember.findOne({
        where: { user_id: userId, group_id: group.id }
      });
      if (alreadyJoined) return res.status(400).json({ message: 'Already in this group' });

      // ✅ Clone all shared study plans from group admin
      const sharedPlans = await StudyPlan.findAll({
        where: {
          user_id: group.creator_user_id,
          group_id: group.id
        }
      });

      for (const plan of sharedPlans) {
        await StudyPlan.create({
          user_id: userId,
          plan_name: plan.plan_name,
          start_date: plan.start_date,
          end_date: plan.end_date,
          weekdays: plan.weekdays,
          study_time: plan.study_time,
          course_ids: plan.course_ids,
          course_settings: plan.course_settings,
          course_count: plan.course_count,
          group_id: group.id
        });
      }

      // Add member to group
      await GroupMember.create({
        group_id: group.id,
        user_id: userId
      });

      return res.status(200).json({ message: 'Joined group successfully' });
    } catch (err) {
      console.error('Join group error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  },
// async getGroupMembers(req, res) {
//   try {
//     const { groupId } = req.params;

//     const members = await db.GroupMember.findAll({
//       where: { group_id: groupId },
//       include: [
//         {
//           model: db.User,
//           attributes: ['id', 'first_name', 'last_name', 'mobile']
//         }
//       ]
//     });

//     return res.status(200).json({ members });
//   } catch (err) {
//     console.error('Get group members error:', err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// }
async getGroupMembers(req, res) {
  try {
    const { groupId } = req.params;

    const members = await db.GroupMember.findAll({
      where: { group_id: groupId },
      include: [
        {
          model: db.User,
          attributes: ['id', 'first_name', 'last_name', 'mobile'],
        },
      ],
    });

    // Flatten user details
    const formatted = members.map((member) => ({
      id: member.id,
      user_id: member.user_id,
      first_name: member.User?.first_name || 'Unknown',
      last_name: member.User?.last_name || '',
      mobile: member.User?.mobile || 'N/A',
      completed: 0, // Replace with real session count if available
    }));

    return res.status(200).json({ members: formatted });
  } catch (err) {
    console.error('Get group members error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

,
async getMyGroups(req, res) {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ message: "Not logged in" });

    // Get group memberships
    const memberships = await GroupMember.findAll({
      where: { user_id: userId },
      include: [{ model: Group, attributes: ['id', 'name', 'code', 'creator_user_id'] }]
    });

    // Extract just the groups
    const groups = memberships.map((m) => m.Group);

    return res.status(200).json({ groups });
  } catch (err) {
    console.error("Get my groups error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
,

async getMyGroupStatus(req, res) {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ message: 'Not logged in' });

    // Get all group memberships
    const memberships = await db.GroupMember.findAll({
      where: { user_id: userId },
      raw: true
    });

    if (!memberships.length) {
      return res.status(200).json({ groups: [] }); // no groups
    }

    const groupIds = memberships.map(m => m.group_id);

    // Fetch all group details
    const groups = await db.Group.findAll({
      where: { id: groupIds },
      attributes: ['id', 'name', 'code', 'creator_user_id'],
      raw: true
    });

    // Fetch all user's study plans tied to those groups
    const plans = await db.StudyPlan.findAll({
      where: {
        user_id: userId,
        group_id: groupIds
      },
      attributes: [
        'id', 'plan_name', 'group_id',
        'start_date', 'end_date',
        'weekdays', 'study_time',
        'course_ids', 'course_settings', 'course_count'
      ],
      raw: true
    });

    // Combine group info + plan
    const groupData = groups.map(group => {
      const plan = plans.find(p => p.group_id === group.id);
      return {
        group,
        studyPlan: plan || null
      };
    });

    return res.status(200).json({ groups: groupData });
  } catch (err) {
    console.error('Get my group status error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

,
async resyncStudyPlanFromGroup(req, res) {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ message: 'Not logged in' });

    const membership = await db.GroupMember.findOne({
      where: { user_id: userId }
    });

    if (!membership) {
      return res.status(400).json({ message: 'Not part of any group' });
    }

    const group = await db.Group.findOne({
      where: { id: membership.group_id }
    });

    if (!group) return res.status(404).json({ message: 'Group not found' });

    const creatorPlan = await db.StudyPlan.findOne({
      where: { user_id: group.creator_user_id }
    });

    if (!creatorPlan) {
      return res.status(400).json({ message: 'Creator has no study plan' });
    }

    // Update user's study plan
    await db.StudyPlan.update(
      {
        plan_name: creatorPlan.plan_name,
        start_date: creatorPlan.start_date,
        end_date: creatorPlan.end_date,
        weekdays: creatorPlan.weekdays,
        study_time: creatorPlan.study_time,
        course_ids: creatorPlan.course_ids,
        course_settings: creatorPlan.course_settings,
        course_count: creatorPlan.course_count
      },
      { where: { user_id: userId } }
    );

    return res.status(200).json({ message: 'Study plan resynced from group leader' });
  } catch (err) {
    console.error('Resync error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}
,
  // ✅ Join existing group by code
 
};

module.exports = GroupController;
