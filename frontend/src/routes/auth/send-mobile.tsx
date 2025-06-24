import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppErrClient } from "@/utils/app-err";
//import { createPasswordRecovery } from "@/api/auth";
import { toast } from "@/hooks/use-toast";
import { checkMobileForReset } from "@/api/auth"; // ✅ Just like Sign-Up
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { motion } from "framer-motion";
// import { auth } from "@/firebase/firebase";
// import {
//   RecaptchaVerifier,
//   signInWithPhoneNumber,
// } from "firebase/auth";
import { setupRecaptcha, sendOtp } from "@/firebase/otpUtils"; // ✅ Just like Sign-Up


// Mobile number schema with validation
const sendMobileSchema = z.object({
  mobile: z.string().regex(/^[0-9]{10}$/, {
    message: "Please enter a valid 10-digit mobile number",
  }),
});

type sendMobileTypes = z.infer<typeof sendMobileSchema>;

const SendMobile = () => {
  const form = useForm<sendMobileTypes>({
    resolver: zodResolver(sendMobileSchema),
    defaultValues: {
      mobile: "",
    },
  });

  const navigate = useNavigate();

//  const onSubmit = async (values: sendMobileTypes) => {
//   try {
//     // ✅ Step 1: Check if mobile exists in DB for reset
//     await checkMobileForReset(values.mobile);

//     const phoneNumber = `+91${values.mobile}`;
//     localStorage.setItem("resetMobile", values.mobile);

//     // ✅ Step 2: Setup Firebase Recaptcha
//     setupRecaptcha("recaptcha-container");

//     // ✅ Step 3: Send OTP
//     const confirmationResult = await sendOtp(phoneNumber);

//     // ✅ Step 4: Store result for later OTP verification
//     localStorage.setItem(
//       "resetConfirmationResult",
//       JSON.stringify(confirmationResult)
//     );

//     toast({
//       title: "Success",
//       description: "OTP sent successfully!",
//     });

//     // ✅ Step 5: Go to reset password page (where OTP gets verified inline)
//     navigate("/reset-password");
    
//   } catch (error) {
//     AppErrClient(error); // centralized error handling ✅
//   }
// };

// const onSubmit = async (values: sendMobileTypes) => {
//   try {
//     await checkMobileForReset(values.mobile);

//     const phoneNumber = `+91${values.mobile}`;
//     localStorage.setItem("resetMobile", values.mobile);

//     setupRecaptcha("recaptcha-container");
//     const confirmationResult = await sendOtp(phoneNumber);
//       // ✅ Log confirmationResult for debugging
//     console.log("📦 Firebase confirmationResult:", confirmationResult);
//     // 🔁 Store in global window instead of localStorage
//     (window as any).confirmationResult = confirmationResult;

//     toast({
//       title: "Success",
//       description: "OTP sent successfully!",
//     });

//     navigate("/reset-password");
//   } catch (error) {
//     AppErrClient(error);
//   }
// };

const onSubmit = async (values: sendMobileTypes) => {
  try {
    // ✅ Step 1: Check if mobile exists in DB
    await checkMobileForReset(values.mobile);

    const phoneNumber = `+91${values.mobile}`;

    // ✅ Step 2: Store mobile in localStorage (needed later for password reset)
    //localStorage.setItem("resetMobile", values.mobile);

    // ✅ Step 3: Setup invisible Firebase reCAPTCHA
    setupRecaptcha("recaptcha-container");

    // ✅ Step 4: Send OTP using Firebase
    const confirmationResult = await sendOtp(phoneNumber);

    // ✅ Step 5: Log & store confirmationResult in window (NOT localStorage)
    console.log("📦 Firebase confirmationResult:", confirmationResult);
    (window as any).confirmationResult = confirmationResult;

    // ✅ Step 6: Success toast and redirect
    toast({
      title: "Success",
      description: "OTP sent successfully!",
    });

    navigate("/reset-password");
  } catch (error) {
    AppErrClient(error);
  }
};

  return (
    <div className="h-[calc(100vh-64px)] w-full flex bg-gradient-to-br from-black via-gray-900 to-green-900 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-20">
        <svg className="absolute top-0 left-0 w-full h-full">
          <defs>
            <pattern
              id="grid-pattern"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="20" cy="20" r="2" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      {/* Left Section - Motivational Message */}
      <motion.div
        className="hidden lg:flex flex-col justify-center items-start w-1/2 px-16 text-white relative"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Background Accent */}

        <motion.h1
          className="text-5xl font-extrabold leading-tight text-white drop-shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          whileHover={{
            scale: 1.02,
            textShadow: "0px 0px 20px rgba(34, 197, 94, 0.8)",
          }}
        >
          Start Fresh
        </motion.h1>
        <motion.h2
          className="text-3xl font-semibold text-green-400 mt-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Reset your password & continue learning
        </motion.h2>
        <motion.p
          className="mt-6 text-lg text-gray-300 leading-relaxed max-w-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1 }}
        >
          Don't let a forgotten password slow you down. Stay committed to your
          journey and reclaim access to all your learning materials!
        </motion.p>
      </motion.div>

      {/* Right Section - Send Reset Mobile Form */}
      <motion.div
        className="flex justify-center items-center w-full lg:w-1/2 px-6"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full max-w-md bg-black/50 border border-white/20 shadow-xl backdrop-blur-lg p-8 rounded-2xl"
        >
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-semibold text-white">
              Forgot Password?
            </CardTitle>
            <CardDescription className="text-gray-300">
              Enter your mobile number below, and we'll send a reset code.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Mobile Input */}
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">
                        Mobile Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="1234567890"
                          type="text"
                          className="bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:ring-green-500 focus:border-green-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <CardFooter className="flex w-full">
                  <motion.div
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0px 0px 12px #22c55e",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full"
                  >
                    <Button
                      disabled={form.formState.isSubmitting}
                      variant="default"
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold transition-all shadow-lg"
                    >
                      {form.formState.isSubmitting ? (
                        <>
                          <Loader className="mr-2 w-4 h-4 animate-spin" />{" "}
                          Sending...
                        </>
                      ) : (
                        "Send Reset Code"
                      )}
                    </Button>
                  </motion.div>
                </CardFooter>
              </form>
            </Form>
          </CardContent>

          {/* Sign Up Link */}
          <div className="px-8 pb-6">
            <p className="text-center text-sm text-gray-300 mt-4">
              Don't have an account?{" "}
              <Link
                to="/sign-up"
                className="text-green-400 hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
       <div id="recaptcha-container"></div>
    </div>
  );
};

export default SendMobile;
