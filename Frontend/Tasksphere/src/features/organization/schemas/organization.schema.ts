import z from "zod"

export const organizationSchema = z.object({
    name: z.string().trim()
        .min(1, "Organization name is required")
        .max(255, "Organization name cannot exceed 255 characters"),
    description: z.string().trim()
        .max(255, "Organization description cannot exceed 255 characters").optional()
})