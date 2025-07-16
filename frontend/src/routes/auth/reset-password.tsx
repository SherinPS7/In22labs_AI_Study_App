import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { AppErrClient } from "@/utils/app-err";
import { resetPassword } from "@/api/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { updatePasswordRecoverySchema } from "@/schemas/auth-schemas";
import type { updatePasswordRecoverytypes } from "@/types/auth-types";
import {  FormProvider } from "react-hook-form";
import {
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
 } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
 } from "@/components/ui/form";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);

  const form = useForm<updatePasswordRecoverytypes>({
    resolver: zodResolver(updatePasswordRecoverySchema),
    defaultValues: {
      password: "",
      confirmpassword: "",
    },
  });

  // 🔐 Get mobile and confirmationResult from localStorage
  const [mobile, setMobile] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  // useEffect(() => {
  //   const storedMobile = localStorage.getItem("resetMobile");
  //   const storedConfirmation = localStorage.getItem("resetConfirmationResult");

  //   if (!storedMobile || !storedConfirmation) {
  //     toast({
  //       title: "Missing Info",
  //       description: "No mobile/OTP session found. Please try again.",
  //       variant: "destructive",
  //     });
  //     navigate("/send-mobile");
  //   } else {
  //     setMobile(storedMobile);
  //     setConfirmationResult(JSON.parse(storedConfirmation));
  //   }
  // }, []);

  // const handleVerifyOtp = async () => {
  //   try {
  //     if (!confirmationResult) {
  //       throw new Error("No OTP session. Please resend OTP.");
  //     }

  //     setLoadingOtp(true);
  //     const result = await confirmationResult.confirm(otp);
  //     console.log("✅ OTP Verified:", result.user);

  //     setOtpVerified(true);
  //     toast({ title: "Success", description: "OTP verified." });
  //   } catch (error) {
  //     console.error("❌ OTP Verification failed:", error);
  //     toast({
  //       title: "Invalid OTP",
  //       description: "The OTP entered is incorrect or expired.",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setLoadingOtp(false);
  //   }
  // };
useEffect(() => {
  const storedMobile = localStorage.getItem("resetMobile");
  const storedConfirmation = (window as any).confirmationResult;
    console.log("📱 Stored mobile:", storedMobile);
  console.log("🧾 Stored confirmationResult:", storedConfirmation);
  if (!storedMobile || !storedConfirmation) {
    toast({
      title: "Missing Info",
      description: "No mobile/OTP session found. Please try again.",
      variant: "destructive",
    });
    navigate("/reset-password");
  } else {
    setMobile(storedMobile);
    setConfirmationResult(storedConfirmation); // no need to JSON.parse
  }
}, []);

  const handleVerifyOtp = async () => {
  try {
    const confirmationResult = (window as any).confirmationResult; // ✅ fetch from global window

    if (!confirmationResult) {
      throw new Error("No OTP session. Please resend OTP.");
    }

    setLoadingOtp(true);

    const result = await confirmationResult.confirm(otp); // ✅ actual Firebase OTP verification
    console.log("✅ OTP Verified:", result.user);

    setOtpVerified(true);
    toast({ title: "Success", description: "OTP verified." });
  } catch (error) {
    console.error("❌ OTP Verification failed:", error);
    toast({
      title: "Invalid OTP",
      description: "The OTP entered is incorrect or expired.",
      variant: "destructive",
    });
  } finally {
    setLoadingOtp(false);
  }
};

  const onSubmit = async (values: updatePasswordRecoverytypes) => {
    try {
      if (!mobile) throw new Error("Mobile number not found");

      await resetPassword(mobile, values.password);

      toast({
        title: "Success",
        description: "Password reset successfully!",
      });

      localStorage.removeItem("resetMobile");
      localStorage.removeItem("resetConfirmationResult");
      navigate("/sign-in");
    } catch (error) {
      AppErrClient(error);
    }
  };
  return (
    <div className="h-[calc(100vh-64px)] w-full flex bg-gradient-to-br from-black via-gray-900 to-green-900 relative overflow-hidden">
      {/* Background Dots */}
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

      {/* Left Side – Motivation */}
      <motion.div
        className="hidden lg:flex flex-col justify-center items-start w-1/2 px-16 text-white"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="text-5xl font-extrabold leading-tight drop-shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          whileHover={{
            scale: 1.02,
            textShadow: "0px 0px 20px rgba(34, 197, 94, 0.8)",
          }}
        >
          Secure Your Account
        </motion.h1>
        <motion.h2
          className="text-3xl font-semibold text-green-400 mt-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Set a new password & continue your journey
        </motion.h2>
        <motion.p
          className="mt-6 text-lg text-gray-300 leading-relaxed max-w-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1 }}
        >
          A strong password keeps your learning progress safe. Choose wisely and
          keep it secure!
        </motion.p>
      </motion.div>

      {/* Right Side – Conditional Form (OTP or Reset Password) */}
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
          {!otpVerified ? (
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-semibold text-white">
                Verify OTP
              </CardTitle>
              <CardDescription className="text-gray-300">
                Enter the OTP sent to your email.
              </CardDescription>
            </CardHeader>
          ) : (
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-semibold text-white">
                Reset Your Password
              </CardTitle>
              <CardDescription className="text-gray-300">
                Choose a strong password to secure your account.
              </CardDescription>
            </CardHeader>
          )}

          <CardContent>
            {!otpVerified ? (
              <FormProvider {...form}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleVerifyOtp();
                  }}
                  className="space-y-5"
                >
                  <FormItem>
                    <FormLabel className="text-white">Enter OTP</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:ring-green-500 focus:border-green-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
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
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700"
                         disabled={loadingOtp}
                      >
                        Verify OTP
                      </Button>
                    </motion.div>
                  </CardFooter>
                </form>
              </FormProvider>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          New Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="********"
                            className="bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:ring-green-500 focus:border-green-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmpassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="********"
                            className="bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:ring-green-500 focus:border-green-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                            Resetting...
                          </>
                        ) : (
                          "Reset Password"
                        )}
                      </Button>
                    </motion.div>
                  </CardFooter>
                </form>
              </Form>
            )}
          </CardContent>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "@/hooks/use-toast";
