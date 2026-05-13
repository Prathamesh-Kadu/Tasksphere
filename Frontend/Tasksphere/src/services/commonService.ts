import axiosClient from "../api/interceptor";
import type { PageResponse, UserResponse } from "../types/common.types";

// -------- Get Users By Search ---------
export const getUsersBySearch = async (search: string, page: number, size: number): Promise<PageResponse<UserResponse>> => {
    const response = await axiosClient.get(`/user/search`, { params: { query: search, page, size } });
    return response.data;
}