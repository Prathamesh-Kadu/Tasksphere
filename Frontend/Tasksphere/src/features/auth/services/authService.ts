import { axiosClient } from "../../../api/axiosClient"
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "../types/auth.types"

export const login = async (data: LoginRequest, signal?: AbortSignal): Promise<LoginResponse> => {
    const response = await axiosClient.post("/auth/login", data, { signal });
    return response.data;
}

export const registerUser = async (data: RegisterRequest, signal?: AbortSignal): Promise<RegisterResponse> => {
    const response = await axiosClient.post("/auth/register", data, { signal });
    return response.data;
}