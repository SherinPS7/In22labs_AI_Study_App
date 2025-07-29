// import axios from "axios";

// const BASE_URL = import.meta.env.VITE_BASE_URL;

// // ✅ Create a new group
// export const createGroup = async (data: { name: string }) => {
//   try {
//     const res = await axios.post(
//       `${BASE_URL}/group/create`,
//       { group_name: data.name }, // 🔁 remap here
//       { withCredentials: true }
//     );
//     return res.data;
//   } catch (error: any) {
//     throw new Error(error.response?.data?.message || "Failed to create group");
//   }
// };

// // ✅ Get members of a specific group
// // 
// export const getGroupMembers = async (groupId: number) => {
//   const res = await axios.get(`${BASE_URL}/group/members/${groupId}`, {
//     withCredentials: true,
//   });
//   return res.data;
// };


// // ✅ Get current user's group status
// export const getGroupStatus = async () => {
//   const res = await axios.get(`${BASE_URL}/group/mystatus`, {
//     withCredentials: true,
//   });
//   return res.data;
// };

// // ✅ Join a group using code

// export const joinGroup = async (code: string) => {
//   try {
//     const res = await axios.post(`${BASE_URL}/group/request-join`, { join_code: code }, {
//       withCredentials: true,
//     });
//     return res.data;
//   } catch (error: any) {
//     throw new Error(error.response?.data?.message || "Failed to request group join");
//   }
// };


// // ✅ Leave a group
// export const leaveGroup = async (groupId: number) => {
//   try {
//     const res = await axios.post(`${BASE_URL}/group/leave`, { groupId }, {
//       withCredentials: true,
//     });
//     return res.data;
//   } catch (error: any) {
//     throw new Error(error.response?.data?.message || "Failed to leave group");
//   }
// };

// // ✅ Get all groups the user is part of

// export const getMyGroups = async () => {
//   const res = await axios.get(`${BASE_URL}/group/mygroups`, {
//     withCredentials: true,
//   });
//   return res.data; // Return full response: { groups: [...], userId: 123 }
// };




// // ✅ Get details for a single group
// export const getGroupDetails = async (groupId: number) => {
//   try {
//     const res = await axios.get(`${BASE_URL}/group/${groupId}`, {
//       withCredentials: true,
//     });
//     return res.data;
//   } catch (error: any) {
//     throw new Error(error.response?.data?.message || "Failed to get group details");
//   }
// };
// export const sendGroupMessage = async (groupId: number, message_text: string) => {
//   try {
//     const res = await axios.post(
//       `${BASE_URL}/group/${groupId}/messages`,
//       { message_text },
//       { withCredentials: true }
//     );
//     return res.data;
//   } catch (error: any) {
//     throw new Error(error.response?.data?.message || "Failed to send message");
//   }
// };
// export const getGroupMessages = async (groupId: number) => {
//   try {
//     const res = await axios.get(`${BASE_URL}/group/${groupId}/messages`, {
//       withCredentials: true,
//     });
//     return res.data;
//   } catch (error: any) {
//     throw new Error(error.response?.data?.message || "Failed to fetch messages");
//   }
// };
// import axios from "axios";

// const BASE_URL = import.meta.env.VITE_BASE_URL;

// // -------------------- Group Core --------------------

// // ✅ Create a new group
// export const createGroup = async (data: { name: string }) => {
//   const res = await axios.post(
//     `${BASE_URL}/group/create`,
//     { group_name: data.name },
//     { withCredentials: true }
//   );
//   return res.data;
// };

// // ✅ Get groups user is part of
// export const getMyGroups = async () => {
//   const res = await axios.get(`${BASE_URL}/group/mygroups`, {
//     withCredentials: true,
//   });
//   return res.data;
// };

// // ✅ Get current group join status
// export const getGroupStatus = async () => {
//   const res = await axios.get(`${BASE_URL}/group/mygroups`, {
//     withCredentials: true,
//   });
//   return res.data;
// };

