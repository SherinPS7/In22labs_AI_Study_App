import { LoginUserTypes } from "@/types/auth-types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginUserSchema } from "@/schemas/auth-schemas";
import { AppErrClient } from "@/utils/app-err";
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
import { Loader, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import OauthWrapper from "@/components/auth/oauth-wrapper";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { motion } from "framer-motion";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginUserTypes>({
    resolver: zodResolver(LoginUserSchema),
    defaultValues: { mobile: "", password: "" },
  });

  const { loginMutation } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (values: LoginUserTypes) => {
    try {
      const response = await loginMutation.mutateAsync(values);
      if (response) {
        toast({ title: "Success", description: "Logged in successfully!" });
        navigate("/overview");
      }
    } catch (error) {
      AppErrClient(error);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] w-full flex bg-gradient-to-br from-black via-gray-900 to-green-900 relative overflow-hidden">
      {/* Subtle Animated Pattern Background */}
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

      {/* Left Section - Welcome Message */}
      <motion.div
        className="hidden lg:flex flex-col justify-center items-start w-1/2 px-16 text-white relative"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Background Accent */}
        {/* <div className="absolute top-1/4 left-[-50px] w-48 h-48 bg-green-500 opacity-30 blur-3xl rounded-full animate-pulse"></div> */}

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
          Welcome Back
        </motion.h1>
        <motion.h2
          className="text-3xl font-semibold text-green-400 mt-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Your learning journey continues
        </motion.h2>
        <motion.p
          className="mt-6 text-lg text-gray-300 leading-relaxed max-w-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1 }}
        >
          Every great achievement starts with knowledge. Keep pushing forward,
          one lesson at a time. Stay consistent, stay curious, and let’s build
          something amazing together.
        </motion.p>
      </motion.div>

      {/* Right Section - Login Form */}
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
              Sign In
            </CardTitle>
            <CardDescription className="text-gray-300">
              Access AI-driven learning tailored just for you.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Mobile Number Field */}
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
                          pattern="[0-9]{10}"
                          maxLength={10}
                          className="bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:ring-green-500 focus:border-green-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
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

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox id="remember" />
                    <label htmlFor="remember" className="text-sm text-gray-300">
                      Remember me
                    </label>
                  </div>
                  <Button size="sm" variant="link" asChild>
                    <Link
                      to="/send-mail"
                      className="text-green-400 hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </Button>
                </div>

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
                          Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </motion.div>
                </CardFooter>
              </form>
            </Form>
          </CardContent>

          {/* OAuth & Sign-up Link */}
          <div className="px-8 pb-6">
            {/* <OauthWrapper /> */}
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
    </div>
  );
};

export default SignIn;
