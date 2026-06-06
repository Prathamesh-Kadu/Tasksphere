import type z from "zod";
import type { taskSchema } from "../schemas/task.schema";

export type TaskRequest = z.infer<typeof taskSchema>;

export interface TaskResponse {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    dueDate: string;
    assignedToUser: string;
    projectName: string;
    organizationName: string;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    dueDate: string;
}
