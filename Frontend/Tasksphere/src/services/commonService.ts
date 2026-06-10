import axiosClient from "../api/interceptor";
import type { PageResponse, UserResponse } from "../types/common.types";

// -------- Get Users By Search ---------
export const getUsersBySearch = async (search: string, page: number, size: number): Promise<PageResponse<UserResponse>> => {
    const response = await axiosClient.get(`/user/search`, { params: { query: search, page, size } });
    return response.data;
}


// ---------------- Get Users By Role and Search ---------------
export const getMembers = async (page: number, size: number, name?: string): Promise<PageResponse<UserResponse>> => {
    const response = await axiosClient.get(`/user/members`, {
        params: { page, size, name: name?.trim() || undefined }
    });
    return response.data;
};