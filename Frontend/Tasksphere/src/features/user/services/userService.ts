import axiosClient from "../../../api/interceptor";
import type { PageResponse, UserResponse } from "../../../types/common.types";

// ---------------- Get Users By Role and Search ---------------
export const getMembers = async (page: number, size: number, name?: string): Promise<PageResponse<UserResponse>> => {
    const response = await axiosClient.get(`/user/members`, {
        params: { page, size, name: name?.trim() || undefined }
    });
    return response.data;
};


//----------------- Remove User from Organization -----------------
export const removeUserFromOrg = async (userId: string): Promise<void> => {
    await axiosClient.delete(`/user/${userId}`);
};


//----------------- Add User to Organization -----------------
export const addUserToOrg = async (userId: string[]): Promise<void> => {
    const response = await axiosClient.patch(`/user/members/${userId}`);
    return response.data;
};