import { useState } from "react"; // Import useState
import { useForm, FormProvider } from "react-hook-form"; // Import FormProvider
import { zodResolver } from "@hookform/resolvers/zod";
import { AppErrClient } from "@/utils/app-err";
import { updatePasswordRecovery } from "@/api/auth";
import { toast } from "@/hooks/use-toast";
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
import { updatePasswordRecoverytypes } from "@/types/auth-types";
import { updatePasswordRecoverySchema } from "@/schemas/auth-schemas";
import { motion } from "framer-motion";

const ResetPassword = () => {
  const form = useForm<updatePasswordRecoverytypes>({
    resolver: zodResolver(updatePasswordRecoverySchema),
    defaultValues: {
      password: "",
      confirmpassword: "",
    },
  });

  const [otpVerified, setOtpVerified] = useState(false); // Track OTP verification status
  const [otp, setOtp] = useState(""); // Store OTP input
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form;

  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const secret = urlParams.get("secret");
  const userId = urlParams.get("userId");

  const onOtpSubmit = (otp: string) => {
    // Validate OTP here (e.g., call an API to verify OTP)
    if (otp === "123456") {
      // For example, assume OTP verification success
      setOtpVerified(true);
    } else {
      toast({
        title: "Invalid OTP",
        description: "The OTP you entered is incorrect.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: updatePasswordRecoverytypes) => {
    try {
      if (!userId || !secret) {
        throw new Error("Required recovery information missing.");
      }

      const payload = {
        userId,
        secret,
        password: values.password,
        confirmpassword: values.confirmpassword,
      };

      const response = await updatePasswordRecovery(payload);

      if (response?.$id) {
        toast({
          title: "Success",
          description: "Your password has been reset successfully!",
        });
        navigate("/sign-in");
      }
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
                    onOtpSubmit(otp);
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
                      >
                        Verify OTP
                      </Button>
                    </motion.div>
                  </CardFooter>
                </form>
              </FormProvider>
            ) : (
              <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={control}
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
                    control={control}
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
