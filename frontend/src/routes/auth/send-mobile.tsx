// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { AppErrClient } from "@/utils/app-err";
// import { toast } from "@/hooks/use-toast";
// import { checkMobileForReset } from "@/api/auth"; // ✅ Just like Sign-Up
// import {
  
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Loader } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import { z } from "zod";
// import { motion } from "framer-motion";
// import { setupRecaptcha, sendOtp } from "@/firebase/otpUtils"; // ✅ Just like Sign-Up


// // Mobile number schema with validation
// const sendMobileSchema = z.object({
//   mobile: z.string().regex(/^[0-9]{10}$/, {
//     message: "Please enter a valid 10-digit mobile number",
//   }),
// });

// type sendMobileTypes = z.infer<typeof sendMobileSchema>;

// const SendMobile = () => {
//   const form = useForm<sendMobileTypes>({
//     resolver: zodResolver(sendMobileSchema),
//     defaultValues: {
//       mobile: "",
//     },
//   });

//   const navigate = useNavigate();
// const onSubmit = async (values: sendMobileTypes) => {
//   try {
//     // ✅ Step 1: Check if mobile exists in DB
//     await checkMobileForReset(values.mobile);

//     const phoneNumber = `+91${values.mobile}`;

//     // ✅ Step 2: Store mobile in localStorage (needed later for password reset)
//     localStorage.setItem("resetMobile", values.mobile);

//     // ✅ Step 3: Setup invisible Firebase reCAPTCHA
//     setupRecaptcha("recaptcha-container");

//     // ✅ Step 4: Send OTP using Firebase
//     const confirmationResult = await sendOtp(phoneNumber);

//     // ✅ Step 5: Log & store confirmationResult in window (NOT localStorage)
//     console.log("📦 Firebase confirmationResult:", confirmationResult);
//     (window as any).confirmationResult = confirmationResult;

//     // ✅ Step 6: Success toast and redirect
//     toast({
//       title: "Success",
//       description: "OTP sent successfully!",
//     });

//     navigate("/reset-password");
//   } catch (error) {
//     AppErrClient(error);
//   }
// };

//   return (
//     <div className="h-[calc(100vh-64px)] w-full flex bg-gradient-to-br from-black via-gray-900 to-green-900 relative overflow-hidden">
//       {/* Background Animation */}
//       <div className="absolute inset-0 opacity-20">
//         <svg className="absolute top-0 left-0 w-full h-full">
//           <defs>
//             <pattern
//               id="grid-pattern"
//               width="40"
//               height="40"
//               patternUnits="userSpaceOnUse"
//             >
//               <circle cx="20" cy="20" r="2" fill="white" />
//             </pattern>
//           </defs>
//           <rect width="100%" height="100%" fill="url(#grid-pattern)" />
//         </svg>
//       </div>

//       {/* Left Section - Motivational Message */}
//       <motion.div
//         className="hidden lg:flex flex-col justify-center items-start w-1/2 px-16 text-white relative"
//         initial={{ opacity: 0, x: -50 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ duration: 1 }}
//       >
//         {/* Background Accent */}

//         <motion.h1
//           className="text-5xl font-extrabold leading-tight text-white drop-shadow-lg"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3, duration: 1 }}
//           whileHover={{
//             scale: 1.02,
//             textShadow: "0px 0px 20px rgba(34, 197, 94, 0.8)",
//           }}
//         >
//           Start Fresh
//         </motion.h1>
//         <motion.h2
//           className="text-3xl font-semibold text-green-400 mt-2"
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.5, duration: 1 }}
//         >
//           Reset your password & continue learning
//         </motion.h2>
//         <motion.p
//           className="mt-6 text-lg text-gray-300 leading-relaxed max-w-md"
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.7, duration: 1 }}
//         >
//           Don't let a forgotten password slow you down. Stay committed to your
//           journey and reclaim access to all your learning materials!
//         </motion.p>
//       </motion.div>

//       {/* Right Section - Send Reset Mobile Form */}
//       <motion.div
//         className="flex justify-center items-center w-full lg:w-1/2 px-6"
//         initial={{ opacity: 0, x: 50 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ duration: 1 }}
//       >
//         <motion.div
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           className="w-full max-w-md bg-black/50 border border-white/20 shadow-xl backdrop-blur-lg p-8 rounded-2xl"
//         >
//           <CardHeader className="text-center">
//             <CardTitle className="text-3xl font-semibold text-white">
//               Forgot Password?
//             </CardTitle>
//             <CardDescription className="text-gray-300">
//               Enter your mobile number below, and we'll send a reset code.
//             </CardDescription>
//           </CardHeader>

//           <CardContent>
//             <Form {...form}>
//               <form
//                 onSubmit={form.handleSubmit(onSubmit)}
//                 className="space-y-5"
//               >
//                 {/* Mobile Input */}
//                 <FormField
//                   control={form.control}
//                   name="mobile"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-white">
//                         Mobile Number
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           {...field}
//                           placeholder="1234567890"
//                           type="text"
//                           className="bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:ring-green-500 focus:border-green-500"
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 {/* Submit Button */}
//                 <CardFooter className="flex w-full">
//                   <motion.div
//                     whileHover={{
//                       scale: 1.05,
//                       boxShadow: "0px 0px 12px #22c55e",
//                     }}
//                     whileTap={{ scale: 0.95 }}
//                     className="w-full"
//                   >
//                     <Button
//                       disabled={form.formState.isSubmitting}
//                       variant="default"
//                       className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold transition-all shadow-lg"
//                     >
//                       {form.formState.isSubmitting ? (
//                         <>
//                           <Loader className="mr-2 w-4 h-4 animate-spin" />{" "}
//                           Sending...
//                         </>
//                       ) : (
//                         "Send Reset Code"
//                       )}
//                     </Button>
//                   </motion.div>
//                 </CardFooter>
//               </form>
//             </Form>
//           </CardContent>

