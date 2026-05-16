import type z from "zod";
import type { projectSchema } from "../schemas/project.schema";


export type ProjectRequest = z.infer<typeof projectSchema>


export interface ProjectReponse {
    id: string;
    name: string;
    description: string;
    organizationName: string;
    createdAt: string;
    admins: string[];
}

export interface Project {
    id: string;
    name: string;
    description: string;
}