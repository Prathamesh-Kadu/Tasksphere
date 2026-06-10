import z from "zod";

export const projectSchema = z.object({
    name: z.string().trim()
        .min(1, "Project name is required")
        .max(255, "Project name cannot exceed 255 characters"),
    description: z.string().trim()
        .max(255, "Project description cannot exceed 255 characters").optional(),
})