//           {/* Sign Up Link */}
//           <div className="px-8 pb-6">
//             <p className="text-center text-sm text-gray-300 mt-4">
//               Don't have an account?{" "}
//               <Link
//                 to="/sign-up"
//                 className="text-green-400 hover:underline font-medium"
//               >
//                 Sign up
//               </Link>
//             </p>
//           </div>
//         </motion.div>
//       </motion.div>
//        <div id="recaptcha-container"></div>
//     </div>
//   );
// };

// export default SendMobile;
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppErrClient } from "@/utils/app-err";
import { toast } from "@/hooks/use-toast";
import { checkMobileForReset } from "@/api/auth";
import {
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
import { setupRecaptcha, sendOtp } from "@/firebase/otpUtils";

const sendMobileSchema = z.object({
  mobile: z.string().regex(/^[0-9]{10}$/, {
    message: "Please enter a valid 10-digit mobile number",
  }),
});

type sendMobileTypes = z.infer<typeof sendMobileSchema>;

const SendMobile = () => {
  const [seconds, setSeconds] = useState(0);
  const [resendActive, setResendActive] = useState(false);
  const form = useForm<sendMobileTypes>({
    resolver: zodResolver(sendMobileSchema),
    defaultValues: {
      mobile: "",
    },
  });

  const navigate = useNavigate();

  // ⏱️ Restore timer if stored
  // useEffect(() => {
  //   const expiry = localStorage.getItem("otpTimerExpiry");
  //   if (expiry) {
  //     const remaining = Math.floor((parseInt(expiry) - Date.now()) / 1000);
  //     if (remaining > 0) {
  //       setSeconds(remaining);
  //       setResendActive(true);
  //     } else {
  //       localStorage.removeItem("otpTimerExpiry");
  //     }
  //   }

  //   // ✅ Ensure reCAPTCHA is ready
  //   const recaptcha = document.getElementById("recaptcha-container");
  //   if (!recaptcha || !recaptcha.hasChildNodes()) {
  //     setTimeout(() => {
  //       window.location.reload(); // reCAPTCHA was removed; refresh to rebuild it
  //     }, 100);
  //   }
  // }, []);
  useEffect(() => {
  const recaptchaElement = document.getElementById("recaptcha-container");

  // If captcha is empty or got removed, re-initialize silently
  if (!recaptchaElement || !recaptchaElement.hasChildNodes()) {
    setupRecaptcha("recaptcha-container");
  }

  const expiry = localStorage.getItem("otpTimerExpiry");
  if (expiry) {
    const remaining = Math.floor((parseInt(expiry) - Date.now()) / 1000);
    if (remaining > 0) {
      setSeconds(remaining);
      setResendActive(true);
    } else {
      localStorage.removeItem("otpTimerExpiry");
    }
  }
}, []);


  // ⏱️ Countdown logic
  useEffect(() => {
    let interval: any;
    if (resendActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    } else if (seconds === 0) {
      setResendActive(false);
      localStorage.removeItem("otpTimerExpiry");
    }
    return () => clearInterval(interval);
  }, [resendActive, seconds]);

  const startTimer = () => {
    const expiry = Date.now() + 60000;
    localStorage.setItem("otpTimerExpiry", expiry.toString());
    setSeconds(60);
    setResendActive(true);
  };

  const onSubmit = async (values: sendMobileTypes) => {
    try {
      await checkMobileForReset(values.mobile);
      const phoneNumber = `+91${values.mobile}`;
      localStorage.setItem("resetMobile", values.mobile);

      setupRecaptcha("recaptcha-container");
      const confirmationResult = await sendOtp(phoneNumber);
      (window as any).confirmationResult = confirmationResult;

      startTimer();
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
      <div className="absolute inset-0 opacity-20">
        <svg className="absolute top-0 left-0 w-full h-full">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="2" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      {/* Left motivational section */}
      <motion.div
        className="hidden lg:flex flex-col justify-center items-start w-1/2 px-16 text-white relative"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="text-5xl font-extrabold leading-tight text-white drop-shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          whileHover={{ scale: 1.02, textShadow: "0px 0px 20px rgba(34, 197, 94, 0.8)" }}
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

      {/* Right Form Section */}
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
              Enter your mobile number below, and we&apos;ll send a reset code.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Mobile Number</FormLabel>
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

                <CardFooter className="flex w-full">
                  <motion.div
                    whileHover={{ scale: 1.05, boxShadow: "0px 0px 12px #22c55e" }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full"
                  >
                    <Button
                      disabled={form.formState.isSubmitting || resendActive}
                      variant="default"
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold transition-all shadow-lg"
                    >
                      {form.formState.isSubmitting ? (
                        <>
                          <Loader className="mr-2 w-4 h-4 animate-spin" /> Sending...
                        </>
                      ) : resendActive ? (
                        `Wait ${seconds}s`
                      ) : (
                        "Send Reset Code"
                      )}
                    </Button>
                  </motion.div>
                </CardFooter>
              </form>
            </Form>
          </CardContent>

          <div className="px-8 pb-6">
            <p className="text-center text-sm text-gray-300 mt-4">
              Don&apos;t have an account?{" "}
              <Link to="/sign-up" className="text-green-400 hover:underline font-medium">
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
