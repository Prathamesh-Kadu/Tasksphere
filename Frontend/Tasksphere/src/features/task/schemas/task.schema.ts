import { z } from "zod";

export const taskSchema = z.object({
    title: z
        .string().trim()
        .min(1, "Task name is required")
        .max(255, "Task name cannot exceed 255 characters")
        .trim(),

    description: z
        .string().trim()
        .max(255, "Description cannot exceed 255 characters")
        .trim(),

    dueDate: z
        .string().trim()
        .min(1, "Due date is mandatory")
        .refine((val) => {
            const date = new Date(val);
            return !isNaN(date.getTime());
        }, "Invalid date format")
        .refine((val) => {
            const date = new Date(val);
            const now = new Date();
            now.setSeconds(0, 0);
            return date >= now;
        }, "Date must be today or in the future"),

    projectId: z
        .string().trim()
        .min(1, "Project ID is required"),

    assignedTo: z
        .string().trim()
        .min(1, "Assigned user ID is required"),

    status: z
        .enum(["TODO", "IN_PROGRESS", "DONE"])
        .optional()
});

