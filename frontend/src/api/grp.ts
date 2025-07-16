import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// ✅ Create a new group
export const createGroup = async (data: { name: string }) => {
  try {
    const res = await axios.post(`${BASE_URL}/group/create`, data, {
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create group");
  }
};
// ✅ Get members of a specific group
// 
export const getGroupMembers = async (groupId: number) => {
  const res = await axios.get(`${BASE_URL}/group/members/${groupId}`, {
    withCredentials: true,
  });
  return res.data;
};


// ✅ Get current user's group status
export const getGroupStatus = async () => {
  const res = await axios.get(`${BASE_URL}/group/mystatus`, {
    withCredentials: true,
  });
  return res.data;
};

// ✅ Join a group using code
export const joinGroup = async (code: string) => {
  try {
    const res = await axios.post(`${BASE_URL}/group/join`, { code }, {
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to join group");
  }
};

// ✅ Leave a group
export const leaveGroup = async (groupId: number) => {
  try {
    const res = await axios.post(`${BASE_URL}/group/leave`, { groupId }, {
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to leave group");
  }
};

// ✅ Get all groups the user is part of
// export const getMyGroups = async () => {
//   try {
//     const res = await axios.get(`${BASE_URL}/group/mygroups`, {
//       withCredentials: true,
//     });
//     return res.data;
//   } catch (error: any) {
//     throw new Error(error.response?.data?.message || "Failed to fetch groups");
//   }
// };
export const getMyGroups = async () => {
  const res = await axios.get(`${BASE_URL}/group/mystatus`, { withCredentials: true });
  return res.data;
};


// ✅ Get details for a single group
export const getGroupDetails = async (groupId: number) => {
  try {
    const res = await axios.get(`${BASE_URL}/group/${groupId}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to get group details");
  }
};
