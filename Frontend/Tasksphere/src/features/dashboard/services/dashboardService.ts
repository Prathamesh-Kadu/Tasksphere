import axiosClient from "../../../api/interceptor";
import type { DashboardStats } from "../types/dashboard.types";

//------------- Dashboard service --------------
export const getDashboardStats = async (): Promise<DashboardStats> => {
    const response = await axiosClient.get(`/dashboard/stats`,);
    return response.data;
};