// // ✅ Request to join a group (via join code)
// export const joinGroup = async (code: string) => {
//   const res = await axios.post(
//     `${BASE_URL}/group/request-join`,
//     { join_code: code },
//     { withCredentials: true }
//   );
//   return res.data;
// };

// // ✅ Leave a group
// export const leaveGroup = async (groupId: number) => {
//   const res = await axios.post(
//     `${BASE_URL}/group/leave`,
//     { groupId },
//     { withCredentials: true }
//   );
//   return res.data;
// };

// // ✅ Get group details
// export const getGroupDetails = async (groupId: number) => {
//   const res = await axios.get(`${BASE_URL}/group/${groupId}`, {
//     withCredentials: true,
//   });
//   return res.data;
// };

// // ✅ Get all group members
// export const getGroupMembers = async (groupId: number) => {
//   const res = await axios.get(`${BASE_URL}/group/${groupId}/members`, {
//     withCredentials: true,
//   });
//   return res.data;
// };

// // ✅ Remove member (admin only)
// export const removeMember = async (groupId: number, userId: number) => {
//   const res = await axios.delete(
//     `${BASE_URL}/group/${groupId}/members/${userId}/remove`,
//     { withCredentials: true }
//   );
//   return res.data;
// };

// // -------------------- Join Requests --------------------

// // ✅ Get join requests (admin only)
// export const getJoinRequests = async (groupId: number) => {
//   const res = await axios.get(`${BASE_URL}/group/${groupId}/requests`, {
//     withCredentials: true,
//   });
//   return res.data;
// };

// // ✅ Approve join request
// export const approveJoinRequest = async (groupId: number, requestId: number) => {
//   const res = await axios.post(
//     `${BASE_URL}/group/${groupId}/requests/${requestId}/approve`,
//     {},
//     { withCredentials: true }
//   );
//   return res.data;
// };

// // ✅ Reject join request
// export const rejectJoinRequest = async (requestId: number) => {
//   const res = await axios.delete(
//     `${BASE_URL}/group/requests/${requestId}/reject`,
//     { withCredentials: true }
//   );
//   return res.data;
// };

// // -------------------- Messages & Chat --------------------

// // ✅ Get all group messages
// export const getGroupMessages = async (groupId: number) => {
//   const res = await axios.get(`${BASE_URL}/group/${groupId}/messages`, {
//     withCredentials: true,
//   });
//   return res.data;
// };

// // ✅ Send text or file message
// export const sendGroupMessage = async (
//   groupId: number,
//   message_type: "text" | "file",
//   content: string | File
// ) => {
//   const formData = new FormData();
//   formData.append("message_type", message_type);

//   if (message_type === "text") {
//     formData.append("content", content as string);
//   } else if (message_type === "file") {
//     formData.append("file", content as File);
//   }

//   const res = await axios.post(
//     `${BASE_URL}/group/${groupId}/message`,
//     formData,
//     {
//       withCredentials: true,
//       headers: { "Content-Type": "multipart/form-data" },
//     }
//   );

//   return res.data;
// };

// // ✅ Upload PDF file only (optional utility)
// export const uploadPDFToGroup = async (groupId: number, file: File) => {
//   const formData = new FormData();
//   formData.append("pdf", file);

//   const res = await axios.post(
//     `${BASE_URL}/group/${groupId}/upload-pdf`,
//     formData,
//     {
//       withCredentials: true,
//       headers: { "Content-Type": "multipart/form-data" },
//     }
//   );

//   return res.data;
// };
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// -------------------- Group Core --------------------

/**
 * Create a new group.
 * @param data { name: string; description?: string }
 */
export const createGroup = async (data: { name: string; description?: string }) => {
  const res = await axios.post(
    `${BASE_URL}/group/create`,
    { group_name: data.name, description: data.description },
    { withCredentials: true }
  );
  return res.data;
};

