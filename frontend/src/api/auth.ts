import { LoginUserTypes } from '@/types/auth-types';
import axios from 'axios';
import dotenv from 'dotenv';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// ✅ Check if mobile exists (during signup)
export async function checkMobileExists(mobile: string) {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/check-mobile`, { mobile }, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error checking mobile number');
  }
}

// ✅ Create a new user (signup)
export async function CreateUser(values: { firstname: string; lastname: string; mobile: string; password: string }) {
  try {
    console.log("Sending values:", values);
    const response = await axios.post(`${BASE_URL}/api/auth/signup`, values, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.error("Signup error:", error.response?.data || error.message);
    throw error;
  }
}

// ✅ Login a user
export const LoginUser = async (data: LoginUserTypes) => {
  try {
    const response = axios.post('http://localhost:4000/api/auth/login', data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
    throw new Error(errorMessage);
  }
};

// ✅ Get current session
export const GetCurrentSession = async () => {
  try {
    const response = await axios.get('http://localhost:4000/api/session/check-session', {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      return { loggedIn: false };
    }
    throw new Error(error.response?.data?.message || "Failed to get session");
  }
};

// ✅ Logout user
export const LogoutUser = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/logout`, {}, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Logout failed";
    throw new Error(errorMessage);
  }
};

// ✅ Check mobile for forgot password flow
export async function checkMobileForReset(mobile: string) {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/forgot/check-mobile`, { mobile }, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error checking mobile number for reset');
  }
}

// ✅ Reset password
export const resetPassword = async (mobile: string, newPassword: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/reset-password`, {
      mobile,
      newPassword,
    }, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to reset password");
  }
};

export const getAllTasks = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/todos`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch tasks");
  }
};

export const createTask = async (task: { title: string; time: string; description: string }) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/todos`, task, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create task");
  }
};

export const updateTask = async (
  id: number,
  task: { title: string; time: string; description: string }
) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/todos/${id}`, task, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update task");
  }
};

export const deleteTask = async (id: number) => {
  try {
    const response = await axios.delete(`${BASE_URL}/api/todos/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete task");
  }
};


// 🔒 Future placeholders for OTP/OAuth (if needed)
export const createVerification = async () => { /* implement when ready */ };
export const LoginOauthgoogle = async () => { /* implement when ready */ };
export const updateVerification = async () => { /* implement when ready */ };
export const updatePasswordRecovery = async () => { /* implement when ready */ };
export const createPasswordRecovery = async () => { /* implement when ready */ };
