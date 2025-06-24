import { auth } from "./firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";

let recaptchaVerifier: RecaptchaVerifier | null = null;

export const setupRecaptcha = (containerId: string) => {
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: "invisible",
      callback: () => console.log("reCAPTCHA solved"),
      "expired-callback": () => {
        recaptchaVerifier = null;  // reset on expiry
      }
    });
    recaptchaVerifier.render();
  }
  return recaptchaVerifier;
};

export const sendOtp = async (phoneNumber: string) => {
  if (!recaptchaVerifier) throw new Error("reCAPTCHA not initialized");
  return await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
};
