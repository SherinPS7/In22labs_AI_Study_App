const { Group, GroupMember, GroupJoinRequest, User, GroupMessage } = require('../models');
//const { nanoid } = require('nanoid');
const path = require('path');
const fs = require('fs');


let nanoid;
(async () => {
  const { nanoid: nano } = await import('nanoid');
  nanoid = nano;
})();

exports.createGroup = async (req, res) => {
  try {
    const { group_name, description } = req.body;

    const userId = req.session.userId;

    // Wait until nanoid is ready
    if (!nanoid) {
      return res.status(500).json({ message: 'Server not ready. Please try again shortly.' });
    }

    const group = await Group.create({
      group_name, // ✅ Matches the model
      description,
      created_by: userId,
      join_code: nanoid(8),
    });



     await GroupMember.create({
      group_id: group.id,
      user_id: userId,
      is_admin: true,
    });

    res.status(201).json({ group });
  } catch (err) {
    console.error('Group creation error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get all groups the user is a member of
// exports.getMyGroups = async (req, res) => {
//   try {
//     const userId = req.session.userId;

//     const memberships = await GroupMember.findAll({
//       where: { user_id: userId },
//       include: [
//         {
//           model: Group,
//           attributes: ['id', 'group_name', 'join_code', 'created_by', 'createdAt'],
//         },
//       ],
//     });

//     const groups = memberships.map((membership) => ({
//   ...membership.Group.dataValues,
//   role: membership.role,
//    isAdmin: membership.Group.created_by === userId,
// }));

//     res.status(200).json({ userId, groups });
//   } catch (err) {
//     console.error('Get my groups error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
exports.getMyGroups = async (req, res) => {
  try {
    const userId = req.session.userId;
    console.log("Session userId:", userId);

    const memberships = await GroupMember.findAll({
      where: { user_id: userId },
      attributes: ['is_admin'], 
      include: [
        {
          model: Group,
          attributes: ['id', 'group_name', 'join_code', 'created_by', 'createdAt'],
        },
      ],
    });

    console.log("Memberships found:", memberships.length);
    memberships.forEach((m) =>
    //   console.log(`Group ID: ${m.Group?.id}, Role: ${m.role}`)
    // );
    console.log(`Group ID: ${m.Group?.id}, isAdmin: ${m.is_admin}`)
    );

    const groups = memberships.map((membership) => ({
      ...membership.Group.dataValues,
     // role: membership.role,
      //isAdmin: membership.Group.created_by === userId,
      isAdmin: membership.is_admin,
    }));

    res.status(200).json({ userId, groups });
  } catch (err) {
    console.error('Get my groups error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Request to Join Group

exports.requestToJoinGroup = async (req, res) => {
  try {
    const joinCode = req.body.join_code;
;
    const userId = req.session.userId;

    // 🛡 Validate inputs
    if (!joinCode) {
      console.error("❌ Missing joinCode in request body", req.body);
      return res.status(400).json({ message: 'Join code is required' });
    }
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    // 🔍 Find group by join code
    const group = await Group.findOne({ where: { join_code: joinCode } });
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // 🔁 Check if already requested
    const existingRequest = await GroupJoinRequest.findOne({
      where: { group_id: group.id, user_id: userId },
    });
    if (existingRequest) {
      return res.status(400).json({ message: 'Already requested to join' });
    }

    // 👥 Check if already a member
    const isMember = await GroupMember.findOne({
      where: { group_id: group.id, user_id: userId },
    });
    if (isMember) {
      return res.status(400).json({ message: 'Already a member' });
    }

    // ✅ Create join request
    await GroupJoinRequest.create({ group_id: group.id, user_id: userId });

    res.status(200).json({ message: 'Join request sent' });
  } catch (err) {
    console.error('🔥 Join request error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Approve Join Request

exports.approveJoinRequest = async (req, res) => {
  try {
    const { groupId, requestId } = req.params;
    const userId = req.session.userId;

    const group = await Group.findByPk(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    // 🔒 Only admin can approve
    if (group.created_by !== userId) {
      return res.status(403).json({ message: 'Forbidden: Not group admin' });
    }

    const request = await GroupJoinRequest.findByPk(requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    await GroupMember.create({
      group_id: groupId,
      user_id: request.user_id,
      role: 'member',
    });

    await request.destroy();

    res.status(200).json({ message: 'User added to group' });
  } catch (err) {
    console.error('Approve error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Reject Join Request

exports.rejectJoinRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.session.userId;

    const request = await GroupJoinRequest.findByPk(requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const group = await Group.findByPk(request.group_id);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    // 🔒 Only admin can reject
    if (group.created_by !== userId) {
      return res.status(403).json({ message: 'Forbidden: Not group admin' });
    }

    await request.destroy();

    res.status(200).json({ message: 'Request rejected' });
  } catch (err) {
    console.error('Reject error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get All Join Requests (Admin)

exports.getJoinRequests = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.session.userId;

    const group = await Group.findByPk(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    // 🔑 Allow any group member to see
    const membership = await GroupMember.findOne({
      where: { group_id: groupId, user_id: userId },
    });
    if (!membership) {
      return res.status(403).json({ message: 'Forbidden: Only group members can see requests' });
    }

    const requests = await GroupJoinRequest.findAll({
      where: { group_id: groupId },
      include: [{ model: User, attributes: ['id', 'first_name', 'last_name'] }],
    });

    res.status(200).json({ requests });
  } catch (err) {
    console.error('Get requests error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get All Group Members
exports.getGroupMembers = async (req, res) => {
  try {
    const { groupId } = req.params;

    const members = await GroupMember.findAll({
      where: { group_id: groupId },
      include: [{ model: User, attributes: ['id', 'first_name', 'last_name'] }],
    });

    res.status(200).json({ members });
  } catch (err) {
    console.error('Get members error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove Member (Admin only)
exports.removeMember = async (req, res) => {
  try {
    const { groupId, userId } = req.params;

    const member = await GroupMember.findOne({ where: { group_id: groupId, user_id: userId } });
    if (!member) return res.status(404).json({ message: 'Member not found' });

    await member.destroy();

    res.status(200).json({ message: 'Member removed' });
  } catch (err) {
    console.error('Remove member error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Group Messages
exports.getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;

  const messages = await GroupMessage.findAll({
  where: { group_id: groupId },
  include: [
    {
      model: User,
      as: 'sender', // IMPORTANT: Use the alias as defined in the association
      attributes: ['id', 'first_name', 'last_name'], // Optional: Select only what you need
    },
  ],
  order: [['createdAt', 'ASC']],
});

    res.status(200).json({ messages });
  } catch (err) {
    console.error('Fetch messages error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Send Message (Text or PDF only)
exports.sendGroupMessage = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.session.userId;
    const { message_type, content } = req.body;

    if (!['text', 'file'].includes(message_type)) {
      return res.status(400).json({ message: 'Invalid message type' });
    }

    let filePath = null;
    if (message_type === 'file') {
      if (!req.file) return res.status(400).json({ message: 'File is required' });

      const ext = path.extname(req.file.originalname).toLowerCase();
      if (ext !== '.pdf') {
        return res.status(400).json({ message: 'Only PDF files allowed' });
      }

      filePath = '/uploads/pdfs/' + req.file.filename;
    }

    const message = await GroupMessage.create({
  group_id: groupId,
  sender_id: userId,
  message_text: message_type === 'text' ? content : filePath,
});


    res.status(201).json({ message });
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.uploadPDFToGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.session.userId;

    if (!req.file) {
      return res.status(400).json({ message: 'No PDF file uploaded' });
    }

    // Save file reference in DB or respond as needed
    return res.status(200).json({
      message: 'PDF uploaded successfully',
      filePath: `/uploads/pdfs/${req.file.filename}`,
    });
  } catch (err) {
    console.error('PDF Upload error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// controllers/groupController.js
exports.leaveGroup = async (req, res) => {
  try {
    const userId = req.session.userId; // Authenticated user
    const { groupId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!groupId) {
      return res.status(400).json({ message: 'groupId required' });
    }

    // Find membership
    const member = await GroupMember.findOne({ where: { group_id: groupId, user_id: userId } });
    if (!member) return res.status(404).json({ message: 'Membership not found' });

    // (optional: Prevent admin/creator from leaving if you want)

    await member.destroy();

    res.status(200).json({ message: 'Left group' });
  } catch (err) {
    console.error('Leave group error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
// controllers/groupController.js
exports.deleteGroup = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { groupId } = req.params;

    const group = await Group.findByPk(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // Only allow creator/admin to delete
    if (group.created_by !== userId) {
      return res.status(403).json({ message: "Only the group creator can delete this group." });
    }

    // Optionally: Delete GroupMembers and GroupMessages, or set up cascading delete
    await Group.destroy({ where: { id: groupId } });

    res.status(200).json({ message: "Group deleted" });
  } catch (err) {
    console.error("Delete group error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
