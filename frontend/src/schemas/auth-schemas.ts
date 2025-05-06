import { z } from "zod";

export const CreateUserSchema = z.object({
  // First Name: Should be a string with a max length of 50 characters
  firstname: z.string().max(50, {
    message: "First name is too large, maximum length is 50 characters.",
  }),

  // Last Name: Should be a string with a max length of 50 characters
  lastname: z.string().max(50, {
    message: "Last name is too large, maximum length is 50 characters.",
  }),

  // Mobile Number: Should be a string with a valid format and length (e.g., 10 digits)
  mobile: z
    .string()
    .length(10, {
      message: "Mobile number must be exactly 10 digits.",
    })
    .regex(/^[0-9]+$/, {
      message: "Mobile number must contain only digits.",
    }),

  

  // Password: Should be a string with a minimum length of 6 and a maximum of 80 characters
  password: z
    .string()
    .min(6, {
      message:
        "Password is too short, it should be at least 6 characters long.",
    })
    .max(80, {
      message:
        "Password exceeded the limit, it should be less than 80 characters.",
    }),
});

export const LoginUserSchema = z.object({
  mobile: z
    .string()
    .min(10, { message: "Mobile number must be 10 digits" })
    .max(10, { message: "Mobile number must be 10 digits" })
    .regex(/^\d{10}$/, { message: "Invalid mobile number" }),
  password: z
    .string()
    .min(6, {
      message: "Password is too short",
    })
    .max(80, {
      message: "Exceeded the limits, try shorter",
    }),
});


export const VerifyUserSchema = z.object({
    userId : z.string(),
    secret : z.string()
});
export const sendOTPSchema = z.object({
  mobile: z
    .string()
    .length(10, {
      message: "Mobile number must be exactly 10 digits.",
    })
    .regex(/^[0-9]+$/, {
      message: "Mobile number must contain only digits.",
    })
    .refine(value => value.length === 10, {
      message: "Please enter a valid 10-digit mobile number.",
    }),
});


export const updatePasswordRecoverySchema = z.object({
    password : z.string().min(6, {
        message : "Password is too short"
    }).max(80, {
        message : "Exceeded the limits, try shorter"
    }),
    confirmpassword : z.string().min(6, {
        message : "Password is too short"
    }).max(80, {
        message : "Exceeded the limits, try shorter"
    })
})