/**
 * Get all groups current user is a member of.
 */
export const getMyGroups = async () => {
  const res = await axios.get(`${BASE_URL}/group/mygroups`, { withCredentials: true });
  return res.data;
};

/**
 * Redundant if getMyGroups is used everywhere, but for compatibility.
 */
export const getGroupStatus = getMyGroups;

/**
 * Request to join a group using a join code.
 */
export const joinGroup = async (code: string) => {
  const res = await axios.post(
    `${BASE_URL}/group/request-join`,
    { join_code: code },
    { withCredentials: true }
  );
  return res.data;
};

/**
 * Leave a group you are a member of.
 */
export const leaveGroup = async (groupId: number) => {
  const res = await axios.post(
    `${BASE_URL}/group/leave`,
    { groupId },
    { withCredentials: true }
  );
  return res.data;
};

/**
 * Get group details (if you want detailed info, otherwise use getMyGroups).
 */
export const getGroupDetails = async (groupId: number) => {
  const res = await axios.get(`${BASE_URL}/group/${groupId}`, {
    withCredentials: true,
  });
  return res.data;
};

/**
 * Get all members of a group.
 */
export const getGroupMembers = async (groupId: number) => {
  const res = await axios.get(`${BASE_URL}/group/${groupId}/members`, {
    withCredentials: true,
  });
  return res.data;
};

/**
 * Remove a user from a group (admin only).
 */
export const removeMember = async (groupId: number, userId: number) => {
  const res = await axios.delete(
    `${BASE_URL}/group/${groupId}/members/${userId}`,
    { withCredentials: true }
  );
  return res.data;
};

// -------------------- Join Requests --------------------

/**
 * Get all pending join requests for a group (admin only).
 */
export const getJoinRequests = async (groupId: number) => {
  const res = await axios.get(`${BASE_URL}/group/${groupId}/requests`, {
    withCredentials: true,
  });
  return res.data;
};

/**
 * Admin: Approve a join request.
 */
export const approveJoinRequest = async (groupId: number, requestId: number) => {
  const res = await axios.post(
    `${BASE_URL}/group/${groupId}/requests/${requestId}/approve`,
    {},
    { withCredentials: true }
  );
  return res.data;
};

/**
 * Admin: Reject a join request.
 */
export const rejectJoinRequest = async ( requestId: number) => {
  const res = await axios.delete(
    `${BASE_URL}/group/requests/${requestId}/reject`,
    { withCredentials: true }
  );
  return res.data;
};

// -------------------- Messages & Chat --------------------

/**
 * Get all messages for a group.
 */
export const getGroupMessages = async (groupId: number) => {
  const res = await axios.get(`${BASE_URL}/group/${groupId}/messages`, {
    withCredentials: true,
  });
  return res.data;
};

/**
 * Send a text or file message.
 * @param content string or File
 */
export const sendGroupMessage = async (
  groupId: number,
  message_type: "text" | "file",
  content: string | File
) => {
  const formData = new FormData();
  formData.append("message_type", message_type);

  if (message_type === "text") {
    formData.append("content", content as string);
  } else if (message_type === "file") {
    formData.append("file", content as File);
  }

  const res = await axios.post(
    `${BASE_URL}/group/${groupId}/message`,
    formData,
    {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return res.data;
};

/**
 * (Optional) Upload a PDF file to group.
 */
export const uploadPDFToGroup = async (groupId: number, file: File) => {
  const formData = new FormData();
  formData.append("pdf", file);

  const res = await axios.post(
    `${BASE_URL}/group/${groupId}/upload-pdf`,
    formData,
    {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return res.data;
};
// /api/grp.ts
export const deleteGroup = async (groupId: number) => {
  const res = await axios.delete(
    `${BASE_URL}/group/${groupId}`,
    { withCredentials: true }
  );
  return res.data;
};
