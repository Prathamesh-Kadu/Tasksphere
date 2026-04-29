import axiosClient from "../../../api/interceptor";
import type { PageResponse } from "../../../types/common.types";
import type { OrganizationRequest, OrganizationResponse, UserResponse } from "../types/organization.types";


// ------ GEt All Organizations ------
export const getOrganizations = async (): Promise<OrganizationResponse[]> => {
    const response = await axiosClient.get("/org");
    return response.data;
}

// ------ Add Organizations ------
export const createOrganization = async (data: OrganizationRequest): Promise<OrganizationResponse> => {
    const response = await axiosClient.post("/org", data);
    return response.data;
}

// ------ Update Organizations ------
export const updateOrganization = async (id: string, data: OrganizationRequest): Promise<OrganizationResponse> => {
    const response = await axiosClient.put(`/org/${id}`, data);
    return response.data;
}

// ------ Delete Organizations ------
export const deleteOrganization = async (id: string): Promise<void> => {
    await axiosClient.delete(`/org/${id}`);
}

// ------ Get Organizations By Id ------
export const getOrganizationById = async (id: string): Promise<OrganizationResponse> => {
    const response = await axiosClient.get(`/org/${id}`);
    return response.data;
}

// -------- Get Users By Search ---------
export const getUsersBySearch = async (search: string, page: number, size: number): Promise<PageResponse<UserResponse>> => {
    const response = await axiosClient.get(`/user/search`, { params: { query: search, page, size } });
    return response.data;
}

// -------- Assigne Owner ---------
export const assignOwner = async (orgId: string, userIds: string[]): Promise<PageResponse<UserResponse>> => {
    const response = await axiosClient.put(`/org/assign-owner`, { organizationId: orgId, userIds: userIds });
    return response.data;
}
