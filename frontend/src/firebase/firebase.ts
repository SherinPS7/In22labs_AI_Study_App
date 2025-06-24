import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBqeQQpG0BCSPQeyLYRJhYnfz3WVayOhM8",
  authDomain: "inlabapp-10c95.firebaseapp.com",
  projectId: "inlabapp-10c95",
 // storageBucket: "inlabapp-10c95.appspot.com",  // corrected here
 storageBucket: "inlabapp-10c95.firebasestorage.app",
  messagingSenderId: "154208016644",
  appId: "1:154208016644:web:5becb0758534aaf8461851",
  measurementId: "G-Z0MDZ5HXLT"
};

const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export const auth = getAuth(app);
