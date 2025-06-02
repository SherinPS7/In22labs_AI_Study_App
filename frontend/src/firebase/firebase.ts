// src/firebase/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnE84EoHWRk4gD3Lk3kQT2g-DdfYwAmKs",
  authDomain: "otp-proj-ee9f4.firebaseapp.com",
  projectId: "otp-proj-ee9f4",
  storageBucket: "otp-proj-ee9f4.appspot.com",  // Corrected!
  messagingSenderId: "466966690702",
  appId: "1:466966690702:web:b8dc29747f1a4167e142df",
  measurementId: "G-XTWVSHK8QQ",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export Auth for OTP usage
export const auth = getAuth(app);
