import type z from "zod";
import type { organizationSchema } from "../schemas/organization.schema";
import type { UserResponse } from "../../../types/common.types";



export type OrganizationRequest = z.infer<typeof organizationSchema>


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
