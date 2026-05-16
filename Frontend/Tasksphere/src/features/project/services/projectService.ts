import axiosClient from "../../../api/interceptor";
import type { PageResponse } from "../../../types/common.types";
import type { ProjectReponse, ProjectRequest } from "../types/project.types";

//------- Get All Projects as per Role
export const getProjects = async (page: number, size: number, search?: string): Promise<PageResponse<ProjectReponse>> => {
    const response = await axiosClient.get(`/project`, {
        params: { page, size, search: search?.trim() || undefined }
    });
    return response.data;
};


// ------ Add Project ------
export const createProject = async (data: ProjectRequest): Promise<ProjectReponse> => {
    const response = await axiosClient.post("/project", data);
    return response.data;
}

// ------ Update Project ------
export const updateProject = async (id: string, data: ProjectRequest): Promise<ProjectReponse> => {
    const response = await axiosClient.put(`/project/${id}`, data);
    return response.data;
}

// ------ Delete Project ------
export const deleteProject = async (id: string): Promise<void> => {
    await axiosClient.delete(`/project/${id}`);
}

// ---------- Assign Admin to Project --------------
export const assignProjectAdmin = async (projectId: string, userIds: string[]) => {
    const response = await axiosClient.put(`/project/assign-admin`, { projectId, userIds });
    return response.data;
};