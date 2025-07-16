import { useState } from "react";
import { useEffect } from "react"; // ← ensure this is imported
import { useOtpTimer } from "@/hooks/useOtpTimer";

import axios from 'axios';
import { CreateUserTypes } from "@/types/auth-types";
import { Loader, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUserSchema } from "@/schemas/auth-schemas";
import { AppErrClient } from "@/utils/app-err";
import { CreateUser } from "@/api/auth";
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
import { useCheckSession } from "@/hooks/use-check-session";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { setupRecaptcha, sendOtp } from '../../firebase/otpUtils';

;

const SignUp = () => {
  useEffect(() => {
  setupRecaptcha("recaptcha-container"); // ✅ only once
}, [])
useEffect(() => {
  const savedMobile = localStorage.getItem("mobile");
  const savedStep = localStorage.getItem("otp-step");
  const savedTime = localStorage.getItem("otp-timestamp");

  if (savedMobile) {
    form.setValue("mobile", savedMobile);
  }

  if (savedStep === "otp") {
    setStep("otp");
  } else if (savedStep === "form") {
    setStep("form");
  }

  if (savedTime) {
    const diff = 60 - Math.floor((Date.now() - Number(savedTime)) / 1000);
    if (diff > 0) start(diff);
    else localStorage.removeItem("otp-timestamp");
  }
}, []);

  const [agreed, setAgreed] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [step, setStep] = useState<"mobile" | "otp" | "form">("mobile");
  const [enteredOtp, setEnteredOtp] = useState("");
const { seconds, active, start, stop } = useOtpTimer(60);

  const form = useForm<CreateUserTypes>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      mobile: "",
      password: "",
    },
  });
  const handleSendOtp = async () => {
    const mobile = form.watch("mobile");

    if (!mobile || mobile.length < 10) {
      toast({
        title: "Invalid Number",
        description: "Please enter a valid 10-digit mobile number.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Step 1: Check if mobile exists in backend
      const res = await axios.post("http://localhost:3000/api/auth/check-mobile", { mobile });
      if (res.data?.status === "exists") {
        toast({
          title: "Mobile Exists",
          description: "This mobile number is already registered.",
          variant: "destructive",
        });
        return;
      }

      // Step 2: Format the number
      const formattedPhone = mobile.startsWith("+") ? mobile : `+91${mobile}`;
await setupRecaptcha("recaptcha-container"); // ✅ safe now
      // Step 3: Setup Firebase Recaptcha and send OTP
   
      const result = await sendOtp(formattedPhone);
      console.log("✅ OTP sent:");
      setConfirmationResult(result);

    const now = Date.now();
    localStorage.setItem("mobile", mobile);
    localStorage.setItem("otp-timestamp", now.toString());
    localStorage.setItem("otp-step", "otp");
      setStep("otp");
      start();
      toast({
        title: "OTP Sent",
        description: `OTP sent to ${formattedPhone}`,
      });
    } catch (error: any) {
      console.error("❌ Error sending OTP:", error);
      toast({
        title: "OTP Error",
        description: error?.response?.data?.message || "Failed to send OTP",
        variant: "destructive",
      });
    }
  };

  const handleVerifyOtp = async () => {
    try {
      if (!confirmationResult) {
        toast({
          title: "Verification Error",
          description: "No OTP session found. Please resend OTP.",
          variant: "destructive",
        });
        return;
      }

      const result = await confirmationResult.confirm(enteredOtp);
      const user = result.user;
       // Clear storage
    localStorage.removeItem("otp-timestamp");
    localStorage.setItem("otp-step", "form");

      console.log("✅ OTP verified:", user);

      toast({
        title: "Verified",
        description: "Mobile number successfully verified.",
      });

      setStep("form");
    } catch (error) {
      console.error("❌ OTP verification failed:", error);
      toast({
        title: "Invalid OTP",
        description: "The OTP you entered is incorrect or expired.",
        variant: "destructive",
      });
    }
  };
  useCheckSession();
  const onSubmit = async (values: CreateUserTypes) => {
    try {
      const response = await CreateUser(values);
      if (response) {
        toast({
          title: "Success",
          description: "User has been successfully created",
        });
        localStorage.removeItem("otp-timestamp");
localStorage.removeItem("otp-step");
localStorage.removeItem("mobile");

        navigate("/feature-selection");
      }
    } catch (error) {
      AppErrClient(error);
    }
  };
  // Rendered always, hidden from view
//<div id="recaptcha-container" className="hidden" />

  return (
    <div className="h-[calc(100vh-64px)] w-full flex bg-gradient-to-br from-black via-gray-900 to-green-900 relative overflow-hidden">
      {/* Background */}
      <div id="recaptcha-container" className="hidden" />

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

      {/* Left Side Text */}
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
          whileHover={{
            scale: 1.02,
            textShadow: "0px 0px 20px rgba(34, 197, 94, 0.8)",
          }}
        >
          People Choose Us for Learning
        </motion.h1>
        <motion.h2 className="text-3xl font-semibold text-green-400 mt-2">
          Congratulations on Your New Journey!
        </motion.h2>
        <motion.p className="mt-6 text-lg text-gray-300 leading-relaxed max-w-md">
          Learning opens the door to limitless opportunities. Let’s build
          something amazing together!
        </motion.p>
      </motion.div>

      {/* Right Form Section */}
      <motion.div
        className="flex justify-center items-center w-full lg:w-1/2 px-6"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.div className="w-full max-w-md bg-black/50 border border-white/20 shadow-xl backdrop-blur-lg p-8 rounded-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-semibold text-white">
              Create an Account
            </CardTitle>
            <CardDescription className="text-gray-300">
              Start your learning journey today!
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Step 1: Mobile Number */}
                {(step === "mobile" || step === "otp" || step === "form") && (
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
                            placeholder="+91 XXXXXXXXXX"
                            type="tel"
                            disabled={step === "form"}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Step 2: Send OTP */}
                {step === "mobile" && (
                  <CardFooter className="flex w-full">
                    <motion.div
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0px 0px 12px #22c55e",
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full"
                    >
                    {/* // <div id="recaptcha-container"></div> */}
                    {/* <div id="recaptcha-container" className="hidden" /> */}

                      <Button
        type="button"
        className="w-full bg-green-600 hover:bg-green-700 text-white"
        onClick={() => {
          handleSendOtp();
          start(); // ⏱️ Start OTP timer
         }}
         disabled={active} // ✅ Disable if timer running
       >
         {active ? `Resend in ${seconds}s` : "Get OTP"}
      </Button>
                      {/* <div id="recaptcha-container"></div> */}
                    </motion.div>
                  </CardFooter>
                )}

                {/* Step 3: OTP Input */}
                {step === "otp" && (
                  <div className="space-y-3">
                    <Input
                      placeholder="Enter OTP"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                    />
                    {/* <CardFooter className="flex w-full">
                      <motion.div
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0px 0px 12px #22c55e",
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full"
                      >
                        <Button
                          type="button"
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                          onClick={handleVerifyOtp}
                        >
                          Verify Mobile Number
                        </Button>
                                       <motion.div
    whileHover={{ scale: 1.05, boxShadow: "0px 0px 12px #22c55e" }}
    whileTap={{ scale: 0.95 }}
    className="w-full"
  >
     <div id="recaptcha-container"></div>
    <Button
      type="button"
      className="w-full bg-gray-700 hover:bg-gray-800 text-white"
      onClick={() => {
       // setupRecaptcha("recaptcha-container");
        handleSendOtp();
        start(); // ⏱️ restart timer
      }}
      disabled={active}
    >
      {active ? `Resend in ${seconds}s` : "Resend OTP"}
    </Button>
  </motion.div>
                      </motion.div>
                    </CardFooter> */}
                    <CardFooter className="flex flex-col gap-4 w-full">
  {/* Verify Button */}
  <motion.div
    whileHover={{ scale: 1.05, boxShadow: "0px 0px 12px #22c55e" }}
    whileTap={{ scale: 0.95 }}
    className="w-full"
  >
    <Button
      type="button"
      className="w-full bg-green-600 hover:bg-green-700 text-white"
      onClick={handleVerifyOtp}
    >
      Verify Mobile Number
    </Button>
  </motion.div>

  {/* Resend OTP Button */}
  <motion.div
    whileHover={{ scale: 1.05, boxShadow: "0px 0px 12px #22c55e" }}
    whileTap={{ scale: 0.95 }}
    className="w-full"
  >
    <Button
      type="button"
      className="w-full bg-gray-700 hover:bg-gray-800 text-white"
      onClick={() => {
        handleSendOtp();
        start(); // ⏱️ restart timer
      }}
      disabled={active}
    >
      {active ? `Resend in ${seconds}s` : "Resend OTP"}
    </Button>
  </motion.div>
</CardFooter>

                  </div>
                )}

                {/* Step 4: Rest of Sign-Up Form */}
                {step === "form" && (
                  <>
                    <FormField
                      control={form.control}
                      name="firstname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">
                            First Name
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="John" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    


                    <FormField
                      control={form.control}
                      name="lastname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">
                            Last Name
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Doe" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                placeholder="••••••••"
                                type={showPassword ? "text" : "password"}
                                className="bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:ring-green-500 focus:border-green-500"
                              />
                              <button
                                type="button"
                                className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                                onClick={() => setShowPassword((prev) => !prev)}
                              >
                                {showPassword ? (
                                  <Eye size={18} />
                                ) : (
                                  <EyeOff size={18} />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={agreed}
                        onCheckedChange={(checked) =>
                          setAgreed(Boolean(checked))
                        }
                      />
                      <label htmlFor="terms" className="text-white text-sm">
                        I agree to the{" "}
                        <Link to="/terms" className="text-green-400 underline">
                          Terms and Conditions
                        </Link>
                      </label>
                    </div>

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
  disabled={!agreed || form.formState.isSubmitting}
  variant="default"
  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold transition-all shadow-lg"
>
  {form.formState.isSubmitting ? (
    <span className="flex items-center justify-center gap-2">
      <Loader className="animate-spin w-4 h-4" />
      Creating Account...
    </span>
  ) : (
    "Create Account"
  )}
</Button>
                      </motion.div>
                    </CardFooter>
                  </>
                )}
              </form>
            </Form>
          </CardContent>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignUp;
