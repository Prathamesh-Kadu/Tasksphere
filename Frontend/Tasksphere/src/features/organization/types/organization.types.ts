import type z from "zod";
import type { organizationSchema } from "../schemas/organization.schema";



export type OrganizationRequest = z.infer<typeof organizationSchema>

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
}
export interface OrganizationResponse {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  projectCount: number;
  userCount: number;
  owners: UserResponse[];
}

export interface Organization {
  id: string;
  name: string;
  description?: string;
}
