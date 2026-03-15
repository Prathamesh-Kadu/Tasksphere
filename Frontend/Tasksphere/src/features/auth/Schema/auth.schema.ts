import z from "zod";

export const loginSchema = z.object({
    email: z.email({
        error: (issue) =>
            !issue.input ? "Email is required" : "Invalid email format"
    }),
    password: z.string().trim().min(1, "Password is required").min(6, "Password must be at least 6 characters")
})

export const registerSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.email({
        error: (issue) =>
            !issue.input ? "Email is required" : "Invalid email format"
    }),
    password: z.string().trim().min(1, "Password is required").min(6, "Password must be at least 6 characters")
})