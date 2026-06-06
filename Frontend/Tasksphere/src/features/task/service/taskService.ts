import axiosClient from "../../../api/interceptor";
import type { TaskRequest, TaskResponse } from "../types/task.types";


// --------------- Get All Tasks ---------------
export const getAllTasks = async (page = 0, size = 10, search = "") => {
    const response = await axiosClient.get(`/task?page=${page}&size=${size}&search=${search}`);
    return response.data;
};

// ------ Add Task ------
export const createTask = async (data: TaskRequest): Promise<TaskResponse> => {
    const response = await axiosClient.post("/task", data);
    return response.data;
}


// --------------- Get Task By Id ---------------
export const getTask = async (id: string) => {
    const response = await axiosClient.get(`/task/${id}`);
    return response.data;
};

// --------------- Update Task---------------
export const updateTask = async (taskId: string, payload: TaskRequest) => {
    const response = await axiosClient.put(`/task/${taskId}`, payload);
    return response.data;
};

// --------------- Delete Task---------------
export const deleteTask = async (taskId: string) => {
    const response = await axiosClient.delete(`/task/${taskId}`);
    return response.data;
};

// --------------- Update Status---------------
export const updateStatus = async (taskId: string, status: string) => {
    const response = await axiosClient.patch(`/task/${taskId}/status`, { status: status });
    return response.data;
};
