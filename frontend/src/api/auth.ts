// src/api/auth.ts
import { LoginUserTypes } from '@/types/auth-types';
import axios from 'axios';
export async function checkMobileExists(mobile: string) {
  try {
    const response = await axios.post("http://localhost:5000/api/auth/check-mobile", { mobile });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error checking mobile number');
  }
}
export async function CreateUser(values: { firstname: string; lastname: string; mobile: string; password: string }) {
  try {
    console.log("Sending values:", values); // <-- add this line

    // POST request to backend sign-up endpoint
    const response = await axios.post("http://localhost:5000/api/auth/signup", values);
    return response.data;
  } catch (error: any) {
    console.error("Signup error:", error.response?.data || error.message);
    throw error;
  }

}

export const LoginUser = async (data: LoginUserTypes) => {
    try {
    const response = await axios.post("http://localhost:5000/api/auth/login", data,{
      withCredentials: true, // Include credentials for session management
    });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
    throw new Error(errorMessage); // this will be caught in your React hook
  }
};

export const GetCurrentSession = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/session/check-session", {
      withCredentials: true, // Important to send cookies/session id
    });
    return response.data; // This will be your session info or loggedIn status
  } catch (error: any) {
    // If session not found or error, return loggedIn false or throw
    if (error.response && error.response.status === 401) {
      return { loggedIn: false };
    }
    throw new Error(error.response?.data?.message || "Failed to get session");
  }
};

// src/api/auth.ts

export const createVerification = async () => { /*...*/ };
//export const GetCurrentSession = async () => { /*...*/ };
export const LoginOauthgoogle = async () => { /*...*/ };
//export const LoginUser = async () => { /*...*/ };
export const LogoutUser = async () => { /*...*/ };
export const updateVerification = async () => { /*...*/ };
export const updatePasswordRecovery = async () => { /*...*/ };
export const createPasswordRecovery = async () => { /*...*/ };