// import { AppErrClient } from "@/utils/app-err";
// import { resetPassword } from "@/api/auth";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Loader } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { updatePasswordRecoverySchema } from "@/schemas/auth-schemas";
// import type { updatePasswordRecoverytypes } from "@/types/auth-types";

// const ResetPassword = () => {
//   const navigate = useNavigate();
//   const [otp, setOtp] = useState("");
//   const [otpVerified, setOtpVerified] = useState(false);
//   const [loadingOtp, setLoadingOtp] = useState(false);

//   const form = useForm<updatePasswordRecoverytypes>({
//     resolver: zodResolver(updatePasswordRecoverySchema),
//     defaultValues: {
//       password: "",
//       confirmpassword: "",
//     },
//   });

//   // 🔐 Get mobile and confirmationResult from localStorage
//   const [mobile, setMobile] = useState<string | null>(null);
//   const [confirmationResult, setConfirmationResult] = useState<any>(null);

//   useEffect(() => {
//     const storedMobile = localStorage.getItem("resetMobile");
//     const storedConfirmation = localStorage.getItem("resetConfirmationResult");

//     if (!storedMobile || !storedConfirmation) {
//       toast({
//         title: "Missing Info",
//         description: "No mobile/OTP session found. Please try again.",
//         variant: "destructive",
//       });
//       navigate("/forgot-password");
//     } else {
//       setMobile(storedMobile);
//       setConfirmationResult(JSON.parse(storedConfirmation));
//     }
//   }, []);

//   // const handleVerifyOtp = async () => {
//   //   try {
//   //     if (!confirmationResult) {
//   //       throw new Error("No OTP session. Please resend OTP.");
//   //     }

//   //     setLoadingOtp(true);
//   //     const result = await confirmationResult.confirm(otp);
//   //     console.log("✅ OTP Verified:", result.user);

//   //     setOtpVerified(true);
//   //     toast({ title: "Success", description: "OTP verified." });
//   //   } catch (error) {
//   //     console.error("❌ OTP Verification failed:", error);
//   //     toast({
//   //       title: "Invalid OTP",
//   //       description: "The OTP entered is incorrect or expired.",
//   //       variant: "destructive",
//   //     });
//   //   } finally {
//   //     setLoadingOtp(false);
//   //   }
//   // };
// const handleVerifyOtp = async () => {
//   try {
//     const confirmationResult = (window as any).confirmationResult; // ✅ fetch from global window

//     if (!confirmationResult) {
//       throw new Error("No OTP session. Please resend OTP.");
//     }

//     setLoadingOtp(true);

//     const result = await confirmationResult.confirm(otp); // ✅ actual Firebase OTP verification
//     console.log("✅ OTP Verified:", result.user);

//     setOtpVerified(true);
//     toast({ title: "Success", description: "OTP verified." });
//   } catch (error) {
//     console.error("❌ OTP Verification failed:", error);
//     toast({
//       title: "Invalid OTP",
//       description: "The OTP entered is incorrect or expired.",
//       variant: "destructive",
//     });
//   } finally {
//     setLoadingOtp(false);
//   }
// };

//   const onSubmit = async (values: updatePasswordRecoverytypes) => {
//     try {
//       if (!mobile) throw new Error("Mobile number not found");

//       await resetPassword(mobile, values.password);

//       toast({
//         title: "Success",
//         description: "Password reset successfully!",
//       });

