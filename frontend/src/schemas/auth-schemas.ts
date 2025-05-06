import { z } from "zod";

export const CreateUserSchema = z.object({
    firstname : z.string().max(50, {
        message : "too large"
    }),
    lastname : z.string().max(50, {
        message : "too large"
    }),
    email : z.string().email({
        message : "Enter a valid email address"
    }),
    password : z.string().min(6, {
        message : "Password is too short"
    }).max(80, {
        message : "Exceeded the limits, try shorter"
    })
});

export const LoginUserSchema = z.object({
    email : z.string().email({
        message : "Enter a valid email address"
    }),
    password : z.string().min(6, {
        message : "Password is too short"
    }).max(80, {
        message : "Exceeded the limits, try shorter"
    })
});

export const VerifyUserSchema = z.object({
    userId : z.string(),
    secret : z.string()
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