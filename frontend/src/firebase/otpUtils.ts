import { auth } from "./firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";

let recaptchaVerifier: RecaptchaVerifier | null = null;

export const setupRecaptcha = (containerId: string = "recaptcha-container") => {
  const containerElement = document.getElementById(containerId);
  if (!containerElement) {
    throw new Error(`Element with ID '${containerId}' not found`);
  }

  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(
      auth, // ✅ Auth object first
      containerId, // ✅ Then container ID
      {
        size: "invisible",
        callback: (response: string) => {
          console.log("✅ reCAPTCHA solved", response);
        },
        "expired-callback": () => {
          console.warn("⚠️ reCAPTCHA expired");
        },
      }
    );
    recaptchaVerifier.render().then((widgetId) => {
      console.log("🔒 reCAPTCHA widget ID:", widgetId);
    });
  }

  return recaptchaVerifier;
};

export const sendOtp = async (phoneNumber: string): Promise<ConfirmationResult> => {
  if (!recaptchaVerifier) throw new Error("❌ reCAPTCHA not initialized");
  return await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
};