//       localStorage.removeItem("resetMobile");
//       localStorage.removeItem("resetConfirmationResult");
//       navigate("/sign-in");
//     } catch (error) {
//       AppErrClient(error);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-black text-white">
//       <div className="w-full max-w-md bg-zinc-900 p-6 rounded-lg shadow-md">
//         {!otpVerified ? (
//           <>
//             <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>
//             <Input
//               type="text"
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               className="mb-4"
//             />
//             <Button onClick={handleVerifyOtp} disabled={loadingOtp} className="w-full">
//               {loadingOtp ? (
//                 <>
//                   <Loader className="mr-2 w-4 h-4 animate-spin" />
//                   Verifying...
//                 </>
//               ) : (
//                 "Verify OTP"
//               )}
//             </Button>
//           </>
//         ) : (
//           <>
//             <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//               <Input
//                 type="password"
//                 placeholder="New Password"
//                 {...form.register("password")}
//               />
//               <Input
//                 type="password"
//                 placeholder="Confirm Password"
//                 {...form.register("confirmpassword")}
//               />
//               <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
//                 {form.formState.isSubmitting ? (
//                   <>
//                     <Loader className="mr-2 w-4 h-4 animate-spin" />
//                     Resetting...
//                   </>
//                 ) : (
//                   "Reset Password"
//                 )}
//               </Button>
//             </form>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;
// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "@/hooks/use-toast";
// import { AppErrClient } from "@/utils/app-err";
// import { resetPassword } from "@/api/auth";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Loader } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { updatePasswordRecoverySchema } from "@/schemas/auth-schemas";
// import type { updatePasswordRecoverytypes } from "@/types/auth-types";

// const ResetPassword = () => {
//   const navigate = useNavigate();
//   const [otp, setOtp] = useState("");
//   const [otpVerified, setOtpVerified] = useState(false);
//   const [loadingOtp, setLoadingOtp] = useState(false);

//   const form = useForm<updatePasswordRecoverytypes>({
//     resolver: zodResolver(updatePasswordRecoverySchema),
//     defaultValues: {
//       password: "",
//       confirmpassword: "",
//     },
//   });

//   // 🔐 Get mobile and confirmationResult from localStorage
//   const [mobile, setMobile] = useState<string | null>(null);
//   const [confirmationResult, setConfirmationResult] = useState<any>(null);

//   useEffect(() => {
//     const storedMobile = localStorage.getItem("resetMobile");
//     const storedConfirmation = localStorage.getItem("resetConfirmationResult");

//     if (!storedMobile || !storedConfirmation) {
//       toast({
//         title: "Missing Info",
//         description: "No mobile/OTP session found. Please try again.",
//         variant: "destructive",
//       });
//       navigate("/forgot-password");
//     } else {
//       setMobile(storedMobile);
//       setConfirmationResult(JSON.parse(storedConfirmation));
//     }
//   }, []);

//   // const handleVerifyOtp = async () => {
//   //   try {
//   //     if (!confirmationResult) {
//   //       throw new Error("No OTP session. Please resend OTP.");
//   //     }

//   //     setLoadingOtp(true);
//   //     const result = await confirmationResult.confirm(otp);
//   //     console.log("✅ OTP Verified:", result.user);

//   //     setOtpVerified(true);
//   //     toast({ title: "Success", description: "OTP verified." });
//   //   } catch (error) {
//   //     console.error("❌ OTP Verification failed:", error);
//   //     toast({
//   //       title: "Invalid OTP",
//   //       description: "The OTP entered is incorrect or expired.",
//   //       variant: "destructive",
//   //     });
//   //   } finally {
//   //     setLoadingOtp(false);
//   //   }
//   // };
// const handleVerifyOtp = async () => {
//   try {
//     const confirmationResult = (window as any).confirmationResult; // ✅ fetch from global window

//     if (!confirmationResult) {
//       throw new Error("No OTP session. Please resend OTP.");
//     }

//     setLoadingOtp(true);

//     const result = await confirmationResult.confirm(otp); // ✅ actual Firebase OTP verification
//     console.log("✅ OTP Verified:", result.user);

//     setOtpVerified(true);
//     toast({ title: "Success", description: "OTP verified." });
//   } catch (error) {
//     console.error("❌ OTP Verification failed:", error);
//     toast({
//       title: "Invalid OTP",
//       description: "The OTP entered is incorrect or expired.",
//       variant: "destructive",
//     });
//   } finally {
//     setLoadingOtp(false);
//   }
// };

//   const onSubmit = async (values: updatePasswordRecoverytypes) => {
//     try {
//       if (!mobile) throw new Error("Mobile number not found");

//       await resetPassword(mobile, values.password);

//       toast({
//         title: "Success",
//         description: "Password reset successfully!",
//       });

//       localStorage.removeItem("resetMobile");
//       localStorage.removeItem("resetConfirmationResult");
//       navigate("/sign-in");
//     } catch (error) {
//       AppErrClient(error);
//     }
//   };